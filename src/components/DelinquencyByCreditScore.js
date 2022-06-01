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

    const endpoint = `/api/get_loan_status_by_credit_score`
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
        const delinquencyRateFeatureData = {
          labels: [],
          datasets: [
            {
              label: "580-669",
              backgroundColor: "#bae6ff",
              borderColor: "#bae6ff",
              borderWidth: 1,
              data: [],
              tooltip: []
            },
            {
              label: "670-739",
              backgroundColor: "#33b1ff",
              borderColor: "#33b1ff",
              borderWidth: 1,
              data: [],
              tooltip: []
            },
            {
              label: "740-799",
              backgroundColor: "#0072c3",
              borderColor: "#0072c3",
              borderWidth: 1,
              data: [],
              tooltip: []
            },
            {
              label: "800+",
              backgroundColor: "#003a6d",
              borderColor: "#003a6d",
              borderWidth: 1,
              data: [],
              tooltip: []
            }
          ]
        }

        for(const row of data){
          delinquencyRateFeatureData.labels.push(row.origination_date.split('T')[0])
          delinquencyRateFeatureData.datasets[0].data.push(((row.fair_delinquent_for_period / row.fair_total_for_period) * 100).toFixed(2))
          delinquencyRateFeatureData.datasets[0].tooltip.push({
            totalAtPoint: row.fair_total_for_period,
            delinquentAtPoint: row.fair_delinquent_for_period
          })
          delinquencyRateFeatureData.datasets[1].data.push(((row.good_delinquent_for_period / row.good_total_for_period) * 100).toFixed(2))
          delinquencyRateFeatureData.datasets[1].tooltip.push({
            totalAtPoint: row.good_total_for_period,
            delinquentAtPoint: row.good_delinquent_for_period
          })
          delinquencyRateFeatureData.datasets[2].data.push(((row.very_good_delinquent_for_period / row.very_good_total_for_period) * 100).toFixed(2))
          delinquencyRateFeatureData.datasets[2].tooltip.push({
            totalAtPoint: row.very_good_total_for_period,
            delinquentAtPoint: row.very_good_delinquent_for_period
          })
          delinquencyRateFeatureData.datasets[3].data.push(((row.exceptional_delinquent_for_period / row.exceptional_total_for_period) * 100).toFixed(2))
          delinquencyRateFeatureData.datasets[3].tooltip.push({
            totalAtPoint: row.exceptional_total_for_period,
            delinquentAtPoint: row.exceptional_delinquent_for_period
          })
        }

        const delinquencyRateFeatureOptions = {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            tooltip: {
              callbacks: {
                beforeTitle: function(context){
                  return `Total loans: ${context[0].dataset.tooltip[context[0].dataIndex].totalAtPoint}`
                },
                title: function(context){
                  return `Delinquent loans: ${context[0].dataset.tooltip[context[0].dataIndex].delinquentAtPoint}`
                },
                label: function(context){
                  return(`Delinquency rate: ${context.raw}%`)
                }
              }
            }
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

  if(isLoading) {
    return <Loader/>
  }

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