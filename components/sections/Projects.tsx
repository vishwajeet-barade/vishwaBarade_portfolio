'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiLinkedin, FiX, FiPlay, FiImage } from 'react-icons/fi';
import { collection, query, orderBy as firestoreOrderBy, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, ProjectMedia } from '@/types';
import Link from 'next/link';

export default function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [filter, setFilter] = useState<string>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const q = query(
                collection(db, 'projects'),
                firestoreOrderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            const projectsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
                startDate: doc.data().startDate?.toDate(),
                endDate: doc.data().endDate?.toDate(),
            })) as Project[];
            setProjects(projectsData);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filter out undefined/null categories and create unique list
    const categories = ['all', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean)))];
    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.category === filter);

    return (
        <div className="section bg-gradient-to-br from-white via-primary-50/30 to-white">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="section-title gradient-text-ai">Featured Projects</h2>
                    <p className="section-subtitle">
                        Explore my work in AI/ML, Data Analysis, and Generative AI
                    </p>
                </motion.div>

                {/* Filter Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-3 mb-12"
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${filter === category
                                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg scale-105'
                                : 'bg-white text-neural-700 hover:bg-neural-100 shadow'
                                }`}
                        >
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="card shimmer h-96"></div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {filteredProjects.map((project, index) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index}
                                    onClick={() => setSelectedProject(project)}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {filteredProjects.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <p className="text-xl text-neural-500">No projects found in this category.</p>
                    </div>
                )}
            </div>

            {/* Project Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <ProjectDetailModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Project Card Component
function ProjectCard({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.1 }}
            onClick={onClick}
            className="card card-hover cursor-pointer overflow-hidden group"
        >
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100">
                {project.thumbnailUrl ? (
                    <img
                        src={project.thumbnailUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                        🚀
                    </div>
                )}

                {/* Status Badge - only show if status exists */}
                {project.status && (
                    <div className="absolute top-4 right-4">
                        <span className={`badge ${project.status === 'completed' ? 'badge-success' :
                            project.status === 'in-progress' ? 'badge-warning' :
                                'badge-info'
                            }`}>
                            {project.status.replace('-', ' ')}
                        </span>
                    </div>
                )}

                {/* Featured Badge - only show if featured */}
                {project.featured && (
                    <div className="absolute top-4 left-4">
                        <span className="badge bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                            ⭐ Featured
                        </span>
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="text-white font-semibold">View Details</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold mb-2 line-clamp-1">{project.title}</h3>
                {/* Use shortDescription if available, otherwise use overview (first 150 chars) */}
                <p className="text-neural-600 mb-4 line-clamp-2">
                    {project.shortDescription || (project.overview?.substring(0, 150) + '...') || ''}
                </p>

                {/* Technologies - only show if array exists and has items */}
                {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.slice(0, 3).map((tech, i) => (
                            <span key={i} className="tag text-xs">
                                {tech}
                            </span>
                        ))}
                        {project.technologies.length > 3 && (
                            <span className="tag text-xs">+{project.technologies.length - 3}</span>
                        )}
                    </div>
                )}

                {/* Links */}
                <div className="flex items-center space-x-3">
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 bg-neural-100 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-colors"
                        >
                            <FiGithub className="w-5 h-5" />
                        </a>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 bg-neural-100 rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-colors"
                        >
                            <FiExternalLink className="w-5 h-5" />
                        </a>
                    )}
                    {project.demoVideoUrl && (
                        <div className="p-2 bg-neural-100 rounded-lg text-neural-600">
                            <FiPlay className="w-5 h-5" />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// Project Detail Modal Component
function ProjectDetailModal({ project, onClose }: { project: Project; onClose: () => void }) {
    const [selectedMedia, setSelectedMedia] = useState<ProjectMedia | null>(null);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="max-w-5xl mx-auto my-8 bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="relative h-64 md:h-96 bg-gradient-to-br from-primary-600 to-accent-600">
                    {project.thumbnailUrl && (
                        <img
                            src={project.thumbnailUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    >
                        <FiX className="w-6 h-6 text-white" />
                    </button>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.title}</h2>
                        <p className="text-white/90 text-lg">{project.shortDescription}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8">
                    {/* Overview */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-4 gradient-text-ai">Overview</h3>
                        <p className="text-neural-700 leading-relaxed whitespace-pre-line">
                            {project.overview || project.detailedDescription}
                        </p>
                    </div>

                    {/* Demo Video */}
                    {project.demoVideoUrl && (
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-4 gradient-text-ai">Demo Video</h3>
                            <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video bg-neural-900">
                                <video
                                    controls
                                    className="w-full h-full"
                                    poster={project.thumbnailUrl}
                                >
                                    <source src={project.demoVideoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    )}

                    {/* Project Media Gallery */}
                    {project.media && project.media.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-4 gradient-text-ai flex items-center">
                                <FiImage className="mr-2" />
                                Project Gallery
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {project.media.sort((a, b) => a.order - b.order).map((media, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedMedia(media)}
                                        className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                                    >
                                        {media.type === 'image' ? (
                                            <img
                                                src={media.url}
                                                alt={media.caption || `Project image ${index + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={media.thumbnail || project.thumbnailUrl}
                                                    alt={media.caption || `Project video ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                    <FiPlay className="w-12 h-12 text-white" />
                                                </div>
                                            </div>
                                        )}
                                        {media.caption && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                                                <p className="text-white text-sm">{media.caption}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Detailed Description */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold mb-4 gradient-text-ai">Detailed Description</h3>
                        <div className="prose max-w-none text-neural-700 leading-relaxed whitespace-pre-line">
                            {project.detailedDescription || project.overview || 'No detailed description available.'}
                        </div>
                    </div>

                    {/* Technologies - only show if array exists and has items */}
                    {project.technologies && project.technologies.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-4 gradient-text-ai">Technologies Used</h3>
                            <div className="flex flex-wrap gap-3">
                                {project.technologies.map((tech, i) => (
                                    <span key={i} className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Links */}
                    <div className="flex flex-wrap gap-4">
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary flex items-center space-x-2"
                            >
                                <FiGithub className="w-5 h-5" />
                                <span>View on GitHub</span>
                            </a>
                        )}
                        {project.linkedinUrl && (
                            <a
                                href={project.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary flex items-center space-x-2"
                            >
                                <FiLinkedin className="w-5 h-5" />
                                <span>LinkedIn Post</span>
                            </a>
                        )}
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-secondary flex items-center space-x-2"
                            >
                                <FiExternalLink className="w-5 h-5" />
                                <span>Live Demo</span>
                            </a>
                        )}
                        {project.customLinks?.map((link, i) => (
                            <a
                                key={i}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-ghost flex items-center space-x-2"
                            >
                                <span>{link.platform}</span>
                            </a>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Media Viewer Modal */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedMedia(null)}
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    >
                        <button
                            onClick={() => setSelectedMedia(null)}
                            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                        >
                            <FiX className="w-6 h-6 text-white" />
                        </button>

                        <div className="max-w-6xl w-full">
                            {selectedMedia.type === 'image' ? (
                                <img
                                    src={selectedMedia.url}
                                    alt={selectedMedia.caption || 'Project media'}
                                    className="w-full h-auto max-h-[90vh] object-contain"
                                />
                            ) : (
                                <video
                                    controls
                                    autoPlay
                                    className="w-full h-auto max-h-[90vh]"
                                >
                                    <source src={selectedMedia.url} type="video/mp4" />
                                </video>
                            )}
                            {selectedMedia.caption && (
                                <p className="text-white text-center mt-4 text-lg">{selectedMedia.caption}</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
