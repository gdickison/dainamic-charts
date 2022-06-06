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
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
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
        const labels = []
        const firstTimeBuyerData = []
        const firstTimeBuyerTooltip = []
        const multiTimeBuyerData = []
        const multiTimeBuyerTooltip = []
        data.map((row, i) => {
          if(i % 2 === 0){
            labels.push(row.origination_date.split('T')[0])
          }
          if(row.first_time_buyer_indicator === true){
            firstTimeBuyerData.push(((row.delinquent / row.total_loans) * 100).toFixed(2))
            firstTimeBuyerTooltip.push({
              totalAtPoint: row.total_loans,
              delinquentAtPoint: row.delinquent
            })
          } else {
            multiTimeBuyerData.push(((row.delinquent / row.total_loans) * 100).toFixed(2))
            multiTimeBuyerTooltip.push({
              totalAtPoint: row.total_loans,
              delinquentAtPoint: row.delinquent
            })
          }
        })

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "1st Time Buyer",
              backgroundColor: "#33b1ff",
              borderColor: "#33b1ff",
              borderWidth: 1,
              data: firstTimeBuyerData,
              tooltip: firstTimeBuyerTooltip
            },
            {
              label: "Multi Time Buyer",
              backgroundColor: "#003a6d",
              borderColor: "#003a6d",
              borderWidth: 1,
              data: multiTimeBuyerData,
              tooltip: multiTimeBuyerTooltip
            }
          ]
        })

        setChartOptions({
          responsive: true,
          aspectRatio: 2.5,
          plugins: {
            legend: {
              display: true
            },
            tooltip: {
              callbacks: {
                beforeTitle: function(context){
                  return `${context[0].dataset.label}`
                },
                title: function(context){
                  return `Total loans: ${context[0].dataset.tooltip[context[0].dataIndex].totalAtPoint}`
                },
                afterTitle: function(context){
                  return `Delinquent loans: ${context[0].dataset.tooltip[context[0].dataIndex].delinquentAtPoint}`
                },
                label: function(context){
                  return `Delinquency rate: ${context.raw}%`
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Delinquency RageRate",
                padding: 20,
                font: {
                  size: 20
                }
              },
              ticks: {
                callback: function(value, index, ticks){
                  return `${value}%`
                },
                font: {
                  size: 16
                }
              }
            },
            x: {
              title: {
                display: true,
                text: "Month",
                padding: 20,
                font: {
                  size: 20
                }
              },
              ticks: {
                callback: function(value){
                  console.log(this.getLabelForValue(value))
                  let date = new Date(this.getLabelForValue(value))
                  return `${date.toLocaleString('en-us', {month: 'long'})} ${date.getFullYear()}`
                },
                font: {
                  size: 16
                }
              },
              grid: {
                display: false
              }
            }
          }
        })

        setLoading(false)
      })
  }, [params])

  if(isLoading){
    return <Loader/>
  }

  return (
    <div>
      <ChartHeaderWithTooltip
        chartName={'Delinquency by First Time Buyer Status'}
        msa={msaName}
      />
      {chartData &&
        <Bar data={chartData} options={chartOptions} />
      }
    </div>
  )
}

export default DelinquencyByFTBStatus