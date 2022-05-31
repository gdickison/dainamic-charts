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
        const ftbsData = {
          labels: [],
          datasets: [
              {
                label: "1st Time Buyer",
                backgroundColor: "#33b1ff",
                borderColor: "#33b1ff",
                borderWidth: 1,
                data: []
              },
              {
                label: "Not 1st Time Buyer",
                backgroundColor: "#003a6d",
                borderColor: "#003a6d",
                borderWidth: 1,
                data: []
              }
            ]
        }

        data.map((row, i) => {
          if(i % 2 === 0){
            ftbsData.labels.push(row.origination_date.split('T')[0])
          }
          if(row.first_time_buyer_indicator === true){
            ftbsData.datasets[0].data.push(((row.delinquent / row.total_loans) * 100).toFixed(2))
          } else {
            ftbsData.datasets[1].data.push(((row.delinquent / row.total_loans) * 100).toFixed(2))
          }
        })

        const ftbsChartOptions = {
          responsive: true,
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: "Something Goes Here"
          }
        }

        setChartData(ftbsData)
        setChartOptions(ftbsChartOptions)
        setLoading(false)
      })
  }, [params])

  if(isLoading){
    return <Loader/>
  }

  return (
    <>
      {msaName &&
      <>
        <h1 className="my-6 text-3xl">Delinquency By 1st Time Buyer Status for {msaName}</h1>
        <div>
          {chartData &&
            <Bar data={chartData} options={chartOptions} />
          }
        </div>
        </>
      }
    </>
  )
}

export default DelinquencyByFTBStatus