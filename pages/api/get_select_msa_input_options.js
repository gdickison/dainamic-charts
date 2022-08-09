// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import pool from '../../src/client'

// export default async function handler(req, res) {
//   const client = await pool.connect()

//   await client
//     .query(`SELECT msa_code, msa_name
//       FROM banking_app.msa_names
//       ORDER BY msa_code;`)
//     .then(response => res.status(200).json({response: response.rows}))
//     .then(client.release())
//     .catch(error => console.log("There is an error getting top feature data: ", error))
// }

export default function handler(req, res) {
  res.status(200).json({ name: 'this is an msa input test' })
}