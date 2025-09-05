/**
 * ImageUpload component for Study & Style application
 * Handles drag-and-drop image uploads with preview and validation
 */

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';
import cloudinaryService from '../services/cloudinary.js';

const ImageUpload = ({ 
  onUploadComplete, 
  onUploadError, 
  multiple = false, 
  maxFiles = 5,
  className = '',
  disabled = false,
  showPreview = true,
  compressImages = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = useCallback(async (files) => {
    if (disabled) return;

    const fileArray = Array.from(files);
    
    // Validate file count
    if (!multiple && fileArray.length > 1) {
      setError('Please select only one file');
      return;
    }

    if (fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Validate each file
    const validFiles = [];
    for (const file of fileArray) {
      const validation = cloudinaryService.validateFile(file);
      if (!validation.isValid) {
        setError(validation.error);
        return;
      }
      validFiles.push(file);
    }

    setError(null);
    
    // Create previews
    if (showPreview) {
      const newPreviews = await Promise.all(
        validFiles.map(async (file) => ({
          id: Date.now() + Math.random(),
          file,
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          status: 'pending'
        }))
      );
      setPreviews(newPreviews);
    }

    // Upload files
    await uploadFiles(validFiles);
  }, [disabled, multiple, maxFiles, showPreview]);

  // Upload files to Cloudinary
  const uploadFiles = async (files) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadResults = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Update preview status
        if (showPreview) {
          setPreviews(prev => prev.map(p => 
            p.file === file ? { ...p, status: 'uploading' } : p
          ));
        }

        // Compress image if enabled
        let fileToUpload = file;
        if (compressImages && file.type.startsWith('image/')) {
          try {
            fileToUpload = await cloudinaryService.compressImage(file);
          } catch (compressionError) {
            console.warn('Image compression failed, using original:', compressionError);
          }
        }

        // Upload to Cloudinary
        const result = await cloudinaryService.uploadImage(fileToUpload, {
          tags: ['wardrobe', 'user-upload'],
          folder: 'study-style/wardrobe'
        });

        if (result.success) {
          uploadResults.push(result.data);
          
          // Update preview status
          if (showPreview) {
            setPreviews(prev => prev.map(p => 
              p.file === file ? { ...p, status: 'success', uploadedUrl: result.data.url } : p
            ));
          }
        } else {
          throw new Error(result.error);
        }

        // Update progress
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      // Call success callback
      if (onUploadComplete) {
        onUploadComplete(multiple ? uploadResults : uploadResults[0]);
      }

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message);
      
      // Update preview status
      if (showPreview) {
        setPreviews(prev => prev.map(p => ({ ...p, status: 'error' })));
      }
      
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle drag events
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(false);
    }
  }, [disabled]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (!disabled) {
      const files = e.dataTransfer.files;
      handleFileSelect(files);
    }
  }, [disabled, handleFileSelect]);

  // Handle file input change
  const handleInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  // Remove preview
  const removePreview = useCallback((previewId) => {
    setPreviews(prev => {
      const preview = prev.find(p => p.id === previewId);
      if (preview && preview.url) {
        URL.revokeObjectURL(preview.url);
      }
      return prev.filter(p => p.id !== previewId);
    });
  }, []);

  // Clear all previews
  const clearPreviews = useCallback(() => {
    previews.forEach(preview => {
      if (preview.url) {
        URL.revokeObjectURL(preview.url);
      }
    });
    setPreviews([]);
    setError(null);
  }, [previews]);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`image-upload ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${isDragging 
            ? 'border-accent bg-accent/10' 
            : 'border-gray-300 hover:border-accent/50'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isUploading ? 'pointer-events-none' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />

        {isUploading ? (
          <div className="space-y-4">
            <div className="animate-spin mx-auto w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Uploading...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{Math.round(uploadProgress)}%</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              {isDragging ? (
                <Upload className="w-full h-full" />
              ) : (
                <ImageIcon className="w-full h-full" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isDragging ? 'Drop images here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, WebP up to 10MB {multiple && `(max ${maxFiles} files)`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Preview Grid */}
      {showPreview && previews.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              {previews.length} file{previews.length > 1 ? 's' : ''} selected
            </h4>
            <button
              onClick={clearPreviews}
              className="text-xs text-gray-500 hover:text-gray-700"
              disabled={isUploading}
            >
              Clear all
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {previews.map((preview) => (
              <div key={preview.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={preview.uploadedUrl || preview.url}
                    alt={preview.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status Overlay */}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {preview.status === 'uploading' && (
                      <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
                    )}
                    {preview.status === 'success' && (
                      <Check className="w-6 h-6 text-green-400" />
                    )}
                    {preview.status === 'error' && (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    )}
                  </div>
                  
                  {/* Remove Button */}
                  {!isUploading && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removePreview(preview.id);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                
                {/* File Info */}
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-medium text-gray-700 truncate">
                    {preview.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(preview.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
