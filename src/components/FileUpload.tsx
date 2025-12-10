import { useState, useCallback } from 'react';
import { Upload, X, FileIcon, Image } from 'lucide-react';
import { Button } from './ui/button';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  label: string;
  existingFile?: File | null;
}

const FileUpload = ({ 
  onFileSelect, 
  accept = '.pdf,.jpg,.jpeg,.png', 
  maxSize = 5,
  label,
  existingFile 
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(existingFile || null);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file: File): boolean => {
    const maxSizeBytes = maxSize * 1024 * 1024;
    
    if (file.size > maxSizeBytes) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    const acceptedTypes = accept.split(',').map(t => t.trim());
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!acceptedTypes.some(type => fileExt === type || file.type.startsWith(type.replace('.', '')))) {
      setError(`File type must be one of: ${accept}`);
      return false;
    }

    return true;
  };

  const handleFile = useCallback((selectedFile: File) => {
    setError('');
    
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setError('');
    onFileSelect(null);
  };

  const isImage = file && file.type.startsWith('image/');

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      
      {!file ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer hover:border-christmas-gold ${
            dragActive ? 'border-christmas-gold bg-christmas-gold/10' : 'border-border bg-muted/30'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept={accept}
            onChange={handleChange}
          />
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                Drop your file here or <span className="text-christmas-gold">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {accept} (max {maxSize}MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            {isImage ? (
              <div className="relative w-16 h-16 rounded overflow-hidden bg-muted">
                <img 
                  src={URL.createObjectURL(file)} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded bg-christmas-red/20 flex items-center justify-center">
                <FileIcon className="w-8 h-8 text-christmas-red" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="hover:bg-destructive/20 hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;
