'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAward, FiX } from 'react-icons/fi';
import { collection, query, orderBy as firestoreOrderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Certificate } from '@/types';


export default function Certificates() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const q = query(collection(db, 'certificates'), firestoreOrderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const certificatesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
            })) as Certificate[];
            setCertificates(certificatesData);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        }
    };

    return (
        <div className="section neural-bg">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title gradient-text-ai">Certificates & Achievements</h2>
                    <p className="section-subtitle">
                        Professional certifications and accomplishments
                    </p>
                </motion.div>

                {/* Certificates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedCert(cert)}
                            className="card overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-300"
                        >
                            {/* Certificate Image */}
                            <div className="relative h-64 bg-gradient-to-br from-primary-100 to-accent-100 overflow-hidden">
                                {cert.imageUrl ? (
                                    <img
                                        src={cert.imageUrl}
                                        alt={cert.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FiAward className="w-20 h-20 text-primary-600 opacity-50" />
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                                    <span className="text-white font-semibold">View Certificate</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 text-center">
                                <h3 className="text-lg font-bold line-clamp-2">{cert.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {certificates.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-neural-500">No certificates added yet.</p>
                    </div>
                )}
            </div>

            {/* Certificate Detail Modal */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedCert(null)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
                        >
                            {/* Header with Close Button */}
                            <div className="relative">
                                <button
                                    onClick={() => setSelectedCert(null)}
                                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
                                >
                                    <FiX className="w-6 h-6 text-neural-900" />
                                </button>

                                {/* Certificate Image */}
                                <div className="relative w-full bg-gradient-to-br from-primary-600 to-accent-600">
                                    {selectedCert.imageUrl ? (
                                        <img
                                            src={selectedCert.imageUrl}
                                            alt={selectedCert.title}
                                            className="w-full h-auto max-h-[70vh] object-contain"
                                        />
                                    ) : (
                                        <div className="w-full h-96 flex items-center justify-center">
                                            <FiAward className="w-32 h-32 text-white opacity-50" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 text-center">
                                <h2 className="text-3xl font-bold mb-4">{selectedCert.title}</h2>
                                <p className="text-neural-600">Click outside or press the close button to exit</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
