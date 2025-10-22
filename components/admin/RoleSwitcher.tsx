import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { getCurrentUser, switchUserRole, User } from '../../services/authService';

export const RoleSwitcher: React.FC = () => {
    const [currentUser, setCurrentUser] = React.useState<User>(getCurrentUser());

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as User['role'];
        const updatedUser = switchUserRole(newRole);
        setCurrentUser({ ...updatedUser });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Role Simulator</CardTitle>
                <CardDescription>Switch roles to test role-based access control (RBAC).</CardDescription>
            </CardHeader>
            <CardContent>
                <Label htmlFor="role-select">Current Role</Label>
                <Select id="role-select" value={currentUser.role} onChange={handleRoleChange}>
                    <option value="GlobalAdministrator">Global Administrator</option>
                    <option value="ComplianceAdministrator">Compliance Administrator</option>
                    <option value="SecurityReader">Security Reader</option>
                </Select>
            </CardContent>
        </Card>
    );
};
