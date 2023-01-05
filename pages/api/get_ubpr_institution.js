import pool from "../../src/client";

export default async function queryUbprInstitution(req, res){
  const client = await pool.connect()

  const bankIdQuery = req.body.selectedBanksParam.length > 0 ? `AND "BANK_ID" IN (${req.body.selectedBanksParam})` : ``
  const assetQuery = req.body.selectedAssetOption !== null ? `AND "ASSET_INT" ${req.body.selectedAssetOption.value}` : ``
  const numOfficesQuery = req.body.selectedNumberOfOffices !== null ? `AND "OFFICES" ${req.body.selectedNumberOfOffices.value}` : ``
  const locationQuery = req.body.selectedLocation !== null ? `AND ${req.body.selectedLocation.value}` : ``
  const peerGroupStateQuery = req.body.selectedPeerGroupState !== null ? `AND "STNAME" = '${req.body.selectedPeerGroupState.value}'` : ``

  await client
    .query(`SELECT
        *
      FROM banking_app.ubpr_institution
      WHERE "INSCOML" = 1
        ${bankIdQuery}
        ${assetQuery}
        ${numOfficesQuery}
        ${locationQuery}
        ${peerGroupStateQuery}
      ORDER BY "BANK_ID"`)
    .then(response => res.status(200).json({response: response.rows}))
    .then(client.release())
    .catch(error => console.log("There was an error getting ubpr data: ", error))
}