'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy as firestoreOrderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FiTrendingUp, FiEye, FiDownload, FiBriefcase, FiCode, FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function DashboardHome() {
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        certificates: 0,
        experience: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [projectsSnap, skillsSnap, certsSnap, expSnap] = await Promise.all([
                getDocs(collection(db, 'projects')),
                getDocs(collection(db, 'skills')),
                getDocs(collection(db, 'certificates')),
                getDocs(collection(db, 'experience')),
            ]);

            setStats({
                projects: projectsSnap.size,
                skills: skillsSnap.size,
                certificates: certsSnap.size,
                experience: expSnap.size,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Projects', value: stats.projects, icon: FiBriefcase, color: 'from-blue-500 to-cyan-500' },
        { label: 'Skills', value: stats.skills, icon: FiCode, color: 'from-purple-500 to-pink-500' },
        { label: 'Certificates', value: stats.certificates, icon: FiAward, color: 'from-orange-500 to-red-500' },
        { label: 'Experience', value: stats.experience, icon: FiTrendingUp, color: 'from-green-500 to-emerald-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-8 bg-gradient-to-r from-primary-600 to-accent-600 text-white"
            >
                <h2 className="text-3xl font-bold mb-2">Welcome to Your Portfolio Dashboard! 👋</h2>
                <p className="text-white/90">
                    Manage your portfolio content, track analytics, and keep your profile up to date.
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card p-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold mb-1">{loading ? '...' : stat.value}</div>
                            <div className="text-neural-600 font-medium">{stat.label}</div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-6"
            >
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="btn-primary">Add New Project</button>
                    <button className="btn-secondary">Add Skill</button>
                    <button className="btn-secondary">Upload Certificate</button>
                </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card p-6"
            >
                <h3 className="text-xl font-bold mb-4">Getting Started</h3>
                <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-neural-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-600 font-bold">1</span>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Update Your Profile</h4>
                            <p className="text-sm text-neural-600">
                                Add your personal information, bio, and profile picture in the Profile section.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-neural-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-600 font-bold">2</span>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">Add Your Projects</h4>
                            <p className="text-sm text-neural-600">
                                Showcase your work with detailed descriptions, images, and demo videos.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3 p-4 bg-neural-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-600 font-bold">3</span>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-1">List Your Skills</h4>
                            <p className="text-sm text-neural-600">
                                Add your technical skills and expertise levels to highlight your capabilities.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
