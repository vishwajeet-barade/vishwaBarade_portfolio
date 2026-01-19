'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiGithub, FiLinkedin } from 'react-icons/fi';
import { SiKaggle } from 'react-icons/si';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Profile } from '@/types';
import toast from 'react-hot-toast';

export default function Contact() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
    });
    const [loading, setLoading] = useState(false);

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

        fetchProfile();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission
        setTimeout(() => {
            toast.success('Message sent successfully! I\'ll get back to you soon.');
            setFormData({ name: '', email: '', subject: '' });
            setLoading(false);
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const contactInfo = [
        {
            icon: FiMail,
            label: 'Email',
            value: profile?.email || 'Loading...',
            href: profile?.email ? `mailto:${profile.email}` : null,
        },
        {
            icon: FiPhone,
            label: 'Phone',
            value: profile?.phone || 'Not provided',
            href: profile?.phone ? `tel:${profile.phone}` : null,
        },
        {
            icon: FiMapPin,
            label: 'Location',
            value: profile?.location || 'India',
            href: null,
        },
    ];

    const socialLinks = [
        { icon: FiGithub, label: 'GitHub', href: 'https://github.com' },
        { icon: FiLinkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
        { icon: SiKaggle, label: 'Kaggle', href: 'https://kaggle.com' },
    ];

    return (
        <div className="section bg-gradient-to-br from-white via-primary-50/30 to-accent-50/30">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title gradient-text-ai">Get In Touch</h2>
                    <p className="section-subtitle">
                        Let's discuss your next project or collaboration
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Let's Connect</h3>
                            <p className="text-neural-700 leading-relaxed mb-8">
                                I'm always open to discussing new projects, creative ideas, or opportunities
                                to be part of your visions. Feel free to reach out through any of the channels below.
                            </p>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-4">
                            {contactInfo.map((info, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
                                >
                                    <div className="p-3 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg">
                                        <info.icon className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-neural-500">{info.label}</p>
                                        {info.href ? (
                                            <a
                                                href={info.href}
                                                className="font-semibold text-neural-900 hover:text-primary-600 transition-colors"
                                            >
                                                {info.value}
                                            </a>
                                        ) : (
                                            <p className="font-semibold text-neural-900">{info.value}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div>
                            <h4 className="font-bold mb-4">Follow Me</h4>
                            <div className="flex items-center space-x-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-neural-700 hover:text-primary-600"
                                    >
                                        <social.icon className="w-6 h-6" />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="card p-8"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="input"
                                    placeholder="Project Inquiry"
                                />
                            </div>



                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiSend className="w-5 h-5" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
