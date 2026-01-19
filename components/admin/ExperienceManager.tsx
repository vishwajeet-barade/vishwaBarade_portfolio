'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy as firestoreOrderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Experience } from '@/types';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ExperienceManager() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        responsibilities: [] as string[],
        technologies: [] as string[],
    });

    const [newResp, setNewResp] = useState('');
    const [newTech, setNewTech] = useState('');

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const q = query(collection(db, 'experience'), firestoreOrderBy('startDate', 'desc'));
            const snapshot = await getDocs(q);
            const expData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                startDate: doc.data().startDate?.toDate(),
                endDate: doc.data().endDate?.toDate(),
                createdAt: doc.data().createdAt?.toDate(),
            })) as Experience[];
            setExperiences(expData);
        } catch (error) {
            console.error('Error fetching experiences:', error);
            toast.error('Failed to load experiences');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const expData = {
                ...formData,
                startDate: new Date(formData.startDate),
                endDate: formData.current ? null : new Date(formData.endDate),
            };

            if (editingId) {
                await updateDoc(doc(db, 'experience', editingId), expData);
                toast.success('Experience updated!');
            } else {
                await addDoc(collection(db, 'experience'), {
                    ...expData,
                    createdAt: new Date(),
                });
                toast.success('Experience added!');
            }
            resetForm();
            fetchExperiences();
        } catch (error) {
            console.error('Error saving experience:', error);
            toast.error('Failed to save experience');
        }
    };

    const handleEdit = (exp: Experience) => {
        setFormData({
            company: exp.company,
            position: exp.position,
            location: exp.location || '',
            startDate: exp.startDate.toISOString().split('T')[0],
            endDate: exp.endDate ? exp.endDate.toISOString().split('T')[0] : '',
            current: exp.current,
            description: exp.description,
            responsibilities: exp.responsibilities || [],
            technologies: exp.technologies || [],
        });
        setEditingId(exp.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this experience?')) return;
        try {
            await deleteDoc(doc(db, 'experience', id));
            toast.success('Experience deleted!');
            fetchExperiences();
        } catch (error) {
            toast.error('Failed to delete experience');
        }
    };

    const addResponsibility = () => {
        if (newResp.trim()) {
            setFormData({ ...formData, responsibilities: [...formData.responsibilities, newResp.trim()] });
            setNewResp('');
        }
    };

    const removeResponsibility = (idx: number) => {
        setFormData({ ...formData, responsibilities: formData.responsibilities.filter((_, i) => i !== idx) });
    };

    const addTechnology = () => {
        if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
            setFormData({ ...formData, technologies: [...formData.technologies, newTech.trim()] });
            setNewTech('');
        }
    };

    const removeTechnology = (tech: string) => {
        setFormData({ ...formData, technologies: formData.technologies.filter(t => t !== tech) });
    };

    const resetForm = () => {
        setFormData({
            company: '',
            position: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            description: '',
            responsibilities: [],
            technologies: [],
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Experience Management</h2>
                    <p className="text-neural-600">Manage your work experience</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2">
                    {showForm ? <FiX className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
                    <span>{showForm ? 'Cancel' : 'Add Experience'}</span>
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                    <h3 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Experience</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">Company *</label>
                            <input type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="input" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Position *</label>
                            <input type="text" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="input" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Location</label>
                            <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="input" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">Start Date *</label>
                            <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="input" required />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">End Date</label>
                            <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="input" disabled={formData.current} />
                        </div>
                        <div className="flex items-center">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input type="checkbox" checked={formData.current} onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: '' })} className="w-5 h-5" />
                                <span className="font-semibold">Currently Working Here</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Description *</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="textarea" rows={3} required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Responsibilities</label>
                        <div className="flex gap-3 mb-2">
                            <input type="text" value={newResp} onChange={(e) => setNewResp(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())} className="input flex-1" placeholder="Add responsibility..." />
                            <button type="button" onClick={addResponsibility} className="btn-secondary"><FiPlus className="w-5 h-5" /></button>
                        </div>
                        <ul className="space-y-2">
                            {formData.responsibilities.map((resp, idx) => (
                                <li key={idx} className="flex items-center gap-2 p-2 bg-neural-50 rounded">
                                    <span className="flex-1">{resp}</span>
                                    <button type="button" onClick={() => removeResponsibility(idx)} className="text-red-600 hover:text-red-800">
                                        <FiX className="w-4 h-4" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Technologies Used</label>
                        <div className="flex gap-3 mb-2">
                            <input type="text" value={newTech} onChange={(e) => setNewTech(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())} className="input flex-1" placeholder="Add technology..." />
                            <button type="button" onClick={addTechnology} className="btn-secondary"><FiPlus className="w-5 h-5" /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.technologies.map((tech, idx) => (
                                <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                                    {tech}
                                    <button type="button" onClick={() => removeTechnology(tech)} className="hover:text-red-600">
                                        <FiX className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" className="btn-primary flex items-center space-x-2">
                            <FiSave className="w-5 h-5" />
                            <span>{editingId ? 'Update' : 'Add'} Experience</span>
                        </button>
                        <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                    </div>
                </form>
            )}

            <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Your Experience ({experiences.length})</h3>
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : experiences.length === 0 ? (
                    <div className="text-center py-8 text-neural-500">No experience added yet!</div>
                ) : (
                    <div className="space-y-4">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-lg">{exp.position}</h4>
                                        <p className="text-primary-600 font-semibold">{exp.company}</p>
                                        <p className="text-sm text-neural-600">
                                            {exp.startDate.toLocaleDateString()} - {exp.current ? 'Present' : exp.endDate?.toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleEdit(exp)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                                            <FiEdit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(exp.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-neural-700 mb-2">{exp.description}</p>
                                {exp.technologies && exp.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {exp.technologies.map((tech, idx) => (
                                            <span key={idx} className="tag text-xs">{tech}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
