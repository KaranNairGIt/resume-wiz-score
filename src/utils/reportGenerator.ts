import { ResumeData } from '@/pages/Index';
import { AnalysisResult } from './resumeAnalyzer';

export const downloadReport = (resumeData: ResumeData, analysis: AnalysisResult) => {
  const report = {
    name: resumeData.userInfo.name,
    email: resumeData.userInfo.email,
    role: resumeData.userInfo.jobRole,
    fileName: resumeData.fileName,
    analysisDate: new Date().toISOString(),
    score: analysis.totalScore,
    grade: analysis.grade,
    detailedScores: {
      contactInformation: `${analysis.scores.contactInfo}/10`,
      education: `${analysis.scores.education}/15`,
      workExperience: `${analysis.scores.workExperience}/25`,
      skills: `${analysis.scores.skills}/20`,
      achievements: `${analysis.scores.achievements}/10`,
      jobRoleKeywords: `${analysis.scores.keywords}/20`
    },
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    improvementTips: analysis.improvementTips,
    summary: `Your resume scored ${analysis.totalScore}/100 (Grade ${analysis.grade}) for the ${resumeData.userInfo.jobRole} role. ${
      analysis.totalScore >= 85 ? 'Excellent work! Your resume is well-structured and comprehensive.' :
      analysis.totalScore >= 70 ? 'Good foundation with room for improvement in key areas.' :
      analysis.totalScore >= 55 ? 'Your resume needs significant improvements to be competitive.' :
      'Major revisions needed to improve your resume\'s effectiveness.'
    }`
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { 
    type: 'application/json' 
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `resume-analysis-${resumeData.userInfo.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};