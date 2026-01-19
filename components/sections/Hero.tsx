'use client';

import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiDownload, FiArrowDown } from 'react-icons/fi';
import { SiKaggle, SiMedium } from 'react-icons/si';
import { useEffect, useState } from 'react';
import { collection, query, limit, getDocs, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Profile, Resume } from '@/types';

export default function Hero() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [resume, setResume] = useState<Resume | null>(null);

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

        const fetchResume = async () => {
            try {
                const q = query(collection(db, 'resume'), where('isActive', '==', true), limit(1));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    setResume({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Resume);
                }
            } catch (error) {
                console.error('Error fetching resume:', error);
            }
        };

        fetchProfile();
        fetchResume();
    }, []);

    const socialLinks = profile?.socialLinks || [
        { platform: 'GitHub', url: 'https://github.com', icon: 'FiGithub' },
        { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'FiLinkedin' },
        { platform: 'Email', url: 'mailto:vishwajeet@example.com', icon: 'FiMail' },
    ];

    const getSocialIcon = (iconName: string) => {
        const icons: { [key: string]: any } = {
            FiGithub: FiGithub,
            FiLinkedin: FiLinkedin,
            FiMail: FiMail,
            SiKaggle: SiKaggle,
            SiMedium: SiMedium,
        };
        return icons[iconName] || FiMail;
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden neural-bg">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating neural nodes */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary-400 rounded-full opacity-20"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}

                {/* Gradient orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container-custom py-20">
                <div className="flex flex-col items-center text-center">
                    {/* Profile Image */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="mb-8"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-600 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse-slow"></div>
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                                {profile?.profileImageUrl ? (
                                    <img
                                        src={profile.profileImageUrl}
                                        alt={profile.fullName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-white text-5xl font-bold">
                                        VB
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Greeting */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-4"
                    >
                        <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-primary-600 font-semibold shadow-lg">
                            👋 Hello, I'm
                        </span>
                    </motion.div>

                    {/* Name */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-7xl font-bold font-display mb-4"
                    >
                        <span className="gradient-text-ai">
                            {profile?.fullName || 'Vishwajeet Barade'}
                        </span>
                    </motion.h1>

                    {/* Title */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl md:text-3xl text-neural-700 font-semibold mb-6"
                    >
                        {profile?.title || 'AI/ML Engineer & Data Analyst'}
                    </motion.p>

                    {/* Bio */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg md:text-xl text-neural-600 max-w-3xl mb-8 leading-relaxed"
                    >
                        {profile?.bio ||
                            'Passionate about AI/ML, Data Analysis, and Generative AI. Building intelligent, data-driven solutions. Currently exploring machine learning models, LLMs, and GenAI applications. Always curious, always learning.'}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-wrap gap-4 justify-center mb-12"
                    >
                        <a
                            href="#projects"
                            className="btn-primary flex items-center space-x-2"
                            onClick={(e) => {
                                e.preventDefault();
                                document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <span>View My Work</span>
                        </a>
                        <a
                            href="#contact"
                            className="btn-secondary flex items-center space-x-2"
                            onClick={(e) => {
                                e.preventDefault();
                                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <FiMail className="w-5 h-5" />
                            <span>Get In Touch</span>
                        </a>
                        {resume ? (
                            <a
                                href={resume.fileUrl}
                                download
                                className="btn-ghost flex items-center space-x-2"
                            >
                                <FiDownload className="w-5 h-5" />
                                <span>Download Resume</span>
                            </a>
                        ) : (
                            <a
                                href="#resume"
                                className="btn-ghost flex items-center space-x-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.querySelector('#resume')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <FiDownload className="w-5 h-5" />
                                <span>View Resume</span>
                            </a>
                        )}
                    </motion.div>

                    {/* Social Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-center space-x-4"
                    >
                        {socialLinks.map((link, index) => {
                            const Icon = getSocialIcon(link.icon || 'FiMail');
                            return (
                                <motion.a
                                    key={index}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-neural-700 hover:text-primary-600"
                                >
                                    <Icon className="w-6 h-6" />
                                </motion.a>
                            );
                        })}
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="flex flex-col items-center text-neural-400"
                        >
                            <span className="text-sm mb-2">Scroll Down</span>
                            <FiArrowDown className="w-6 h-6" />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
