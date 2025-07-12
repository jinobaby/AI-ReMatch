const router = require('express').Router()
const multer = require('multer')
const pdfParse = require('pdf-parse')
const mammoth = require('mammoth')
const VerifyToken = require('../verification/tokenVerification')
const { rankResumesWithOpenAI, getFallbackRanking, estimateTokenUsage, testOpenAIConnection } = require('../services/openaiService')

// Configure multer for memory storage (no file saving to disk)
const storage = multer.memoryStorage()

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB per file
        files: 5 // Maximum 5 files
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        const isValidType = allowedTypes.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.docx')
        
        if (isValidType) {
            cb(null, true)
        } else {
            cb(new Error('Only PDF and DOCX files are allowed'), false)
        }
    }
})

// Helper function to extract text from PDF buffer
async function extractPdfText(buffer) {
    try {
        const data = await pdfParse(buffer)
        return data.text
    } catch (error) {
        console.error('Error extracting PDF text:', error)
        throw new Error('Failed to extract text from PDF')
    }
}

// Helper function to extract text from DOCX buffer
async function extractDocxText(buffer) {
    try {
        const result = await mammoth.extractRawText({ buffer: buffer })
        return result.value
    } catch (error) {
        console.error('Error extracting DOCX text:', error)
        throw new Error('Failed to extract text from DOCX')
    }
}

// Helper function to process all uploaded files
async function processResumeFiles(files) {
    const processedResumes = []
    
    for (const file of files) {
        try {
            let extractedText = ''
            
            // Extract text based on file type
            if (file.mimetype === 'application/pdf') {
                extractedText = await extractPdfText(file.buffer)
            } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                       file.originalname.toLowerCase().endsWith('.docx')) {
                extractedText = await extractDocxText(file.buffer)
            }
            
            // Clean and validate extracted text
            const cleanedText = extractedText.trim()
            if (cleanedText.length < 50) {
                throw new Error(`Insufficient content in ${file.originalname}`)
            }
            
            processedResumes.push({
                name: file.originalname,
                text: cleanedText,
                size: file.size,
                type: file.mimetype
            })
            
        } catch (error) {
            console.error(`Error processing ${file.originalname}:`, error)
            // Continue processing other files but log the error
            processedResumes.push({
                name: file.originalname,
                error: error.message,
                size: file.size,
                type: file.mimetype
            })
        }
    }
    
    return processedResumes
}

// Main endpoint for ranking resumes
router.post('/rank-resumes', VerifyToken, upload.array('resumes', 5), async (req, res) => {
    try {
        const { jobDescription } = req.body
        const files = req.files

        // Validation
        if (!files || files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'No resume files uploaded' 
            })
        }

        if (!jobDescription || jobDescription.trim().length < 50) {
            return res.status(400).json({ 
                success: false, 
                message: 'Job description is required and must be at least 50 characters' 
            })
        }

        console.log(`🚀 Processing ${files.length} files for AI-powered ranking...`)

        // Process all uploaded files
        const processedResumes = await processResumeFiles(files)
        
        // Check if any files were successfully processed
        const successfullyProcessed = processedResumes.filter(resume => !resume.error)
        if (successfullyProcessed.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Failed to process any resume files. Please check file formats and content.',
                errors: processedResumes.map(r => ({ name: r.name, error: r.error }))
            })
        }

        // Estimate token usage for cost management
        const estimatedTokens = estimateTokenUsage(jobDescription, successfullyProcessed)
        console.log(`📊 Estimated token usage: ${estimatedTokens} tokens`)

        // Try OpenAI ranking first, fallback if needed
        let rankedResults
        let analysisMethod = 'ai'
        
        try {
            // Check if OpenAI is configured
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OpenAI API key not configured')
            }

            // Use OpenAI for intelligent ranking
            rankedResults = await rankResumesWithOpenAI(jobDescription, successfullyProcessed)
            console.log(`✅ OpenAI analysis completed successfully`)
            
        } catch (aiError) {
            console.error('🚨 OpenAI analysis failed, using fallback:', aiError.message)
            analysisMethod = 'fallback'
            rankedResults = getFallbackRanking(successfullyProcessed, jobDescription)
        }

        res.status(200).json({
            success: true,
            message: `Successfully ranked ${rankedResults.length} resumes using ${analysisMethod === 'ai' ? 'OpenAI' : 'fallback'} analysis`,
            data: rankedResults,
            processingSummary: {
                totalUploaded: files.length,
                successfullyProcessed: successfullyProcessed.length,
                failed: processedResumes.filter(r => r.error).length,
                analysisMethod: analysisMethod,
                estimatedTokens: estimatedTokens
            }
        })

    } catch (error) {
        console.error('🚨 Error in rank-resumes endpoint:', error)
        
        // Handle multer errors specifically
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'File size exceeds 2MB limit' 
                })
            }
            if (error.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Maximum 5 files allowed' 
                })
            }
        }

        res.status(500).json({ 
            success: false, 
            message: 'Internal server error during resume processing',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        })
    }
})

// Health check endpoint with OpenAI status
router.get('/health', async (req, res) => {
    let openaiStatus = 'unknown'
    
    try {
        if (process.env.OPENAI_API_KEY) {
            const isConnected = await testOpenAIConnection()
            openaiStatus = isConnected ? 'connected' : 'connection_failed'
        } else {
            openaiStatus = 'not_configured'
        }
    } catch (error) {
        openaiStatus = 'error'
    }

    res.status(200).json({ 
        success: true, 
        message: 'Resume service is running',
        openaiStatus: openaiStatus,
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        timestamp: new Date().toISOString()
    })
})

// Test endpoint for OpenAI
router.get('/test-openai', async (req, res) => {
    try {
        const isConnected = await testOpenAIConnection()
        res.status(200).json({
            success: isConnected,
            message: isConnected ? 'OpenAI connection successful' : 'OpenAI connection failed',
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'OpenAI test failed',
            error: error.message
        })
    }
})

module.exports = router