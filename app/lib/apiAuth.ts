// app/lib/apiAuth.ts
// Server-side helpers for API routes to enforce RBAC beyond the coarse middleware gate.
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { getCollection } from "@/app/lib/db";
import { hasPermission, type Permission, type Role } from "@/app/lib/rbac";

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: Role;
  employeeId?: string | null;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  return (session?.user as SessionUser) ?? null;
}

type PermissionResult =
  | { ok: true; user: SessionUser }
  | { ok: false; status: number; error: string };

// Returns { ok:true, user } when allowed, otherwise a ready-to-return error shape.
export async function requirePermission(permission: Permission): Promise<PermissionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, status: 401, error: "Unauthorized" };
  if (user.role === "hr" && (permission === "attendance:read:self" || permission === "attendance:write:self")
      && user.employeeId && ObjectId.isValid(user.id)) {
    // HR self-attendance must be explicitly enabled for the linked employee.
    // Read the current account so a stale session cannot use an old link.
    const accounts = await getCollection("users");
    const account = await accounts.findOne({
      _id: new ObjectId(user.id),
      role: "hr",
      active: { $ne: false },
      employeeId: user.employeeId,
      selfAttendanceEmployeeId: user.employeeId,
    }, { projection: { _id: 1 } });
    if (account) return { ok: true, user };
  }
  if (!hasPermission(user.role, permission)) {
    return { ok: false, status: 403, error: "Forbidden" };
  }
  return { ok: true, user };
}

// Stricter than a permission check: only the `admin` role passes. Used for
// account administration (user management) which HR must not access.
export async function requireAdmin(): Promise<PermissionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, status: 401, error: "Unauthorized" };
  if (user.role !== "admin") return { ok: false, status: 403, error: "Forbidden" };
  return { ok: true, user };
}
