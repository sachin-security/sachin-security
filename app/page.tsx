// app/page.tsx
import Hero from '@/app/components/Hero';
import About from '@/app/components/About';
import Services from '@/app/components/Services';
import Industries from '@/app/components/Industries';
import WhyChooseUs from '@/app/components/WhyChooseUs';
import Testimonials from '@/app/components/Testimonials';
import Contact from '@/app/components/Contact';


export default function Home() {
  return (
    <main >
      <Hero />
      <About />
      <Services customPadding={0} />
      <Industries />
      <WhyChooseUs />
      <Testimonials />
      <Contact />
    </main>
  );
}