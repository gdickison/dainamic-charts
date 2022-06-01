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

const DelinquencyByLoanTerm = ({params, msaName}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()

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
        const labels = []
        const dataset = []
        for(const row of data){
          if(row.total_loans >= 10){
            labels.push(row.loan_term)
            let delinquencyRate = parseFloat((Number(row.delinquent) / Number(row.total_loans)) * 100).toFixed(2)
            if(delinquencyRate > 0 && delinquencyRate < 100){
              dataset.push({
                x: row.loan_term,
                y: delinquencyRate,
                totalAtTerm: row.total_loans,
                delinquentAtTerm: row.delinquent
              })
            }
          }
        }

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Delinquency Rate",
              data: dataset,
              borderColor: "#1192e8",
              backgroundColor: "#1192e8"
            }
          ]
        })
        setLoading(false)
      })
  }, [params])

  const chartOptions = {
    responsive: true,
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
        hitRadius: 20
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
      <h1 className="my-6 text-3xl">Delinquency By Loan Term for {msaName}</h1>
      {chartData &&
        <Scatter data={chartData} options={chartOptions}/>
      }
      {/* {chartData &&
        <Line data={chartData} options={chartOptions}/>
      } */}
    </div>
  )
}

export default DelinquencyByLoanTerm