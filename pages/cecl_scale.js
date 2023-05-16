import { useEffect, useState } from "react"
import Select from "react-select"
import { supabase } from '../src/utils/supabase';
import Loader from '../src/components/Loader'

export default function SCALE ({ peerOptions }) {
  console.log('peerOptions', peerOptions)
  const [statsData, setStatsData] = useState(null)
  const [ratioData, setRatioData] = useState(null)
  const [selectedPeerGroup, setSelectedPeerGroup] = useState(null)

  function handleSelectedPeerGroupChange(selectedPeerGroup){
    setSelectedPeerGroup(selectedPeerGroup.value)
  }

  async function getDummyRatiosData () {
    const ratiosDummyData = await supabase.from(
      'ubpr_ratios_dummy_ubpre019'
    ).select().like('period', '%12-31%').order('period')

    setRatioData(ratiosDummyData.data)
  }

  async function getDummyStatsData () {
    const selectedPeerParam = selectedPeerGroup ? selectedPeerGroup : 'TNCOM'
    const statsDummyData = await supabase.from(
      'ubpr_stats_dummy_ubpse019'
    ).select().like('period', '%12-31%').match({peercode: selectedPeerParam}).order('period')

    setStatsData(statsDummyData.data)
  }

  useEffect(() => {
    getDummyStatsData()
    getDummyRatiosData()
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
      const filename = 'scale_tab_4.xls'

      // Create download link element
      downloadLink = document.createElement("a");

      document.body.appendChild(downloadLink);

      if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
          type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
      } else {
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click()
      }
    }
  }

  if(!ratioData || !statsData){
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader/>
      </div>
    )
  }

  if(ratioData && statsData){
    const ratioAvg = (ratioData.reduce((a,b) => a + b.ubpre019, 0) / ratioData.length).toFixed(4)
    const statsAvg = (statsData.reduce((a,b) => a + Number(b.ubpse019), 0) / statsData.length).toFixed(4)
    const adjustment = (ratioAvg - statsAvg).toFixed(4)

    return (
      <div className="my-12">
        <h1 className="text-center text-xl">SCALE - TAB-4</h1>
        <h1 className="text-center text-xl">Adjustment to Proxy Expected Lifetime Loss Rate to Reflect Institution's Historical Performance</h1>
        <div className="w-full mx-auto p-12 flex justify-center space-x-6">
          <div className="w-96 flex flex-col items-center">
            <div className="my-2">
              <Select
                className="w-[800px]"
                options={peerOptions}
                placeholder="Select Peer Group"
                onChange={handleSelectedPeerGroupChange}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center mb-12 mx-auto py-2 px-4 border-2 border-blue-500 w-[800px] rounded-md">
          <div className="w-full">
            <table id='exportTable' className="w-full">
              <thead>
                <tr>
                  <th colSpan={2}>Institution ({ratioData[0].idrssd})</th>
                  <th colSpan={2}>Peer ({statsData[0].peercode})</th>
                </tr>
                <tr>
                  <th colSpan={2}>Net Loss to Average Total LNLS</th>
                  <th colSpan={2}>Net Loss to Average Total LNLS</th>
                </tr>
                <tr>
                  <th>Year</th>
                  <th>Percent</th>
                  <th>Year</th>
                  <th>Percent</th>
                </tr>
              </thead>
              <tbody>
                {ratioData.map((row, i) => {
                  return (
                    <tr key={row.id}>
                      <td className="w-1/4 text-center">{row.period.split('-')[0]}</td>
                      <td className="w-1/4 text-center">{row.ubpre019.toFixed(2)}%</td>
                      <td className="w-1/4 text-center">{statsData[i].period.split('-')[0]}</td>
                      <td className="w-1/4 text-center">{statsData[i].ubpse019}%</td>
                    </tr>
                  )
                })}
                <tr>
                  <td className="w-1/4 text-center text-lg">Average</td>
                  <td className="w-1/4 text-center text-lg border-2">{ratioAvg}%</td>
                  <td className="w-1/4 text-center text-lg">Average</td>
                  <td className="w-1/4 text-center text-lg border-2">{statsAvg}%</td>
                </tr>
                <tr className="h-2"></tr>
                <tr>
                  <td className="w-1/4 text-center text-lg">Adjustment</td>
                  <td className="w-1/4 text-center text-lg border-2">{adjustment}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-center">
          <button className="w-[800px] border-2 border-blue-500 py-4 rounded-md hover:bg-blue-500 hover:text-blue-50" onClick={exportTableToExcel}>Download Data</button>
        </div>
      </div>
    )
  }
}

export async function getServerSideProps() {
  let { data } = await supabase.from(
      'peer_groups'
    )
    .select()
    .order('peername')

  const peerOptionsData = data.map(row => {
    return ({
      value: row.peercode,
      label: `${row.peername} (${row.peercode})`
    })
  })

  return {
    props: {
     peerOptions: peerOptionsData
    },
  }
}