import { useEffect, useState } from "react"
import Select from "react-select"

export default function SCALE () {
  const [statsData, setStatsData] = useState(null)
  const [ratioData, setRatioData] = useState(null)
  const [peerOptions, setPeerOptions] = useState()
  const [selectedPeerGroup, setSelectedPeerGroup] = useState(null)

  async function getPeerOptions () {
    let peerOptionsData = await fetch(
      'api/get_peer_options',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(response => response.json())

    peerOptionsData = peerOptionsData.response.map(row => {
      return ({
        value: row.peercode,
        label: `${row.peername} (${row.peercode})`
      })
    })
    setPeerOptions(peerOptionsData)
  }

  function handleSelectedPeerGroupChange(selectedPeerGroup){
    setSelectedPeerGroup(selectedPeerGroup.value)
  }

  async function getDummyRatiosData () {
    let ratiosDummyData = await fetch(
      '/api/get_dummy_ratios',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then(response => response.json())

    setRatioData(ratiosDummyData.response)
  }

  async function getDummyStatsData () {
    const selectedPeerParam = selectedPeerGroup ? selectedPeerGroup : 'TNCOM'
    let statsDummyData = await fetch(
      '/api/get_dummy_stats',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({selectedPeerParam})
      }
    ).then(response => response.json())

    setStatsData(statsDummyData.response)
  }

  useEffect(() => {
    getPeerOptions()
    getDummyStatsData()
    getDummyRatiosData()
  }, [])

  useEffect(() => {
    getDummyStatsData()
  }, [selectedPeerGroup])

  return (
    <div className="w-full mx-auto p-12 flex justify-center space-x-6">
      <div className="w-96 flex flex-col items-center">
        <h1 className="text-center text-xl">SCALE - TAB-4 - INSTITUTION</h1>
        <div className="h-[38px] my-2"></div>
        {ratioData &&
          ratioData.map(row => {
            return (
              <div key={row.id} className="p-4 border-2 border-gray-300 rounded-md my-2 w-96 h-36 flex flex-col justify-center items-center">
                {Object.entries(row).map(([key, value]) => {
                  if(key !== 'id'){
                    return (
                      <div key={key + value}><span className="font-semibold">{key.toUpperCase()}</span>: {key === 'period' ? value.split('-')[0] : value}</div>
                    )
                  }
                })}
              </div>
            )
          })
        }
      </div>
      <div className="w-96 flex flex-col items-center">
        <h1 className="text-center text-xl">SCALE - TAB-4 - PEER GROUP</h1>
        <div className="my-2">
          <Select
            className="w-96"
            options={peerOptions}
            placeholder="Select Peer Group"
            onChange={handleSelectedPeerGroupChange}
          />
        </div>
        {statsData &&
          statsData.map(row => {
            return (
              <div key={row.id} className="p-4 border-2 border-gray-300 rounded-md my-2 w-96 h-36 flex flex-col justify-center items-center">
                {Object.entries(row).map(([key, value]) => {
                  if(key !== 'id' && key !== 'peername'){
                    return (
                      <div key={key + value}><span className="font-semibold">{key.toUpperCase()}</span>: {key === 'period' ? value.split('-')[0] : value}</div>
                    )
                  }
                })}
              </div>
            )
          })
        }
      </div>
    </div>
  )
}