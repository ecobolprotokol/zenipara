import { describe, expect, it } from 'vitest';
import {
  APP_ROUTE_PATHS,
  ROLE_ROUTE_PATHS,
  ROLE_OPTIONS,
  getGlobalSearchResultPath,
  getRoleAccessDescription,
  getRoleCode,
  getRoleDefaultPath,
  getRoleDisplayLabel,
  getRoleFallbackPaths,
  getRoleMessagesPath,
  getRoleProfilePath,
  isRoleAdmin,
  isRoleKomandan,
  isRolePrajurit,
  isRoleStaff,
  isRoleSuperAdmin,
  isKnownRole,
  normalizeRole,
} from '@/features/shared/lib/rolePermissions';

describe('rolePermissions helpers', () => {
  it('normalizes role codes to canonical role', () => {
    expect(normalizeRole('SAD')).toBe('super_admin');
    expect(normalizeRole('KMD')).toBe('komandan');
    expect(normalizeRole('STF')).toBe('staff_satuan');
    expect(normalizeRole('PRJ')).toBe('prajurit');
    expect(normalizeRole('PJP')).toBe('PJP');
  });

  it('keeps canonical roles as-is', () => {
    expect(normalizeRole('super_admin')).toBe('super_admin');
    expect(normalizeRole('admin_satuan')).toBe('admin_satuan');
    expect(normalizeRole('komandan')).toBe('komandan');
    expect(normalizeRole('staff_satuan')).toBe('staff_satuan');
    expect(normalizeRole('prajurit')).toBe('prajurit');
  });

  it('normalizes common human-friendly role aliases', () => {
    expect(normalizeRole('Super Admin')).toBe('super_admin');
    expect(normalizeRole('Admin Satuan')).toBe('admin_satuan');
    expect(normalizeRole('Staff Operasional')).toBe('staff_satuan');
  });

  it('recognizes known roles from canonical and code forms', () => {
    expect(isKnownRole('admin_satuan')).toBe(true);
    expect(isKnownRole('SAD')).toBe(true);
    expect(isKnownRole('PJP')).toBe(false);
    expect(isKnownRole('unknown')).toBe(false);
  });

  it('returns correct display label and role code', () => {
    expect(getRoleDisplayLabel('super_admin')).toBe('Super Admin');
    expect(getRoleDisplayLabel('SAD')).toBe('Super Admin');
    expect(getRoleDisplayLabel('admin_satuan')).toBe('Admin Satuan');
    expect(getRoleCode('komandan')).toBe('DAN');
    expect(getRoleCode('KMD')).toBe('DAN');
  });

  it('returns access description and default path for both code and canonical role', () => {
    expect(getRoleAccessDescription('STF')).toBe('Operasional harian: laporan, leave review, pesan');
    expect(getRoleDefaultPath('PRJ')).toBe('/prajurit/dashboard');
    expect(getRoleDefaultPath('super_admin')).toBe('/super-admin/dashboard');
    expect(getRoleDefaultPath('admin_satuan')).toBe('/admin/dashboard');
    expect(getRoleDefaultPath('unknown')).toBeNull();
  });

  it('returns profile and message paths for canonical and code roles', () => {
    expect(getRoleProfilePath('PRJ')).toBe('/prajurit/profile');
    expect(getRoleProfilePath('admin_satuan')).toBe('/admin/users');
    expect(getRoleMessagesPath('KMD')).toBe('/komandan/messages');
    expect(getRoleMessagesPath('PJP')).toBeNull();
    expect(getRoleMessagesPath('unknown')).toBeNull();
  });

  it('keeps centralized route path catalog in sync with helper outputs', () => {
    expect(ROLE_ROUTE_PATHS.admin_satuan.dashboard).toBe('/admin/dashboard');
    expect(getRoleDefaultPath('admin_satuan')).toBe(ROLE_ROUTE_PATHS.admin_satuan.dashboard);
    expect(getRoleProfilePath('PRJ')).toBe(ROLE_ROUTE_PATHS.prajurit.profile);
    expect(getRoleMessagesPath('STF')).toBe(ROLE_ROUTE_PATHS.staff_satuan.messages);
  });

  it('maps global search result type and role to centralized route paths', () => {
    expect(getGlobalSearchResultPath('task', 'PRJ')).toBe(ROLE_ROUTE_PATHS.prajurit.tasks);
    expect(getGlobalSearchResultPath('task', 'KMD')).toBe(ROLE_ROUTE_PATHS.komandan.tasks);
    expect(getGlobalSearchResultPath('user', 'SAD')).toBe(ROLE_ROUTE_PATHS.admin_satuan.users);
    expect(getGlobalSearchResultPath('user', 'komandan')).toBe(ROLE_ROUTE_PATHS.komandan.personnel);
    expect(getGlobalSearchResultPath('announcement', 'admin_satuan')).toBe(ROLE_ROUTE_PATHS.admin_satuan.announcements);
    expect(getGlobalSearchResultPath('announcement', 'PRJ')).toBe(ROLE_ROUTE_PATHS.prajurit.dashboard);
    expect(getGlobalSearchResultPath('announcement', 'unknown')).toBe(APP_ROUTE_PATHS.error);
    expect(APP_ROUTE_PATHS.error).toBe('/error');
  });

  it('returns fallback paths and role options with code labels', () => {
    expect(getRoleFallbackPaths('SAD')).toContain('/super-admin/dashboard');
    const adminOption = ROLE_OPTIONS.find((opt) => opt.value === 'admin_satuan');
    expect(adminOption?.label).toBe('Admin Satuan (ADS)');
    expect(adminOption?.description).toBe('Kelola user, logistik, dan branding satuan sendiri');
  });

  it('supports semantic role predicates for code and canonical values', () => {
    expect(isRoleAdmin('admin_satuan')).toBe(true);
    expect(isRoleAdmin('SAD')).toBe(true);
    expect(isRoleSuperAdmin('SAD')).toBe(true);
    expect(isRoleKomandan('KMD')).toBe(true);
    expect(isRoleStaff('STF')).toBe(true);
    expect(isRolePrajurit('PRJ')).toBe(true);
    expect(isRoleSuperAdmin('staff_satuan')).toBe(false);
  });
});
