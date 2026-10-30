# VISIO AI for the HRMS

VISIO AI appears at `/portal/ai` and `/admin/ai`, with navigation links in both workspaces. It offers built-in product guidance, links to existing forms, published knowledge article search, and scoped pending request counts from the existing database. Personal counts are always bound to the signed-in employee; HR/admin can explicitly choose workspace totals. Managers do not receive HR/admin scope.

## OpenAI activation

Add these **server-side** production environment variables in Netlify project configuration → Environment variables. Never commit a key or put it in a `NEXT_PUBLIC_` variable. Do not send a key through chat.

- `OPENAI_API_KEY`: a project API key from the company's existing OpenAI API account, entered directly by the account owner in the hosting secret field.
- `VISIO_AI_MODEL`: an OpenAI Responses-compatible text model ID available to that API project. Confirm availability in the OpenAI dashboard; no model is hardcoded.
- `VISIO_AI_ENABLED`: `true` after credentials, model, billing and data-sharing configuration have been checked.

Redeploy after changing these variables. Setting `VISIO_AI_ENABLED=false` disables generated responses without removing built-in help. A ChatGPT login or subscription alone is not an API credential.

When enabled, the employee/admin must opt in on the page before a generated question sends anything to OpenAI. Only that question and the matching built-in guidance/published knowledge articles are included. Private employee records, totals, documents, photographs, biometrics, GPS, salaries and credentials are not retrieved for the model. Questions can still contain information entered by the user: do not paste confidential data. Review company-published knowledge articles before enabling external AI processing.

The app uses the AI SDK OpenAI adapter with the Responses API and `store:false`. This disables response-object storage for later API retrieval; it does not promise zero provider retention or change the company's OpenAI contract. See [OpenAI Responses migration](https://developers.openai.com/api/docs/guides/migrate-to-responses) and [API authentication](https://developers.openai.com/api/reference/overview).

## Limits and operations

- Read-only assistant: no tools for approving requests, changing employment records, face punching, payroll payment or sending messages.
- 1–1200 character questions; request body ≤8 KB; 30 questions per user per 15-minute bucket, enforced by a MongoDB atomic quota reservation.
- `visioAIRateLimits` stores user ID, time bucket, counter and expiry only. Its unique index prevents races and its TTL removes expired counters. Chat questions/answers are not stored by this feature; the UI retains at most ten answers in memory and clears them on navigation/reload or Clear conversation.
- Knowledge search uses literal escaped words and only active, unexpired knowledge articles. Sources use application-owned internal links, never links returned by a model.
- OpenAI generation has no retries and an 18-second timeout. Provider failure returns built-in guidance with an explicit notice. A configured key is not proof of account access or billing health.
- Guidance and counts are displayed separately. Counts are snapshots labelled with scope and time; they are not payroll calculations or policy entitlements.

## Acceptance test after activation

1. Sign in as an employee: ask about a face mismatch, leave and pending requests. Confirm the links and personal counts against My requests.
2. Sign in as HR/admin: select Workspace totals and compare against Action inbox. Confirm managers/employees cannot select global scope.
3. Opt in to OpenAI and ask a non-confidential product question. Confirm the response is labelled OpenAI answer and sources open the corresponding form.
4. Disable OpenAI or simulate provider failure in isolated tests: guidance remains available and no success is claimed for generation.

No real attendance, HR approval, offer or payroll action is needed to test this assistant.
