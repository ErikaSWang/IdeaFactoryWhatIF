
const connectionString = process.env.DATABASE_URL;
module.exports = {
  connection: connectionString,
  ssl: { rejectUnauthorized: false }
};
