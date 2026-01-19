'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy as firestoreOrderBy, query } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Project } from '@/types';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProjectsManager() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        overview: '',
        thumbnailUrl: '',
        githubUrl: '',
    });



    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const q = query(collection(db, 'projects'), firestoreOrderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const projectsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
            })) as Project[];
            setProjects(projectsData);
        } catch (error) {
            console.error('Error fetching projects:', error);
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnailUrl') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `projects/${field}_${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            setFormData(prev => ({ ...prev, [field]: url }));
            toast.success('Image uploaded!');
        } catch (error) {
            toast.error('Failed to upload image');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Store ONLY the 4 fields you provide + timestamps
            const projectData: any = {
                title: formData.title,
                overview: formData.overview,
                thumbnailUrl: formData.thumbnailUrl,
                updatedAt: new Date(),
            };

            // Only add githubUrl if it's not empty
            if (formData.githubUrl && formData.githubUrl.trim()) {
                projectData.githubUrl = formData.githubUrl;
            }

            if (editingId) {
                await updateDoc(doc(db, 'projects', editingId), projectData);
                toast.success('Project updated!');
            } else {
                await addDoc(collection(db, 'projects'), {
                    ...projectData,
                    createdAt: new Date(),
                });
                toast.success('Project added!');
            }
            resetForm();
            fetchProjects();
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error('Failed to save project');
        }
    };

    const handleEdit = (project: Project) => {
        setFormData({
            title: project.title,
            overview: project.overview || '',
            thumbnailUrl: project.thumbnailUrl,
            githubUrl: project.githubUrl || '',
        });
        setEditingId(project.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            await deleteDoc(doc(db, 'projects', id));
            toast.success('Project deleted!');
            fetchProjects();
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project');
        }
    };



    const resetForm = () => {
        setFormData({
            title: '',
            overview: '',
            thumbnailUrl: '',
            githubUrl: '',
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Projects Management</h2>
                    <p className="text-neural-600">Manage your portfolio projects</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2">
                    {showForm ? <FiX className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
                    <span>{showForm ? 'Cancel' : 'Add Project'}</span>
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="card p-6">
                        <h3 className="text-xl font-bold mb-4">Add Project</h3>
                        <div className="space-y-4">
                            {/* Project Title */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">Project Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input"
                                    placeholder="Enter project title"
                                    required
                                />
                            </div>

                            {/* Detailed Overview */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">Detailed Overview *</label>
                                <textarea
                                    value={formData.overview}
                                    onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                                    className="textarea"
                                    rows={6}
                                    placeholder="Provide a detailed description of your project"
                                    required
                                />
                            </div>

                            {/* Thumbnail URL */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">Thumbnail URL *</label>
                                {formData.thumbnailUrl && (
                                    <img
                                        src={formData.thumbnailUrl}
                                        alt="Thumbnail Preview"
                                        className="w-48 h-32 object-cover rounded-lg mb-2"
                                    />
                                )}
                                <div className="space-y-2">
                                    <input
                                        type="url"
                                        value={formData.thumbnailUrl}
                                        onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                                        className="input"
                                        placeholder="Paste image URL (e.g., from Cloudinary)"
                                        required
                                    />
                                    <div className="text-sm text-neural-600">Or upload an image:</div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'thumbnailUrl')}
                                        className="input"
                                        disabled={uploading}
                                    />
                                </div>
                            </div>

                            {/* GitHub Link */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">GitHub Link</label>
                                <input
                                    type="url"
                                    value={formData.githubUrl}
                                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                                    className="input"
                                    placeholder="https://github.com/username/repo"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={uploading}
                            className="btn-primary flex items-center space-x-2"
                        >
                            <FiSave className="w-5 h-5" />
                            <span>{uploading ? 'Uploading...' : editingId ? 'Update Project' : 'Add Project'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Projects List */}
            <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Your Projects ({projects.length})</h3>
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-8 text-neural-500">No projects yet. Add your first project!</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map((project) => (
                            <div key={project.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                {project.thumbnailUrl && <img src={project.thumbnailUrl} alt={project.title} className="w-full h-32 object-cover rounded-lg mb-3" />}
                                <h4 className="font-bold mb-1">{project.title}</h4>
                                <p className="text-sm text-neural-600 mb-3 line-clamp-2">{project.shortDescription}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(project)} className="btn-secondary text-sm py-2"><FiEdit2 className="w-4 h-4 mr-1" /> Edit</button>
                                    <button onClick={() => handleDelete(project.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><FiTrash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
