export const ROLES = {
  OWNER: 'owner',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};

export const ROLE_LABELS = {
  [ROLES.OWNER]: 'Owner',
  [ROLES.EDITOR]: 'Editor',
  [ROLES.VIEWER]: 'Viewer',
};

export function canEdit(role) {
  return role === ROLES.OWNER || role === ROLES.EDITOR;
}

export default ROLES;
