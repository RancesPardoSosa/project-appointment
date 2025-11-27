import mysql from "mysql2/promise";

const dbPE = mysql.createPool({
  host: process.env.RDS_HOST_PE,
  user: process.env.RDS_USER_PE,
  password: process.env.RDS_PASS_PE,
  database: process.env.RDS_DB_PE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const dbCL = mysql.createPool({
  host: process.env.RDS_HOST_CL,
  user: process.env.RDS_USER_CL,
  password: process.env.RDS_PASS_CL,
  database: process.env.RDS_DB_CL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const getDbPE = () => dbPE;
export const getDbCL = () => dbCL;
