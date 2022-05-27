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
import { useState, useEffect } from "react"
import { Bar } from "react-chartjs-2"

const DelinquencyByEducation = ({params, msaName}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()

  useEffect(() => {
    setLoading(true)
    const JSONdata = JSON.stringify({
      msaCode: params.msaCode
    })
    const endpoint = `api/get_population_by_education`
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
        for(const [key, value] of Object.entries(data)){
          labels.push(key)
          dataset.push(parseFloat(value * 100).toFixed(2))
        }

        setChartData({
          maintainAspectRatio: false,
          labels: labels,
          datasets: [
            {
              label: "Population by Education",
              data: dataset,
              backgroundColor: [
                '#bae6ff',
                '#33b1ff',
                '#0072c3',
                '#003a6d'
              ]
            }
          ]
        })
        setLoading(false)
      })
  }, [params.msaCode])

  const chartOptions = {
    responsive: true,
    indexAxis: 'y',
    legend: {
      position: 'top'
    }
  }

  if(isLoading) {
    return <Loader/>
  }

  return (
    <>
      {msaName &&
        <>
          <h1 className="my-6 text-3xl">Population By Education for {msaName}</h1>
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

export default DelinquencyByEducation