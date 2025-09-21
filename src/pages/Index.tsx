import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { UserInfoForm } from '@/components/UserInfoForm';
import { ResumeAnalysis } from '@/components/ResumeAnalysis';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export interface UserInfo {
  name: string;
  email: string;
  jobRole: string;
}

export interface ResumeData {
  userInfo: UserInfo;
  resumeText: string;
  fileName: string;
}

const Index = () => {
  const [step, setStep] = useState(1);
  const [resumeText, setResumeText] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', email: '', jobRole: '' });
  const [fileName, setFileName] = useState('');

  const handleFileUploaded = (text: string, name: string) => {
    setResumeText(text);
    setFileName(name);
    setStep(2);
  };

  const handleUserInfoSubmit = (info: UserInfo) => {
    setUserInfo(info);
    setStep(3);
  };

  const resetProcess = () => {
    setStep(1);
    setResumeText('');
    setUserInfo({ name: '', email: '', jobRole: '' });
    setFileName('');
  };

  const progressValue = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Resume Checker & Evaluator
          </h1>
          <p className="text-lg text-muted-foreground">
            Get professional feedback and scoring for your resume
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Step {step} of 3
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progressValue)}% Complete
            </span>
          </div>
          <Progress value={progressValue} className="w-full" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span className={step >= 1 ? "text-primary font-medium" : ""}>Upload Resume</span>
            <span className={step >= 2 ? "text-primary font-medium" : ""}>Basic Info</span>
            <span className={step >= 3 ? "text-primary font-medium" : ""}>Analysis</span>
          </div>
        </Card>

        {/* Step Content */}
        {step === 1 && (
          <FileUpload onFileUploaded={handleFileUploaded} />
        )}

        {step === 2 && (
          <UserInfoForm 
            onSubmit={handleUserInfoSubmit}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <ResumeAnalysis
            resumeData={{
              userInfo,
              resumeText,
              fileName
            }}
            onReset={resetProcess}
          />
        )}
      </div>
    </div>
  );
};

export default Index;