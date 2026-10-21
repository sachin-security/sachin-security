'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck, Users, CalendarCheck, Wallet } from 'lucide-react';
export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await signIn('credentials', { identifier, password, redirect: false });
      if (res?.error) { setError(res.error === 'CredentialsSignin' ? 'Invalid email/employee ID or password.' : 'Sign-in is unavailable. Please contact your administrator.'); setLoading(false); }
      else window.location.href = '/admin';
    } catch { setError('Could not sign in. Please try again.'); setLoading(false); }
  }
  return <div className="hrms-ui hrms-login">
    <section className="hrms-login-story" aria-label="Sachin Security workspace">
      <div className="hrms-login-wordmark"><ShieldCheck size={28} /><span>Sachin Security<small>PEOPLE WORKSPACE</small></span></div>
      <div className="hrms-login-story-content"><span className="hrms-eyebrow">BUILT AROUND YOUR PEOPLE</span><h1>A better day<br />starts together.</h1><p>Your people, attendance and everyday operations.<br className="hidden xl:block" /> All in one thoughtfully organised workspace.</p><div className="hrms-login-features"><span><Users size={18} /> People management</span><span><CalendarCheck size={18} /> Attendance & leave</span><span><Wallet size={18} /> Payroll & documents</span></div></div>
      <p className="hrms-login-signature">Trusted service. Since 1996.</p>
    </section>
    <section className="hrms-login-form-side">
      <div className="hrms-login-card"><Image src="/logo.png" width={64} height={64} alt="Sachin Security Services" className="object-contain mb-7" priority /><span className="hrms-eyebrow">WELCOME TO YOUR WORKSPACE</span><h2>Good to see you.</h2><p className="hrms-login-description">Sign in to manage your day.</p>
        <form onSubmit={submit} className="space-y-5">
          <div><label htmlFor="login-identifier" className="hrms-field-label">Email or employee ID</label><input id="login-identifier" autoComplete="username" placeholder="Enter your email or employee ID" value={identifier} onChange={e => setIdentifier(e.target.value)} required disabled={loading} className="hrms-login-input" /></div>
          <div><label htmlFor="login-password" className="hrms-field-label">Password</label><div className="relative"><input id="login-password" autoComplete="current-password" type={visible ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} className="hrms-login-input pr-12" /><button type="button" className="hrms-password-toggle" aria-label={visible ? 'Hide password' : 'Show password'} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="hrms-login-submit">{loading ? <><Loader2 size={18} className="animate-spin" /> Signing in…</> : <>Sign in to workspace <ArrowRight size={18} /></>}</button>
        </form>
        <p className="hrms-login-help">Need access or help signing in?<br />Contact your HR administrator.</p>
      </div>
      <div className="hrms-login-legal">Sachin Security Services Pvt. Ltd. <span>Employee & staff access</span></div>
    </section>
  </div>;
}
