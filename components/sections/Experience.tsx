'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiBriefcase } from 'react-icons/fi';
import { collection, query, orderBy as firestoreOrderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Experience } from '@/types';
import { format } from 'date-fns';

export default function ExperienceSection() {
    const [experiences, setExperiences] = useState<Experience[]>([]);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const q = query(collection(db, 'experience'), firestoreOrderBy('startDate', 'desc'));
            const snapshot = await getDocs(q);
            const experiencesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                startDate: doc.data().startDate?.toDate(),
                endDate: doc.data().endDate?.toDate(),
                createdAt: doc.data().createdAt?.toDate(),
            })) as Experience[];
            setExperiences(experiencesData);
        } catch (error) {
            console.error('Error fetching experiences:', error);
        }
    };

    return (
        <div className="section bg-white">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title gradient-text-ai">Experience</h2>
                    <p className="section-subtitle">
                        My professional journey and achievements
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-600 via-accent-600 to-purple-600"></div>

                    {/* Experience items */}
                    <div className="space-y-12">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                    }`}
                            >
                                {/* Timeline dot */}
                                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 z-10"></div>

                                {/* Content */}
                                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} pl-16 md:pl-0`}>
                                    <div className="card p-6 hover:shadow-xl transition-all duration-300">
                                        {/* Company Logo */}
                                        {exp.companyLogo && (
                                            <div className="mb-4">
                                                <img
                                                    src={exp.companyLogo}
                                                    alt={exp.company}
                                                    className="h-12 w-auto object-contain"
                                                />
                                            </div>
                                        )}

                                        {/* Position & Company */}
                                        <h3 className="text-xl font-bold mb-2">{exp.position}</h3>
                                        <div className="flex items-center space-x-2 text-primary-600 font-semibold mb-3">
                                            <FiBriefcase className="w-4 h-4" />
                                            <span>{exp.company}</span>
                                        </div>

                                        {/* Date & Location */}
                                        <div className="flex flex-wrap gap-4 text-sm text-neural-600 mb-4">
                                            <div className="flex items-center space-x-1">
                                                <FiCalendar className="w-4 h-4" />
                                                <span>
                                                    {format(exp.startDate, 'MMM yyyy')} - {exp.current ? 'Present' : format(exp.endDate!, 'MMM yyyy')}
                                                </span>
                                            </div>
                                            {exp.location && (
                                                <div className="flex items-center space-x-1">
                                                    <FiMapPin className="w-4 h-4" />
                                                    <span>{exp.location}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <p className="text-neural-700 mb-4">{exp.description}</p>

                                        {/* Responsibilities */}
                                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="font-semibold mb-2">Key Responsibilities:</h4>
                                                <ul className="list-disc list-inside space-y-1 text-neural-700">
                                                    {exp.responsibilities.map((resp, i) => (
                                                        <li key={i}>{resp}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Technologies */}
                                        {exp.technologies && exp.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {exp.technologies.map((tech, i) => (
                                                    <span key={i} className="tag text-xs">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {experiences.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-xl text-neural-500">No experience added yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
