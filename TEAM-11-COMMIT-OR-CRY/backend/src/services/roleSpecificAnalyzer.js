class RoleSpecificAnalyzer {
    constructor() {
        this.roles = {
            frontend: ['react', 'vue', 'angular', 'javascript', 'css', 'html', 'typescript'],
            backend: ['node', 'python', 'java', 'api', 'database', 'sql', 'mongodb'],
            fullstack: ['mern', 'mean', 'javascript', 'database', 'react', 'node'],
            devops: ['docker', 'kubernetes', 'aws', 'jenkins', 'terraform', 'ci/cd']
        };
    }

    async analyze(jobTitle, jobDescription, resumes) {
        let roleType = this.detectRole(jobTitle, jobDescription);
        
        if (!roleType) {
            return this.basicAnalysis(resumes, jobDescription);
        }
        
        return this.scoreForRole(resumes, roleType);
    }

    detectRole(title, desc) {
        let combined = title.toLowerCase() + ' ' + desc.toLowerCase();
        
        if (combined.includes('frontend') || combined.includes('react') || combined.includes('ui')) 
            return 'frontend';
        
        if (combined.includes('backend') || combined.includes('api') || combined.includes('server')) 
            return 'backend';
            
        if (combined.includes('fullstack') || combined.includes('full stack') || combined.includes('mern')) 
            return 'fullstack';
            
        if (combined.includes('devops') || combined.includes('docker')) 
            return 'devops';
        
        return null;
    }

    scoreForRole(resumes, role) {
        let results = [];
        let keywords = this.roles[role];
        
        resumes.forEach(resume => {
            let score = this.calculateScore(resume.text, keywords);
            results.push({
                name: resume.name,
                score: score,
                explanation: `${role} match: ${score}%`
            });
        });
        
        results.sort((a, b) => b.score - a.score);
        return results;
    }

    calculateScore(resumeText, keywords) {
        let text = resumeText.toLowerCase();
        let matches = 0;
        
        keywords.forEach(keyword => {
            if (text.includes(keyword.toLowerCase())) {
                matches++;
            }
        });
        
        let percentage = (matches / keywords.length) * 100;
        let finalScore = 60 + Math.round(percentage * 0.3);
        
        return Math.min(finalScore, 95);
    }

    basicAnalysis(resumes, jobDescription) {
        let results = [];
        
        resumes.forEach(resume => {
            let score = this.simpleScore(resume.text, jobDescription);
            results.push({
                name: resume.name,
                score: score,
                explanation: `Basic match: ${score}%`
            });
        });
        
        return results.sort((a, b) => b.score - a.score);
    }

    simpleScore(resumeText, jobDesc) {
        if (!jobDesc) return 70;
        
        let jobWords = jobDesc.toLowerCase().split(' ').filter(w => w.length > 3);
        let resumeLower = resumeText.toLowerCase();
        let matches = 0;
        
        jobWords.forEach(word => {
            if (resumeLower.includes(word)) matches++;
        });
        
        let score = 60 + Math.round((matches / jobWords.length) * 35);
        return Math.min(score, 95);
    }
}

module.exports = { RoleSpecificAnalyzer };

module.exports = { RoleSpecificAnalyzer };