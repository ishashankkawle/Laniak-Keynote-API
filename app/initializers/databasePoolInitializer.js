import {Pool} from ('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'testdb',
    password: '1234abcd',
    port: 5432,
});

export {pool}