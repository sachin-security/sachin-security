import RecruitmentWorkspace from '@/app/components/RecruitmentWorkspace';
import { getSessionUser } from '@/app/lib/apiAuth';
export default async function Page(){const user=await getSessionUser();return user&&['admin','hr'].includes(user.role)?<RecruitmentWorkspace/>:<p>HR/admin access required.</p>;}
