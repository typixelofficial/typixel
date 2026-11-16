# Security Specification — Typixel Portfolio Firestore Rules

## 1. Data Invariants
1. Default-deny catch-all rule (`/{document=**}`) blocks all unspecified paths.
2. Public visitors may ONLY read published items (`isPublished == true`) in `showcaseItems`, `tools`, `blogPosts`, and single-document `get` on `siteConfig/public` when `isPublished == true`.
3. Only verified Google-authenticated administrators (`isAdmin()` checking `request.auth.token.email_verified == true` and bootstrapped admin emails or `/admins/{uid}`) may create, update, or delete any portfolio document.
4. Every write strictly validates `updatedByUid == request.auth.uid`, `updatedAt == request.time`, exact required & allowed keys (`hasAll` + `hasOnly`), field types, string `.size()` limits, and `isValidId()` path validation.
5. `allow list` rules strictly evaluate `resource.data.isPublished == true || isAdminEmail()` without using `get()` or `exists()` document lookups.
6. Self-promotion in `/admins/{uid}` is strictly blocked unless the user is already a bootstrapped verified admin email.

## 2. Adversarial "Dirty Dozen" Payloads (All Must Return PERMISSION_DENIED)
1. Unauthenticated `create` on `/showcaseItems/test1` -> DENIED
2. Authenticated non-admin (`user@example.com`) `create` on `/showcaseItems/test1` -> DENIED
3. Unverified admin email (`email_verified: false`) `update` on `/showcaseItems/test1` -> DENIED
4. Admin `create` with spoofed `updatedByUid: "other-uid"` -> DENIED
5. Admin `create` with client-supplied `updatedAt` != `request.time` -> DENIED
6. Admin `create` with shadow ghost field (`isVerified: true`) -> DENIED
7. Admin `update` on `/showcaseItems/test1` changing unapproved/extra key or exceeding string size limit (>900000 chars on `imageUrl`) -> DENIED
8. Unauthenticated `list` on `/showcaseItems` without filtering `isPublished == true` -> DENIED
9. Unauthenticated `get` on `/showcaseItems/unpublished_draft` where `isPublished == false` -> DENIED
10. Unauthenticated `list` on `/siteConfig` -> DENIED
11. Non-admin `create` on `/admins/{uid}` attempting self-privilege escalation -> DENIED
12. Path ID poisoning (`create` on `/showcaseItems/invalid id with spaces!`) -> DENIED
