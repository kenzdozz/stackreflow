import { Pool } from 'pg';
import { dbConnObj } from '../config';

const pool = new Pool(dbConnObj);

export default pool;
