import {
  Chart as ChartJS,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"

ChartJS.register(
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

import Loader from "./Loader"
import { Bar } from "react-chartjs-2"
import { useState, useEffect } from "react"

const DelinquencyByFTBStatus = ({params, msaName}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()

  useEffect(() => {
    setLoading(true)
    const JSONdata = JSON.stringify({
      msaCode: params.msaCode,
      startDate: params.startDate,
      endDate: params.endDate
    })

    const endpoint = `/api/get_delinquency_by_ftbs`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    fetch(endpoint, options)
      .then(res => res.json())
      .then(data => data.response)
      .then(data => {
        console.log('data', data)
        // const delinquencyRateFeatureData = {
        //   labels: [],
        //   datasets: [
        //       {
        //         label: "580-669",
        //         backgroundColor: "#bae6ff",
        //         borderColor: "#bae6ff",
        //         borderWidth: 1,
        //         data: []
        //       },
        //       {
        //         label: "670-739",
        //         backgroundColor: "#33b1ff",
        //         borderColor: "#33b1ff",
        //         borderWidth: 1,
        //         data: []
        //       },
        //       {
        //         label: "740-799",
        //         backgroundColor: "#0072c3",
        //         borderColor: "#0072c3",
        //         borderWidth: 1,
        //         data: []
        //       },
        //       {
        //         label: "800+",
        //         backgroundColor: "#003a6d",
        //         borderColor: "#003a6d",
        //         borderWidth: 1,
        //         data: []
        //       }
        //     ]
        // }

        // for(const row of data){
        //   delinquencyRateFeatureData.labels.push(row.origination_date.split('T')[0])
        //   delinquencyRateFeatureData.datasets[0].data.push(((row.fair_delinquent_for_period / row.fair_total_for_period) * 100).toFixed(2))
        //   delinquencyRateFeatureData.datasets[1].data.push(((row.good_delinquent_for_period / row.good_total_for_period) * 100).toFixed(2))
        //   delinquencyRateFeatureData.datasets[2].data.push(((row.very_good_delinquent_for_period / row.very_good_total_for_period) * 100).toFixed(2))
        //   delinquencyRateFeatureData.datasets[3].data.push(((row.exceptional_delinquent_for_period / row.exceptional_total_for_period) * 100).toFixed(2))
        // }

        // const delinquencyRateFeatureOptions = {
        //   responsive: true,
        //   legend: {
        //     position: 'top'
        //   },
        //   title: {
        //     display: true,
        //     text: "Something Goes Here"
        //   }
        // }

        // setChartData(delinquencyRateFeatureData)
        // setChartOptions(delinquencyRateFeatureOptions)
        // setLoading(false)
      })
  }, [params])

  return (
    <div>
      <h1>Delinquency by First Time Buyer Status goes here</h1>
    </div>
  )
}

export default DelinquencyByFTBStatus