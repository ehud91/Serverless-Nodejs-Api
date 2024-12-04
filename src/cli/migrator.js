// tsx src/cli/migrator.js
const { drizzle } = require('drizzle-orm/neon-serverless');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const secrets = require('../lib/secrets');
const schema = require('../db/schemas');
require('dotenv').config();

const { Pool, neonConfig } = require('@neondatabase/serverless');

const ws = reqiore('ws');

async function performMigration() {
    const dbUrl = await secrets.getDatabaseUrl();
    if (!dbUrl) {
        return;
    }
    console.log(dbUrl);
    // neon serverless pool
    // https://github.com/neondatabase/serverless?tab=readme-ov-file#pool-and-client
    neonConfig.webSocketConstructor = ws; // <-- this is the key bit
    const pool = new Pool({ connectionString: dbUrl });
    pool.on('error', err => console.error(err)); // deal with e.g.
    // re-connect
    // ...
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const db = await drizzle(client, {schema});
        await migrate(db, { migrationFolder: 'src/migrations' });        
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
    await pool.end();
}


if (require.main === module) {
    console.log("run Migrations!");
    performMigration().then((val) => {
        console.log("Migrations done");
        process.exit(0);
    }).catch(rer => {
        console.log("Migrations error");
        process.exit(1);
    })
}