import { useState, memo } from "react"
import UbprFormInputs from "../src/components/UbprFormInputs"

const UBPR = () => {
  const [ubprData, setUbprData] = useState()
  const [ubprRconData, setUbprRconData] = useState()
  const [nameParam, setNameParam] = useState('')
  const [specializationParam, setSpecializationParam] = useState('')
  const [cityParam, setCityParam] = useState('')
  const [stateParam, setStateParam] = useState('')

  const handleNameParamChange = e => {
    e.preventDefault()
    setNameParam(e.target.value)
  }

  const handleSpecializationParamChange = e => {
    e.preventDefault()
    setSpecializationParam(e.target.value)
  }

  const handleStateParamChange = e => {
    e.preventDefault()
    setStateParam(e.target.value)
  }

  const handleCityParamChange = e => {
    e.preventDefault()
    setCityParam(e.target.value)
  }

  const getUbprInstitutionData = async () => {
    const bankEndpoint = `/api/get_ubpr_institution`
    const rconEndpoint = `/api/get_ubpr_rcon`
    const JSONdata = JSON.stringify({
      nameParam,
      specializationParam,
      stateParam,
      cityParam
    })

    const bankOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    let banks = await fetch(bankEndpoint, bankOptions).then(response => response.json())
    banks = banks.response

    const bankIds = banks.map(bank => bank.BANK_ID)
    const rconOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ bankIds })
    }
    let rcon = await fetch(rconEndpoint, rconOptions).then(response => response.json())
    rcon = rcon.response

    setUbprData(banks)
    setUbprRconData(rcon)
  }

  const getData = async () => {
    setUbprData(null)
    setUbprRconData(null)
    getUbprInstitutionData()
  }

  return (
    <div>
      <UbprFormInputs
        handleNameParamChange={handleNameParamChange}
        handleSpecializationParamChange={handleSpecializationParamChange}
        handleCityParamChange= {handleCityParamChange}
        handleStateParamChange={handleStateParamChange}
        getData={getData}
      />
      <h1>UBPR DATA GOES HERE</h1>
      {ubprData &&
        <div>
{console.log('ubprData', ubprData)}
          {ubprData.map((row, i) => {
            return (
              <div key={i} className="m-2 border-2 border-gray-400 p-2 flex flex-row gap-4">
                <div className="w-1/5">
                  <h1>{row.NAME}</h1>
                  <h1>ID: {row.BANK_ID}</h1>
                  <address>
                    <p>{row.ADDRESS}</p>
                    <p><span>{row.CITY}, </span><span>{row.STNAME}</span><span> {row.ZIP}</span></p>
                  </address>
                  <a href={`https://${row.WEBADDR}`} target="_blank">{row.WEBADDR}</a>
                </div>
                <div className="w-1/5">
                  <p><span>FDIC Region:</span> <span>{row.FDICREGN}</span></p>
                  <p><span>Banking Class:</span> <span>{row.BKCLASS}</span></p>
                  <p><span>Specialization:</span> <span>{row.SPECGRPN}</span></p>
                  {/* <p><span>Updated:</span> <span>{row.DATEUPDT}</span></p> */}
                </div>
                <div className="w-1/5">
                  <p><span>Equity:</span> <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(row.EQ * 1000)}</span></p>
                </div>
              </div>
            )
          })}
          {ubprData.map((row, i) => {
            return (Object.entries(row).map(([key, value], idx) => {
              return (
                <div>
                  <p key={`${i}-${idx}`}>{key} - {value}</p>
                </div>
              )
            }))
          })}
        </div>
      }
      {ubprRconData &&
        <div>
{console.log('ubprRconData', ubprRconData)}
          {ubprRconData.map((row, i) => {
            return (Object.entries(row).map(([key, value], idx) => {
              {/* if(value !== null){ */}
                return (
                  <div>
                    <p key={`${i}-${idx}`}>{key} - {value}</p>
                  </div>
                )
              {/* } */}
            }))
          })}
        </div>
      }
    </div>
  )
}

export default UBPR