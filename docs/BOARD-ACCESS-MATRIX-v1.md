# Dementor Club Board — Access Matrix v1

Status: canonical target model for `/workspace/board/`.

The Board user-state source of truth is `community/board/board-user-state-v2.js`.
Permissions should be monotonic where possible: progressing toward membership must not remove capabilities the user already had as an authenticated Guest.

## User states

1. `UNAUTHENTICATED`
2. `AUTHENTICATED_GUEST_DC9_INCOMPLETE`
3. `AUTHENTICATED_GUEST_DC9_COMPLETE`
4. `APPLICANT`
5. `MEMBER_NOT_ACTIVATED`
6. `MEMBER_ACTIVATED`
7. `DEMENTOR`
8. `OWNER_ADMIN`

## Board capability matrix

| Capability | 1. Unauthenticated | 2. Guest / DC-9 incomplete | 3. Guest / DC-9 complete | 4. Applicant | 5. Member / not activated | 6. Member / activated | 7. Dementor | 8. Owner Admin |
|---|---|---|---|---|---|---|---|---|
| Open Board | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| See live artifacts | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Pan / zoom spatial Board | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Open / enlarge artifact | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Follow artifact external link | No | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| React / `Интересно` | No | Yes | Yes | Yes | Target: Yes | Yes | Yes | Yes |
| Respond to artifact | No | Yes | Yes | Yes | Target: Yes | Yes | Yes | Yes |
| See `Создать` CTA | No | Yes, gated | Yes, gated | Yes, gated | Yes | Yes | Yes | Yes |
| Create artifact | No | No | No | No | Yes: first artifact | Yes, if slot available | Yes, if slot available | Yes |
| Move own artifact | No | No | No | No | No until first publish | Yes | Yes | Yes |
| Move someone else's artifact | No | No | No | No | No | No | No by role alone | Target: Yes |
| Close / archive own artifact | No | No | No | No | After own artifact exists | Yes | Yes | Yes |
| Close / moderate someone else's artifact | No | No | No | No | No | No | No by role alone | Target: Yes |
| Change Board layout / platform objects | No | No | No | No | No | No by role alone | No by role alone | Target: Yes |

## Guest create gate

The create control stays visible for states 2–4 but never opens the composer.

- State 2: explain that DC-9 must be completed and a club application submitted. Primary CTA goes to `/join/`.
- State 3: explain that DC-9 is complete and an application must be submitted. Primary CTA goes to `/join/apply/`.
- State 4: explain that the application is already being reviewed and creation unlocks only after membership is accepted. Primary CTA goes to application status.

## Guest interactions

States 2–4 are not passive readers.

- They can use the same spatial Board surface: pan, zoom, focus and open artifacts.
- `Интересно` is stored separately in `dc_guest_board_interests`; it does not convert the Guest into a Member reaction record.
- `Откликнуться` writes a normal artifact response owned by the authenticated profile, through a Guest-only RLS path and a `SECURITY INVOKER` RPC wrapper.
- They cannot create, move, close or moderate artifacts.

## Known access-model gaps after Guest patch

1. `MEMBER_NOT_ACTIVATED` currently has a legacy activation gate that blocks reactions/responses until the first artifact. This conflicts with the monotonic-permissions rule now that Guests can react/respond. It should be converted from a hard permission gate into onboarding emphasis only.
2. `OWNER_ADMIN` is correctly detected as a state, but global Board moderation (move/close any artifact, layout administration) is not yet fully wired in the current Board UI. These capabilities are target permissions, not claimed as implemented by the Guest patch.

## Invariant

A Board role controls permissions. UI visibility alone is never authorization. Database policies/functions remain the enforcement layer for writes.
