'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Resume } from '@/types';
import { FiDownload, FiTrash2, FiFileText, FiCheck, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ResumeManager() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        fileName: '',
        fileUrl: '',
    });

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'resume'));
            const resumesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                uploadedAt: doc.data().uploadedAt?.toDate(),
            })) as Resume[];
            setResumes(resumesData.sort((a, b) => b.version - a.version));
        } catch (error) {
            console.error('Error fetching resumes:', error);
            toast.error('Failed to load resumes');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fileName.trim() || !formData.fileUrl.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            // Deactivate all previous resumes
            const activeResumes = resumes.filter(r => r.isActive);
            for (const resume of activeResumes) {
                await updateDoc(doc(db, 'resume', resume.id), { isActive: false });
            }

            // Add new resume
            await addDoc(collection(db, 'resume'), {
                fileName: formData.fileName,
                fileUrl: formData.fileUrl,
                fileSize: 0, // Not applicable for URL-based uploads
                uploadedAt: new Date(),
                version: resumes.length + 1,
                isActive: true,
            });

            toast.success('Resume added successfully!');
            setShowForm(false);
            setFormData({ fileName: '', fileUrl: '' });
            fetchResumes();
        } catch (error) {
            console.error('Error adding resume:', error);
            toast.error('Failed to add resume');
        }
    };

    const handleSetActive = async (id: string) => {
        try {
            // Deactivate all
            for (const resume of resumes) {
                await updateDoc(doc(db, 'resume', resume.id), { isActive: false });
            }
            // Activate selected
            await updateDoc(doc(db, 'resume', id), { isActive: true });
            toast.success('Active resume updated!');
            fetchResumes();
        } catch (error) {
            toast.error('Failed to update active resume');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this resume?')) return;
        try {
            await deleteDoc(doc(db, 'resume', id));
            toast.success('Resume deleted!');
            fetchResumes();
        } catch (error) {
            toast.error('Failed to delete resume');
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Resume Management</h2>
                    <p className="text-neural-600">Manage your resume hosted on Cloudinary</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary flex items-center space-x-2"
                >
                    {showForm ? <FiX className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
                    <span>{showForm ? 'Cancel' : 'Add Resume'}</span>
                </button>
            </div>

            {/* Add Resume Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                    <h3 className="text-xl font-bold">Add New Resume</h3>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            💡 <strong>Upload to Cloudinary:</strong>
                        </p>
                        <ul className="text-sm text-blue-700 mt-2 space-y-1">
                            <li>• Upload your resume PDF to <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Cloudinary</a></li>
                            <li>• Copy the direct PDF URL</li>
                            <li>• Paste it in the "Resume URL" field below</li>
                        </ul>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Resume Name *</label>
                        <input
                            type="text"
                            value={formData.fileName}
                            onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                            className="input"
                            placeholder="e.g., My Resume 2024"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Resume URL (Cloudinary) *</label>
                        <input
                            type="url"
                            value={formData.fileUrl}
                            onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                            className="input"
                            placeholder="https://res.cloudinary.com/your-cloud/raw/upload/..."
                            required
                        />
                        <p className="text-xs text-neural-500 mt-1">Paste the direct PDF URL from Cloudinary</p>
                    </div>

                    <button type="submit" className="btn-primary">
                        Add Resume
                    </button>
                </form>
            )}


            {/* Resumes List */}
            <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Your Resumes ({resumes.length})</h3>
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : resumes.length === 0 ? (
                    <div className="text-center py-8 text-neural-500">
                        No resumes uploaded yet. Upload your first resume above!
                    </div>
                ) : (
                    <div className="space-y-3">
                        {resumes.map((resume) => (
                            <div
                                key={resume.id}
                                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${resume.isActive
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-neural-200 bg-white hover:border-neural-300'
                                    }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-red-100 rounded-lg">
                                        <FiFileText className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h4 className="font-bold">{resume.fileName}</h4>
                                            {resume.isActive && (
                                                <span className="inline-flex items-center px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                                                    <FiCheck className="w-3 h-3 mr-1" />
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-neural-600">
                                            Version {resume.version} • {formatFileSize(resume.fileSize)} •
                                            Uploaded {resume.uploadedAt.toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <a
                                        href={resume.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                        title="Download"
                                    >
                                        <FiDownload className="w-5 h-5" />
                                    </a>
                                    {!resume.isActive && (
                                        <button
                                            onClick={() => handleSetActive(resume.id)}
                                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                                            title="Set as Active"
                                        >
                                            <FiCheck className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(resume.id)}
                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                        title="Delete"
                                    >
                                        <FiTrash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="card p-6 bg-blue-50 border border-blue-200">
                <h3 className="font-bold mb-2 text-blue-900">💡 Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Only PDF files are accepted</li>
                    <li>• The active resume will be available for download on your portfolio</li>
                    <li>• Keep your resume updated regularly</li>
                    <li>• You can have multiple versions, but only one can be active</li>
                </ul>
            </div>
        </div>
    );
}
