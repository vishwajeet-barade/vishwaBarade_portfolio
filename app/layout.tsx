import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const inter = Inter({
    subsets: ["latin"],
    variable: '--font-inter',
    display: 'swap',
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: '--font-outfit',
    display: 'swap',
});

export const metadata: Metadata = {
    title: "Vishwajeet Barade | AI/ML Engineer & Data Analyst",
    description: "Portfolio of Vishwajeet Barade - Passionate about AI/ML, Data Analysis, and Generative AI. Building intelligent, data-driven solutions.",
    keywords: ["AI", "Machine Learning", "Data Analysis", "Generative AI", "LLM", "Portfolio"],
    authors: [{ name: "Vishwajeet Barade" }],
    openGraph: {
        title: "Vishwajeet Barade | AI/ML Engineer",
        description: "Exploring machine learning models, LLMs, and GenAI applications",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Vishwajeet Barade | AI/ML Engineer",
        description: "Exploring machine learning models, LLMs, and GenAI applications",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className={inter.className}>
                {children}
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#1e293b',
                            color: '#fff',
                            borderRadius: '12px',
                            padding: '16px',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </body>
        </html>
    );
}
