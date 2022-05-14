import { useState } from "react"
import { useEffect } from "react"

const DelinquencyRateByDemographic = ({ msa }) => {
  const [queryParams, setQueryParams] = useState({
    startDate: "2019-01-01",
    endDate: "2021-03-01"
  })
  const [msaDemographicData, setMsaDemographicData] = useState()

  const handleChange = e => {
    e.preventDefault()
    setQueryParams({...queryParams, [e.target.name]: e.target.value})
  }

  const getSomeData = async () => {
    if(!queryParams.msaCode){
      // TODO: use an alert like the one I built for RedBalloon
      alert("pick an msa")
    }
    const JSONdata = JSON.stringify({
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      msaCode: queryParams.msaCode
    })

    const endpoint = `/api/demographic_data`

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    const response = await fetch(endpoint, options)
    let status = response.status
    let demographicData = await response.json()

    if(status === 404){
      console.log("There was an error")
    } else if(status === 200){
      setMsaDemographicData(demographicData.response.rows[0])
    }
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <h1 className="my-6 text-7xl">Delinquency Rate By Demographic</h1>
      <p className="mx-12">Demographics would be at the aggregate level to what we have. Say, if users select  have People with less than HS, in certain industry, etc. within a certain time period, we should show then the deliquency rate for that subset.</p>
      <form action="#">
        <label htmlFor="startDate">Enter a start date: </label>
        {/* TODO: format the entered date - can I enforce a format? */}
        {/* TODO: show an alert if date is outside range */}
        <input type="text" id="startDate" name="startDate" min="2019-01-01" max="2021-03-01" defaultValue="2019-01-01" onChange={handleChange}/>
        <label htmlFor="endDate">Enter an end date: </label>
        <input type="text" id="endDate" name="endDate" min="2019-01-01" max="2021-03-01" defaultValue="2021-03-01" onChange={handleChange}/>
        <label htmlFor="msaCode">Enter an MSA Code: </label>
        <select type="text" id="msaCode" name="msaCode" defaultValue="" onChange={handleChange}>
          <option disabled></option>
          {msa && msa.map(singleMsa => {
            return (
              <option key={singleMsa.msa} value={singleMsa.msa}>{singleMsa.msa} - {singleMsa.name}</option>
            )
          })}
        </select>
      </form>
      <button onClick={getSomeData}>Get Some Data</button>
      {msaDemographicData &&
        <div>
          <p>Selected MSA: {msaDemographicData.name}</p>
          <p>Total Population: {(msaDemographicData.total_population).toLocaleString()}</p>
          <p>Median Home Income: ${(msaDemographicData.median_home_income).toLocaleString()}</p>
          <p>Median Home Value: ${(msaDemographicData.median_home_value).toLocaleString()}</p>
        </div>
      }
    </div>
  )
}

export default DelinquencyRateByDemographic

export const getStaticProps = async () => {
  // get the MSAs to generate the MSA select input options
  const pg = require('pg')
  const pool = new pg.Pool({
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    host: process.env.PGHOST,
    password: String(process.env.PGPASSWORD)
  })

  // TODO: find a better way to populate the msa options - this takes too long
  const response = await pool.query(`select distinct msa, name from data_refined.clean_data_19_21_v2 order by msa`)
  const msa = response.rows
  console.log(msa)

  return {
    props: {
      msa,
    },
  }
}