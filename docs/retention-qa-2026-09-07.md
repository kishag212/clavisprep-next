# Clavis Prep retention QA — September 7, 2026

Release status: Atomic roadmap live stale-save gate PASSED. Authentication, persistence, and two-account UI isolation checks passed. Application remains undeployed per user instruction; deployed callback/progress smoke checks remain a post-release requirement. This is not a comprehensive security penetration test.

## Scope and evidence

- Production-source checks: 18 regression tests passed with `node --test tests/progress.test.cjs`.
- Targeted ESLint passed with no warnings; production `npm run build` passed, including TypeScript.
- Browser functional checks used an isolated Next.js copy at localhost:3019 with the real progress UI/API and a synthetic, in-memory Supabase query adapter. No production credentials or real accounts were used in that fixture. Reload persistence here proves the UI/API flow, not live Supabase durability or RLS.
- After user approval, added the exact Supabase redirect `http://localhost:3017/auth/callback?next=%2Fprogress`. Google sign-in now returns to localhost:3017/progress successfully. The missing `student_context` column was confirmed by PostgreSQL 42703 and fixed by applying the existing migration with explicit approval; Supabase reported success.
- Real-account checks passed: authenticated plan loading; setup saved with existing grade/interests and the displayed 45-minute budget; a private synthetic journal entry saved and appeared after navigation in Organizer; family digest excluded it; removal in Organizer persisted when progress was reopened. The QA entry was removed. Existing roadmap activities appeared in the weekly plan. Cross-account RLS isolation and roadmap completion writes were not exercised against production.

## Defects fixed

1. Postponed weekly journal/reflection tasks disappeared at the next week boundary. Retain the original task identity until completion or resumption.
2. Account switching could leave stale plan data visible and potentially submit a previous account's form under a new account at the same revision. Bind saves to the loaded owner, invalidate stale responses, and clear data on session changes.
3. A saved $0 college cost appeared as unknown. Preserve an explicit known-cost flag and distinguish zero from missing information.
4. Task-to-journal navigation could change the hash without updating the selected panel. Use native hash navigation for that link.
5. Weekly planning minutes overwrote the student's activity availability. Store planning time separately and preserve activity hours.
6. A misplaced root authentication return had no callback handoff; failed callbacks targeted a missing error page. Added root-to-callback routing, safe local return-path validation, and a recovery page. Verified the root redirect with a dummy code. Inspected Supabase and added the missing exact localhost callback with user approval; live Google return now works.
7. Page title repeated the brand. Removed the duplicate.
8. Added bounded fetch timeouts and a clipboard fallback for digest export.

## Browser checks

| Scenario | Result |
| --- | --- |
| Grade/interests onboarding | Passed in isolated fixture |
| Complete a weekly step with reflection | Passed in isolated fixture |
| Reload and retain completed step | Passed in isolated fixture |
| Add journal entry; private by default | Passed in isolated fixture |
| Select a journal title for the family digest | Passed in isolated fixture |
| Digest excludes private reflection/body | Passed in browser and downloaded file |
| Create and edit college comparison | Passed in isolated fixture |
| Record $0 as a known annual cost | Passed after fix |
| Change grade to 12th and budget to 15 minutes | Passed; senior tasks total 15 minutes |
| Reschedule recurring task and bring it back | Passed in isolated fixture |
| Navigate from weekly task to journal | Passed after fix |
| Desktop and 390 × 844 phone layout | Inspected weekly plan and family digest; readable and usable |
| Download digest | File verified in Downloads; browser download-event listener did not report the event |
| Copy digest | Browser reported successful clipboard copy |
| Live Google sign-in back to localhost | Passed after authorized redirect configuration change |
| Live authenticated progress load | Passed after approved migration |
| Live setup save and persistence | Passed |
| Live private journal save and Organizer synchronization | Passed |
| Live family digest excludes private entry | Passed |
| QA entry removal persists in progress | Passed |

The browser viewport override was reset after testing.

## Remaining release gate

The existing `supabase/migrations/20260815_add_student_context.sql` was applied with explicit approval, and real-account save/reload and Organizer cross-view checks passed. The redirect configuration was saved with explicit approval; the production Site URL and callback were preserved. No production application deployment was made. Server diagnostics report error codes and schema errors without logging student records or authentication tokens. A second-account RLS check and live roadmap completion write remain unverified.

After successful real-account tests, verify the deployed callback and progress route after release before inviting pilot families. Existing unrelated workspace edits were preserved.

## Follow-up QA

- Fixed roadmap task saving so an empty update result, database error, or network exception cannot report successful completion. The UI changes only after a confirmed write. Added a regression test covering all three failures and success.
- Added accessible names to Organizer delete controls.
- Re-ran 18 regression tests, targeted lint, and the production build: all passed.
- Live browser access timed out on three consecutive attempts, including browser inventory. No live policy query was executed and account isolation is not certified. Prepared `docs/retention-policy-audit.sql`, a read-only metadata query that does not select student records or change policies.
- Concurrent roadmap edits in separate tabs remain a review item: the legacy task save replaces the monthly tasks array without a revision check. Progress/Organizer saves already enforce revisions.

## Live policy audit — connection restored

Executed a read-only query against pg_class, pg_namespace, and pg_policies in the ClavisPrep production project. No student records were selected and no database permissions were changed.

- `user_profiles`: RLS enabled; four policies cover SELECT, INSERT, UPDATE, DELETE. Every applicable predicate is `auth.uid() = user_id`; policies target public.
- `roadmap_activities`: RLS enabled; four policies cover SELECT, INSERT, UPDATE, DELETE. Every applicable predicate is `auth.uid() = user_id`; policies target authenticated.
- INSERT uses an explicit ownership WITH CHECK. UPDATE policies specify ownership USING and omit an explicit WITH CHECK.
- No additional unrestricted policy appeared in the complete eight-row result for these two tables.
- Configuration review passed. This is not a live two-account browser test, which remains unperformed. Prior browser timeout blocker is resolved.

## Live end-to-end follow-up

- Saved `QA E2E account A sentinel` with a private synthetic body; it loaded in a new tab. This single test entry remains temporarily for the pending isolation test.
- Loaded two tabs at the same revision, then changed title-sharing in one. The older tab's journal save was rejected with the conflict message. The new draft did not enter saved data; reload showed the one original entry and the newer sharing state.
- Family digest included only the explicitly selected title and excluded the private body. Restored the marker to private and confirmed save.
- Chrome was using the original account, not a second identity. Signed Chrome out and verified direct /progress access shows the sign-in prompt with no saved content.
- Left Chrome at /login?next=/progress awaiting user sign-in to a different test account. The in-app session was left in place. Two-account isolation is still pending; do not label it passed.

## Two-account test in progress

Confirmed a different account in Chrome using the dashboard account identity. Account B's Organizer portfolio was empty and did not contain A's sentinel. Restored A's session after prior global sign-out; its sentinel remained saved and private. Thus A-to-B read isolation passed through the UI.

Automatic approval review rejected submitting B's default onboarding values as an unapproved persistent account mutation. Did not retry or bypass the block. Staged (not saved) an alternative narrowly scoped portfolio marker, `QA E2E account B sentinel`, dated 2026-09-07, category Activity, body `Synthetic isolation test entry.` Awaiting explicit approval to save it, verify reverse isolation, and remove the QA markers. B's setup remains unchanged.

## Two-account test completed

User explicitly approved saving B's synthetic marker and deleting both test markers. The first B save exposed a real new-profile defect: PostgreSQL 23502, required location missing. Read-only schema inspection confirmed legacy required text columns. Fixed the progress insert to supply blank location, GPA, target schools, and extracurriculars until provided by the student; updates do not overwrite these existing fields. Regression query double now enforces the production non-null insert requirements.

After the fix, B's portfolio entry saved and persisted after reload. A's fresh journal contained only A's marker; B's fresh portfolio contained only B's marker. Deleting B's marker left A's marker intact. Deleted A's marker next. Fresh views confirmed both accounts have zero journal/portfolio entries. Both synthetic markers are removed. B's weekly-plan onboarding was not submitted; its new profile exists as required for Organizer persistence.

Validation: all 18 regression tests passed, including production-required field checks; targeted lint passed; production build passed. Bidirectional isolation passed through normal app UI with two distinct authenticated accounts. Forged cross-owner database requests were not exercised.

## Atomic roadmap saves prepared

Prepared `supabase/migrations/20260907_atomic_roadmap_save.sql` and updated roadmap task saving to call it. The function atomically compares the stored task JSON with the client-loaded task JSON before replacing it. A stale update returns false. It requires the loaded owner ID to match auth.uid(), runs as SECURITY INVOKER, and retains table RLS and grants. Task JSON travels in the request body rather than URL filters.

The UI changes only on true and displays an explicit reload message for stale/account-changed results. Regression coverage verifies the expected snapshot and owner are passed, and verifies success, false, database errors, and network failures. All 18 regression tests and targeted lint pass. The SQL function has not been installed or tested in a live database; no local PostgreSQL runtime is available. The browser connection timed out when opening the schema inspection page.

Deployment prerequisite: apply the migration, then run the live concurrent-tab test. Until then the local roadmap's new save call will fail safely because the function is absent; there is no unsafe fallback.

## Migration handoff result

User reported “Success” after running the supplied atomic roadmap migration in Supabase. Treat the migration as user-confirmed applied; installation has not yet been independently inspected. Live two-tab verification remains blocked because browser inventory continues to time out before returning any tabs. No live concurrency pass is claimed.

## Live stale-save retry — September 7, 2026

User requested the live two-tab stale-save test and explicitly prohibited deployment. Browser inventory initially succeeded. Opened `http://localhost:3017/roadmap` in Chrome; the authenticated session displayed the initial “When should we start?” picker, with no existing roadmap. This is consistent with the newer test account described above; account identity was not independently rechecked during this attempt. Did not generate a roadmap or submit setup values.

Attempted to reach the original account's preserved in-app session, but navigation timed out. Tab inventory found the attempted roadmap tab; selecting it also timed out. Attempted Chrome's previously approved `/login?next=/progress` flow to restore access to the existing roadmap, but both navigation and the subsequent page-state read timed out.

Result: BLOCKED by browser control timeouts before either competing save. No roadmap writes, profile changes, migration changes, or deployment were performed. The migration remains user-confirmed applied, and the live atomic-save test remains unverified. Resume with a responsive authenticated account that already has roadmap tasks; load the same month in two tabs, save one change, verify the older tab's competing save is rejected with the reload message, then reload to confirm the first change survived and restore the test changes.

## Local loading recovery

After the user reported that the roadmap would not load, confirmed the local Next.js process was listening on port 3017 but returned no HTTP response within 15 seconds. Its log contained `write EPIPE` uncaught exceptions. Stopped the unresponsive process; a fresh Turbopack development server also stalled compiling `/roadmap`. Restarted using the documented `npm run dev -- --port 3017 --webpack` option. The roadmap then returned HTTP 200, and a fresh in-app browser tab loaded the existing authenticated roadmap with six months and 27 tasks (zero complete). Kept that tab open for continuation. This is a local development runtime workaround; no application source changes, account writes, or deployment were made. Live stale-save verification is still pending.

## Live two-tab atomic roadmap test — PASSED

Ran against the real Supabase-backed local app at `http://localhost:3017/roadmap`, using two in-app browser tabs with the same authenticated account and the same initial May 2026 roadmap state. No mock adapter was used.

1. Recorded the first task's baseline (`completed: false`, no status/outcome) and the entire month's task-list checksum using a scoped read-only database query. Both tabs displayed zero of 27 tasks complete.
2. In tab 1, completed the first May task with the synthetic reflection `QA atomic roadmap 2026-09-07 tab 1 — synthetic completion; restore after test.` The feedback dialog closed, progress changed to one of 27, and the first task showed “Mark incomplete.”
3. Without reloading tab 2, attempted to complete the second task in the same month with a distinct synthetic reflection. The app rejected the save with: “Your roadmap changed in another tab or account. Reload before saving again. Your update was not saved.” The dialog remained open with the draft intact; no success state was shown.
4. Cancelled the rejected draft and reloaded tab 2. The first task remained complete and the second remained incomplete. A scoped database read independently confirmed the first synthetic reflection persisted and the second task had no saved reflection.
5. Restored the first task through a narrowly scoped database update, guarded by the exact row ID, synthetic marker, and a check that the proposed restoration matched the full pre-test task-list checksum. The update returned one row with `restored_exactly: true`. This removed the synthetic outcome/status and restored `completed: false`; it did not merely toggle the checkbox while leaving QA metadata behind.
6. Reloaded the original browser tab and confirmed zero of 27 tasks complete, zero of seven in May, and both tested tasks available to complete. Closed the temporary second tab and SQL tab; retained the restored roadmap tab.

Result: confirmed successful live atomic write, stale monthly-array rejection, preservation of the winning write across reload, and exact task-list cleanup. The atomic roadmap migration is now functionally verified. No source changes or deployment occurred during this test. Existing broader limitations still apply: forged cross-owner requests and a simultaneous-load stress test were not exercised; this was a deliberate stale-snapshot two-tab test.

## Final retention release review

Reviewed the retention API, shared progress hook, planning/digest logic, validation, Organizer integration, authentication return helper, and roadmap save changes. The atomic task-save behavior remains unchanged from the successful live test.

Found and fixed a separate roadmap profile-form gap: its save-time database read supplied a fresh timestamp, allowing an older open form to overwrite a newer profile edit. The page now records the account that loaded the form, rejects a different signed-in account before writing, and compares profile existence and timestamp against the originally loaded profile before applying the existing conditional write. New-profile creation in another tab and profile deletion also reject the stale form. Existing planner context remains preserved.

Added a regression covering stale timestamps, account switching, profile creation/deletion, unchanged profiles, and initial profile creation. It exercises the production profile-save function and verifies rejected cases make no write, while allowed updates preserve planner context and retain the timestamp predicate.

Final validation after this fix:

- `node --test tests/progress.test.cjs`: 19 passed, zero failed. The logged synthetic database error is from the intentional failed-write test.
- Targeted ESLint with `--max-warnings 0`: passed for the retention API/UI, Organizer, roadmap, callback/error page, shared retention libraries/hook, and proxy.
- `npm run build -- --webpack`: passed, including TypeScript and generation of all 42 static pages. Webpack was selected because of the documented local Turbopack stall; this does not certify the default Turbopack build path.
- `git diff --check`: passed.

The new profile-form guards have local regression coverage, not a repeated live profile-mutation test. Existing marketing/SEO workspace changes were preserved and are outside this focused retention review. New retention files and the migration are still untracked in the workspace and must be included in any eventual release commit. No commit, push, account mutation, database migration, or deployment occurred during this review. Deployment remains paused by user instruction; deployed sign-in/callback and progress smoke checks remain required after an authorized release.

## Live profile-form stale-save test — PASSED

Loaded the existing account's profile in two local app tabs after the guard fix. Recorded a full profile checksum and a separate `progress_v1` checksum before writing. Both forms loaded the same original profile.

- Tab 1 saved a synthetic Recent win marker and returned to the roadmap, which displayed it. Did not regenerate recommendations.
- Tab 2 attempted a distinct Recent win marker without reloading. It stayed on the edit form and displayed “Your profile changed in another tab. Reload before saving again. Your update was not saved.”
- Reloading tab 2 showed tab 1's marker. A scoped database read confirmed only the winning marker was saved and the planner checksum was unchanged.
- Restored the original context and timestamp using a row-scoped update guarded by the synthetic marker and the checksum of the proposed full-profile restoration. The database returned one row with `restored_exactly: true`, matching the full original profile checksum. Synthetic markers and default fields added by the form were removed as part of that exact restoration.

The live profile stale-form gate now passes in addition to the earlier atomic roadmap task gate. Account-switch guards retain local regression coverage; this test did not switch accounts. No deployment or roadmap regeneration occurred.

## Retention release package

Prepared the 19 retention files on `codex/retention-release-qa`, excluding unrelated marketing/SEO changes. Exported the staged Git index into an isolated temporary directory and validated that exact source tree with the installed dependencies and existing local environment configuration (neither dependencies nor environment secrets are included in the commit).

- All 19 regression tests passed in the isolated release tree.
- Targeted retention ESLint passed with zero warnings.
- `npm run build -- --webpack` passed, including TypeScript and 39 generated static pages. The earlier 42-page result included unrelated, uncommitted site additions; this 39-page result is the retention-only package.
- Staged whitespace checks passed. Both live stale-save gates and exact cleanup are documented above.

Package is ready for a local release commit. No push or deployment is authorized. Post-deployment callback/sign-in and progress smoke tests remain required before pilot invitations.
