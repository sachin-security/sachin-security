import Image from 'next/image';
import Link from 'next/link';
import { Camera, Cpu, MonitorCheck, Radio, ArrowRight } from 'lucide-react';

const steps = [
  { icon: Camera, title: 'Connect your CCTV', text: 'Assess existing cameras, DVR/NVR and network access. Connect compatible video feeds to an edge or server-based analytics system.' },
  { icon: Cpu, title: 'Detect the event', text: 'Configure zones, schedules and rules so analytics can flag events such as restricted-area entry or line crossing.' },
  { icon: MonitorCheck, title: 'Verify the alert', text: 'A monitoring operator reviews the relevant camera, location and event clip before escalating under your site procedure.' },
  { icon: Radio, title: 'Coordinate the response', text: 'The control room contacts the assigned guard or supervisor, who checks the site and reports the outcome for follow-up.' },
];

export default function AISecurityWorkflow() {
  return (
    <section id="ai-physical-security" aria-labelledby="ai-security-title" className="bg-slate-950 py-20 sm:py-24 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-10">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-[.2em] mb-4">Existing cameras. Actionable intelligence.</p>
          <h2 id="ai-security-title" className="text-3xl sm:text-5xl font-bold leading-tight tracking-tight">AI-powered physical security.<br /><span className="text-amber-400">From camera to coordinated response.</span></h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">Give compatible CCTV a smarter role in protecting your premises. Add video analytics to existing feeds, bring important events to an operator’s attention, and connect verified alerts with the people on the ground.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <figure className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
            <Image src="/images/cctv-ai-upgrade.webp" alt="Concept illustration of an existing warehouse CCTV camera connected to an analytics computer and monitoring screen" width={1536} height={1024} sizes="(min-width: 1024px) 50vw, 100vw" className="w-full h-auto" />
            <figcaption className="p-6"><p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-2">01 / Add intelligence</p><h3 className="text-xl font-semibold">Upgrade the monitoring, keep compatible cameras</h3><p className="text-slate-300 text-sm leading-relaxed mt-3">An analytics layer processes supported video streams. The intelligence comes from the connected software or edge device; camera replacement is assessed only where compatibility or image quality requires it.</p></figcaption>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
            <Image src="/images/cctv-guard-response.webp" alt="Concept illustration of a control-room operator using a radio to coordinate security guards at a warehouse gate" width={1536} height={1024} sizes="(min-width: 1024px) 50vw, 100vw" className="w-full h-auto" />
            <figcaption className="p-6"><p className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-2">02 / Turn awareness into action</p><h3 className="text-xl font-semibold">AI flags. People verify. Guards respond.</h3><p className="text-slate-300 text-sm leading-relaxed mt-3">A useful alert includes the camera and location. Operators validate the event, contact the site team and record the response, with escalation guided by the agreed site procedure.</p></figcaption>
          </figure>
        </div>

        <ol className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-8" aria-label="CCTV analytics and guard response workflow">
          {steps.map((step, index) => <li key={step.title} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6"><div className="flex items-center justify-between mb-5"><step.icon aria-hidden="true" className="w-7 h-7 text-amber-400" /><span className="text-slate-500 text-sm font-mono">0{index + 1}</span></div><h3 className="font-semibold text-lg mb-3">{step.title}</h3><p className="text-slate-300 text-sm leading-relaxed">{step.text}</p></li>)}
        </ol>

        <div className="grid md:grid-cols-2 gap-8 mt-12 border-t border-slate-800 pt-10">
          <div><h3 className="text-xl font-semibold mb-4">Start with the events that matter to your site</h3><ul className="space-y-3 text-slate-300 text-sm"><li>• Restricted-zone entry and perimeter line crossing</li><li>• Loitering beyond a configured dwell time</li><li>• After-hours movement in selected areas</li><li>• Camera obstruction or video loss, where supported</li></ul></div>
          <div><h3 className="text-xl font-semibold mb-4">Designed around your cameras and your guards</h3><p className="text-slate-300 text-sm leading-relaxed">Begin with a site survey and a pilot on selected cameras. Agree detection rules, operator coverage, guard contacts and escalation steps before wider rollout. Capabilities depend on camera feeds, lighting, network conditions and the selected analytics solution; AI alerts require human review.</p><Link href="/#contact" className="inline-flex items-center gap-2 mt-6 bg-amber-400 text-slate-950 px-5 py-3 rounded-lg font-semibold hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400">Discuss a CCTV upgrade <ArrowRight aria-hidden="true" className="w-4 h-4" /></Link></div>
        </div>
        <p className="text-xs text-slate-400 mt-8">Illustrative concept visuals. Integration, notification channels and response arrangements are configured for each site; no guaranteed detection or response time is implied.</p>
      </div>
    </section>
  );
}
