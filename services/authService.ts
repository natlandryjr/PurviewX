// Mock auth service. In a real app, this would interact with an authentication provider.

export interface User {
  name: string;
  role: 'GlobalAdministrator' | 'ComplianceAdministrator' | 'SecurityReader';
}

let currentUser: User = {
  name: 'Alex Wilber',
  role: 'GlobalAdministrator',
};

export const getCurrentUser = (): User => {
  return currentUser;
};

export const switchUserRole = (role: User['role']): User => {
  currentUser.role = role;
  console.log(`Switched user role to: ${role}`);
  return currentUser;
};
