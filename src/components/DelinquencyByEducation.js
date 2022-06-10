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
import { Bar, Doughnut } from "react-chartjs-2"

const DelinquencyByEducation = ({dateRange, targetRegion, compRegions}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()

  useEffect(() => {
    setLoading(true)
    const JSONdata = JSON.stringify({
      msaCodes: targetRegion.msaCode
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
          // maintainAspectRatio: false,
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

        setChartOptions({
          responsive: true,
          aspectRatio: 2.5,
          indexAxis: 'y',
          legend: {
            position: 'top'
          }
        })
        setLoading(false)
      })
  }, [targetRegion.msaCode])

  if(isLoading) {
    return <Loader/>
  }

  return (
    <div>
      <h1 className="my-6 text-3xl">Population By Education for {targetRegion.msaName}</h1>
      <div>
        {chartData &&
          <Doughnut data={chartData} options={chartOptions} />
        }
      </div>
    </div>
  )
}

export default DelinquencyByEducation