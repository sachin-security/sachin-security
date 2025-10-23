// app/page.tsx
import Hero from '@/app/components/Hero';
import Nav from '@/app/components/Navbar';
import About from '@/app/components/About';
import Services from '@/app/components/Services';
import Industries from '@/app/components/Industries';
import WhyChooseUs from '@/app/components/WhyChooseUs';
import Testimonials from '@/app/components/Testimonials';
import Contact from '@/app/components/Contact';
import Footer from '@/app/components/Footer';

export default function Home() {
  return (
    <main >
      <Nav/>
      <Hero />
      <About />
      <Services />
      <Industries />
      <WhyChooseUs />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}