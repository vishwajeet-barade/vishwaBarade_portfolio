'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FiHome, FiUser, FiCode, FiBriefcase, FiAward, FiFileText,
    FiLogOut, FiMenu, FiX, FiBarChart2, FiSettings
} from 'react-icons/fi';
import { SiFirebase } from 'react-icons/si';

// Import admin sections (we'll create these next)
import ProfileManager from '@/components/admin/ProfileManager';
import ProjectsManager from '@/components/admin/ProjectsManager';
import SkillsManager from '@/components/admin/SkillsManager';
import ExperienceManager from '@/components/admin/ExperienceManager';
import CertificatesManager from '@/components/admin/CertificatesManager';
import ResumeManager from '@/components/admin/ResumeManager';
import DashboardHome from '@/components/admin/DashboardHome';


interface AdminDashboardProps {
    user: any;
    onLogout: () => void;
}

type Section = 'dashboard' | 'profile' | 'projects' | 'skills' | 'experience' | 'certificates' | 'resume';

export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
    const [activeSection, setActiveSection] = useState<Section>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { id: 'dashboard' as Section, label: 'Dashboard', icon: FiHome },
        { id: 'profile' as Section, label: 'Profile', icon: FiUser },
        { id: 'projects' as Section, label: 'Projects', icon: FiBriefcase },
        { id: 'skills' as Section, label: 'Skills', icon: FiCode },
        { id: 'experience' as Section, label: 'Experience', icon: FiBarChart2 },
        { id: 'certificates' as Section, label: 'Certificates', icon: FiAward },
        { id: 'resume' as Section, label: 'Resume', icon: FiFileText },
    ];

    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard':
                return <DashboardHome />;
            case 'profile':
                return <ProfileManager />;
            case 'projects':
                return <ProjectsManager />;
            case 'skills':
                return <SkillsManager />;
            case 'experience':
                return <ExperienceManager />;
            case 'certificates':
                return <CertificatesManager />;
            case 'resume':
                return <ResumeManager />;
            default:
                return <DashboardHome />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neural-50 via-white to-primary-50">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-neural-900 via-neural-800 to-neural-900 text-white shadow-2xl z-50 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
            >
                {/* Header */}
                <div className="p-6 border-b border-neural-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-lg">
                                <SiFirebase className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">Admin Panel</span>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 hover:bg-neural-700 rounded-lg transition-colors"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="mt-4 text-sm text-neural-400">
                        {user?.email}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 flex-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveSection(item.id);
                                    setSidebarOpen(false);
                                }}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mb-2 ${isActive
                                    ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                                    : 'text-neural-300 hover:bg-neural-700 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-neural-700">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-neural-700 hover:bg-neural-600 rounded-lg transition-colors mb-2"
                    >
                        <FiSettings className="w-5 h-5" />
                        <span>View Portfolio</span>
                    </a>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                        <FiLogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Bar */}
                <header className="bg-white shadow-sm border-b border-neural-200 sticky top-0 z-40">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 hover:bg-neural-100 rounded-lg transition-colors"
                            >
                                <FiMenu className="w-6 h-6" />
                            </button>
                            <h1 className="text-2xl font-bold gradient-text-ai">
                                {menuItems.find(item => item.id === activeSection)?.label}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="hidden md:block text-sm text-neural-600">
                                Welcome back, <span className="font-semibold">{user?.email?.split('@')[0]}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="p-6">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderSection()}
                    </motion.div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                />
            )}
        </div>
    );
}
