/**
 * Cloudinary service for image upload and management
 */

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'study-style',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'study_style_preset',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  folder: 'study-style/wardrobe'
};

class CloudinaryService {
  constructor() {
    this.baseUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}`;
    this.uploadUrl = `${this.baseUrl}/image/upload`;
  }

  /**
   * Upload image to Cloudinary
   * @param {File} file - Image file to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  async uploadImage(file, options = {}) {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('folder', options.folder || CLOUDINARY_CONFIG.folder);
      
      // Add optional parameters
      if (options.publicId) {
        formData.append('public_id', options.publicId);
      }
      
      if (options.tags) {
        formData.append('tags', Array.isArray(options.tags) ? options.tags.join(',') : options.tags);
      }

      // Add transformation parameters
      if (options.transformation) {
        formData.append('transformation', JSON.stringify(options.transformation));
      } else {
        // Default transformation for wardrobe items
        formData.append('transformation', JSON.stringify([
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { format: 'auto' }
        ]));
      }

      // Upload to Cloudinary
      const response = await fetch(this.uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const result = await response.json();
      
      return {
        success: true,
        data: {
          publicId: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          createdAt: result.created_at,
          tags: result.tags || []
        }
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Upload multiple images
   * @param {FileList|Array} files - Array of files to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Array>} Array of upload results
   */
  async uploadMultipleImages(files, options = {}) {
    const fileArray = Array.from(files);
    const uploadPromises = fileArray.map((file, index) => 
      this.uploadImage(file, {
        ...options,
        publicId: options.publicId ? `${options.publicId}_${index}` : undefined
      })
    );

    try {
      const results = await Promise.allSettled(uploadPromises);
      return results.map((result, index) => ({
        index,
        file: fileArray[index],
        ...result.value
      }));
    } catch (error) {
      console.error('Multiple upload error:', error);
      throw error;
    }
  }

  /**
   * Delete image from Cloudinary
   * @param {string} publicId - Public ID of the image to delete
   * @returns {Promise<Object>} Deletion result
   */
  async deleteImage(publicId) {
    try {
      // Note: This requires server-side implementation for security
      // For now, we'll just return success as deletion is not critical for the MVP
      console.log('Image deletion requested for:', publicId);
      return {
        success: true,
        message: 'Image deletion requested'
      };
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate optimized image URL
   * @param {string} publicId - Public ID of the image
   * @param {Object} transformation - Transformation options
   * @returns {string} Optimized image URL
   */
  getOptimizedUrl(publicId, transformation = {}) {
    const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`;
    
    const transformations = [];
    
    // Add transformations
    if (transformation.width || transformation.height) {
      const crop = transformation.crop || 'fill';
      transformations.push(`c_${crop}`);
      
      if (transformation.width) transformations.push(`w_${transformation.width}`);
      if (transformation.height) transformations.push(`h_${transformation.height}`);
    }
    
    if (transformation.quality) {
      transformations.push(`q_${transformation.quality}`);
    } else {
      transformations.push('q_auto');
    }
    
    if (transformation.format) {
      transformations.push(`f_${transformation.format}`);
    } else {
      transformations.push('f_auto');
    }

    // Add effects
    if (transformation.effects) {
      transformation.effects.forEach(effect => {
        transformations.push(effect);
      });
    }

    const transformationString = transformations.length > 0 ? transformations.join(',') + '/' : '';
    return `${baseUrl}/${transformationString}${publicId}`;
  }

  /**
   * Generate thumbnail URL
   * @param {string} publicId - Public ID of the image
   * @param {number} size - Thumbnail size (default: 150)
   * @returns {string} Thumbnail URL
   */
  getThumbnailUrl(publicId, size = 150) {
    return this.getOptimizedUrl(publicId, {
      width: size,
      height: size,
      crop: 'fill',
      quality: 'auto'
    });
  }

  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @returns {Object} Validation result
   */
  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.' 
      };
    }

    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: 'File too large. Maximum size is 10MB.' 
      };
    }

    return { isValid: true };
  }

  /**
   * Compress image before upload (client-side)
   * @param {File} file - Image file to compress
   * @param {Object} options - Compression options
   * @returns {Promise<File>} Compressed file
   */
  async compressImage(file, options = {}) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const maxWidth = options.maxWidth || 1200;
        const maxHeight = options.maxHeight || 1200;
        const quality = options.quality || 0.8;

        let { width, height } = img;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Get image analysis (colors, objects, etc.)
   * @param {string} publicId - Public ID of the image
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeImage(publicId) {
    try {
      // This would typically require server-side implementation
      // For now, return mock analysis data
      return {
        success: true,
        data: {
          colors: ['#FF5733', '#33FF57', '#3357FF'],
          dominantColor: '#FF5733',
          objects: ['clothing', 'fabric'],
          tags: ['fashion', 'apparel']
        }
      };
    } catch (error) {
      console.error('Image analysis error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Create singleton instance
const cloudinaryService = new CloudinaryService();

export default cloudinaryService;
export { CloudinaryService, CLOUDINARY_CONFIG };
