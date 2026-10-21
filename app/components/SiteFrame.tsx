'use client';
import { usePathname } from 'next/navigation';
import Nav from './Navbar';
import Footer from './Footer';
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const workspace = pathname.startsWith('/admin') || pathname.startsWith('/portal');
  return <>{!workspace && <Nav />}{children}{!workspace && <Footer />}</>;
}
