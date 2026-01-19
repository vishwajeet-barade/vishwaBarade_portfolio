'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy as firestoreOrderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Certificate } from '@/types';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CertificatesManager() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
    });

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const q = query(collection(db, 'certificates'), firestoreOrderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const certsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
            })) as Certificate[];
            setCertificates(certsData);
        } catch (error) {
            console.error('Error fetching certificates:', error);
            toast.error('Failed to load certificates');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.imageUrl.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const certData = {
                title: formData.title,
                imageUrl: formData.imageUrl,
                createdAt: new Date(),
            };

            if (editingId) {
                await updateDoc(doc(db, 'certificates', editingId), {
                    title: formData.title,
                    imageUrl: formData.imageUrl,
                });
                toast.success('Certificate updated!');
            } else {
                await addDoc(collection(db, 'certificates'), certData);
                toast.success('Certificate added!');
            }
            resetForm();
            fetchCertificates();
        } catch (error) {
            console.error('Error saving certificate:', error);
            toast.error('Failed to save certificate');
        }
    };

    const handleEdit = (cert: Certificate) => {
        setFormData({
            title: cert.title,
            imageUrl: cert.imageUrl || '',
        });
        setEditingId(cert.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this certificate?')) return;
        try {
            await deleteDoc(doc(db, 'certificates', id));
            toast.success('Certificate deleted!');
            fetchCertificates();
        } catch (error) {
            toast.error('Failed to delete certificate');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            imageUrl: '',
        });
        setEditingId(null);
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Certificates Management</h2>
                    <p className="text-neural-600">Manage your professional certificates</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center space-x-2">
                    {showForm ? <FiX className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
                    <span>{showForm ? 'Cancel' : 'Add Certificate'}</span>
                </button>
            </div>


            {showForm && (
                <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                    <h3 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Certificate</h3>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            💡 <strong>Upload to Cloudinary:</strong>
                        </p>
                        <ul className="text-sm text-blue-700 mt-2 space-y-1">
                            <li>• Upload your certificate image to <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Cloudinary</a></li>
                            <li>• Copy the direct image URL</li>
                            <li>• Paste it in the "Certificate Image URL" field below</li>
                        </ul>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Certificate Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="input"
                            placeholder="e.g., AWS Certified Solutions Architect"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2">Certificate Image URL (Cloudinary) *</label>
                        {formData.imageUrl && (
                            <div className="mb-3">
                                <img
                                    src={formData.imageUrl}
                                    alt="Certificate Preview"
                                    className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-primary-200"
                                />
                            </div>
                        )}
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="input"
                            placeholder="https://res.cloudinary.com/your-cloud/image/upload/..."
                            required
                        />
                        <p className="text-xs text-neural-500 mt-1">Paste the direct image URL from Cloudinary</p>
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" className="btn-primary flex items-center space-x-2">
                            <FiSave className="w-5 h-5" />
                            <span>{editingId ? 'Update' : 'Add'} Certificate</span>
                        </button>
                        <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
                    </div>
                </form>
            )}


            <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Your Certificates ({certificates.length})</h3>
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : certificates.length === 0 ? (
                    <div className="text-center py-8 text-neural-500">No certificates yet!</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {certificates.map((cert) => (
                            <div key={cert.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                {cert.imageUrl && <img src={cert.imageUrl} alt={cert.title} className="w-full h-48 object-cover rounded-lg mb-3" />}
                                <h4 className="font-bold mb-3 text-center">{cert.title}</h4>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(cert)} className="btn-secondary text-sm py-2 flex-1 flex items-center justify-center">
                                        <FiEdit2 className="w-4 h-4 mr-1" /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(cert.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
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
