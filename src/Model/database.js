import { Pool } from 'pg';

const connectionString = `postgres://diabpyfbimjuya:c50f60c6ad2f56d26aa449bc5814a3323d4a6e32e544ce26619a4f9868618e18@ec2-54-227-244-12.compute-1.amazonaws.com:5432/d233ill936cr99`;

const pool = new Pool({connectionString, ssl: true,});

// const pool = new Pool({
//   user: 'kenzdozz',
//   host: 'localhost',
//   database: 'stackreflow',
//   password: 'chidozie',
//   port: 5432,
// });

export default pool;
