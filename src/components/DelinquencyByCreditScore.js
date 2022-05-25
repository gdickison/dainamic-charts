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

import { Bar } from "react-chartjs-2"
import { useState, useEffect } from "react"

const DelinquencyByCreditScore = ({params, msaName}) => {
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

    const endpoint = `/api/get_loan_status_by_credit_score_for_date_range`
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
        const delinquencyRateFeatureData = {
          labels: [],
          datasets: [
              {
                label: "580-669",
                backgroundColor: "#bae6ff",
                borderColor: "#bae6ff",
                borderWidth: 1,
                data: []
              },
              {
                label: "670-739",
                backgroundColor: "#33b1ff",
                borderColor: "#33b1ff",
                borderWidth: 1,
                data: []
              },
              {
                label: "740-799",
                backgroundColor: "#0072c3",
                borderColor: "#0072c3",
                borderWidth: 1,
                data: []
              },
              {
                label: "800+",
                backgroundColor: "#003a6d",
                borderColor: "#003a6d",
                borderWidth: 1,
                data: []
              }
            ]
        }

        for(let i = 0; i < data.length; i++){
          delinquencyRateFeatureData.labels.push(data[i].origination_date.split('T')[0])
        }

        for(let i = 0; i < data.length; i++){
          delinquencyRateFeatureData.datasets[0].data.push(((data[i].fair_delinquent_for_period / data[i].fair_total_for_period) * 100).toFixed(2))
          delinquencyRateFeatureData.datasets[1].data.push(((data[i].good_delinquent_for_period / data[i].good_total_for_period) * 100).toFixed(2))
          delinquencyRateFeatureData.datasets[2].data.push(((data[i].very_good_delinquent_for_period / data[i].very_good_total_for_period) * 100).toFixed(2))
          delinquencyRateFeatureData.datasets[3].data.push(((data[i].exceptional_delinquent_for_period / data[i].exceptional_total_for_period) * 100).toFixed(2))
        }

        console.log(delinquencyRateFeatureData)

        const delinquencyRateFeatureOptions = {
          responsive: true,
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: "Something Goes Here"
          }
        }

        setChartData(delinquencyRateFeatureData)
        setChartOptions(delinquencyRateFeatureOptions)
        setLoading(false)
      })
  }, [params])

  if(isLoading) return <p>Waiting for data....</p>
  return (
    <>
      {msaName &&
      <>
        <h1 className="my-6 text-3xl">Delinquency By Credit Score for {msaName}</h1>
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

export default DelinquencyByCreditScore