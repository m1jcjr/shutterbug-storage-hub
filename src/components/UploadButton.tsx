
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface UploadButtonProps {
  onUpload: (files: FileList) => void;
  disabled?: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({ onUpload, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleUploadClick = () => {
    if (disabled) {
      toast.error("You've reached your upload limit. Upgrade your tier to upload more photos.");
      return;
    }
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files);
    }
    // Clear the input value so the same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) {
      toast.error("You've reached your upload limit. Upgrade your tier to upload more photos.");
      return;
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    } else {
      toast.error('No files detected');
    }
  };
  
  return (
    <div
      className={`w-full p-4 transition-all ${isDragging ? 'bg-blue-50 border-2 border-dashed border-google-blue' : ''} ${disabled ? 'opacity-70' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Button 
        onClick={handleUploadClick}
        className={`bg-google-blue hover:bg-blue-600 text-white flex gap-2 items-center ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
        disabled={disabled}
      >
        <Upload className="w-4 h-4" />
        <span>Upload Photos</span>
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      <p className="text-sm text-muted-foreground mt-2">
        Drag and drop photos here or click the upload button
      </p>
    </div>
  );
};

export default UploadButton;

