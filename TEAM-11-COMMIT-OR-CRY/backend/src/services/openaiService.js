const OpenAI = require('openai')

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

// Test OpenAI connection
async function testOpenAIConnection() {
    try {
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [
                { role: "user", content: "Hello! Respond with 'OpenAI connection successful'" }
            ],
            max_tokens: 50
        })

        console.log('✅ OpenAI Test Result:', completion.choices[0].message.content)
        return true
    } catch (error) {
        console.error('❌ OpenAI Connection Failed:', error.message)
        
        // Log specific error types for better debugging
        if (error.status === 429) {
            console.error('💰 OpenAI Quota Exceeded - Using deterministic fallback')
        } else if (error.status === 401) {
            console.error('🔑 OpenAI API Key Invalid')
        } else if (error.status === 403) {
            console.error('🚫 OpenAI Access Forbidden')
        }
        
        return false
    }
}


//Generate optimized prompt for resume ranking
function createRankingPrompt(jobDescription, resumes) {
    const resumeTexts = resumes.map((resume, index) =>
        `**RESUME ${index + 1} - "${resume.name}":**\n${resume.text.substring(0, 1500)}...\n\n`
    ).join('')

    return `You are an expert HR recruiter and ATS specialist. Your task is to score resumes against a job description using ABSOLUTE scoring criteria.

**IMPORTANT SCORING GUIDELINES:**
- Use ABSOLUTE scoring (60-95 scale) based on job requirements match
- DO NOT use relative ranking between candidates
- Each resume should be scored independently
- Same resume should get same score regardless of other candidates
- 60-69: Poor fit (major skill gaps, irrelevant experience)
- 70-79: Fair fit (some relevant skills, significant gaps)
- 80-89: Good fit (most requirements met, minor gaps)
- 90-95: Excellent fit (exceptional match, exceeds requirements)

**JOB DESCRIPTION:**
${jobDescription}

**RESUMES TO ANALYZE:**
${resumeTexts}

**SCORING CRITERIA (Weight each equally):**
1. Technical Skills Match (25%): How many required skills are present
2. Experience Relevance (25%): How relevant is their work experience
3. Education Alignment (25%): Does education support the role requirements
4. Keywords & Terminology (25%): Use of industry-specific terms

**REQUIRED OUTPUT FORMAT (JSON):**
{
    "rankings": [
        {
            "resumeIndex": 1,
            "name": "resume_name.pdf",
            "score": 85,
            "explanation": "Strong match with 5+ years Python experience, React expertise, and relevant project portfolio. Missing MongoDB experience reduces score from 90 to 85.",
            "keyMatches": ["Python", "React", "API Development"],
            "missingSkills": ["MongoDB", "Docker"],
            "scoreBreakdown": {
                "technicalSkills": 85,
                "experience": 90,
                "education": 80,
                "keywords": 85
            }
        }
    ],
    "overallAnalysis": "Brief summary of scoring methodology used"
}

Remember: Score each resume independently based on absolute criteria, not relative to other candidates.`
}


//Process resumes with OpenAI API
async function rankResumesWithOpenAI(jobDescription, resumes) {
    try {
        console.log(`🤖 Starting OpenAI analysis for ${resumes.length} resumes...`)

        // Create the prompt
        const prompt = createRankingPrompt(jobDescription, resumes)

        console.log(`📊 Using model: ${process.env.OPENAI_MODEL}`)

        // Make API call to OpenAI
        const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            messages: [
                {
                    role: "system",
                    content: "You are an expert ATS system and HR recruiter. You MUST provide consistent, absolute scoring based on job requirements. Each resume should be scored independently using the same criteria, regardless of other candidates in the batch."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 4000,
            temperature: 0.1, // Very low temperature for maximum consistency
            response_format: { type: "json_object" },
            seed: 12345 // Fixed seed for consistent results
        })

        const responseText = completion.choices[0].message.content
        console.log(`📝 OpenAI Response received: ${responseText.substring(0, 200)}...`)

        // Parse OpenAI response
        const aiResult = JSON.parse(responseText)

        // Validate and format results
        const rankings = aiResult.rankings.map((ranking, index) => ({
            name: resumes[index]?.name || `resume_${ranking.resumeIndex}`,
            score: Math.max(60, Math.min(95, ranking.score)), // Ensure score bounds
            explanation: ranking.explanation || 'AI analysis completed',
            keyMatches: ranking.keyMatches || [],
            missingSkills: ranking.missingSkills || [],
            scoreBreakdown: ranking.scoreBreakdown || {
                technicalSkills: ranking.score,
                experience: ranking.score,
                education: ranking.score,
                keywords: ranking.score
            },
            aiConfidence: 'high',
            analysisTimestamp: new Date().toISOString()
        }))

        // Sort by score (highest first) but maintain absolute scoring integrity
        const sortedRankings = rankings.sort((a, b) => b.score - a.score)

        console.log(`✅ OpenAI analysis complete. Scored ${sortedRankings.length} resumes with absolute criteria`)
        return sortedRankings

    } catch (error) {
        console.error('🚨 OpenAI service error:', error)
        throw new Error('Failed to analyze resumes with AI: ' + error.message)
    }
}

/**
 * Enhanced deterministic fallback ranking (if AI completely fails)
 */
function getFallbackRanking(resumes, jobDescription) {
    console.log('⚠️ Using enhanced fallback ranking - OpenAI unavailable')

    return resumes.map((resume, index) => {
        const jdWords = jobDescription.toLowerCase().split(/\W+/).filter(word => word.length > 3)
        const resumeWords = resume.text.toLowerCase().split(/\W+/)

        // Advanced keyword matching with weights
        const criticalSkills = ['javascript', 'python', 'react', 'node', 'sql', 'java', 'html', 'css']
        const experienceTerms = ['experience', 'years', 'worked', 'developed', 'built', 'managed']
        const educationTerms = ['degree', 'university', 'college', 'bachelor', 'master', 'phd']

        // Calculate weighted scores
        let skillScore = 0
        let experienceScore = 0
        let educationScore = 0
        let keywordScore = 0

        const matchedSkills = []
        const matchingWords = []

        // Technical skills scoring (40% weight)
        criticalSkills.forEach(skill => {
            if (resumeWords.includes(skill) && jdWords.includes(skill)) {
                skillScore += 10
                matchedSkills.push(skill)
            }
        })

        // Experience context scoring (30% weight)
        experienceTerms.forEach(term => {
            if (resumeWords.includes(term)) {
                experienceScore += 5
            }
        })

        // Education scoring (15% weight)
        educationTerms.forEach(term => {
            if (resumeWords.includes(term)) {
                educationScore += 3
            }
        })

        // General keyword matching (15% weight)
        jdWords.forEach(word => {
            if (resumeWords.includes(word)) {
                keywordScore += 1
                matchingWords.push(word)
            }
        })

        // Calculate deterministic final score (no randomness)
        const rawScore = Math.min(100, skillScore + experienceScore + educationScore + (keywordScore * 0.5))
        const normalizedScore = Math.round(Math.max(60, Math.min(95, rawScore)))

        // Generate missing skills suggestions
        const missingSkills = criticalSkills.filter(skill => 
            jdWords.includes(skill) && !resumeWords.includes(skill)
        ).slice(0, 3)

        return {
            name: resume.name,
            score: normalizedScore,
            explanation: `Deterministic fallback analysis: ${matchedSkills.length} technical skills matched, ${matchingWords.length} total keywords found. ${
                normalizedScore >= 85 ? 'Strong alignment with job requirements.' :
                normalizedScore >= 75 ? 'Good match with relevant qualifications.' :
                normalizedScore >= 65 ? 'Moderate fit with some relevant skills.' :
                'Basic match requiring additional evaluation.'
            } Score is consistent and deterministic.`,
            keyMatches: [...matchedSkills, ...matchingWords.slice(0, 3)].slice(0, 5),
            missingSkills: missingSkills.length > 0 ? missingSkills : ['Advanced skills assessment unavailable'],
            aiConfidence: 'fallback_deterministic',
            scoreBreakdown: {
                technicalSkills: Math.min(95, skillScore * 2),
                experience: Math.min(95, experienceScore * 3),
                education: Math.min(95, educationScore * 5),
                keywords: Math.min(95, keywordScore)
            }
        }
    }).sort((a, b) => b.score - a.score)
}

/**
 * Estimate token usage for cost management
 */
function estimateTokenUsage(jobDescription, resumes) {
    const avgWordsPerToken = 0.75
    const totalWords = jobDescription.split(' ').length +
        resumes.reduce((sum, r) => sum + r.text.split(' ').length, 0)
    return Math.ceil(totalWords / avgWordsPerToken)
}

module.exports = {
    rankResumesWithOpenAI,
    getFallbackRanking,
    estimateTokenUsage,
    testOpenAIConnection
}