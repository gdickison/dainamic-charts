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

const DelinquencyByNumberOfBorrowers = ({params, msaName}) => {
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

    const endpoint = `/api/get_delinquency_by_num_borrowers`
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
        const structuredData = {
          labels: [],
          datasets: [
            {
              label: "1 Borrower",
              backgroundColor: "#33b1ff",
              borderColor: "#33b1ff",
              borderWidth: 1,
              data: [],
              tooltip: []
            },
            {
              label: "2 Borrowers",
              backgroundColor: "#003a6d",
              borderColor: "#003a6d",
              borderWidth: 1,
              data: [],
              tooltip: []
            }
          ]
        }

        data.map((row, i) => {
          if(i % 2 === 0){
            structuredData.labels.push(row.origination_date.split('T')[0])
          }
          if(row.num_borrowers === 1){
            structuredData.datasets[0].data.push(((row.delinquent / row.total_loans) * 100).toFixed(2))
            structuredData.datasets[0].tooltip.push({
              totalAtPoint: row.total_loans,
              delinquentAtPoint: row.delinquent
            })
          } else {
            structuredData.datasets[1].data.push(((row.delinquent / row.total_loans) * 100).toFixed(2))
            structuredData.datasets[1].tooltip.push({
              totalAtPoint: row.total_loans,
              delinquentAtPoint: row.delinquent
            })
          }
        })

        const options = {
          responsive: true,
          aspectRatio: 3,
          plugins: {
            legend: {
              position: 'top'
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
                  return(`Delinquency rate: ${context.raw}%`)
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: true,
                text: "Delinquency Rate",
                padding: 20,
                font: {
                  size: 16
                }
              },
              ticks: {
                callback: function(value, index, ticks){
                  return value + "%"
                },
                font: {
                  size: 16
                }
              },
              grace: 5,
              beginAtZero: true
            },
            x: {
              title: {
                display: true,
                text: "Month",
                padding: 20,
                font: {
                  size: 16
                }
              },
              ticks: {
                callback: function(value){
                  let date = new Date(this.getLabelForValue(value))
                  return `${date.toLocaleString('en-us', {month: 'long'})} ${date.getFullYear()}`
                },
                font: {
                  size: 16
                }
              }
            }
          }
        }

        setChartData(structuredData)
        setChartOptions(options)
        setLoading(false)
      })
  }, [params])

  if(isLoading){
    return <Loader/>
  }

  return (
    <div>
      <h1 className="my-2 text-2xl">Delinquency By Number of Borrowers for {msaName}</h1>
      <div className="space-y-2 text-sm">
        <p>All loans for each month are grouped by number of borrowers (1 or 2). Delinquent loans are divided by the total loans to show the delinquency rate. Loans with 3+ borrowers are rare and are excluded. Hover over the bars to see details</p>
      </div>
      <div>
        {chartData &&
          <div className="relative flex items-center">
            <Bar data={chartData} options={chartOptions} />
          </div>
        }
      </div>
    </div>
  )
}

export default DelinquencyByNumberOfBorrowers