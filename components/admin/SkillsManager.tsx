'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy as firestoreOrderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skill } from '@/types';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function SkillsManager() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'AI/ML' as 'AI/ML' | 'Data Analysis' | 'Programming' | 'Tools' | 'Other',
        proficiency: 50,
    });

    const categories: Array<'AI/ML' | 'Data Analysis' | 'Programming' | 'Tools' | 'Other'> = [
        'AI/ML',
        'Data Analysis',
        'Programming',
        'Tools',
        'Other'
    ];

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
            toast.error('Failed to load skills');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateDoc(doc(db, 'skills', editingId), {
                    ...formData,
                    updatedAt: new Date(),
                });
                toast.success('Skill updated!');
            } else {
                await addDoc(collection(db, 'skills'), {
                    ...formData,
                    createdAt: new Date(),
                });
                toast.success('Skill added!');
            }
            resetForm();
            fetchSkills();
        } catch (error) {
            console.error('Error saving skill:', error);
            toast.error('Failed to save skill');
        }
    };

    const handleEdit = (skill: Skill) => {
        setFormData({
            name: skill.name,
            category: skill.category,
            proficiency: skill.proficiency,
        });
        setEditingId(skill.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;
        try {
            await deleteDoc(doc(db, 'skills', id));
            toast.success('Skill deleted!');
            fetchSkills();
        } catch (error) {
            console.error('Error deleting skill:', error);
            toast.error('Failed to delete skill');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', category: 'AI/ML', proficiency: 50 });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Skills Management</h2>
                    <p className="text-neural-600">Manage your technical skills and expertise</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary flex items-center space-x-2"
                >
                    {showForm ? <FiX className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
                    <span>{showForm ? 'Cancel' : 'Add Skill'}</span>
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="card p-6">
                    <h3 className="text-xl font-bold mb-4">{editingId ? 'Edit Skill' : 'Add New Skill'}</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Skill Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input"
                                    placeholder="e.g., Python, TensorFlow"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">Category *</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                    className="input"
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Proficiency: {formData.proficiency}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={formData.proficiency}
                                onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })}
                                className="w-full h-2 bg-neural-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-neural-500 mt-1">
                                <span>Beginner</span>
                                <span>Intermediate</span>
                                <span>Expert</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="btn-primary flex items-center space-x-2">
                                <FiSave className="w-5 h-5" />
                                <span>{editingId ? 'Update' : 'Add'} Skill</span>
                            </button>
                            <button type="button" onClick={resetForm} className="btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Skills List */}
            <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Your Skills ({skills.length})</h3>
                {loading ? (
                    <div className="text-center py-8 text-neural-500">Loading...</div>
                ) : skills.length === 0 ? (
                    <div className="text-center py-8 text-neural-500">
                        No skills added yet. Click "Add Skill" to get started!
                    </div>
                ) : (
                    <div className="space-y-3">
                        {skills.map((skill) => (
                            <div key={skill.id} className="flex items-center gap-4 p-4 bg-neural-50 rounded-lg hover:bg-neural-100 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="font-bold">{skill.name}</h4>
                                            <p className="text-sm text-neural-600">{skill.category}</p>
                                        </div>
                                        <span className="text-sm font-semibold text-primary-600">
                                            {skill.proficiency}%
                                        </span>
                                    </div>
                                    <div className="relative h-2 bg-neural-200 rounded-full overflow-hidden">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full"
                                            style={{ width: `${skill.proficiency}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(skill)}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                    >
                                        <FiEdit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(skill.id)}
                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
