'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, X, File } from 'lucide-react';
import { ImagePreview } from './ImagePreview';

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<string>;
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  showPreview?: boolean;
  className?: string;
}

export function FileUpload({
  onFileUpload,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  showPreview = true,
  className = ''
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<{url: string, name: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = useCallback(async (files: File[]) => {
    setError(null);
    
    for (const file of files) {
      // Проверка размера файла
      if (file.size > maxSize) {
        setError(`Файл ${file.name} превышает максимальный размер ${(maxSize / 1024 / 1024).toFixed(0)}МБ`);
        continue;
      }
      
      setUploading(true);
      setProgress(0);
      
      try {
        // Более реалистичная симуляция прогресса загрузки
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 85) {
              clearInterval(progressInterval);
              return 85;
            }
            return prev + Math.random() * 15;
          });
        }, 100);
        
        const url = await onFileUpload(file);
        
        clearInterval(progressInterval);
        setProgress(100);
        
        setUploadedFiles(prev => [...prev, { url, name: file.name }]);
        
        // Показываем уведомление об успешной загрузке
        if (typeof window !== 'undefined') {
          const { toast } = await import('sonner');
          toast.success(`Файл "${file.name}" успешно загружен`);
        }
        
        setTimeout(() => {
          setProgress(0);
          setUploading(false);
        }, 500);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка при загрузке файла';
        setError(errorMessage);
        setUploading(false);
        setProgress(0);
        
        // Показываем уведомление об ошибке
        if (typeof window !== 'undefined') {
          const { toast } = await import('sonner');
          toast.error(`Ошибка загрузки файла "${file.name}": ${errorMessage}`);
        }
      }
    }
  }, [onFileUpload, maxSize]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const isImage = (filename: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          onChange={handleFileChange}
          accept={accept}
          multiple={multiple}
          style={{ display: 'none' }}
          id="file-upload"
        />
        
        <div className="flex flex-col items-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          
          <div className="space-y-1">
            <label htmlFor="file-upload" className="text-sm text-gray-600 cursor-pointer">
              {isDragOver ? 'Отпустите файлы здесь' : 'Нажмите для выбора файлов или перетащите их сюда'}
            </label>
            <p className="text-xs text-gray-400">
              Максимальный размер: {(maxSize / 1024 / 1024).toFixed(0)}МБ
            </p>
          </div>
        </div>
      </div>

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Загрузка файла...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Загруженные файлы:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="relative">
                {showPreview && isImage(file.name) ? (
                  <ImagePreview
                    src={file.url}
                    alt={file.name}
                    showRemove
                    onRemove={() => removeFile(index)}
                    width={120}
                    height={90}
                  />
                ) : (
                  <div className="relative border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4 text-gray-500" />
                      <span className="text-xs truncate">{file.name}</span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}