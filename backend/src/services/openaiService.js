import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

/**
 * Test OpenAI connection
 */
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
        return false
    }
}

/**
 * Generate optimized prompt for resume ranking
 */
function createRankingPrompt(jobDescription, resumes) {
    const resumeTexts = resumes.map((resume, index) =>
        `**RESUME ${index + 1} - "${resume.name}":**\n${resume.text.substring(0, 1500)}...\n\n`
    ).join('')

    return `You are an expert HR recruiter and ATS specialist. Your task is to rank resumes against a job description.

**JOB DESCRIPTION:**
${jobDescription}

**RESUMES TO ANALYZE:**
${resumeTexts}

**INSTRUCTIONS:**
1. Analyze each resume against the job requirements
2. Score each resume from 60-95 (60=poor fit, 95=excellent fit)
3. Consider: skills match, experience relevance, education alignment, keywords presence
4. Provide specific, actionable explanations for each score

**REQUIRED OUTPUT FORMAT (JSON):**
{
    "rankings": [
        {
            "resumeIndex": 1,
            "name": "resume_name.pdf",
            "score": 85,
            "explanation": "Strong match with 5+ years Python experience, React expertise, and relevant project portfolio. Missing MongoDB experience.",
            "keyMatches": ["Python", "React", "API Development"],
            "missingSkills": ["MongoDB", "Docker"]
        }
    ],
    "overallAnalysis": "Brief summary of the candidate pool quality"
}

Rank from highest to lowest score. Be precise and professional.`
}

/**
 * Process resumes with OpenAI API
 */
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
                    content: "You are an expert ATS system and HR recruiter. Provide accurate, professional resume rankings in the exact JSON format requested."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 4000,
            temperature: 0.3, // Lower temperature for more consistent results
            response_format: { type: "json_object" }
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
            aiConfidence: 'high'
        }))

        // Sort by score (highest first)
        const sortedRankings = rankings.sort((a, b) => b.score - a.score)

        console.log(`✅ OpenAI analysis complete. Ranked ${sortedRankings.length} resumes`)
        return sortedRankings

    } catch (error) {
        console.error('🚨 OpenAI service error:', error)
        throw new Error('Failed to analyze resumes with AI: ' + error.message)
    }
}

/**
 * Emergency fallback ranking (if AI completely fails)
 */
function getFallbackRanking(resumes, jobDescription) {
    console.log('⚠️ Using fallback ranking - OpenAI unavailable')

    return resumes.map((resume, index) => {
        const jdWords = jobDescription.toLowerCase().split(/\s+/)
        const resumeWords = resume.text.toLowerCase().split(/\s+/)

        const matchingWords = jdWords.filter(word =>
            word.length > 3 && resumeWords.some(rWord => rWord.includes(word))
        )

        const baseScore = Math.min(95, Math.max(60, (matchingWords.length / jdWords.length) * 100))
        const randomVariation = (Math.random() - 0.5) * 10
        const finalScore = Math.round(Math.max(60, Math.min(95, baseScore + randomVariation)))

        return {
            name: resume.name,
            score: finalScore,
            explanation: `Fallback analysis: ${matchingWords.length} keyword matches found. ${finalScore >= 85 ? 'Strong alignment with job requirements.' :
                    finalScore >= 75 ? 'Good match with relevant qualifications.' :
                        finalScore >= 65 ? 'Moderate fit with some relevant skills.' :
                            'Basic match requiring additional evaluation.'
                }`,
            keyMatches: matchingWords.slice(0, 5),
            missingSkills: ['AI analysis unavailable'],
            aiConfidence: 'fallback'
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