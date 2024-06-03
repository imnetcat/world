interface Role {
  name: string;
  roleId?: string;
}

interface Account {
  login: string;
  password: string;
  isBlocked: boolean;
  rolesId: string[];
  accountId?: string;
}

interface Session {
  accountId: string;
  token: string;
  ip: string;
  data: string;
  sessionId?: string;
}

interface World {
  name: string;
  accountId: string;
  height: number;
  width: number;
  generatorConfig: string;
  generationTime: number;
  createdAt: string;
  worldId?: string;
}
