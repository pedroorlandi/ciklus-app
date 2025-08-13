import { useEffect, useState } from "react";
import Header from "@/components/institutional/Header";
import HeroSection from "@/components/institutional/HeroSection";
import AboutSection from "@/components/institutional/AboutSection";
import ServicesSection from "@/components/institutional/ServicesSection";
import TeamSection from "@/components/institutional/TeamSection";
import CredentialsSection from "@/components/institutional/CredentialsSection";
import ArticlesSection from "@/components/institutional/ArticlesSection";
import ContactSection from "@/components/institutional/ContactSection";
import Footer from "@/components/institutional/Footer";

export default function InstitutionalLanding() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Reveal animation on page load
    setIsVisible(true);

    // Scroll reveal animations
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      const windowHeight = window.innerHeight;
      
      reveals.forEach(reveal => {
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <TeamSection />
        <CredentialsSection />
        <ArticlesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}