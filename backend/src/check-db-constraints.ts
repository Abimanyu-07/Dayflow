import 'dotenv/config';
import { pool } from './lib/db';

async function checkConstraints() {
  try {
    console.log('Querying check constraints for attendance table...');
    const result = await pool.query(`
      SELECT 
        cc.constraint_name,
        cc.check_clause
      FROM 
        information_schema.check_constraints cc
      JOIN 
        information_schema.constraint_column_usage ccu 
        ON cc.constraint_name = ccu.constraint_name
      WHERE 
        ccu.table_name = 'attendance';
    `);
    
    console.log('Results:');
    console.log(JSON.stringify(result.rows, null, 2));

    console.log('\nQuerying check constraints for leaves table...');
    const leavesResult = await pool.query(`
      SELECT 
        cc.constraint_name,
        cc.check_clause
      FROM 
        information_schema.check_constraints cc
      JOIN 
        information_schema.constraint_column_usage ccu 
        ON cc.constraint_name = ccu.constraint_name
      WHERE 
        ccu.table_name = 'leaves';
    `);
    console.log('Results:');
    console.log(JSON.stringify(leavesResult.rows, null, 2));

    console.log('\nQuerying check constraints for users table...');
    const usersResult = await pool.query(`
      SELECT 
        cc.constraint_name,
        cc.check_clause
      FROM 
        information_schema.check_constraints cc
      JOIN 
        information_schema.constraint_column_usage ccu 
        ON cc.constraint_name = ccu.constraint_name
      WHERE 
        ccu.table_name = 'users';
    `);
    console.log('Results:');
    console.log(JSON.stringify(usersResult.rows, null, 2));

  } catch (err) {
    console.error('Error querying constraints:', err);
  } finally {
    await pool.end();
  }
}

checkConstraints();
