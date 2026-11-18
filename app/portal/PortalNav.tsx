'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import CompanyLogo from '@/app/components/CompanyLogo';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { CalendarCheck, ClipboardList, Ellipsis, House, LogOut, Menu, X } from 'lucide-react';
const PRIMARY_LINKS = [
  { href: '/portal', label: 'Home', icon: House },
  { href: '/portal/duty', label: 'My duty', icon: ClipboardList },
  { href: '/portal/attendance', label: 'Attendance', icon: CalendarCheck },
];
const LINKS = [
  ...PRIMARY_LINKS,
  { href: '/portal/requests', label: 'My requests' },
  { href: '/portal/services', label: 'HR services' },
  { href: '/portal/leave', label: 'Leave' },
  { href: '/portal/documents', label: 'Documents' },
  { href: '/portal/ai', label: 'VISIO AI' },
  { href: '/portal/profile', label: 'My profile' },
];
export default function PortalNav({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close);
  }, [open]);
  const active = (href: string) => pathname === href || (href !== '/portal' && pathname.startsWith(href + '/'));
  const initials = name.split(' ').filter(Boolean).map(s => s[0]).slice(0, 2).join('');
  return <><header className="hrms-portal-header"><div className="hrms-portal-header-inner">
    <Link href="/portal" className="hrms-portal-brand"><CompanyLogo size={40} /><span>Sachin Security<small>GUARD & EMPLOYEE WORKSPACE</small></span></Link>
    <nav className="hrms-portal-links" aria-label="Employee navigation">{LINKS.map(link => <Link key={link.href} href={link.href} aria-current={active(link.href) ? 'page' : undefined}>{link.label}</Link>)}</nav>
    <div className="ml-auto flex items-center gap-3"><Link href="/portal/profile" className="hrms-user-avatar" aria-label="My profile" title={name}>{initials}</Link><div className="hrms-user-caption"><strong>{name}</strong><small>EMPLOYEE</small></div><button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="hrms-signout" aria-label="Sign out" title="Sign out"><LogOut size={18} /></button><button className="hrms-portal-menu" onClick={() => setOpen(!open)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="employee-mobile-navigation">{open ? <X size={21} /> : <Menu size={21} />}</button></div>
    </div><nav hidden={!open} id="employee-mobile-navigation" className="hrms-portal-mobile" aria-label="Mobile employee navigation">{LINKS.map(link => <Link key={link.href} href={link.href} aria-current={active(link.href) ? 'page' : undefined} onClick={() => setOpen(false)}>{link.label}</Link>)}</nav>
  </header><nav className="hrms-mobile-dock" aria-label="Employee shortcuts">
    {PRIMARY_LINKS.map(({ href, label, icon: Icon }) => (
      <Link href={href} key={href} aria-current={active(href) ? 'page' : undefined} onClick={() => setOpen(false)}>
        <Icon size={20} aria-hidden="true" />{label}
      </Link>
    ))}
    <button type="button" aria-expanded={open} aria-controls="employee-mobile-navigation" onClick={() => setOpen(!open)}>
      <Ellipsis size={20} aria-hidden="true" />More
    </button>
  </nav></>;
}
