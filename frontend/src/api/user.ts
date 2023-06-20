export type UserRoles = 'admin' | 'user';

export interface User {
	id: string;
	login: string;
	password: string;
	isBlocked: boolean;
	roles: Array<{
		role: UserRoles;
		subscriptionEndDate: string; // Date in string
	}>;
}

export type UserBase = Omit<User, 'id' | 'isBlocked' | 'roles'>;
