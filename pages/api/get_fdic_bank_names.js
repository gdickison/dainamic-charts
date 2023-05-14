// import pool from "../../src/client";

export default async function queryUbprInstitution(req, res){
  // const client = await pool.connect()

  await fetch('https://banks.data.fdic.gov/api/institutions?sort_by=NAME&sort_order=ASC&limit=5000&offset=0&format=json&filename=data_file&filters=ACTIVE%3A1&download=false&fields=NAME,FED_RSSD,CERT')
  .then(response => response.json())
  .then(data => res.status(200).json({response: data.data}))
  .catch(error => console.log("There was an error getting bank names: ", error));
}