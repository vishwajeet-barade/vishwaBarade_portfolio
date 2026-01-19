import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Panel | Vishwajeet Barade Portfolio",
    description: "Admin panel for managing portfolio content",
    robots: "noindex, nofollow",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
