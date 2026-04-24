# Security Specification - Front Window Changer

## Data Invariants
1. A user can only access and modify their own profile, devices, and configs.
2. A config must belong to a valid user.
3. Timestamps (`createdAt`, `updatedAt`) must be server-verified during writes.
4. `uid` and `ownerId` (implicit in path) are immutable.
5. `deviceId` matches the document ID for devices.

## The "Dirty Dozen" Payloads (Red Team)

1. **Identity Spoof**: User A tries to create a profile for User B.
   - `path: /users/userB`, `auth: userA`, `data: { uid: 'userB', email: 'spoof@attacker.com' }`
   - **Expected**: PERMISSION_DENIED.

2. **Privilege Escalation**: User tries to set `isAdmin: true` (if it existed) or modify system-only fields.
   - `path: /users/userA`, `data: { isAdmin: true }`
   - **Expected**: PERMISSION_DENIED (field not in schema/allowed updates).

3. **Orphaned Write**: User tries to create a config for a non-existent user path.
   - `path: /users/nonExistent/configs/config1`
   - **Expected**: PERMISSION_DENIED (path owner check).

4. **Resource Poisoning**: Extremely large string for `name`.
   - `path: /users/userA/configs/config1`, `data: { name: 'A'.repeat(2000) }`
   - **Expected**: PERMISSION_DENIED (size check).

5. **ID Injection**: Document ID containing malicious characters.
   - `path: /users/userA/configs/config<script>alert(1)</script>`
   - **Expected**: PERMISSION_DENIED (regex check).

6. **State Shortcutting**: Skipping `updatedAt` on an update.
   - `path: /users/userA/configs/config1`, `data: { name: 'New Name' }` (no `updatedAt`)
   - **Expected**: PERMISSION_DENIED (required field check).

7. **Timestamp Spoof**: Providing a future timestamp from the client.
   - `path: /users/userA/configs/config1`, `data: { updatedAt: '2099-01-01T00:00:00Z' }`
   - **Expected**: PERMISSION_DENIED (must match `request.time`).

8. **Cross-User Access**: User A tries to list configs for User B.
   - `path: /users/userB/configs`, `auth: userA`
   - **Expected**: PERMISSION_DENIED.

9. **Device Hijack**: User A tries to link a device to User B's account.
   - `path: /users/userB/devices/device1`, `auth: userA`
   - **Expected**: PERMISSION_DENIED.

10. **Ghost Field**: Adding `isVerified: true` to a config.
    - `path: /users/userA/configs/config1`, `data: { name: 'Valid', isVerified: true }`
    - **Expected**: PERMISSION_DENIED (`affectedKeys().hasOnly()` check).

11. **Malicious Device OS**: OS version too long.
    - `path: /users/userA/devices/device1`, `data: { osVersion: 'B'.repeat(500) }`
    - **Expected**: PERMISSION_DENIED.

12. **Anonymous Access**: Trying to read configs without being signed in.
    - `path: /users/userA/configs/config1`, `auth: null`
    - **Expected**: PERMISSION_DENIED.
