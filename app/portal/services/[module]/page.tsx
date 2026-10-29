import ServiceWorkspace from '@/app/components/ServiceWorkspace';
import { getServiceModule } from '@/app/lib/serviceModules';
import { notFound } from 'next/navigation';
export default async function Page({ params }: { params: Promise<{ module: string }> }) { const { module } = await params; if (!getServiceModule(module)) notFound(); return <ServiceWorkspace key={module} moduleKey={module} />; }
