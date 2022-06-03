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
import { linearRegression } from "../../public/utils"
import { useState, useEffect } from "react"
import { Line, Scatter } from "react-chartjs-2"

const DelinquencyByInterestRate = ({params, msaName}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()

  useEffect(() => {
    setLoading(true)
    const JSONdata = JSON.stringify({
      startDate: params.startDate,
      endDate: params.endDate,
      msaCode: params.msaCode
    })
    const endpoint = `/api/get_delinquency_by_interest_rate`
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
        for(const row of data){
          row.interest_rate = (Math.round(row.interest_rate * 8) / 8).toFixed(3)
        }

        const filteredData = data.reduce((a, v) => {
          if(a[v.interest_rate]){
            a[v.interest_rate].current = Number(a[v.interest_rate].current) + Number(v.current)
            a[v.interest_rate].delinquent = Number(a[v.interest_rate].delinquent) + Number(v.delinquent)
            a[v.interest_rate].total_loans = Number(a[v.interest_rate].total_loans) + Number(v.total_loans)
          } else {
            a[v.interest_rate] = v
          }
          return a
        }, {})

        const labels = []
        const dataset = []
        const regressionX = []
        const regressionY = []
        for(const row of Object.values(filteredData)){
          let delinquencyRate = parseFloat((Number(row.delinquent) / Number(row.total_loans)) * 100).toFixed(2)
          if(delinquencyRate > 0 && delinquencyRate < 100){
            dataset.push({
              x: row.interest_rate,
              y: delinquencyRate,
              totalAtRate: row.total_loans,
              delinquentAtRate: row.delinquent
            })
            regressionX.push(Number(row.interest_rate))
            regressionY.push(Number(delinquencyRate))
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

        setChartData(
          {
            labels: labels,
            type: 'scatter',
            datasets: [
              {
                label: "Delinquency Rate",
                data: dataset,
                borderColor: '#1192e8',
                backgroundColor: '#1192e8',
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
          }
        )
        setLoading(false)
      })
  }, [params.endDate, params.msaCode, params.startDate])

  const chartOptions = {
    responsive: true,
    aspectRatio: 3,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          beforeTitle: function(context) {
            return `Interest Rate: ${context[0].raw.x}%`
          },
          title: function(context) {
            return `Total Loans at Rate: ${context[0].raw.totalAtRate}`
          },
          afterTitle: function(context) {
            return `Delinquent Loans at Rate: ${context[0].raw.delinquentAtRate}`
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
        beginAtZero: true,
        grid: {
          drawnOnChartArea: false
        }
      },
      x: {
        title: {
          display: true,
          text: "Interest Rate (grouped by .125%)",
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
        }
      }
    }
  }

  if(isLoading) {
    return (
      <Loader/>
    )
  }

  return (
    <div>
      <h1 className="my-2 text-2xl">Delinquency By Interest Rate for {msaName}</h1>
      <div className="space-y-2 text-sm">
        <p>All loans during the selected date range are grouped into increments of .125%. Delinquent loans at the given rate are divided by the total loans at that rate to show the delinquency rate. Delinquency rates of 0% are not shown. Delinquency rates of 100% generally indicate an anomally based on a very small number of loans at the given rate and are also excluded. The gray line shows the regression. Hover over the data points to see details</p>
      </div>
      {chartData &&
      <div className="relative flex items-center">
        <Scatter className="my-6" data={chartData} options={chartOptions}/>
      </div>
      }
      {/* {chartData &&
        <Line data={chartData} options={chartOptions}/>
      } */}
    </div>
  )
}

export default DelinquencyByInterestRate