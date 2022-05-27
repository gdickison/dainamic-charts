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
    const endpoint = `/api/get_delinquency_by_interest_rate_data`
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
            a[v.interest_rate].current_at_rate = Number(a[v.interest_rate].current_at_rate) + Number(v.current_at_rate)
            a[v.interest_rate].delinquent_at_rate = Number(a[v.interest_rate].delinquent_at_rate) + Number(v.delinquent_at_rate)
            a[v.interest_rate].total_at_rate = Number(a[v.interest_rate].total_at_rate) + Number(v.total_at_rate)
            a[v.interest_rate].total_loans = Number(a[v.interest_rate].total_loans) + Number(v.total_loans)
          } else {
            a[v.interest_rate] = v
          }
          return a
        }, {})

        const labels = []
        const dataset = []
        for(const row of Object.values(filteredData)){
          let delinquencyRate = parseFloat((Number(row.delinquent_at_rate) / Number(row.total_loans)) * 100).toFixed(2)
          if(delinquencyRate > 0 && delinquencyRate < 100){
            dataset.push({
              x: row.interest_rate,
              y: delinquencyRate
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
        hitRadius: 5
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