import database from "infra/database.js";

export default async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const postgresQueryVersion = await database.query("SHOW server_version;");
  const postgresResultVersion = postgresQueryVersion.rows[0].server_version;

  const databaseMaxConnectionResult = await database.query(
    "SHOW max_connections;"
  );

  const databaseName = process.env.POSTGRES_DB;

  const databaseUsedConnectionResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseMaxConnectionValue =
    databaseMaxConnectionResult.rows[0].max_connections;
  const databaseUsedConnectionValue =
    databaseUsedConnectionResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependecies: {
      database: {
        version: postgresResultVersion,
        max_connections: parseInt(databaseMaxConnectionValue),
        open_connections: databaseUsedConnectionValue,
      },
    },
  });
}
