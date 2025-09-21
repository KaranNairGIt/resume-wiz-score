export interface AnalysisResult {
  totalScore: number;
  grade: string;
  scores: {
    contactInfo: number;
    education: number;
    workExperience: number;
    skills: number;
    achievements: number;
    keywords: number;
  };
  strengths: string[];
  weaknesses: string[];
  improvementTips: string[];
}

export const analyzeResume = (resumeText: string, jobRole: string): AnalysisResult => {
  const text = resumeText.toLowerCase();
  const scores = {
    contactInfo: analyzeContactInfo(text),
    education: analyzeEducation(text),
    workExperience: analyzeWorkExperience(text),
    skills: analyzeSkills(text),
    achievements: analyzeAchievements(text),
    keywords: analyzeKeywords(text, jobRole),
  };

  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const grade = calculateGrade(totalScore);
  
  const strengths = generateStrengths(scores, jobRole);
  const weaknesses = generateWeaknesses(scores);
  const improvementTips = generateImprovementTips(scores, weaknesses);

  return {
    totalScore,
    grade,
    scores,
    strengths,
    weaknesses,
    improvementTips,
  };
};

const analyzeContactInfo = (text: string): number => {
  let score = 0;
  
  // Check for email
  if (/@/.test(text)) score += 4;
  
  // Check for phone number patterns
  if (/\d{3}[\-\s]?\d{3}[\-\s]?\d{4}|\(\d{3}\)\s?\d{3}[\-\s]?\d{4}/.test(text)) score += 3;
  
  // Check for name (if text is longer than expected for just contact info)
  if (text.length > 50) score += 3;
  
  return Math.min(score, 10);
};

const analyzeEducation = (text: string): number => {
  let score = 0;
  
  const educationKeywords = [
    'university', 'college', 'degree', 'bachelor', 'master', 'phd', 'doctorate',
    'education', 'graduated', 'gpa', 'major', 'minor', 'school', 'institute',
    'b.s.', 'b.a.', 'm.s.', 'm.a.', 'bs', 'ba', 'ms', 'ma'
  ];
  
  const foundKeywords = educationKeywords.filter(keyword => text.includes(keyword));
  
  if (foundKeywords.length > 0) score += 8;
  if (foundKeywords.length >= 3) score += 4;
  if (/\d{4}/.test(text)) score += 3; // Year mentioned
  
  return Math.min(score, 15);
};

const analyzeWorkExperience = (text: string): number => {
  let score = 0;
  
  const experienceKeywords = [
    'experience', 'work', 'job', 'position', 'role', 'company', 'employer',
    'developed', 'managed', 'led', 'created', 'implemented', 'achieved',
    'responsible', 'responsibilities', 'projects', 'project'
  ];
  
  const foundKeywords = experienceKeywords.filter(keyword => text.includes(keyword));
  
  if (foundKeywords.length >= 2) score += 10;
  if (foundKeywords.length >= 5) score += 8;
  if (foundKeywords.length >= 8) score += 7;
  
  // Check for dates/duration
  if (/\d{4}|\d+\s*(year|month|yr|mo)/.test(text)) score += 5;
  
  return Math.min(score, 25);
};

const analyzeSkills = (text: string): number => {
  let score = 0;
  
  const skillKeywords = [
    'skills', 'skill', 'technologies', 'technology', 'programming', 'software',
    'tools', 'languages', 'frameworks', 'database', 'technical', 'proficient'
  ];
  
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node', 'sql', 'html', 'css',
    'git', 'aws', 'docker', 'kubernetes', 'excel', 'powerpoint', 'word',
    'communication', 'leadership', 'teamwork', 'problem solving'
  ];
  
  const foundSkillKeywords = skillKeywords.filter(keyword => text.includes(keyword));
  const foundSkills = commonSkills.filter(skill => text.includes(skill));
  
  if (foundSkillKeywords.length > 0) score += 8;
  if (foundSkills.length >= 3) score += 6;
  if (foundSkills.length >= 6) score += 6;
  
  return Math.min(score, 20);
};

const analyzeAchievements = (text: string): number => {
  let score = 0;
  
  const achievementKeywords = [
    'achievement', 'award', 'recognition', 'certification', 'certificate',
    'honor', 'accomplishment', 'published', 'patent', 'increased', 'improved',
    'reduced', 'saved', '%', 'percent'
  ];
  
  const foundKeywords = achievementKeywords.filter(keyword => text.includes(keyword));
  
  if (foundKeywords.length >= 1) score += 5;
  if (foundKeywords.length >= 3) score += 3;
  if (foundKeywords.length >= 5) score += 2;
  
  return Math.min(score, 10);
};

const analyzeKeywords = (text: string, jobRole: string): number => {
  const jobRoleKeywords = generateJobRoleKeywords(jobRole.toLowerCase());
  const foundKeywords = jobRoleKeywords.filter(keyword => text.includes(keyword));
  
  const matchPercentage = foundKeywords.length / jobRoleKeywords.length;
  return Math.round(matchPercentage * 20);
};

const generateJobRoleKeywords = (jobRole: string): string[] => {
  const keywordMap: { [key: string]: string[] } = {
    'software engineer': [
      'programming', 'coding', 'development', 'javascript', 'python', 'java',
      'react', 'node', 'git', 'database', 'api', 'software', 'algorithm'
    ],
    'marketing manager': [
      'marketing', 'campaign', 'social media', 'analytics', 'brand', 'seo',
      'content', 'strategy', 'digital', 'advertising', 'promotion'
    ],
    'data scientist': [
      'data', 'analysis', 'python', 'r', 'machine learning', 'statistics',
      'sql', 'visualization', 'modeling', 'analytics', 'pandas', 'numpy'
    ],
    'product manager': [
      'product', 'roadmap', 'strategy', 'stakeholder', 'requirements',
      'agile', 'scrum', 'analytics', 'user experience', 'market research'
    ],
    'designer': [
      'design', 'ui', 'ux', 'photoshop', 'illustrator', 'figma', 'sketch',
      'visual', 'creative', 'typography', 'branding', 'wireframe'
    ]
  };

  // Find matching keywords for job role
  for (const [role, keywords] of Object.entries(keywordMap)) {
    if (jobRole.includes(role) || role.includes(jobRole)) {
      return keywords;
    }
  }

  // Default keywords for any role
  return [
    'experience', 'skills', 'team', 'project', 'management', 'communication',
    'leadership', 'problem solving', 'collaboration', 'innovation'
  ];
};

const calculateGrade = (score: number): string => {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  return 'D';
};

const generateStrengths = (scores: AnalysisResult['scores'], jobRole: string): string[] => {
  const strengths: string[] = [];
  
  if (scores.contactInfo >= 8) {
    strengths.push('Complete contact information provided');
  }
  
  if (scores.education >= 12) {
    strengths.push('Strong educational background clearly presented');
  }
  
  if (scores.workExperience >= 20) {
    strengths.push('Excellent work experience section with detailed descriptions');
  }
  
  if (scores.skills >= 16) {
    strengths.push('Comprehensive skills section relevant to your field');
  }
  
  if (scores.achievements >= 7) {
    strengths.push('Good inclusion of achievements and measurable results');
  }
  
  if (scores.keywords >= 15) {
    strengths.push(`Strong keyword alignment with ${jobRole} role requirements`);
  }
  
  if (strengths.length === 0) {
    strengths.push('Resume structure is present and readable');
  }
  
  return strengths;
};

const generateWeaknesses = (scores: AnalysisResult['scores']): string[] => {
  const weaknesses: string[] = [];
  
  if (scores.contactInfo < 8) {
    weaknesses.push('Contact information section needs improvement');
  }
  
  if (scores.education < 10) {
    weaknesses.push('Education section could be more detailed');
  }
  
  if (scores.workExperience < 15) {
    weaknesses.push('Work experience section lacks depth or detail');
  }
  
  if (scores.skills < 12) {
    weaknesses.push('Skills section needs expansion or better organization');
  }
  
  if (scores.achievements < 5) {
    weaknesses.push('Missing achievements, certifications, or quantifiable results');
  }
  
  if (scores.keywords < 10) {
    weaknesses.push('Limited job-relevant keywords and terminology');
  }
  
  return weaknesses;
};

const generateImprovementTips = (scores: AnalysisResult['scores'], weaknesses: string[]): string[] => {
  const tips: string[] = [];
  
  if (scores.contactInfo < 8) {
    tips.push('Ensure your resume includes email, phone number, and optionally LinkedIn profile or portfolio URL');
  }
  
  if (scores.education < 10) {
    tips.push('Add your degree, institution, graduation year, and relevant coursework or GPA if strong');
  }
  
  if (scores.workExperience < 15) {
    tips.push('Use action verbs and quantify your achievements (e.g., "Increased sales by 25%" instead of "Helped with sales")');
  }
  
  if (scores.skills < 12) {
    tips.push('Create a dedicated skills section with both technical and soft skills relevant to your target role');
  }
  
  if (scores.achievements < 5) {
    tips.push('Add a certifications section and include measurable accomplishments throughout your experience');
  }
  
  if (scores.keywords < 10) {
    tips.push('Review the job description and incorporate relevant industry keywords and terminology naturally');
  }
  
  tips.push('Keep your resume to 1-2 pages and use consistent formatting throughout');
  tips.push('Proofread carefully for spelling and grammar errors');
  
  return tips;
};