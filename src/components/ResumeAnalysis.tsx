import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Award, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  User,
  Briefcase,
  GraduationCap,
  Settings,
  Star
} from 'lucide-react';
import { ResumeData } from '@/pages/Index';
import { analyzeResume, AnalysisResult } from '@/utils/resumeAnalyzer';
import { downloadReport } from '@/utils/reportGenerator';

interface ResumeAnalysisProps {
  resumeData: ResumeData;
  onReset: () => void;
}

export const ResumeAnalysis = ({ resumeData, onReset }: ResumeAnalysisProps) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const performAnalysis = async () => {
      setIsAnalyzing(true);
      // Simulate analysis time for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = analyzeResume(resumeData.resumeText, resumeData.userInfo.jobRole);
      setAnalysis(result);
      setIsAnalyzing(false);
      
      // Animate score counting up
      let current = 0;
      const increment = result.totalScore / 50; // 50 steps
      const timer = setInterval(() => {
        current += increment;
        if (current >= result.totalScore) {
          setAnimatedScore(result.totalScore);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, 30);
    };

    performAnalysis();
  }, [resumeData]);

  const handleDownloadReport = () => {
    if (analysis) {
      downloadReport(resumeData, analysis);
      toast({
        title: "Report Downloaded",
        description: "Your resume analysis report has been downloaded as JSON.",
      });
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-grade-a';
      case 'B': return 'text-grade-b'; 
      case 'C': return 'text-grade-c';
      case 'D': return 'text-grade-d';
      default: return 'text-muted-foreground';
    }
  };

  const getGradeBackground = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-grade-a/10 border-grade-a/20';
      case 'B': return 'bg-grade-b/10 border-grade-b/20';
      case 'C': return 'bg-grade-c/10 border-grade-c/20';
      case 'D': return 'bg-grade-d/10 border-grade-d/20';
      default: return 'bg-muted/10';
    }
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <div className="space-y-6">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Analyzing Your Resume
              </h2>
              <p className="text-muted-foreground">
                Our AI is evaluating your resume across multiple criteria...
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-success" />
                Extracting content structure
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-success" />
                Analyzing sections and keywords
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                Generating recommendations
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!analysis) return null;

  const criteriaSections = [
    { key: 'contactInfo', icon: User, label: 'Contact Information', maxScore: 10 },
    { key: 'education', icon: GraduationCap, label: 'Education Section', maxScore: 15 },
    { key: 'workExperience', icon: Briefcase, label: 'Work Experience', maxScore: 25 },
    { key: 'skills', icon: Settings, label: 'Skills Section', maxScore: 20 },
    { key: 'achievements', icon: Award, label: 'Achievements', maxScore: 10 },
    { key: 'keywords', icon: TrendingUp, label: 'Job Role Keywords', maxScore: 20 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Score Overview */}
      <Card className="p-8 text-center">
        <div className="space-y-6">
          <div className="relative">
            <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 ${getGradeBackground(analysis.grade)}`}>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getGradeColor(analysis.grade)}`}>
                  {analysis.grade}
                </div>
                <div className="text-sm text-muted-foreground">Grade</div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-4xl font-bold text-foreground mb-2">
              {animatedScore}<span className="text-2xl text-muted-foreground">/100</span>
            </div>
            <Progress value={animatedScore} className="w-64 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Resume Score for <span className="font-medium">{resumeData.userInfo.jobRole}</span>
            </p>
          </div>
        </div>
      </Card>

      {/* Detailed Scoring */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Detailed Analysis
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {criteriaSections.map(({ key, icon: Icon, label, maxScore }) => {
            const score = analysis.scores[key as keyof typeof analysis.scores];
            const percentage = (score / maxScore) * 100;
            
            return (
              <div key={key} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{label}</span>
                  </div>
                  <span className="text-sm font-medium">
                    {score}/{maxScore}
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Strengths and Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-success">
            <CheckCircle className="h-5 w-5" />
            Strengths
          </h3>
          <div className="space-y-3">
            {analysis.strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{strength}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            Areas for Improvement
          </h3>
          <div className="space-y-3">
            {analysis.weaknesses.map((weakness, index) => (
              <div key={index} className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{weakness}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Improvement Tips */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-primary">
          <TrendingUp className="h-5 w-5" />
          Improvement Tips
        </h3>
        <div className="space-y-3">
          {analysis.improvementTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
              <div className="h-6 w-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={handleDownloadReport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Report
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Analyze Another Resume
        </Button>
      </div>
    </div>
  );
};