'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Profile, SocialLink } from '@/types';
import { FiSave, FiPlus, FiTrash2, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ProfileManager() {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profileId, setProfileId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        fullName: 'Vishwajeet Barade',
        title: 'AI/ML Engineer & Data Analyst',
        bio: 'Passionate about AI/ML, Data Analysis, and Generative AI.',
        aboutMe: '',
        email: 'baradevishwajeet15@gmail.com',
        phone: '',
        location: 'India',
        profileImageUrl: '',
        coverImageUrl: '',
        metaTitle: '',
        metaDescription: '',
    });
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
        { platform: 'GitHub', url: '', icon: 'FiGithub' },
        { platform: 'LinkedIn', url: '', icon: 'FiLinkedin' },
    ]);
    const [interests, setInterests] = useState<string[]>(['AI/ML', 'Data Science']);
    const [newInterest, setNewInterest] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'profile'), limit(1));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const profileDoc = snapshot.docs[0];
                const data = profileDoc.data();
                setProfileId(profileDoc.id);
                setFormData({
                    fullName: data.fullName || '',
                    title: data.title || '',
                    bio: data.bio || '',
                    aboutMe: data.aboutMe || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    location: data.location || '',
                    profileImageUrl: data.profileImageUrl || '',
                    coverImageUrl: data.coverImageUrl || '',
                    metaTitle: data.metaTitle || '',
                    metaDescription: data.metaDescription || '',
                });
                setSocialLinks(data.socialLinks || []);
                setInterests(data.interests || []);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const profileData = {
                ...formData,
                socialLinks,
                interests,
                updatedAt: new Date(),
            };

            if (profileId) {
                await updateDoc(doc(db, 'profile', profileId), profileData);
                toast.success('Profile updated successfully!');
            } else {
                const docRef = await addDoc(collection(db, 'profile'), profileData);
                setProfileId(docRef.id);
                toast.success('Profile created successfully!');
            }
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const addSocialLink = () => {
        setSocialLinks([...socialLinks, { platform: '', url: '', icon: '' }]);
    };

    const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
        const updated = [...socialLinks];
        updated[index] = { ...updated[index], [field]: value };
        setSocialLinks(updated);
    };

    const removeSocialLink = (index: number) => {
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
    };

    const addInterest = () => {
        if (newInterest.trim()) {
            setInterests([...interests, newInterest.trim()]);
            setNewInterest('');
        }
    };

    const removeInterest = (index: number) => {
        setInterests(interests.filter((_, i) => i !== index));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FiLoader className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Profile Management</h2>
                    <p className="text-neural-600">Update your personal information and settings</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center space-x-2">
                    {saving ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiSave className="w-5 h-5" />}
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            {/* Basic Info */}
            <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Full Name *</label>
                        <input
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            className="input"
                            placeholder="Vishwajeet Barade"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input"
                            placeholder="AI/ML Engineer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Email *</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="input"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Phone</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="input"
                            placeholder="+91 XXXXX XXXXX"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold mb-2">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="input"
                            placeholder="Mumbai, India"
                        />
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Bio & About</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Short Bio (Hero Section)</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="textarea"
                            rows={3}
                            placeholder="A brief introduction about yourself..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">About Me (Detailed)</label>
                        <textarea
                            value={formData.aboutMe}
                            onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                            className="textarea"
                            rows={6}
                            placeholder="Tell your story in detail..."
                        />
                    </div>
                </div>
            </div>

            {/* Images */}
            <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Profile Images</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800">
                        💡 <strong>Upload images to free hosting:</strong>
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                        <li>• <strong>Cloudinary:</strong> <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">cloudinary.com</a> (25GB free, best!)</li>
                        <li>• <strong>ImgBB:</strong> <a href="https://imgbb.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">imgbb.com</a> (unlimited, no account)</li>
                        <li>• <strong>Imgur:</strong> <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">imgur.com</a> (unlimited)</li>
                    </ul>
                    <p className="text-xs text-blue-600 mt-2">Upload your image there, copy the direct link, and paste below!</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2">Profile Picture URL</label>
                        {formData.profileImageUrl && (
                            <div className="mb-3">
                                <img src={formData.profileImageUrl} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover border-2 border-primary-200" />
                            </div>
                        )}
                        <input
                            type="url"
                            value={formData.profileImageUrl}
                            onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
                            className="input"
                            placeholder="https://i.ibb.co/xxxxx/profile.jpg"
                        />
                        <p className="text-xs text-neural-500 mt-1">Paste the direct image URL from ImgBB, Cloudinary, or Imgur</p>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Cover Image URL</label>
                        {formData.coverImageUrl && (
                            <div className="mb-3">
                                <img src={formData.coverImageUrl} alt="Cover Preview" className="w-full h-32 rounded-lg object-cover border-2 border-primary-200" />
                            </div>
                        )}
                        <input
                            type="url"
                            value={formData.coverImageUrl}
                            onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                            className="input"
                            placeholder="https://i.ibb.co/xxxxx/cover.jpg"
                        />
                        <p className="text-xs text-neural-500 mt-1">Paste the direct image URL from ImgBB, Cloudinary, or Imgur</p>
                    </div>
                </div>
            </div>

            {/* Social Links */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Social Links</h3>
                    <button onClick={addSocialLink} className="btn-secondary flex items-center space-x-2">
                        <FiPlus className="w-4 h-4" />
                        <span>Add Link</span>
                    </button>
                </div>
                <div className="space-y-3">
                    {socialLinks.map((link, index) => (
                        <div key={index} className="flex gap-3">
                            <input
                                type="text"
                                value={link.platform}
                                onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                                className="input flex-1"
                                placeholder="Platform (e.g., GitHub)"
                            />
                            <input
                                type="url"
                                value={link.url}
                                onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                                className="input flex-1"
                                placeholder="URL"
                            />
                            <button onClick={() => removeSocialLink(index)} className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                                <FiTrash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Interests */}
            <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Interests & Hobbies</h3>
                <div className="flex gap-3 mb-4">
                    <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                        className="input flex-1"
                        placeholder="Add an interest..."
                    />
                    <button onClick={addInterest} className="btn-secondary">
                        <FiPlus className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {interests.map((interest, index) => (
                        <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                            {interest}
                            <button onClick={() => removeInterest(index)} className="hover:text-red-600">
                                <FiTrash2 className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
