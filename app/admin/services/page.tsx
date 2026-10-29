import ServiceHub from '@/app/components/ServiceHub';
import { getSessionUser } from '@/app/lib/apiAuth';
export default async function Page() { const user = await getSessionUser(); return user && ['admin','hr'].includes(user.role) ? <ServiceHub staff /> : <p>HR/admin access required.</p>; }
