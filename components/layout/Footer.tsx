'use client';

import Link from 'next/link';
import { FiGithub, FiLinkedin, FiMail, FiHeart, FiArrowUp } from 'react-icons/fi';
import { SiFirebase } from 'react-icons/si';

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-gradient-to-br from-neural-900 via-neural-800 to-neural-900 text-white">
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-accent-600 to-purple-600"></div>

            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-2 rounded-lg">
                                <SiFirebase className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold font-display">Vishwajeet Barade</span>
                        </div>
                        <p className="text-neural-300 mb-4 max-w-md">
                            AI/ML Engineer passionate about building intelligent solutions.
                            Exploring the frontiers of machine learning, data analysis, and generative AI.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-neural-800 rounded-lg hover:bg-primary-600 transition-colors"
                            >
                                <FiGithub className="w-5 h-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-neural-800 rounded-lg hover:bg-primary-600 transition-colors"
                            >
                                <FiLinkedin className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:vishwajeet@example.com"
                                className="p-2 bg-neural-800 rounded-lg hover:bg-primary-600 transition-colors"
                            >
                                <FiMail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a
                                        href={`#${item.toLowerCase()}`}
                                        className="text-neural-300 hover:text-primary-400 transition-colors"
                                    >
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/admin" className="text-neural-300 hover:text-primary-400 transition-colors">
                                    Admin Panel
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-neural-300 hover:text-primary-400 transition-colors">
                                    Resume
                                </a>
                            </li>
                            <li>
                                <a href="#certificates" className="text-neural-300 hover:text-primary-400 transition-colors">
                                    Certificates
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-neural-700">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <p className="text-neural-400 text-sm mb-4 md:mb-0 flex items-center">
                            © {currentYear} Vishwajeet Barade. Made with{' '}
                            <FiHeart className="w-4 h-4 mx-1 text-red-500" /> and{' '}
                            <SiFirebase className="w-4 h-4 mx-1 text-orange-500" />
                        </p>

                        <button
                            onClick={scrollToTop}
                            className="flex items-center space-x-2 px-4 py-2 bg-neural-800 rounded-lg hover:bg-primary-600 transition-all duration-300 transform hover:scale-105"
                        >
                            <span className="text-sm">Back to Top</span>
                            <FiArrowUp className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
