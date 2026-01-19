'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiUser, FiCode, FiBriefcase, FiAward, FiMail, FiFileText } from 'react-icons/fi';
import { SiFirebase } from 'react-icons/si';

const navItems = [
    { name: 'Home', href: '#home', icon: FiHome },
    { name: 'About', href: '#about', icon: FiUser },
    { name: 'Skills', href: '#skills', icon: FiCode },
    { name: 'Projects', href: '#projects', icon: FiBriefcase },
    { name: 'Experience', href: '#experience', icon: FiAward },
    { name: 'Certificates', href: '#certificates', icon: FiAward },
    { name: 'Resume', href: '#resume', icon: FiFileText },
    { name: 'Contact', href: '#contact', icon: FiMail },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Update active section based on scroll position
            const sections = navItems.map(item => item.href.substring(1));
            const current = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });
            if (current) setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (href: string) => {
        setIsOpen(false);
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/80 backdrop-blur-lg shadow-lg border-b border-neural-200'
                    : 'bg-transparent'
                    }`}
            >
                <div className="container-custom">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <div className="relative bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-lg">
                                    <SiFirebase className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <span className="text-xl md:text-2xl font-bold font-display gradient-text-ai">
                                VB
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeSection === item.href.substring(1);
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => handleNavClick(item.href)}
                                        className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${isActive
                                            ? 'text-primary-600'
                                            : 'text-neural-700 hover:text-primary-600'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{item.name}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeSection"
                                                className="absolute inset-0 bg-primary-100 rounded-lg -z-10"
                                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                );
                            })}

                            {/* Admin Link */}
                            <Link
                                href="/admin"
                                className="ml-4 px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                Admin
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-lg hover:bg-neural-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <FiX className="w-6 h-6 text-neural-900" />
                            ) : (
                                <FiMenu className="w-6 h-6 text-neural-900" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-2xl z-50 md:hidden"
                        >
                            <div className="flex flex-col h-full">
                                {/* Header */}
                                <div className="flex items-center justify-between p-6 border-b border-neural-200">
                                    <span className="text-xl font-bold font-display gradient-text-ai">
                                        Menu
                                    </span>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 rounded-lg hover:bg-neural-100 transition-colors"
                                    >
                                        <FiX className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Navigation Items */}
                                <nav className="flex-1 overflow-y-auto py-6">
                                    {navItems.map((item, index) => {
                                        const Icon = item.icon;
                                        const isActive = activeSection === item.href.substring(1);
                                        return (
                                            <motion.button
                                                key={item.name}
                                                initial={{ x: 50, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                                onClick={() => handleNavClick(item.href)}
                                                className={`w-full flex items-center space-x-3 px-6 py-3 transition-colors ${isActive
                                                    ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600'
                                                    : 'text-neural-700 hover:bg-neural-50'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium">{item.name}</span>
                                            </motion.button>
                                        );
                                    })}
                                </nav>

                                {/* Admin Button */}
                                <div className="p-6 border-t border-neural-200">
                                    <Link
                                        href="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white text-center rounded-lg font-semibold shadow-lg"
                                    >
                                        Admin Panel
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
