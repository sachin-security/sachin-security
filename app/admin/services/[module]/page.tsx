import ServiceWorkspace from '@/app/components/ServiceWorkspace';
import { getServiceModule } from '@/app/lib/serviceModules';
import { getSessionUser } from '@/app/lib/apiAuth';
import { notFound } from 'next/navigation';
export default async function Page({ params }: { params: Promise<{ module: string }> }) { const user = await getSessionUser(); if (!user || !['admin','hr'].includes(user.role)) return <p>HR/admin access required.</p>; const { module } = await params; if (!getServiceModule(module)) notFound(); return <ServiceWorkspace key={module} moduleKey={module} staff />; }
