# Temporary tester access

Administrators grant 30 days of Pro feature access to existing, confirmed accounts using protected Supabase `app_metadata.tester_access_expires_at`. No Stripe customer, subscription, payment method, or charge is created. Paid subscriptions remain independent and take precedence in the account display.

Dashboard, College Match, Essay Coach, and the roadmap goal-import API use the same expiry rule. The server authenticates goal imports and reads protected app metadata. Missing, invalid, or expired grants do not unlock access. The dashboard displays the expiry date and explains that tester access ends without a charge. Refresh the page after a grant or revocation to update the UI.

Grant only the emails authorized by the owner:

```sh
node --env-file=.env.local scripts/grant-tester-access.cjs tester@example.com
```

The script requires local Supabase URL and service-role credentials. It validates all requested accounts before writes, preserves other app metadata, and reports each successful grant. It sends no email. Do not commit credentials or the tester roster. Re-running renews the grant for 30 days from the run. Revoke by removing `tester_access_expires_at` from that user's app metadata using Supabase admin access, preserving all other fields.

Validation: `node --test tests/access.test.cjs tests/progress.test.cjs` (23 tests), `npx tsc --noEmit`. No tester accounts have been granted access until the owner supplies their account emails and the grant script is run.

## Invitation code

Testers can redeem a private code at `/tester-access` after signing in with a confirmed email. Production stores only its SHA-256 hash in `TESTER_INVITE_SHA256`; `TESTER_INVITE_EXPIRES_AT` closes new redemptions. The code is high entropy, is never committed, and should be shared only with pilot participants. Anyone who receives it can redeem it on a confirmed account before the deadline.

Each successful redemption writes a 30-day expiry and `tester_invite_redeemed_at` to protected app metadata. Re-entry returns the existing expiry; expired/revoked grants cannot renew through the code. Keep the redeemed marker when revoking. Existing paid subscriptions and billing are unchanged. Disabling the invitation does not revoke already-issued grants. Signup/login retain the return path to the invitation page.

Validation additionally covers invalid/expired codes, authentication, confirmed email, cross-origin rejection, metadata preservation, grant duration, repeated redemption and revoked/expired grants. Total: 26 tests.
