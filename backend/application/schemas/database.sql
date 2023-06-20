CREATE TABLE "Account" (
  "id" bigint generated always as identity,
  "login" varchar(64) NOT NULL,
  "password" varchar NOT NULL,
  "isBlocked" boolean NOT NULL DEFAULT false
);

ALTER TABLE "Account" ADD CONSTRAINT "pkAccount" PRIMARY KEY ("id");
CREATE UNIQUE INDEX "akAccountLogin" ON "Account" ("login");

CREATE TABLE "AccountRole" (
  "id" bigint generated always as identity,
  "accountId" bigint NOT NULL,
  "role" varchar NOT NULL,
  "subscriptionEndDate" timestamp with time zone NULL
);

ALTER TABLE "AccountRole" ADD CONSTRAINT "pkAccountRole" PRIMARY KEY ("id");
ALTER TABLE "AccountRole" ADD CONSTRAINT "fkAccountRoleAccount" FOREIGN KEY ("accountId") REFERENCES "Account" ("id");

CREATE TABLE "Session" (
  "id" bigint generated always as identity,
  "accountId" bigint NOT NULL,
  "token" varchar NOT NULL,
  "ip" inet NOT NULL,
  "data" jsonb NOT NULL
);

ALTER TABLE "Session" ADD CONSTRAINT "pkSession" PRIMARY KEY ("id");
ALTER TABLE "Session" ADD CONSTRAINT "fkSessionAccount" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE CASCADE;
CREATE UNIQUE INDEX "akSessionToken" ON "Session" ("token");

CREATE TABLE "World" (
  "id" bigint generated always as identity,
  "name" varchar NOT NULL,
  "accountId" bigint NOT NULL,
  "height" integer NOT NULL,
  "width" integer NOT NULL,
  "tiles" jsonb NOT NULL,
  "generatorConfig" jsonb NOT NULL,
  "generationTime" integer NOT NULL,
  "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "World" ADD CONSTRAINT "pkWorld" PRIMARY KEY ("id");
ALTER TABLE "World" ADD CONSTRAINT "fkWorldAccount" FOREIGN KEY ("accountId") REFERENCES "Account" ("id");
