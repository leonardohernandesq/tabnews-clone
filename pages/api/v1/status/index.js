import database from "infra/database.js";

export default async function status(request, response) {
  const result = await database.query("select 1 + 1 as sum;");
  console.log(result.rows);
  response
    .status(200)
    .json({ message: "alunos do curso.dev são pessoas acima da média" });
}
