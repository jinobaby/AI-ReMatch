/**
 * Role-Specific AI Enhancement Service
 * Provides precise, context-aware resume analysis for web development sub-roles
 */

class RoleSpecificAnalyzer {
    constructor() {
        this.roleDefinitions = this.initializeRoleDefinitions()
        this.skillWeightings = this.initializeSkillWeightings()
        this.contextPatterns = this.initializeContextPatterns()
    }

    /**
     * Enhanced role-specific analysis
     */
    async analyzeResumesForRole(jobTitle, jobDescription, resumes) {
        console.log(`🎯 Starting role-specific analysis for: ${jobTitle}`)
        
        // Step 1: Identify the specific role category
        const roleCategory = this.categorizeRole(jobTitle, jobDescription)
        
        // Step 2: Get role-specific configuration
        const roleConfig = this.roleDefinitions[roleCategory]
        
        if (!roleConfig) {
            console.log('⚠️ Role not recognized, using generic analysis')
            return this.genericAnalysis(resumes, jobDescription)
        }
        
        // Step 3: Apply role-specific analysis
        const enhancedResults = await this.performRoleSpecificAnalysis(
            resumes, 
            jobDescription, 
            roleConfig
        )
        
        console.log(`✅ Role-specific analysis complete for ${roleCategory}`)
        return enhancedResults
    }

    /**
     * Initialize role definitions with realistic skill requirements
     */
    initializeRoleDefinitions() {
        return {
            'frontend_developer': {
                coreSkills: {
                    // High weight - absolutely essential
                    critical: ['HTML5', 'CSS3', 'JavaScript', 'responsive design'],
                    // Medium weight - very important
                    important: ['React', 'Vue', 'Angular', 'SASS', 'LESS', 'TypeScript'],
                    // Low weight - nice to have
                    bonus: ['Webpack', 'testing frameworks', 'accessibility', 'performance optimization']
                },
                experiencePatterns: [
                    /built.*user interface/i,
                    /responsive.*design/i,
                    /cross-browser.*compatibility/i,
                    /UI.*component/i
                ],
                exclusionPatterns: [
                    /database.*design/i,
                    /server.*infrastructure/i,
                    /DevOps/i
                ],
                contextKeywords: ['UI', 'UX', 'frontend', 'client-side', 'browser']
            },

            'backend_developer': {
                coreSkills: {
                    critical: ['API development', 'database design', 'server-side'],
                    important: ['Node.js', 'Python', 'Java', 'SQL', 'NoSQL', 'REST'],
                    bonus: ['microservices', 'caching', 'security', 'performance tuning']
                },
                experiencePatterns: [
                    /API.*development/i,
                    /database.*integration/i,
                    /server.*side/i,
                    /backend.*services/i
                ],
                exclusionPatterns: [
                    /UI.*design/i,
                    /frontend.*development/i,
                    /responsive.*layout/i
                ],
                contextKeywords: ['API', 'database', 'server', 'backend', 'service']
            },

            'fullstack_developer': {
                coreSkills: {
                    critical: ['JavaScript', 'frontend frameworks', 'backend development', 'database'],
                    important: ['React', 'Node.js', 'API integration', 'version control'],
                    bonus: ['deployment', 'testing', 'CI/CD', 'cloud platforms']
                },
                experiencePatterns: [
                    /full.*stack/i,
                    /end.*to.*end/i,
                    /frontend.*backend/i,
                    /complete.*web.*application/i
                ],
                exclusionPatterns: [],
                contextKeywords: ['fullstack', 'end-to-end', 'complete solution']
            },

            'devops_engineer': {
                coreSkills: {
                    critical: ['CI/CD', 'containerization', 'cloud platforms', 'automation'],
                    important: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'infrastructure'],
                    bonus: ['monitoring', 'security', 'scripting', 'terraform']
                },
                experiencePatterns: [
                    /CI\/CD.*pipeline/i,
                    /infrastructure.*automation/i,
                    /containerization/i,
                    /deployment.*automation/i
                ],
                exclusionPatterns: [
                    /UI.*development/i,
                    /frontend.*coding/i
                ],
                contextKeywords: ['infrastructure', 'deployment', 'automation', 'pipeline']
            },

            'qa_engineer': {
                coreSkills: {
                    critical: ['testing methodologies', 'test automation', 'quality assurance'],
                    important: ['regression testing', 'functional testing', 'debugging'],
                    bonus: ['performance testing', 'security testing', 'test frameworks']
                },
                experiencePatterns: [
                    /end.*to.*end.*testing/i,
                    /test.*automation/i,
                    /quality.*assurance/i,
                    /regression.*testing/i
                ],
                exclusionPatterns: [
                    /unit.*testing.*only/i
                ],
                contextKeywords: ['testing', 'QA', 'quality', 'automation', 'debugging']
            },

            'ui_ux_designer': {
                coreSkills: {
                    critical: ['user-centered design', 'UI design', 'prototyping'],
                    important: ['Figma', 'Sketch', 'user research', 'wireframing'],
                    bonus: ['A/B testing', 'design systems', 'accessibility']
                },
                experiencePatterns: [
                    /user.*centered.*design/i,
                    /UI.*design/i,
                    /prototyping/i,
                    /user.*research/i
                ],
                exclusionPatterns: [
                    /backend.*development/i,
                    /database.*design/i
                ],
                contextKeywords: ['design', 'user experience', 'prototype', 'interface']
            }
        }
    }

    /**
     * Categorize role based on job title and description
     */
    categorizeRole(jobTitle, jobDescription) {
        const title = jobTitle.toLowerCase()
        const description = jobDescription.toLowerCase()
        
        // Frontend indicators
        if (title.includes('frontend') || title.includes('ui') || 
            description.includes('user interface') || description.includes('responsive design')) {
            return 'frontend_developer'
        }
        
        // Backend indicators
        if (title.includes('backend') || title.includes('api') ||
            description.includes('server-side') || description.includes('database')) {
            return 'backend_developer'
        }
        
        // DevOps indicators
        if (title.includes('devops') || title.includes('infrastructure') ||
            description.includes('ci/cd') || description.includes('deployment')) {
            return 'devops_engineer'
        }
        
        // QA indicators
        if (title.includes('qa') || title.includes('test') ||
            description.includes('quality assurance') || description.includes('testing')) {
            return 'qa_engineer'
        }
        
        // UI/UX indicators
        if (title.includes('designer') || title.includes('ux') ||
            description.includes('design') || description.includes('user experience')) {
            return 'ui_ux_designer'
        }
        
        // Fullstack indicators (check last as it's broad)
        if (title.includes('fullstack') || title.includes('full stack') ||
            description.includes('end-to-end') || description.includes('complete solution')) {
            return 'fullstack_developer'
        }
        
        return null // Unknown role, use generic analysis
    }

    /**
     * Perform role-specific resume analysis
     */
    async performRoleSpecificAnalysis(resumes, jobDescription, roleConfig) {
        const results = []
        
        for (const resume of resumes) {
            const analysis = await this.analyzeResumeForRole(resume, roleConfig, jobDescription)
            results.push(analysis)
        }
        
        // Sort by role-specific score
        return results.sort((a, b) => b.roleSpecificScore - a.roleSpecificScore)
    }

    /**
     * Analyze individual resume against role requirements
     */
    async analyzeResumeForRole(resume, roleConfig, jobDescription) {
        const resumeText = resume.text.toLowerCase()
        
        // Calculate skill matches with role-specific weighting
        const skillAnalysis = this.calculateRoleSpecificSkillScore(resumeText, roleConfig)
        
        // Analyze experience context
        const contextAnalysis = this.analyzeExperienceContext(resumeText, roleConfig)
        
        // Check for exclusion patterns (red flags)
        const exclusionCheck = this.checkExclusionPatterns(resumeText, roleConfig)
        
        // Calculate final role-specific score
        const roleSpecificScore = this.calculateFinalScore(
            skillAnalysis,
            contextAnalysis,
            exclusionCheck
        )
        
        return {
            name: resume.name,
            roleSpecificScore: roleSpecificScore,
            skillBreakdown: skillAnalysis,
            contextMatches: contextAnalysis.matches,
            redFlags: exclusionCheck.flags,
            explanation: this.generateRoleSpecificExplanation(
                roleSpecificScore,
                skillAnalysis,
                contextAnalysis,
                exclusionCheck
            ),
            traditionalScore: this.calculateTraditionalScore(resumeText, jobDescription)
        }
    }

    /**
     * Calculate role-specific skill scoring with proper weighting
     */
    calculateRoleSpecificSkillScore(resumeText, roleConfig) {
        const skillMatches = {
            critical: [],
            important: [],
            bonus: []
        }
        
        let totalScore = 0
        let maxPossibleScore = 0
        
        // Check critical skills (40 points each)
        roleConfig.coreSkills.critical.forEach(skill => {
            maxPossibleScore += 40
            if (this.skillFoundInResume(skill, resumeText)) {
                skillMatches.critical.push(skill)
                totalScore += 40
            }
        })
        
        // Check important skills (20 points each)
        roleConfig.coreSkills.important.forEach(skill => {
            maxPossibleScore += 20
            if (this.skillFoundInResume(skill, resumeText)) {
                skillMatches.important.push(skill)
                totalScore += 20
            }
        })
        
        // Check bonus skills (10 points each)
        roleConfig.coreSkills.bonus.forEach(skill => {
            maxPossibleScore += 10
            if (this.skillFoundInResume(skill, resumeText)) {
                skillMatches.bonus.push(skill)
                totalScore += 10
            }
        })
        
        return {
            matches: skillMatches,
            score: Math.round((totalScore / maxPossibleScore) * 100),
            breakdown: {
                critical: `${skillMatches.critical.length}/${roleConfig.coreSkills.critical.length}`,
                important: `${skillMatches.important.length}/${roleConfig.coreSkills.important.length}`,
                bonus: `${skillMatches.bonus.length}/${roleConfig.coreSkills.bonus.length}`
            }
        }
    }

    /**
     * Enhanced skill detection with context awareness
     */
    skillFoundInResume(skill, resumeText) {
        // Simple keyword matching first
        if (resumeText.includes(skill.toLowerCase())) {
            return true
        }
        
        // Check for variations and related terms
        const skillVariations = this.getSkillVariations(skill)
        return skillVariations.some(variation => 
            resumeText.includes(variation.toLowerCase())
        )
    }

    /**
     * Get skill variations for better matching
     */
    getSkillVariations(skill) {
        const variations = {
            'JavaScript': ['js', 'javascript', 'ecmascript', 'es6', 'es2015'],
            'React': ['react.js', 'reactjs', 'react native'],
            'CSS3': ['css', 'css3', 'cascading style sheets'],
            'responsive design': ['responsive', 'mobile-first', 'adaptive design'],
            'API development': ['rest api', 'restful', 'api design', 'web api'],
            'CI/CD': ['continuous integration', 'continuous deployment', 'pipeline']
        }
        
        return variations[skill] || [skill]
    }

    /**
     * Analyze experience context patterns
     */
    analyzeExperienceContext(resumeText, roleConfig) {
        const matches = []
        
        roleConfig.experiencePatterns.forEach(pattern => {
            const match = resumeText.match(pattern)
            if (match) {
                matches.push({
                    pattern: pattern.source,
                    context: match[0],
                    score: 15 // Bonus points for relevant experience context
                })
            }
        })
        
        return {
            matches: matches,
            score: Math.min(60, matches.length * 15) // Cap at 60 points
        }
    }

    /**
     * Check for exclusion patterns (role mismatches)
     */
    checkExclusionPatterns(resumeText, roleConfig) {
        const flags = []
        
        roleConfig.exclusionPatterns.forEach(pattern => {
            const match = resumeText.match(pattern)
            if (match) {
                flags.push({
                    pattern: pattern.source,
                    context: match[0],
                    penalty: -10 // Deduct points for role mismatches
                })
            }
        })
        
        return {
            flags: flags,
            penalty: flags.length * -10
        }
    }

    /**
     * Calculate final weighted score
     */
    calculateFinalScore(skillAnalysis, contextAnalysis, exclusionCheck) {
        const baseScore = Math.max(60, 
            skillAnalysis.score * 0.7 + // 70% weight on skills
            contextAnalysis.score * 0.3   // 30% weight on context
        )
        
        const finalScore = Math.max(60, Math.min(95, 
            baseScore + exclusionCheck.penalty
        ))
        
        return Math.round(finalScore)
    }

    /**
     * Generate role-specific explanation
     */
    generateRoleSpecificExplanation(score, skillAnalysis, contextAnalysis, exclusionCheck) {
        let explanation = `Role-specific analysis: ${score}% match. `
        
        // Add skill breakdown
        const criticalMatch = skillAnalysis.matches.critical.length
        const importantMatch = skillAnalysis.matches.important.length
        
        if (criticalMatch > 0) {
            explanation += `Strong in core skills: ${skillAnalysis.matches.critical.slice(0, 3).join(', ')}. `
        }
        
        if (contextAnalysis.matches.length > 0) {
            explanation += `Relevant experience context found. `
        }
        
        if (exclusionCheck.flags.length > 0) {
            explanation += `Some role misalignment detected. `
        }
        
        // Add recommendation
        if (score >= 85) {
            explanation += 'Excellent fit for this specific role.'
        } else if (score >= 75) {
            explanation += 'Good alignment with role requirements.'
        } else if (score >= 65) {
            explanation += 'Moderate fit, may need some skill development.'
        } else {
            explanation += 'Limited alignment with role requirements.'
        }
        
        return explanation
    }

    /**
     * Traditional scoring for comparison
     */
    calculateTraditionalScore(resumeText, jobDescription) {
        const jdWords = jobDescription.toLowerCase().split(/\W+/).filter(w => w.length > 3)
        const resumeWords = resumeText.split(/\W+/)
        
        const matches = jdWords.filter(word => resumeWords.includes(word))
        return Math.round(Math.max(60, Math.min(95, (matches.length / jdWords.length) * 100)))
    }
}

module.exports = { RoleSpecificAnalyzer }