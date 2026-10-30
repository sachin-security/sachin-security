'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Send, Sparkles, Trash2 } from 'lucide-react';
import './visio-ai.css';

type Config = { generatedAnswers: boolean; staff: boolean; topics: {id:string;title:string;href:string}[] };
type Answer = { question:string; answer:string; mode:string; notice:string; sources:{id:string;title:string;href:string}[]; summary:{label:string;value:number}[]; scope:string; asOf:string; linked:boolean };
const suggestions = ['How do I fix a face mismatch?', 'How do I apply for leave?', 'Show my pending requests', 'Where can I see my duty?', 'How do I claim an expense?'];
export default function VisioAI() {
  const [config,setConfig]=useState<Config|null>(null),[question,setQuestion]=useState(''),[answers,setAnswers]=useState<Answer[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState(''),[scope,setScope]=useState('mine'),[generate,setGenerate]=useState(false);
  const lock=useRef(false), abort=useRef<AbortController|null>(null), result=useRef<HTMLDivElement>(null);
  useEffect(()=>{const controller=new AbortController();fetch('/api/workspace/ai',{signal:controller.signal,cache:'no-store'}).then(async r=>{if(!r.ok)throw Error('Sign in again or retry to load VISIO AI.');setConfig(await r.json());}).catch(e=>{if(e.name!=='AbortError')setError(e.message);});return()=>{controller.abort();abort.current?.abort();};},[]);
  useEffect(()=>{if(answers.length)result.current?.focus();},[answers.length]);
  async function ask(text=question) {
    if(lock.current || !text.trim() || !config)return;
    lock.current=true;setBusy(true);setError('');
    const controller=new AbortController();abort.current=controller;
    const timer=setTimeout(()=>controller.abort(),25000);
    try {const response=await fetch('/api/workspace/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:text,scope,generate,providerConsent:generate}),signal:controller.signal});const data=await response.json();if(!response.ok)throw Error(data.error||'Could not load an answer.');setAnswers(old=>[...old.slice(-9),{...data,question:text}]);setQuestion('');}
    catch(e){setError(e instanceof Error?(e.name==='AbortError'?'The request timed out. Please retry.':e.message):'Could not load an answer.');}
    finally{clearTimeout(timer);lock.current=false;setBusy(false);}
  }
  return <section className="visio-ai" aria-labelledby="visio-ai-title">
    <header className="visio-ai-heading"><Image src="/visio-it-logo.png" alt="VISIO IT SOLUTIONS" width={64} height={64}/><div><p className="text-sm font-semibold text-blue-800">YOUR HRMS ASSISTANT</p><h1 id="visio-ai-title" className="text-3xl font-bold">VISIO AI</h1><p>Find the right form, understand the next step and check permitted request totals.</p></div></header>
    <p className="visio-ai-info">{config?.generatedAnswers?'OpenAI answers are available when you opt in below.':'Built-in HRMS help is available. OpenAI answers will be enabled after the company connects its API account.'} This assistant does not punch attendance, approve requests or change records.</p>
    <div className="visio-ai-suggestions" aria-label="Suggested questions">{suggestions.map(text=><button key={text} disabled={busy||!config} onClick={()=>ask(text)}>{text}</button>)}{config?.staff?<button disabled={busy} onClick={()=>{setScope('workspace');setQuestion('Show pending workspace requests and the action inbox');}}>Review workspace requests</button>:null}</div>
    <div className="visio-ai-results" aria-label="Answers" aria-busy={busy}>
      {!answers.length?<div className="visio-ai-empty"><Sparkles aria-hidden="true"/><h2>How can I help today?</h2><p>Try a suggested question or ask about attendance, leave, duty, photos or HR services. Each question is handled independently.</p></div>:answers.map((item,index)=><article key={index} className="visio-ai-answer"><h2 className="font-semibold text-lg">{item.question}</h2><p className="text-xs text-slate-500 mt-2">{item.mode==='generated'?'OpenAI answer':'HRMS guidance'} · {item.scope} · {new Date(item.asOf).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})} IST</p><p className="whitespace-pre-wrap my-4 leading-relaxed">{item.answer}</p>{item.summary.length?<dl className="visio-ai-counts">{item.summary.map(count=><div key={count.label}><dt>{count.label}</dt><dd>{count.value}</dd></div>)}</dl>:<p>No linked employee profile is available for personal request totals. Ask HR to link your account.</p>}<nav aria-label="Answer sources" className="visio-ai-sources">{item.sources.map((source,i)=><Link key={source.id+'-'+i} href={source.href}>{source.title} ↗</Link>)}</nav><p className="text-sm text-slate-600 mt-3">{item.notice}</p></article>)}
    </div>
    <div ref={result} tabIndex={-1} className="text-sm" aria-live="polite">{busy?'Finding guidance…':error?<p role="alert" className="text-red-700">{error}</p>:answers.length?'Answer ready.':''}</div>
    <form className="visio-ai-compose" onSubmit={e=>{e.preventDefault();ask();}}>
      {config?.staff?<label className="block text-sm font-semibold mb-3">Record scope <select value={scope} onChange={e=>setScope(e.target.value)} disabled={busy} className="border rounded-lg p-2 ml-2"><option value="mine">My records</option><option value="workspace">Workspace totals</option></select></label>:null}
      <label htmlFor="visio-question" className="block font-semibold">Ask VISIO AI</label><textarea id="visio-question" value={question} onChange={e=>setQuestion(e.target.value)} maxLength={1200} rows={3} placeholder="For example: How do I update my attendance photograph?" disabled={busy} aria-describedby="visio-ai-privacy" required/>
      <p id="visio-ai-privacy" className="text-sm text-slate-600">Do not enter Aadhaar, passwords, banking details or confidential employee information. Questions are not saved as chat history by this HRMS; the conversation clears when you leave or reload.</p>
      {config?.generatedAnswers?<label className="flex items-start gap-2 text-sm mt-3"><input type="checkbox" checked={generate} onChange={e=>setGenerate(e.target.checked)} disabled={busy} className="mt-1"/><span>Use OpenAI for my questions on this page. Send my question and matching HRMS/company guidance to OpenAI. Private request records and totals stay within the HRMS. Uncheck to use built-in help.</span></label>:null}
      <div className="flex gap-3 justify-between mt-4"><button type="button" disabled={busy||!answers.length} onClick={()=>{setAnswers([]);setQuestion('');setGenerate(false);setError('');}} className="flex items-center gap-2 border rounded-xl px-4 py-2"><Trash2 size={16}/>Clear conversation</button><button disabled={busy||!config||!question.trim()} className="flex items-center gap-2 bg-blue-950 text-white rounded-xl px-5 py-2"><Send size={16}/>{busy?'Working…':'Ask VISIO AI'}</button></div>
    </form>
    <details className="mt-6"><summary className="cursor-pointer font-semibold">Browse HRMS shortcuts</summary><nav className="visio-ai-sources mt-3" aria-label="HRMS shortcuts">{config?.topics.map(topic=><Link key={topic.id} href={topic.href}>{topic.title} ↗</Link>)}</nav></details>
  </section>;
}
