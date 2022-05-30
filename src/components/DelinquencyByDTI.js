import { useEffect, useState } from "react"

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
import { Line } from "react-chartjs-2"

const DelinquencyByDTI = ({params, msaName}) => {
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
    const endpoint = `/api/get_delinquency_by_dti`
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

        const labels = []
        const dataset = []
        for(const row of data){
          if(row.total_loans > 10){
            const delinquencyRate = parseFloat((Number(row.delinquent) / Number(row.total_loans)) * 100).toFixed(2)
            if(delinquencyRate > 0 && delinquencyRate < 100){
              labels.push(row.dti)
              dataset.push({
                x: row.dti,
                y: delinquencyRate,
                totalAtDTI: row.total_loans,
                delinquentAtDTI: row.delinquent
              })
            }
          }
        }

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Delinquency by DTI",
              data: dataset,
              borderColor: "blue",
              backgroundColor: "blue"
            }
          ]
        })

        setChartOptions({
          responsive: true,
          plugins: {
            legend: {
              display: true
            },
            tooltip: {
              callbacks: {
                beforeTitle: function(context){
                  return `DTI: ${context[0].raw.x}`
                },
                title: function(context){
                  return `Total Loans at DTI: ${context[0].raw.totalAtDTI}`
                },
                afterTitle: function(context) {
                  return `Delinquent Loans at DTI: ${context[0].raw.delinquentAtDTI}`
                },
                label: function(context){
                  return `Delinquency Rate: ${context.raw.y}%`
                }
              }
            }
          },
          // scales: {
          //   y: {
          //     type: 'linear',
          //     display: true,
          //     position: 'left',
          //     grid: {
          //       drawnOnChartArea: false
          //     }
          //   },
          //   y1: {
          //     type: 'linear',
          //     display: true,
          //     position: 'right',
          //     grid: {
          //       drawnOnChartArea: false
          //     }
          //   }
          // },
          elements: {
            line: {
              // tension: 0.25,
              borderWidth: 2,
              borderColor: '#1192e8'
            },
            point: {
              radius: 5,
              hitRadius: 15
            }
          }
        })

        console.log('labels', labels)
        console.log('dataset', dataset)
      })
    setLoading(false)
  }, [params.startDate, params.endDate, params.msaCode])


  if(isLoading){
    return <Loader/>
  }
  return (
    <div>
      <h1 className="my-6 text-3xl">Delinquency By DTI for {msaName}</h1>
      {chartData &&
        <Line data={chartData} options={chartOptions}/>
      }
    </div>
  )
}

export default DelinquencyByDTI