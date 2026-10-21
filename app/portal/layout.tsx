import { auth } from '@/auth';
import PortalNav from './PortalNav';
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return <div className="hrms-ui hrms-portal"><a href="#employee-content" className="hrms-skip">Skip to workspace</a><PortalNav name={session?.user?.name || 'Employee'} /><main id="employee-content" className="hrms-portal-content"><div className="hrms-content">{children}</div></main><footer className="hrms-app-footer max-w-7xl mx-auto"><span>Sachin Security Services Pvt. Ltd.</span><span>Your everyday employee workspace.</span></footer></div>;
}
