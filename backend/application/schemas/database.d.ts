interface Account {
  login: string;
  password: string;
  isBlocked: boolean;
  accountId?: string;
}

interface AccountRole {
  accountId: string;
  role: string;
  subscriptionEndDate?: string;
  accountRoleId?: string;
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
  tiles: string;
  generatorConfig: string;
  generationTime: number;
  createdAt: string;
  worldId?: string;
}
