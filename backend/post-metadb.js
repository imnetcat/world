const fs = require('node:fs');

console.log('Executing post metadb script');

const databaseSQLPath = './application/schemas/database.sql';

const getFirstGroup = (regexp, str) =>
	Array.from(str.matchAll(regexp), (m) => m[1]);

const buffer = fs.readFileSync(databaseSQLPath, { encoding: 'utf-8' });
let strBuffer = buffer.toString('utf-8');
const group1 = getFirstGroup(
	/  "(\w*)" bigint generated always as identity,/g,
	strBuffer
);
strBuffer = strBuffer.replaceAll(
	/  "(\w*)" bigint generated always as identity,/g,
	'  "id" bigint generated always as identity,'
);

strBuffer = strBuffer.replaceAll(
	/REFERENCES "(\w*)" \("(\w*)"\)/g,
	(match, p1, p2) => {
		return group1.includes(p2) ? `REFERENCES "${p1}" ("id")` : match;
	}
);

for (const match of group1) {
	strBuffer = strBuffer.replaceAll(
		`PRIMARY KEY ("${match}")`,
		'PRIMARY KEY ("id")'
	);
}

fs.writeFileSync(databaseSQLPath, strBuffer, { encoding: 'utf-8' });
