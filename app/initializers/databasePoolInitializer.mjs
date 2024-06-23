import pg from 'pg';

const pool = new pg.Pool({
    user: 'postgres.kpdbetuawspoaqfusuib',
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: 5432,
});

export {pool}


