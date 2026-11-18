import { getSessionUser } from "@/app/lib/apiAuth";
import { getCollection } from "@/app/lib/db";
import type { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

const reviewCycle = "2026–27";
const states = [
  { id: "GJ", name: "Gujarat", label: "Gujarat PSARA rules and circulars", href: "https://cpahmedabad.gipl.in/ResolutionsandCirculars" },
  { id: "MP", name: "Madhya Pradesh", label: "Madhya Pradesh PSARA service", href: "https://negd.gov.in/isl/Directory/statedata/343" },
  { id: "UP", name: "Uttar Pradesh", label: "UP PSARA rules and training guidance", href: "https://uppolice.gov.in/article/en/-private-security-agency" },
];
const checks = [
  { id: "licence", label: "PSARA licence coverage and renewal", detail: "Check each deployment district against the licence and verify its expiry and renewal submission." },
  { id: "guard-records", label: "Guard verification and training", detail: "Reconcile guard and supervisor records with current site rosters, verification evidence and training certificates." },
  { id: "wages", label: "Wage and overtime records", detail: "Verify the applicable wage notification, effective dates, classification and location for each site. Reconcile shifts, overtime, wage registers and wage slips." },
  { id: "statutory", label: "Statutory deductions and returns", detail: "Check applicability for each establishment. Reconcile payroll deductions, contributions, challans and filing acknowledgements." },
];

type ReviewEvent = {
  _id: ObjectId;
  state: string;
  check: string;
  reviewed: boolean;
  actorId: string;
  actorName: string;
  at: Date;
};

async function requireComplianceStaff() {
  const user = await getSessionUser();
  if (user?.role !== "admin" && user?.role !== "hr") notFound();
  return user;
}

async function recordReview(form: FormData) {
  "use server";
  const user = await requireComplianceStaff();
  const state = states.find(({ id }) => id === form.get("state"));
  const check = checks.find(({ id }) => id === form.get("check"));
  const status = form.get("status");
  if (!state || !check || (status !== "reviewed" && status !== "reopened")) {
    throw new Error("Invalid compliance review");
  }
  const events = await getCollection("complianceReviewEvents");
  await events.insertOne({
    cycle: reviewCycle,
    state: state.id,
    check: check.id,
    reviewed: status === "reviewed",
    actorId: user.id,
    actorName: user.name || "HR staff",
    at: new Date(),
  });
  revalidatePath("/admin/compliance");
}

const salaryTdsDeadlines = [
  ["Q1", "April–June 2026", "31 July 2026"],
  ["Q2", "July–September 2026", "31 October 2026"],
  ["Q3", "October–December 2026", "31 January 2027"],
  ["Q4", "January–March 2027", "31 May 2027"],
];

const references = [
  {
    title: "Salary TDS transition",
    description: "Keep prior-year salary declarations and certificates with their original tax year. Use the new Act references for salary withholding from April 2026.",
    label: "Income Tax Department TDS FAQs",
    href: "https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/%20tds%20compliance-faq",
  },
  {
    title: "Labour codes and registers",
    description: "Use the Ministry’s employer handbook and rules to review payroll, wage, attendance and statutory records for each establishment.",
    label: "Ministry of Labour and Employment",
    href: "https://www.labour.gov.in/offerings/schemes-and-services/details/labour-codes-gzNzQzMtQWa",
  },
  {
    title: "Security agency licences and training",
    description: "Review licensing, guard and supervisor training, verification and register requirements against the rules of each operating state or union territory.",
    label: "Ministry of Home Affairs PSARA resources",
    href: "https://www.mha.gov.in/police-modernisation-division",
  },
];

export default async function CompliancePage() {
  await requireComplianceStaff();
  const events = await getCollection("complianceReviewEvents");
  const [currentReviews, recentReviews] = await Promise.all([
    events.aggregate<ReviewEvent>([
      { $match: { cycle: reviewCycle } },
      { $sort: { at: -1, _id: -1 } },
      { $group: { _id: { state: "$state", check: "$check" }, event: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$event" } },
    ]).toArray(),
    events.find<ReviewEvent>({ cycle: reviewCycle }).sort({ at: -1, _id: -1 }).limit(12).toArray(),
  ]);
  const current = new Map(currentReviews.map((event) => [event.state + "/" + event.check, event]));
  const formatDate = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Compliance</h1>
        <p>Find official filing guidance and baseline deadlines for payroll and guard operations.</p>
      </header>
      <section className="space-y-4" aria-labelledby="state-reviews">
        <div>
          <h2 id="state-reviews" className="text-xl font-semibold">State reviews · {reviewCycle}</h2>
          <p className="mt-1 text-sm">Review the supporting records for every applicable site before marking a check as reviewed. Keep the underlying evidence with the establishment’s records.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {states.map((state) => (
            <article key={state.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="text-lg font-semibold">{state.name}</h3>
              <a className="text-sm underline underline-offset-4" href={state.href}>{state.label}</a>
              <ul className="mt-3 divide-y divide-gray-200">
                {checks.map((check) => {
                  const event = current.get(state.id + "/" + check.id);
                  return (
                    <li key={check.id} className="space-y-2 py-3">
                      <h4 className="font-medium">{check.label}</h4>
                      <p className="text-sm">{check.detail}</p>
                      <p className="text-sm font-medium">{event?.reviewed ? "Reviewed" : "Review pending"}</p>
                      {event && <p className="text-sm">{event.actorName} · {formatDate.format(event.at)}</p>}
                      <form action={recordReview}>
                        <input type="hidden" name="state" value={state.id} />
                        <input type="hidden" name="check" value={check.id} />
                        <button
                          className="min-h-11 rounded-md border border-gray-300 px-3 text-sm font-medium hover:bg-gray-100"
                          name="status"
                          value={event?.reviewed ? "reopened" : "reviewed"}
                          aria-label={(event?.reviewed ? "Reopen " : "Mark reviewed: ") + state.name + " " + check.label}
                        >{event?.reviewed ? "Reopen review" : "Mark reviewed"}</button>
                      </form>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 sm:p-6" aria-labelledby="recent-reviews">
        <h2 id="recent-reviews" className="text-xl font-semibold">Recent review activity</h2>
        {recentReviews.length ? (
          <ul className="space-y-2 text-sm">
            {recentReviews.map((event) => (
              <li key={String(event._id)}>
                {formatDate.format(event.at)} · {event.actorName} {event.reviewed ? "marked reviewed" : "reopened"} {checks.find(({ id }) => id === event.check)?.label} · {states.find(({ id }) => id === event.state)?.name}
              </li>
            ))}
          </ul>
        ) : <p className="text-sm">No state reviews recorded yet.</p>}
      </section>
      <section className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-6" aria-labelledby="salary-tds">
        <h2 id="salary-tds" className="text-xl font-semibold">Salary TDS · Tax Year 2026–27</h2>
        <p>Form 138 is the quarterly salary TDS statement for this tax year. Check the filing portal for any extensions before using these standard deadlines.</p>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {salaryTdsDeadlines.map(([quarter, period, due]) => (
            <div key={quarter} className="rounded-lg bg-gray-50 p-3">
              <dt className="text-sm">{quarter} · {period}</dt>
              <dd className="mt-1 font-semibold">{due}</dd>
            </div>
          ))}
        </dl>
        <a className="inline-block underline underline-offset-4" href="https://www.incometax.gov.in/iec/foportal/newformpage/forms/form138-um">
          Form 138 filing manual
        </a>
      </section>
      <section className="space-y-3" aria-labelledby="references">
        <h2 id="references" className="text-xl font-semibold">Official references</h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {references.map(({ title, description, label, href }) => (
            <li key={title} className="space-y-2 rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm">{description}</p>
              <a className="inline-block text-sm underline underline-offset-4" href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
