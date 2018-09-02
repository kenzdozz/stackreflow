import { Pool } from 'pg';

const pool = new Pool({
  user: 'kenzdozz',
  host: 'localhost',
  database: 'stackreflow',
  password: 'chidozie',
  port: 5432,
});

export default pool;
