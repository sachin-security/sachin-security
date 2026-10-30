import { SERVICE_MODULES } from './serviceModules';
import type { Role } from './rbac';

export type AIResource = { id: string; title: string; text: string; href: string };
export const canUseStaffAI = (role: Role) => role === 'admin' || role === 'hr';
export function aiResources(role: Role): AIResource[] {
  const staff = canUseStaffAI(role), root = staff ? '/admin' : '/portal';
  return [
    { id: 'attendance', title: 'Attendance and face verification', text: 'Employees open Attendance, give face-processing consent, allow camera and location, complete the live challenge and submit the punch. Camera permission alone is not attendance. For a face mismatch, submit a clearer reference photo from My profile and wait for HR review. Do not bypass verification or submit another person’s face. A missed punch can be raised as an attendance correction for HR review.', href: staff ? '/admin/attendance' : '/portal/attendance' },
    { id: 'photo', title: 'Update my photograph', text: 'Open My profile and use the photo update option. Submit a clear front-facing JPG or PNG, up to 5 MB. HR must approve the new photograph before it becomes the face-verification reference. HR reviewers cannot approve their own photo change.', href: '/portal/profile' },
    { id: 'leave', title: 'Leave and holidays', text: 'Employees use Leave to see their recorded balances and submit dates, leave type and reason. Approval depends on HR and company policy. This assistant cannot promise a balance or approve leave.', href: `${root}/leave` },
    { id: 'requests', title: staff ? 'HR action inbox' : 'My requests', text: staff ? 'Use Action inbox to review pending leave, photo, incident and service records. Open the original record and review evidence before making a decision. This assistant does not approve requests.' : 'Use My requests to view your leave, photo, incident and HR service statuses. Open the original request for its comments and decision history.', href: staff ? '/admin/approvals' : '/portal/requests' },
    { id: 'duty', title: staff ? 'Guard operations' : 'My duty', text: staff ? 'Guard operations lets HR/admin assign dated duties to existing employees and review incident reports. Check site, times and conflicts before assigning. It is not continuous GPS monitoring.' : 'My duty shows your upcoming assigned shifts, site details and available supervisor/company contacts. Submit incident reports here. For an urgent safety problem call your supervisor or company assistance; this assistant does not dispatch help.', href: staff ? '/admin/guard-operations' : '/portal/duty' },
    { id: 'documents', title: 'Documents', text: 'Open Documents for the records available to your account. Never paste Aadhaar numbers, banking information, passwords or private documents into an AI question.', href: `${root}/documents` },
    { id: 'knowledge', title: 'Company knowledge base', text: 'Read the published company knowledge articles for approved guidance. If a policy is not published, ask HR. Do not assume statutory rules, payroll deductions or leave entitlements.', href: `${root}/knowledge` },
    ...SERVICE_MODULES.map(module => ({ id: module.key, title: module.title, text: `${module.description} ${module.note} ${module.staffCreates ? 'HR/admin assigns these tasks; employees submit evidence or completion for review.' : 'Open this form, complete its required fields and submit for HR review.'}`, href: `${root}/services/${module.key}` })),
    ...(staff ? [
      { id: 'insights', title: 'Workforce insights', text: 'Open Workforce insights for saved site workforce counts, attendance statuses, request totals and payslip snapshots. These are saved records, not real-time guard tracking or confirmed bank payments.', href: '/admin/insights' },
      { id: 'recruitment', title: 'Recruitment', text: 'Review existing candidates, internal interview schedules, feedback and offer drafts. Offers are internal drafts. Hiring decisions and employee enrollment remain authorised human actions.', href: '/admin/recruitment' },
    ] : []),
    ...(role === 'admin' ? [{ id: 'users', title: 'User access', text: 'Use User management to maintain accounts and roles. Verify the person and intended access before making changes. Never share a password with the assistant.', href: '/admin/users' }] : []),
  ];
}
export function selectAIResources(question: string, resources: AIResource[]) {
  const stopWords = new Set(['how','what','where','when','can','the','and','for','this','that','please','show','does','with','have','from']);
  const terms = (question.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) || []).filter(term=>!stopWords.has(term));
  const synonyms: Record<string, string[]> = { photo: ['face mismatch','photograph','photo','फोटो','चेहरा'], attendance: ['punch','attendance','camera','gps','हाजिरी','उपस्थिति'], leave: ['leave','holiday','छुट्टी'], duty: ['shift','roster','duty','ड्यूटी'], requests: ['pending','request','inbox','status','लंबित'], insights: ['summary','dashboard','report','overview'], helpdesk: ['help','support','मदद'] };
  return resources.map(resource => ({ resource, score: terms.reduce((sum, term) => sum + (resource.title.toLowerCase().includes(term) ? 5 : resource.text.toLowerCase().includes(term) ? 1 : 0), 0) + (synonyms[resource.id]?.some(word => question.toLowerCase().includes(word)) ? 15 : 0) })).filter(item => item.score > 0).sort((a,b) => b.score-a.score).slice(0,3).map(item => item.resource);
}
