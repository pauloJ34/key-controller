const fs = require('node:fs/promises');
const path = require('node:path');
const { connection } = require("../database/connection.js");

class GenerateReportController {
  async handle(_, response) {
    try {
      const result = await connection.query(/*sql*/`
        SELECT
          schedule.id,
          schedule.acquisition_date,
          schedule.confirmed_devolution_date,
          key.id AS key_id,
          key.number AS key_number,
          sector.id AS sector_id,
          sector.name AS sector_name,
          u.name AS user_name,
          u.registry AS user_registry
        FROM public.schedule AS schedule
        LEFT JOIN public.users AS u
          ON u.registry = schedule.user_id
        LEFT JOIN public.key AS key
          ON key.id = schedule.key_id
        LEFT JOIN public.sector AS sector
          ON sector.id = key.sector_id
        WHERE schedule.acquisition_date::DATE >= date_trunc('MONTH', CURRENT_DATE)
          AND schedule.confirmed
          AND schedule.deleted_at IS NULL
        ORDER BY schedule.acquisition_date ASC
      `)

      const textCsv = "id do Agendamento, data de aquisição, data de devolução, id da chave, número da chave, id do setor, nome do setor, nome de usuário, matricula do usuário, \n"
      const csvData = result.rows.map(row => Object.values(row).join(','));

      const month = new Date().getMonth();
      const year = new Date().getFullYear();

      const location = path.join(process.cwd(), 'reports', `${year}-${month}-${Date.now()}.csv`);

      await fs.writeFile(location, textCsv + csvData.join('\n'));

      return response.status(200).json({ message: "ok" })
    } catch (error) {
      return response.status(500).json(error)
    }
  }
}

module.exports = { GenerateReportController }