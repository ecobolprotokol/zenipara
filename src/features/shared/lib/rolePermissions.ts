/**
 * RBAC utilities untuk role hierarchy dan access control.
 *
 * 5 role final:
 *   super_admin  — akses penuh lintas satuan
 *   admin_satuan — kelola satuan sendiri
 *   komandan     — komando operasional satuan
 *   staff_satuan — operasional harian satuan
 *   prajurit     — user akhir satuan
 */

import type { User, CommandLevel } from '@/types';

export const APP_ROUTE_PATHS = {
  root: '/',
  login: '/login',
  register: '/register/:token',
  forceChangePin: '/force-change-pin',
  error: '/error',
} as const;

export const KNOWN_ROLES = [
  'super_admin',
  'admin_satuan',
  'komandan',
  'staff_satuan',
  'prajurit',
] as const;

export type KnownRole = typeof KNOWN_ROLES[number];

export const ROLE_CODE_MAP: Record<KnownRole, string> = {
  super_admin: 'SAD',
  admin_satuan: 'ADS',
  komandan: 'DAN',
  staff_satuan: 'STF',
  prajurit: 'PJT',
};

const ROLE_ALIASES: Record<string, KnownRole | string> = {
  admin: 'admin_satuan',
  'admin satuan': 'admin_satuan',
  admin_satuan: 'admin_satuan',
  staf: 'staff_satuan',
  staff: 'staff_satuan',
  'staff satuan': 'staff_satuan',
  staff_satuan: 'staff_satuan',
  'super admin': 'super_admin',
  super_admin: 'super_admin',
  komandan: 'komandan',
  prajurit: 'prajurit',
};

const ROLE_CODE_TO_ROLE: Record<string, KnownRole | string> = {
  SAD: 'super_admin',
  ADS: 'admin_satuan',
  DAN: 'komandan',
  STF: 'staff_satuan',
  PJT: 'prajurit',
};

export const ROLE_ACCESS_MAP: Record<KnownRole, string> = {
  super_admin: 'Akses penuh lintas semua satuan',
  admin_satuan: 'Kelola user, logistik, dan branding satuan sendiri',
  komandan: 'Komando tugas, personel, dan gate pass satuan sendiri',
  staff_satuan: 'Operasional harian: laporan, leave review, pesan',
  prajurit: 'Gate pass, absensi, tugas, dan profil pribadi',
};

export const ROLE_ROUTE_PATHS = {
  super_admin: {
    dashboard: '/super-admin/dashboard',
    satuans: '/super-admin/satuans',
    settings: '/super-admin/settings',
    audit: '/super-admin/audit',
  },
  admin_satuan: {
    dashboard: '/admin/dashboard',
    users: '/admin/users',
    branding: '/admin/branding',
    gatePassMonitor: '/admin/gatepass-monitor',
    logistics: '/admin/logistics',
    announcements: '/admin/announcements',
    attendance: '/admin/attendance',
    analytics: '/admin/analytics',
    apel: '/admin/apel',
    kegiatan: '/admin/kegiatan',
    schedule: '/admin/schedule',
    posJaga: '/admin/pos-jaga',
    documents: '/admin/documents',
    settings: '/admin/settings',
  },
  komandan: {
    dashboard: '/komandan/dashboard',
    tasks: '/komandan/tasks',
    personnel: '/komandan/personnel',
    gatePass: '/komandan/gatepass-approval',
    attendance: '/komandan/attendance',
    laporanOps: '/komandan/laporan-ops',
    sprint: '/komandan/sprint',
    reports: '/komandan/reports',
    evaluation: '/komandan/evaluation',
    apel: '/komandan/apel',
    logistics: '/komandan/logistics',
    messages: '/komandan/messages',
  },
  staff_satuan: {
    dashboard: '/staff/dashboard',
    messages: '/staff/messages',
    leaveReview: '/staff/leave-review',
    laporanOps: '/staff/laporan-ops',
    sprint: '/staff/sprint',
  },
  prajurit: {
    dashboard: '/prajurit/dashboard',
    gatePass: '/prajurit/gatepass',
    attendance: '/prajurit/attendance',
    tasks: '/prajurit/tasks',
    leave: '/prajurit/leave',
    messages: '/prajurit/messages',
    profile: '/prajurit/profile',
    apel: '/prajurit/apel',
    kegiatan: '/prajurit/kegiatan',
    scanPos: '/prajurit/scan-pos',
  },
} as const;

export const ROUTE_ROLE_GROUPS = {
  superAdminOnly: ['super_admin'],
  adminOnly: ['admin_satuan'],
  adminKomandan: ['admin_satuan', 'komandan'],
  adminKomandanStaff: ['admin_satuan', 'komandan', 'staff_satuan'],
  staffOnly: ['staff_satuan'],
  prajuritShared: ['prajurit', 'komandan', 'admin_satuan'],
  allRoles: ['super_admin', 'admin_satuan', 'komandan', 'staff_satuan', 'prajurit'],
} as const;

const ROLE_DEFAULT_PATH_MAP: Record<KnownRole, string> = {
  super_admin: ROLE_ROUTE_PATHS.super_admin.dashboard,
  admin_satuan: ROLE_ROUTE_PATHS.admin_satuan.dashboard,
  komandan: ROLE_ROUTE_PATHS.komandan.dashboard,
  staff_satuan: ROLE_ROUTE_PATHS.staff_satuan.dashboard,
  prajurit: ROLE_ROUTE_PATHS.prajurit.dashboard,
};

const ROLE_FALLBACK_PATH_MAP: Record<KnownRole, string[]> = {
  super_admin: [ROLE_ROUTE_PATHS.super_admin.dashboard],
  admin_satuan: [ROLE_ROUTE_PATHS.admin_satuan.dashboard, ROLE_ROUTE_PATHS.admin_satuan.settings],
  komandan: [ROLE_ROUTE_PATHS.komandan.dashboard, ROLE_ROUTE_PATHS.komandan.tasks],
  staff_satuan: [ROLE_ROUTE_PATHS.staff_satuan.dashboard],
  prajurit: [ROLE_ROUTE_PATHS.prajurit.dashboard, ROLE_ROUTE_PATHS.prajurit.profile],
};

const ROLE_PROFILE_PATH_MAP: Record<KnownRole, string> = {
  super_admin: ROLE_ROUTE_PATHS.super_admin.satuans,
  admin_satuan: ROLE_ROUTE_PATHS.admin_satuan.users,
  komandan: ROLE_ROUTE_PATHS.komandan.personnel,
  staff_satuan: ROLE_ROUTE_PATHS.staff_satuan.dashboard,
  prajurit: ROLE_ROUTE_PATHS.prajurit.profile,
};

const ROLE_MESSAGES_PATH_MAP: Partial<Record<KnownRole, string>> = {
  komandan: ROLE_ROUTE_PATHS.komandan.messages,
  staff_satuan: ROLE_ROUTE_PATHS.staff_satuan.messages,
  prajurit: ROLE_ROUTE_PATHS.prajurit.messages,
};

function humanizeRole(role: string): string {
  return role
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function normalizeRole(role: string | null | undefined): KnownRole | string | null {
  if (!role) return null;
  const trimmed = role.trim();
  const lowered = trimmed.toLowerCase();
  if (KNOWN_ROLES.includes(lowered as KnownRole)) return lowered as KnownRole;
  const aliasMatch = ROLE_ALIASES[lowered];
  if (aliasMatch) return aliasMatch;
  const compacted = lowered.replace(/[\s_/-]+/g, ' ').replace(/\s+/g, ' ').trim();
  const compactAliasMatch = ROLE_ALIASES[compacted];
  if (compactAliasMatch) return compactAliasMatch;
  const codeMatch = ROLE_CODE_TO_ROLE[trimmed.toUpperCase()];
  if (codeMatch) return codeMatch;
  return trimmed;
}

export function isKnownRole(role: string | null | undefined): role is KnownRole {
  const normalized = normalizeRole(role);
  return typeof normalized === 'string' && KNOWN_ROLES.includes(normalized as KnownRole);
}

export function getRoleDisplayLabel(role: string | null | undefined): string {
  const normalized = normalizeRole(role);
  if (!normalized) return '—';

  switch (normalized) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin_satuan':
      return 'Admin Satuan';
    case 'komandan':
      return 'Komandan';
    case 'staff_satuan':
      return 'Staff Satuan';
    case 'prajurit':
      return 'Prajurit';
    default:
      return humanizeRole(normalized);
  }
}

export const ROLE_OPTIONS = KNOWN_ROLES.map((role) => ({
  value: role,
  label: `${getRoleDisplayLabel(role)} (${ROLE_CODE_MAP[role]})`,
  code: ROLE_CODE_MAP[role],
  description: ROLE_ACCESS_MAP[role],
}));

export function getRoleCode(role: string | null | undefined): string {
  const normalized = normalizeRole(role);
  if (!normalized) return '—';
  if (typeof normalized !== 'string') return '—';
  if (!isKnownRole(normalized)) return normalized.toUpperCase();
  return ROLE_CODE_MAP[normalized];
}

export function getRoleAccessDescription(role: string | null | undefined): string {
  const normalized = normalizeRole(role);
  if (!normalized || !isKnownRole(normalized)) return '—';
  return ROLE_ACCESS_MAP[normalized];
}

export function getRoleDefaultPath(role: string | null | undefined): string | null {
  const normalized = normalizeRole(role);
  if (!normalized || !isKnownRole(normalized)) return null;
  return ROLE_DEFAULT_PATH_MAP[normalized];
}

export function getRoleFallbackPaths(role: string | null | undefined): string[] {
  const normalized = normalizeRole(role);
  if (!normalized || !isKnownRole(normalized)) return [];
  return ROLE_FALLBACK_PATH_MAP[normalized];
}

export function getRoleProfilePath(role: string | null | undefined): string | null {
  const normalized = normalizeRole(role);
  if (!normalized || !isKnownRole(normalized)) return null;
  return ROLE_PROFILE_PATH_MAP[normalized] ?? null;
}

export function getRoleMessagesPath(role: string | null | undefined): string | null {
  const normalized = normalizeRole(role);
  if (!normalized || !isKnownRole(normalized)) return null;
  return ROLE_MESSAGES_PATH_MAP[normalized] ?? null;
}

export type GlobalSearchResultType = 'task' | 'user' | 'announcement';

export function getGlobalSearchResultPath(type: GlobalSearchResultType, role: string | null | undefined): string {
  if (type === 'task') {
    if (isRolePrajurit(role)) return ROLE_ROUTE_PATHS.prajurit.tasks;
    if (isRoleStaff(role)) return ROLE_ROUTE_PATHS.staff_satuan.sprint;
    if (isRoleKomandan(role)) return ROLE_ROUTE_PATHS.komandan.tasks;
    return ROLE_ROUTE_PATHS.admin_satuan.dashboard;
  }

  if (type === 'user') {
    if (isRoleSuperAdmin(role)) return ROLE_ROUTE_PATHS.super_admin.dashboard;
    return ROLE_ROUTE_PATHS.admin_satuan.users;
  }

  return APP_ROUTE_PATHS.error;
}

export function isRoleSuperAdmin(role: string | null | undefined): role is KnownRole {
  return normalizeRole(role) === 'super_admin';
}

export function isRoleAdmin(role: string | null | undefined): role is KnownRole {
  return normalizeRole(role) === 'admin_satuan';
}

export function isRoleKomandan(role: string | null | undefined): role is KnownRole {
  return normalizeRole(role) === 'komandan';
}

export function isRoleStaff(role: string | null | undefined): role is KnownRole {
  return normalizeRole(role) === 'staff_satuan';
}

export function isRolePrajurit(role: string | null | undefined): role is KnownRole {
  return normalizeRole(role) === 'prajurit';
}
