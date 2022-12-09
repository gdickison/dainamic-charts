import { useState, memo } from "react"
import UbprFormInputs from "../src/components/UbprFormInputs"
import UbprBarChart from "../src/components/UbprBarChart"
import UbprBankSummary from "../src/components/UbprBankSummary"
import { rconOptions } from "../public/utils"

const UBPR = () => {
  const [ubprBankData, setUbprBankData] = useState()
  const [ubprRconData, setUbprRconData] = useState()
  const [nameParam, setNameParam] = useState('')
  const [specializationParam, setSpecializationParam] = useState('')
  const [cityParam, setCityParam] = useState('')
  const [stateParam, setStateParam] = useState('')
  const [fdicRegionParam, setFdicRegionParam] = useState('')
  const [selectedRcons, setSelectedRcons] = useState([])

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

  const handleFdicRegionChange = e => {
    e.preventDefault()
    setFdicRegionParam(e.target.value)
  }

  const spliceIntoChunks = (arr, chunkSize) => {
    const res = [];
    while (arr.length > 0) {
        const chunk = arr.splice(0, chunkSize);
        res.push(chunk);
    }
    return res;
  }

  const getUbprBankData = async () => {
    const bankEndpoint = `/api/get_ubpr_institution`
    const rconEndpoint = `/api/get_ubpr_rcon`
    const JSONdata = JSON.stringify({
      nameParam,
      specializationParam,
      stateParam,
      fdicRegionParam,
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
    setUbprBankData(banks)

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

    const rconData = spliceIntoChunks(rcon, rcon.length / banks.length)

    setUbprRconData(rconData)
  }

  const getData = async () => {
    setUbprBankData(null)
    setUbprRconData(null)
    getUbprBankData()
  }

  const handleSelectedRconChange = e => {
    e.preventDefault()
    const updatedRcons = ([...selectedRcons, e.target.value])
    updatedRcons.sort((a, b) => a.rcon - b.rcon)
    setSelectedRcons(updatedRcons)
  }

  const removeRcon = e => {
    e.preventDefault()
    const newRcons = selectedRcons.filter(rcon => rcon !== e.target.id)
    setSelectedRcons(newRcons)
  }

  return (
    <div>
      <UbprFormInputs
        handleNameParamChange={handleNameParamChange}
        handleSpecializationParamChange={handleSpecializationParamChange}
        handleCityParamChange= {handleCityParamChange}
        handleStateParamChange={handleStateParamChange}
        handleFdicRegionChange={handleFdicRegionChange}
        getData={getData}
        rconOptions={rconOptions}
        handleSelectedRconChange={handleSelectedRconChange}
        selectedRcons={selectedRcons}
        removeRcon={removeRcon}
      />
      <section className="m-4 space-y-10">
      {console.log('ubprBankData', ubprBankData)}
        {ubprBankData && ubprRconData &&
          ubprBankData.map((bank, i) => {
            return (
              <div className="border-t-2 border-t-gray-400" key={i}>
                <h1 className="mx-2 my-4 text-2xl">{bank.NAME} - {bank.BANK_ID}</h1>
                <UbprBankSummary
                  bankData={bank}
                />
                <div className="flex flex-wrap">
                  {selectedRcons &&
                    selectedRcons.map((rcon, idx) => {
                      return (
                        <div key={idx} className="w-1/2">
                          <UbprBarChart
                            bankData={bank}
                            statsData={ubprRconData[i]}
                            selectedMetric={rcon}
                          />
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            )
          })
        }
      </section>
    </div>
  )
}

export default UBPR