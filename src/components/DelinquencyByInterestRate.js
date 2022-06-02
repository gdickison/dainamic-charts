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
        for(const row of Object.values(filteredData)){
          let delinquencyRate = parseFloat((Number(row.delinquent) / Number(row.total_loans)) * 100).toFixed(2)
          if(delinquencyRate > 0 && delinquencyRate < 100){
            dataset.push({
              x: row.interest_rate,
              y: delinquencyRate,
              totalAtRate: row.total_loans,
              delinquentAtRate: row.delinquent
            })
          }
        }

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Delinquency Rate",
              data: dataset,
              borderColor: '#1192e8',
              backgroundColor: '#1192e8'
            }
          ]
        })
        setLoading(false)
      })
  }, [params.endDate, params.msaCode, params.startDate])

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true
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
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          drawnOnChartArea: false
        }
      }
    },
    elements: {
      line: {
        tension: 0.25,
        borderWidth: 2,
        borderColor: '#1192e8'
      },
      point: {
        radius: 5,
        hitRadius: 15
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
      <h1 className="my-6 text-3xl">Delinquency By Interest Rate for {msaName}</h1>
      {chartData &&
        <Scatter data={chartData} options={chartOptions}/>
      }
      {/* {chartData &&
        <Line data={chartData} options={chartOptions}/>
      } */}
    </div>
  )
}

export default DelinquencyByInterestRate