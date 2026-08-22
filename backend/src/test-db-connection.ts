import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root of backend
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL is not defined in the environment variables.');
  process.exit(1);
}

console.log(`🔌 Attempting to connect to database using connection string...`);
// Mask password in logs
const maskedConnStr = connectionString.replace(/:([^:@]+)@/, ':****@');
console.log(`🔗 Target: ${maskedConnStr}`);

const pool = new Pool({
  connectionString,
});

async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    console.log('✅ Successfully connected to the PostgreSQL database!');

    // 1. Test connection with SELECT NOW()
    const nowResult = await client.query('SELECT NOW()');
    console.log(`⏱️ Server Time (SELECT NOW()): ${nowResult.rows[0].now}`);

    // 2. Verify access to existing tables
    const tables = ['users', 'employees', 'leaves', 'payroll', 'notifications'];
    console.log('\n📊 Verifying table access:');
    
    for (const table of tables) {
      try {
        const countResult = await client.query(`SELECT COUNT(*) FROM "${table}"`);
        console.log(`   ✔️ Table "${table}" exists. Row count: ${countResult.rows[0].count}`);
      } catch (err: any) {
        console.error(`   ❌ Error accessing table "${table}": ${err.message}`);
      }
    }

  } catch (err: any) {
    console.error('❌ Database connection failed!');
    console.error(err.stack);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

testConnection();
