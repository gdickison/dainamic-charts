import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

import Loader from "./Loader"
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import { linearRegression } from "../../public/utils"
import { useState, useEffect } from "react"
import { Scatter } from "react-chartjs-2"

const DelinquencyByLoanTerm = ({params, msaName}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()

  useEffect(() => {
    setLoading(true)
    const JSONdata = JSON.stringify({
      startDate: params.startDate,
      endDate: params.endDate,
      msaCode: params.msaCode
    })
    const endpoint = `/api/get_delinquency_by_loan_term`
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
        const dataset = []
        const regressionX = []
        const regressionY = []
        for(const row of data){
          if(row.total_loans >= 10){
            let delinquencyRate = parseFloat((Number(row.delinquent) / Number(row.total_loans)) * 100).toFixed(2)
            if(delinquencyRate > 0 && delinquencyRate < 100){
              dataset.push({
                x: row.loan_term,
                y: delinquencyRate,
                totalAtTerm: row.total_loans,
                delinquentAtTerm: row.delinquent
              })
              regressionX.push(Number(row.loan_term))
              regressionY.push(Number(delinquencyRate))
            }
          }
        }

        const lr = linearRegression(regressionY, regressionX)

        const regressionData = []
        for(const row of dataset){
          if(lr.intercept + (lr.slope * Number(row.x)) > 0){
            regressionData.push({
              x: Number(row.x),
              y: lr.intercept + (lr.slope * Number(row.x))
            })
          }
        }

        setChartData({
          datasets: [
            {
              label: "Delinquency Rate",
              data: dataset,
              borderColor: "#1192e8",
              backgroundColor: "#1192e8",
              pointRadius: 5,
              pointHitRadius: 15,
              pointHoverRadius: 15
            },
            {
              label: "Regression",
              data: regressionData,
              borderColor: '#94A3B8',
              showLine: true,
              pointRadius: 0,
              pointHitRadius: 0
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
                beforeTitle: function(context) {
                  return `Loan Term: ${context[0].raw.x} Months`
                },
                title: function(context) {
                  return `Total Loans at Term: ${(Number(context[0].raw.totalAtTerm)).toLocaleString()}`
                },
                afterTitle: function(context) {
                  return `Delinquent Loans at Term: ${(Number(context[0].raw.delinquentAtTerm)).toLocaleString()}`
                },
                label: function(context) {
                  let label = `Delinquency Rate: ${context.raw.y}%`
                  return label
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
                text: "Loan Term (months)",
                padding: 20,
                font: {
                  size: 16
                }
              },
              ticks: {
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
  }, [params.endDate, params.msaCode, params.startDate])

  if(isLoading) {
    return (
      <Loader/>
    )
  }

  return (
    <div>
      <ChartHeaderWithTooltip
        chartName={"Delinquency by Loan Term"}
        msa={msaName}
        tooltip={"Delinquent loans at the given term are divided by the total loans at that term to show the delinquency rate. Delinquency rates of 0% are not shown. Delinquency rates of 100% generally indicate an anomally based on a very small number of loans at the given rate and are also excluded. Hover over the data points to see details"}
      />
      {chartData &&
        <Scatter data={chartData} options={chartOptions}/>
      }
    </div>
  )
}

export default DelinquencyByLoanTerm