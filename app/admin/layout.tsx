'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import CompanyLogo from '@/app/components/CompanyLogo';
import { Briefcase, Users, Search, LogOut, Menu, X, Home, Building2, Network, CalendarCheck, CalendarClock, FileText, Settings, ExternalLink, UserCog, Wallet, ShieldCheck, ChevronRight, CircleHelp } from 'lucide-react';

const navigation = [
  { label: 'Workspace', items: [{ name: 'Overview', icon: Home, path: '/admin' }] },
  { label: 'People & operations', items: [
    { name: 'Employee directory', icon: Search, path: '/admin/search-employee' },
    { name: 'Add employee', icon: Users, path: '/admin/add-employee' },
    { name: 'Attendance', icon: CalendarCheck, path: '/admin/attendance' },
    { name: 'Guard operations', icon: ShieldCheck, path: '/admin/guard-operations', roles: ['admin', 'hr'] },
    { name: 'Photo requests', icon: Users, path: '/admin/photo-requests', roles: ['admin', 'hr'] },
    { name: 'Leave management', icon: CalendarClock, path: '/admin/leave' },
    { name: 'Payroll', icon: Wallet, path: '/admin/payroll', roles: ['admin', 'hr'] },
    { name: 'Documents', icon: FileText, path: '/admin/documents' },
  ] },
  { label: 'Organisation', items: [
    { name: 'Organisation', icon: Building2, path: '/admin/organization' },
    { name: 'Reporting structure', icon: Network, path: '/admin/reporting' },
    { name: 'Job openings', icon: Briefcase, path: '/admin/all-jobs' },
    { name: 'Create job', icon: Briefcase, path: '/admin/add-job' },
  ] },
  { label: 'Administration', items: [
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
    { name: 'User management', icon: UserCog, path: '/admin/users', roles: ['admin'] },
    { name: 'Support messages', icon: CircleHelp, path: '/admin/support-messages' },
    { name: 'Employee portal', icon: ExternalLink, path: '/portal' },
  ] },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; role?: string }>({});
  const pathname = usePathname();
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/auth/session', { signal: controller.signal }).then(r => r.json()).then(s => setUser(s?.user || {})).catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  if (pathname === '/admin/login') return <>{children}</>;
  const current = navigation.flatMap(group => group.items).find(item => item.path === pathname)?.name || 'Workspace';
  const initials = (user.name || 'HR').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  async function logout() { if (confirm('Sign out of your workspace?')) await signOut({ callbackUrl: '/admin/login' }); }
  return <div className="hrms-ui hrms-shell">
    <a href="#workspace-content" className="hrms-skip">Skip to workspace</a>
    {open && <button className="hrms-overlay" onClick={() => setOpen(false)} aria-label="Close navigation" />}
    <aside id="workspace-navigation" className={`hrms-sidebar ${open ? 'is-open' : ''}`}>
      <Link href="/admin" className="hrms-brand" onClick={() => setOpen(false)}>
        <CompanyLogo size={44} />
        <span>Sachin Security<small>SECURITY OPERATIONS</small></span>
      </Link>
      <div className="hrms-sidebar-caption">People. Posts. Protection.</div>
      <nav aria-label="Main navigation" className="hrms-navigation">
        {navigation.map(group => {
          const items = group.items.filter(item => !('roles' in item) || item.roles?.includes(user.role || ''));
          return <div key={group.label} className="hrms-nav-group"><p>{group.label}</p>{items.map(item => {
            const active = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path + '/'));
            return <Link href={item.path} key={item.path} aria-current={active ? 'page' : undefined} className={`hrms-nav-link ${active ? 'is-active' : ''}`} onClick={() => setOpen(false)}><item.icon size={18} /><span>{item.name}</span>{active && <ChevronRight size={14} />}</Link>;
          })}</div>;
        })}
      </nav>
      <div className="hrms-sidebar-bottom"><ShieldCheck size={17} /><span>Sachin Security Services<small>People at the heart of every day.</small></span></div>
    </aside>
    <div className="hrms-workspace">
      <header className="hrms-topbar">
        <div className="flex items-center gap-3 min-w-0"><button className="hrms-menu-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="workspace-navigation" onClick={() => setOpen(!open)}>{open ? <X size={21} /> : <Menu size={21} />}</button><div className="hrms-breadcrumb"><span>Workspace</span><ChevronRight size={13} /><strong>{current}</strong></div></div>
        <div className="flex items-center gap-3"><span className="hrms-user-avatar">{initials}</span><div className="hrms-user-caption"><strong>{user.name || 'Your workspace'}</strong><small>{user.role ? user.role.toUpperCase() : 'STAFF'}</small></div><button onClick={logout} className="hrms-signout" aria-label="Sign out" title="Sign out"><LogOut size={18} /></button></div>
      </header>
      <main id="workspace-content" className="hrms-content">{children}</main>
      <footer className="hrms-app-footer"><span>Sachin Security Services Pvt. Ltd.</span><span>People. Presence. Progress.</span></footer>
    </div>
  </div>;
}
