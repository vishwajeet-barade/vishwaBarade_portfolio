'use client';

import { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface CloudinaryUploadProps {
    onUploadSuccess: (url: string) => void;
    folder?: string;
    acceptedTypes?: string;
    maxSize?: number; // in MB
    buttonText?: string;
    currentImage?: string;
}

export default function CloudinaryUpload({
    onUploadSuccess,
    folder = 'portfolio',
    acceptedTypes = 'image/*',
    maxSize = 10,
    buttonText = 'Upload Image',
    currentImage
}: CloudinaryUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
            toast.error(`File size must be less than ${maxSize}MB`);
            return;
        }

        // Validate cloud name and preset
        if (!cloudName || !uploadPreset) {
            toast.error('Cloudinary not configured. Please add credentials to .env.local');
            return;
        }

        setUploading(true);
        setProgress(0);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('folder', folder);

            // Upload to Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();

            // Return optimized URL
            const optimizedUrl = data.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');

            onUploadSuccess(optimizedUrl);
            toast.success('Upload successful!');
            setProgress(100);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Upload failed. Please try again.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="space-y-2">
            {currentImage && (
                <div className="relative inline-block">
                    <img
                        src={currentImage}
                        alt="Current"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-neural-200"
                    />
                </div>
            )}

            <div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedTypes}
                    onChange={handleFileSelect}
                    className="hidden"
                    id={`cloudinary-upload-${folder}`}
                    disabled={uploading}
                />
                <label
                    htmlFor={`cloudinary-upload-${folder}`}
                    className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${uploading
                            ? 'bg-neural-300 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700 text-white'
                        }`}
                >
                    {uploading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Uploading... {progress}%</span>
                        </>
                    ) : (
                        <>
                            <FiUpload className="w-5 h-5" />
                            <span>{buttonText}</span>
                        </>
                    )}
                </label>
            </div>

            {uploading && (
                <div className="w-full bg-neural-200 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-primary-600 h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
