import Link from 'next/link';
import { auth } from '@/auth';
import { User, CalendarClock, FileText, KeyRound, ShieldCheck, ArrowUpRight, type LucideIcon } from 'lucide-react';
import AttendanceClock from './AttendanceClock';
function QuickLink({ href, title, desc, icon: Icon }: { href: string; title: string; desc: string; icon: LucideIcon }) {
  return <Link href={href} className="hrms-action-card"><span className="hrms-action-icon"><Icon size={20} /></span><span className="flex-1"><strong>{title}</strong><p>{desc}</p></span><ArrowUpRight size={15} className="text-slate-400" /></Link>;
}
export default async function PortalPage() {
  const session = await auth();
  const name = session?.user?.name || 'Employee';
  return <div>
    <div className="hrms-hero"><div><span className="hrms-eyebrow">YOUR GUARD & EMPLOYEE WORKSPACE</span><h1>Welcome, {name}.</h1><p>Your duty, attendance and support. Ready for your day.</p></div><Link href="/portal/profile" className="hrms-hero-link">My profile <ArrowUpRight size={16} /></Link></div>
    <div className="grid gap-6 lg:grid-cols-5 items-start">
      <section className="hrms-attendance-card lg:col-span-3" aria-label="Daily attendance"><AttendanceClock /><Link href="/portal/attendance" className="block text-sm font-medium text-center text-slate-600 hover:text-slate-900 border-t border-slate-100 pt-4 mt-5">View monthly attendance →</Link></section>
      <section className="lg:col-span-2"><div className="hrms-section-heading !mt-0"><h2>Your essentials</h2></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"><QuickLink href="/portal/duty" title="My duty & site" desc="Shift times, instructions and supervisor contact" icon={ShieldCheck} /><QuickLink href="/portal/duty#reports" title="Report an incident" desc="Send an issue to HR and follow its status" icon={FileText} /><QuickLink href="/portal/profile" title="My profile" desc="Your details and contact information" icon={User} /><QuickLink href="/portal/leave" title="Leave & time off" desc="Apply for leave and view your balance" icon={CalendarClock} /><QuickLink href="/portal/documents" title="My documents" desc="Find and download your documents" icon={FileText} /><QuickLink href="/admin/change-password" title="Account security" desc="Manage your password" icon={KeyRound} /></div><div className="rounded-xl bg-[#fff0f1] p-5 mt-5"><p className="font-semibold text-[#9e1722] text-xs">Need a hand?</p><p className="text-xs text-[#856167] mt-2 leading-relaxed">For help with attendance, leave or your employee details, contact your HR team.</p><Link href="/portal/privacy" className="inline-block mt-3 text-xs text-[#9e1722] underline underline-offset-4">Face privacy & consent</Link></div></section>
    </div>
  </div>;
}
