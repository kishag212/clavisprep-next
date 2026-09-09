# Temporary tester access

Administrators grant 30 days of Pro feature access to existing, confirmed accounts using protected Supabase `app_metadata.tester_access_expires_at`. No Stripe customer, subscription, payment method, or charge is created. Paid subscriptions remain independent and take precedence in the account display.

Dashboard, College Match, Essay Coach, and the roadmap goal-import API use the same expiry rule. The server authenticates goal imports and reads protected app metadata. Missing, invalid, or expired grants do not unlock access. The dashboard displays the expiry date and explains that tester access ends without a charge. Refresh the page after a grant or revocation to update the UI.

Grant only the emails authorized by the owner:

```sh
node --env-file=.env.local scripts/grant-tester-access.cjs tester@example.com
```

The script requires local Supabase URL and service-role credentials. It validates all requested accounts before writes, preserves other app metadata, and reports each successful grant. It sends no email. Do not commit credentials or the tester roster. Re-running renews the grant for 30 days from the run. Revoke by removing `tester_access_expires_at` from that user's app metadata using Supabase admin access, preserving all other fields.

Validation: `node --test tests/access.test.cjs tests/progress.test.cjs` (23 tests), `npx tsc --noEmit`. No tester accounts have been granted access until the owner supplies their account emails and the grant script is run.
