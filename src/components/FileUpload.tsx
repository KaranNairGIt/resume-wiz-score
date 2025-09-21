import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { parseFile } from '@/utils/fileParser';

interface FileUploadProps {
  onFileUploaded: (text: string, fileName: string) => void;
}

export const FileUpload = ({ onFileUploaded }: FileUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await parseFile(file);
      if (text.trim()) {
        onFileUploaded(text, file.name);
        toast({
          title: "Success!",
          description: "Resume uploaded and processed successfully.",
        });
      } else {
        throw new Error("No text content found in the file");
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8">
        <div className="text-center mb-6">
          <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Upload Your Resume
          </h2>
          <p className="text-muted-foreground">
            Upload your resume in PDF, DOCX, or TXT format for analysis
          </p>
        </div>

        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200",
            "hover:border-primary hover:bg-primary/5",
            isDragActive && "border-primary bg-primary/10",
            isDragReject && "border-destructive bg-destructive/10",
            isProcessing && "pointer-events-none opacity-50"
          )}
        >
          <input {...getInputProps()} />
          
          {isProcessing ? (
            <div className="space-y-4">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
              <p className="text-muted-foreground">Processing your resume...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {isDragReject ? (
                <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
              ) : (
                <Upload className="h-8 w-8 text-primary mx-auto" />
              )}
              
              {isDragActive ? (
                <p className="text-lg text-primary font-medium">Drop your resume here!</p>
              ) : isDragReject ? (
                <p className="text-destructive">File type not supported</p>
              ) : (
                <div>
                  <p className="text-lg text-foreground font-medium mb-2">
                    Drag & drop your resume here
                  </p>
                  <p className="text-muted-foreground text-sm">
                    or click to browse files
                  </p>
                </div>
              )}
              
              <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-muted rounded">PDF</span>
                <span className="px-2 py-1 bg-muted rounded">DOCX</span>
                <span className="px-2 py-1 bg-muted rounded">TXT</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-accent/50 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Tips for best results:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Use a well-formatted resume with clear sections</li>
                <li>Include contact information, education, and work experience</li>
                <li>Keep file size under 10MB</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};