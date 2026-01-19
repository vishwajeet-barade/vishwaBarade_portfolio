import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Certificates from '@/components/sections/Certificates';
import Resume from '@/components/sections/Resume';
import Contact from '@/components/sections/Contact';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-neural-50 via-white to-primary-50">
            <Navbar />

            {/* Hero Section */}
            <section id="home">
                <Hero />
            </section>

            {/* About Section */}
            <section id="about">
                <About />
            </section>

            {/* Skills Section */}
            <section id="skills">
                <Skills />
            </section>

            {/* Projects Section */}
            <section id="projects">
                <Projects />
            </section>

            {/* Experience Section */}
            <section id="experience">
                <Experience />
            </section>

            {/* Certificates Section */}
            <section id="certificates">
                <Certificates />
            </section>

            {/* Resume Section */}
            <section id="resume">
                <Resume />
            </section>

            {/* Contact Section */}
            <section id="contact">
                <Contact />
            </section>

            <Footer />
        </main>
    );
}
