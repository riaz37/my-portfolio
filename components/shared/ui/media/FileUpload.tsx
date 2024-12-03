'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/shared/ui/core/button';
import { useCustomToast } from "../toast/toast-wrapper";
import { FiUpload } from 'react-icons/fi';
import { Progress } from '@/components/shared/ui/feedback/progress';

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  type?: 'image' | 'document' | 'video';
  maxSize?: number; // in MB
}

const fileTypeMap = {
  image: {
    accept: 'image/*',
    maxSize: 5, // 5MB
    types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  },
  document: {
    accept: '.pdf,.doc,.docx,.ppt,.pptx',
    maxSize: 25, // 25MB
    types: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ],
  },
  video: {
    accept: 'video/mp4,video/webm,video/ogg',
    maxSize: 50, // 50MB
    types: ['video/mp4', 'video/webm', 'video/ogg'],
  },
};

export function FileUpload({
  onUploadComplete,
  type = 'image',
  maxSize = fileTypeMap[type].maxSize,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useCustomToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "Error",
        description: `File size must be less than ${maxSize}MB`,
        variant: "error"
      });
      return;
    }

    // Check file type
    if (!fileTypeMap[type].types.includes(file.type)) {
      toast({
        title: "Error",
        description: `Invalid file type. Please upload a ${type} file`,
        variant: "error"
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      setProgress(100);
      const data = await response.json();
      onUploadComplete(data.url);
      toast({
        title: "Success",
        description: "File uploaded successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "error"
      });
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={fileTypeMap[type].accept}
        className="hidden"
      />
      <Button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className="w-full"
      >
        <FiUpload className="mr-2 h-4 w-4" />
        {uploading ? 'Uploading...' : `Upload ${type.charAt(0).toUpperCase() + type.slice(1)}`}
      </Button>
      {uploading && (
        <div className="w-full">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-center mt-1">{progress}%</p>
        </div>
      )}
    </div>
  );
}
