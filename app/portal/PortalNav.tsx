'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LogOut, Menu, X } from 'lucide-react';
const LINKS = [
  { href: '/portal', label: 'Overview' }, { href: '/portal/profile', label: 'My profile' },
  { href: '/portal/attendance', label: 'Attendance' }, { href: '/portal/leave', label: 'Leave' }, { href: '/portal/documents', label: 'Documents' },
];
export default function PortalNav({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close);
  }, [open]);
  const active = (href: string) => href === '/portal' ? pathname === href : pathname.startsWith(href);
  const initials = name.split(' ').filter(Boolean).map(s => s[0]).slice(0, 2).join('');
  return <header className="hrms-portal-header"><div className="hrms-portal-header-inner">
    <Link href="/portal" className="hrms-portal-brand"><Image src="/logo.png" alt="Sachin Security" width={38} height={38} className="object-contain" /><span>Sachin Security<small>EMPLOYEE WORKSPACE</small></span></Link>
    <nav className="hrms-portal-links" aria-label="Employee navigation">{LINKS.map(link => <Link key={link.href} href={link.href} aria-current={active(link.href) ? 'page' : undefined}>{link.label}</Link>)}</nav>
    <div className="ml-auto flex items-center gap-3"><span className="hrms-user-avatar" title={name}>{initials}</span><div className="hrms-user-caption"><strong>{name}</strong><small>EMPLOYEE</small></div><button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="hrms-signout" aria-label="Sign out" title="Sign out"><LogOut size={18} /></button><button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="employee-mobile-navigation">{open ? <X size={21} /> : <Menu size={21} />}</button></div>
    </div>{open && <nav id="employee-mobile-navigation" className="hrms-portal-mobile lg:hidden" aria-label="Mobile employee navigation">{LINKS.map(link => <Link key={link.href} href={link.href} aria-current={active(link.href) ? 'page' : undefined} onClick={() => setOpen(false)}>{link.label}</Link>)}</nav>}
  </header>;
}
