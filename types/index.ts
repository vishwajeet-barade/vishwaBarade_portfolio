// Type definitions for the portfolio data structure

export interface SocialLink {
    platform: string;
    url: string;
    icon?: string;
}

export interface Skill {
    id: string;
    name: string;
    category: 'AI/ML' | 'Data Analysis' | 'Programming' | 'Tools' | 'Other';
    proficiency: number; // 0-100
    icon?: string;
    createdAt: Date;
}

export interface Certificate {
    id: string;
    title: string;
    issuer: string;
    issueDate: Date;
    expiryDate?: Date;
    credentialId?: string;
    credentialUrl?: string;
    imageUrl?: string;
    description?: string;
    skills?: string[];
    createdAt: Date;
}

export interface ProjectMedia {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    caption?: string;
    order: number;
}

export interface Project {
    id: string;
    title: string;
    shortDescription: string;
    detailedDescription: string;
    overview: string;

    // Media
    thumbnailUrl: string;
    media: ProjectMedia[]; // Images and videos
    demoVideoUrl?: string;

    // Links
    githubUrl?: string;
    linkedinUrl?: string;
    liveUrl?: string;
    customLinks?: SocialLink[];

    // Technical details
    technologies: string[];
    category: string;
    tags: string[];

    // Metadata
    startDate?: Date;
    endDate?: Date;
    status: 'completed' | 'in-progress' | 'planned';
    featured: boolean;
    order: number;

    // Engagement
    likes?: number;
    views?: number;

    createdAt: Date;
    updatedAt: Date;
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description: string;
    responsibilities: string[];
    achievements?: string[];
    technologies?: string[];
    companyLogo?: string;
    createdAt: Date;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    grade?: string;
    description?: string;
    achievements?: string[];
    logo?: string;
    createdAt: Date;
}

export interface Resume {
    id: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    uploadedAt: Date;
    version: number;
    isActive: boolean;
}

export interface Profile {
    id: string;
    fullName: string;
    title: string;
    bio: string;
    email: string;
    phone?: string;
    location?: string;

    // Profile images
    profileImageUrl?: string;
    coverImageUrl?: string;

    // Social links
    socialLinks: SocialLink[];

    // About section
    aboutMe: string;
    interests?: string[];

    // SEO
    metaTitle?: string;
    metaDescription?: string;

    updatedAt: Date;
}

export interface Analytics {
    id: string;
    totalViews: number;
    projectViews: { [projectId: string]: number };
    resumeDownloads: number;
    lastUpdated: Date;
}

// Form data types for admin panel
export interface ProjectFormData extends Omit<Project, 'id' | 'createdAt' | 'updatedAt'> { }
export interface SkillFormData extends Omit<Skill, 'id' | 'createdAt'> { }
export interface CertificateFormData extends Omit<Certificate, 'id' | 'createdAt'> { }
export interface ExperienceFormData extends Omit<Experience, 'id' | 'createdAt'> { }
export interface EducationFormData extends Omit<Education, 'id' | 'createdAt'> { }
