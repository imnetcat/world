-- Database required data

-- Account

-- admin:123456
INSERT INTO "Account" (
  "login",
  "password"
) VALUES (
  'admin',
  '$scrypt$N=32768,r=8,p=1,maxmem=67108864$XcD5Zfk+BVIGEyiksBjjy9LL42AFOOqlhEB650woECs$3CNOs25gOVV8AZMYQc6bFnrYdM+3xP996shxJEq5LxGt4gs1g9cocZmi/SYg/H16egY4j7qxTD/oygyEI80cgg'
);

INSERT INTO "AccountRole" (
  "accountId",
  "role"
) VALUES (
  (SELECT id FROM "Account" where "login" = 'admin'),
  'admin'
);
