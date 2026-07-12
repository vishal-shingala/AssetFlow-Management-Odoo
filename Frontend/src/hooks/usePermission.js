/**
 * usePermission - a custom hook to check if the current user has the required role(s).
 *
 * Usage:
 *   const { can } = usePermission();
 *   can(['ADMIN', 'ASSET_MANAGER'])  // returns true if user has one of these roles
 */
export function usePermission() {
  const userStr = sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userRole = user?.role || null;

  const can = (allowedRoles) => {
    if (!userRole) return false;
    if (String(userRole).toUpperCase() === 'ADMIN') return true;
    const rolesArr = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return rolesArr.some(
      (r) => String(r).toUpperCase() === String(userRole).toUpperCase()
    );
  };

  return { userRole, can };
}
