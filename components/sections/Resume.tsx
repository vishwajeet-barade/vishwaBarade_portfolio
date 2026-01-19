'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Resume } from '@/types';
import { motion } from 'framer-motion';
import { FiDownload, FiFileText, FiExternalLink } from 'react-icons/fi';

export default function ResumeSection() {
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActiveResume();
    }, []);

    const fetchActiveResume = async () => {
        try {
            const q = query(collection(db, 'resume'), where('isActive', '==', true));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const resumeDoc = snapshot.docs[0];
                setResume({
                    id: resumeDoc.id,
                    ...resumeDoc.data(),
                    uploadedAt: resumeDoc.data().uploadedAt?.toDate(),
                } as Resume);
            }
        } catch (error) {
            console.error('Error fetching resume:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-br from-neural-50 via-white to-primary-50">
                <div className="container-custom">
                    <div className="text-center">
                        <div className="animate-pulse">Loading resume...</div>
                    </div>
                </div>
            </section>
        );
    }

    if (!resume) {
        return (
            <section className="py-20 bg-gradient-to-br from-neural-50 via-white to-primary-50">
                <div className="container-custom">
                    <div className="text-center">
                        <FiFileText className="w-16 h-16 mx-auto mb-4 text-neural-400" />
                        <p className="text-neural-600">Resume not available at the moment.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gradient-to-br from-neural-50 via-white to-primary-50">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text-ai">
                        My Resume
                    </h2>
                    <p className="text-lg text-neural-600 max-w-2xl mx-auto">
                        Download my latest resume to learn more about my experience and qualifications
                    </p>
                </motion.div>

                {/* Resume Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="card p-8 text-center">
                        {/* Icon */}
                        <div className="relative inline-block mb-6">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
                            <div className="relative bg-gradient-to-r from-primary-600 to-accent-600 p-6 rounded-full">
                                <FiFileText className="w-16 h-16 text-white" />
                            </div>
                        </div>

                        {/* Resume Info */}
                        <h3 className="text-2xl font-bold mb-2">{resume.fileName}</h3>
                        <p className="text-neural-600 mb-6">
                            Version {resume.version} • Updated {resume.uploadedAt.toLocaleDateString()}
                        </p>

                        {/* Download Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={resume.fileUrl}
                                download
                                className="btn-primary flex items-center justify-center space-x-2"
                            >
                                <FiDownload className="w-5 h-5" />
                                <span>Download Resume</span>
                            </a>
                            <a
                                href={resume.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary flex items-center justify-center space-x-2"
                            >
                                <FiExternalLink className="w-5 h-5" />
                                <span>View in Browser</span>
                            </a>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-8 pt-6 border-t border-neural-200">
                            <p className="text-sm text-neural-500">
                                💡 Feel free to download and review my resume. For any questions or opportunities, please reach out via the contact section.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
