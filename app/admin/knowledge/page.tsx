import Announcements from '@/app/components/Announcements';
import { getSessionUser } from '@/app/lib/apiAuth';
export default async function Page(){const user=await getSessionUser();return user&&['admin','hr'].includes(user.role)?<Announcements knowledge staff/>:<p>HR/admin access required.</p>;}
