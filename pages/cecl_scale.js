import { useEffect, useState } from "react"
import Select from "react-select"
import { supabase } from '../src/utils/supabase';

export default function SCALE ({ ratiosDummyData }) {
  console.log('ratiosDummyData', ratiosDummyData)
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

  // async function getDummyRatiosData () {
  //   let ratiosDummyData = await fetch(
  //     '/api/get_dummy_ratios',
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     }
  //   ).then(response => response.json())

  //   setRatioData(ratiosDummyData.response)
  // }

  async function getDummyStatsData () {
    const selectedPeerParam = selectedPeerGroup ? selectedPeerGroup : 'TNCOM'
    let statsDummyData = await supabase.from(
      'ubpr_stats_dummy_ubpse019'
    ).select().like('period', '%12-31%').match({peercode: selectedPeerParam}).order('period', {ascending: false})
console.log('statsDummyData', statsDummyData)
    setStatsData(statsDummyData.data)
  }
  // async function getDummyStatsData () {
  //   const selectedPeerParam = selectedPeerGroup ? selectedPeerGroup : 'TNCOM'
  //   let statsDummyData = await fetch(
  //     '/api/get_dummy_stats',
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({selectedPeerParam})
  //     }
  //   ).then(response => response.json())

  //   setStatsData(statsDummyData.response)
  // }

  useEffect(() => {
    getPeerOptions()
    getDummyStatsData()
    // getDummyRatiosData()
  }, [])

  useEffect(() => {
    getDummyStatsData()
  }, [selectedPeerGroup])

  function exportTableToExcel(){
    if(document.getElementById('exportTable') !== null) {
      var downloadLink;
      var dataType = 'application/vnd.ms-excel';
      var tableSelect = document.getElementById('exportTable');
      var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
      // Specify file name
      // filename = filename?filename+'.xls':'excel_data.xls';
      const filename = 'download.xls'

      // Create download link element
      downloadLink = document.createElement("a");

      document.body.appendChild(downloadLink);

      if(navigator.msSaveOrOpenBlob){
          var blob = new Blob(['\ufeff', tableHTML], {
              type: dataType
          });
          navigator.msSaveOrOpenBlob( blob, filename);
      }else{
          // Create a link to the file
          downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

          // Setting the file name
          downloadLink.download = filename;

          //triggering the function
          downloadLink.click()
      }
    }
  }

  return (
    <>
      <div className="w-full mx-auto p-12 flex justify-center space-x-6">
        <div className="w-96 flex flex-col items-center">
          <h1 className="text-center text-xl">SCALE - TAB-4 - INSTITUTION</h1>
          <div className="h-[38px] my-2"></div>
          {ratiosDummyData &&
            ratiosDummyData.map(row => {
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
      <div className="flex justify-center mb-12 mx-auto py-2 px-4 border-2 border-blue-500 w-[800px] rounded-md">
        <table id='exportTable' className="hidden">
          <thead>
            {/* <tr>
              <th>{'TEST HEADER'}</th>
            </tr> */}
            <tr>
              <th>Year</th>
              <th>Code</th>
              <th>Percent</th>
            </tr>
          </thead>
          <tbody>
            {ratiosDummyData && ratiosDummyData.map(row => {
              return (
                <tr key={row.id}>
                  <td>{row.period.split('-')[0]}</td>
                  <td>{row.idrssd}</td>
                  <td>{row.ubpre019}</td>
                </tr>
              )
            })}
            {statsData && statsData.map((row, i) => {
              return (
                <tr key={row.id}>
                  <td>{row.period.split('-')[0]}</td>
                  <td>{row.peercode}</td>
                  <td>{row.ubpse019}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <button onClick={exportTableToExcel}>Download Data</button>
      </div>
    </>
  )
}

export async function getServerSideProps() {
  let { data } = await supabase.from('ubpr_ratios_dummy_ubpre019').select().like('period', '%12-31%')

  return {
    props: {
     ratiosDummyData: data
    },
  }
}