'use client';

import { motion } from 'framer-motion';
import { FiBriefcase, FiAward, FiHeart, FiCode } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { collection, query, limit, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Profile } from '@/types';

export default function About() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [projectsCount, setProjectsCount] = useState(0);
    const [certificatesCount, setCertificatesCount] = useState(0);
    const [experienceYears, setExperienceYears] = useState(0);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const q = query(collection(db, 'profile'), limit(1));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    setProfile({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Profile);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        const fetchStats = async () => {
            try {
                // Count projects
                const projectsSnapshot = await getDocs(collection(db, 'projects'));
                setProjectsCount(projectsSnapshot.size);

                // Count certificates
                const certificatesSnapshot = await getDocs(collection(db, 'certificates'));
                setCertificatesCount(certificatesSnapshot.size);

                // Calculate years of experience from experience collection
                const experienceSnapshot = await getDocs(collection(db, 'experience'));
                if (!experienceSnapshot.empty) {
                    let totalMonths = 0;
                    experienceSnapshot.docs.forEach(doc => {
                        const data = doc.data();
                        const startDate = data.startDate?.toDate();
                        const endDate = data.current ? new Date() : data.endDate?.toDate();

                        if (startDate && endDate) {
                            const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
                                (endDate.getMonth() - startDate.getMonth());
                            totalMonths += months;
                        }
                    });
                    const years = Math.floor(totalMonths / 12);
                    setExperienceYears(years > 0 ? years : 1); // Minimum 1 year
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchProfile();
        fetchStats();
    }, []);

    const stats = [
        { icon: FiCode, label: 'Projects Completed', value: projectsCount > 0 ? `${projectsCount}+` : '0' },
        { icon: FiBriefcase, label: 'Years Experience', value: experienceYears > 0 ? `${experienceYears}+` : '0' },
        { icon: FiAward, label: 'Certifications', value: certificatesCount > 0 ? `${certificatesCount}+` : '0' },
        { icon: FiHeart, label: 'Coffee Consumed', value: '∞' },
    ];

    return (
        <div className="section bg-white">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title gradient-text-ai">About Me</h2>
                    <p className="section-subtitle">
                        Get to know more about my journey and passion
                    </p>
                </motion.div>


                <div className="max-w-4xl mx-auto">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="prose prose-lg max-w-none">
                            <p className="text-neural-700 leading-relaxed">
                                {profile?.aboutMe || `
                  Hello! I'm Vishwajeet Barade, a passionate AI/ML Engineer and Data Analyst 
                  with a deep fascination for building intelligent, data-driven solutions.
                `}
                            </p>
                            <p className="text-neural-700 leading-relaxed">
                                Currently, I'm exploring the cutting edge of machine learning models, Large Language Models (LLMs),
                                and Generative AI applications. My journey in tech is driven by curiosity and a constant desire to learn
                                and innovate.
                            </p>
                            <p className="text-neural-700 leading-relaxed">
                                I believe in the power of AI to transform industries and improve lives. Whether it's developing
                                predictive models, analyzing complex datasets, or building GenAI applications, I'm always excited
                                to tackle new challenges and push the boundaries of what's possible.
                            </p>
                        </div>

                        {/* Interests */}
                        {profile?.interests && profile.interests.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-3 gradient-text-ai">Interests</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.interests.map((interest, i) => (
                                        <span key={i} className="tag">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="flex flex-wrap gap-4 pt-4 justify-center">
                            <a href="#contact" className="btn-primary">
                                Get In Touch
                            </a>
                            <a href="#projects" className="btn-secondary">
                                View My Work
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="card text-center p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl mb-4">
                                <stat.icon className="w-8 h-8 text-primary-600" />
                            </div>
                            <div className="text-3xl font-bold gradient-text-ai mb-2">{stat.value}</div>
                            <div className="text-neural-600 font-medium">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
