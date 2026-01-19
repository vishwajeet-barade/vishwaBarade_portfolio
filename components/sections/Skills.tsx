'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, query, orderBy as firestoreOrderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skill } from '@/types';
import {
    SiPython, SiTensorflow, SiPytorch, SiScikitlearn, SiPandas, SiNumpy,
    SiJupyter, SiGooglecolab, SiKeras, SiOpencv, SiMongodb, SiPostgresql,
    SiMysql, SiFirebase, SiDocker, SiGit, SiJavascript, SiReact, SiNodedotjs,
    SiTypescript, SiNextdotjs, SiTailwindcss
} from 'react-icons/si';

const iconMap: { [key: string]: any } = {
    python: SiPython,
    tensorflow: SiTensorflow,
    pytorch: SiPytorch,
    sklearn: SiScikitlearn,
    pandas: SiPandas,
    numpy: SiNumpy,
    jupyter: SiJupyter,
    colab: SiGooglecolab,
    keras: SiKeras,
    opencv: SiOpencv,
    mongodb: SiMongodb,
    postgresql: SiPostgresql,
    mysql: SiMysql,
    firebase: SiFirebase,
    docker: SiDocker,
    git: SiGit,
    javascript: SiJavascript,
    react: SiReact,
    nodejs: SiNodedotjs,
    typescript: SiTypescript,
    nextjs: SiNextdotjs,
    tailwind: SiTailwindcss,
};

export default function Skills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const q = query(collection(db, 'skills'), firestoreOrderBy('proficiency', 'desc'));
            const snapshot = await getDocs(q);
            const skillsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
            })) as Skill[];
            setSkills(skillsData);
        } catch (error) {
            console.error('Error fetching skills:', error);
        }
    };

    const categories = ['all', ...Array.from(new Set(skills.map(s => s.category)))];
    const filteredSkills = selectedCategory === 'all'
        ? skills
        : skills.filter(s => s.category === selectedCategory);

    const getIcon = (skillName: string) => {
        const key = skillName.toLowerCase().replace(/[^a-z]/g, '');
        return iconMap[key] || null;
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
                    <h2 className="section-title gradient-text-ai">Skills & Expertise</h2>
                    <p className="section-subtitle">
                        Technologies and tools I work with
                    </p>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg scale-105'
                                    : 'bg-white text-neural-700 hover:bg-neural-100 shadow'
                                }`}
                        >
                            {category === 'all' ? 'All Skills' : category}
                        </button>
                    ))}
                </motion.div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSkills.map((skill, index) => {
                        const Icon = getIcon(skill.name);
                        return (
                            <motion.div
                                key={skill.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="card p-6 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        {Icon && (
                                            <div className="p-2 bg-primary-100 rounded-lg">
                                                <Icon className="w-6 h-6 text-primary-600" />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-bold text-lg">{skill.name}</h3>
                                            <span className="text-sm text-neural-500">{skill.category}</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-semibold text-primary-600">
                                        {skill.proficiency}%
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="relative h-2 bg-neural-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${skill.proficiency}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: index * 0.05 }}
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full"
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {filteredSkills.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-neural-500">No skills found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
