import WorkspaceRequests from '@/app/components/WorkspaceRequests';
import { getSessionUser } from '@/app/lib/apiAuth';
export default async function ApprovalsPage() {
  const user = await getSessionUser();
  if (!user || !['admin', 'hr'].includes(user.role)) return <p className="p-6">This inbox is available to HR and administrators.</p>;
  return <WorkspaceRequests staff />;
}
