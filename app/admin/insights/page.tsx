import WorkforceInsights from '@/app/components/WorkforceInsights';
import { getSessionUser } from '@/app/lib/apiAuth';
export default async function Page() { const user = await getSessionUser(); return user && ['admin','hr'].includes(user.role) ? <WorkforceInsights /> : <p>HR/admin access required.</p>; }
