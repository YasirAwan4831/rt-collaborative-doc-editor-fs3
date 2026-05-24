export const ROLES = {
  OWNER: 'owner',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};

export const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: ['read', 'write', 'delete', 'share', 'rename'],
  [ROLES.EDITOR]: ['read', 'write'],
  [ROLES.VIEWER]: ['read'],
};

export function canPerform(role, action) {
  return ROLE_PERMISSIONS[role]?.includes(action) ?? false;
}

export default ROLES;
