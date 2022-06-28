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

const DelinquencyByRace = ({dateRange, targetRegion, compRegions}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()

  useEffect(() => {
    setLoading(true)
    const JSONdata = JSON.stringify({
      msaCode: targetRegion.msaCode
    })
    const endpoint = `/api/get_population_by_race`
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
          labels: labels,
          datasets: [
            {
              label: "Population % by Race",
              data: dataset,
              backgroundColor: [
                '#bae6ff',
                '#82cfff',
                '#33b1ff',
                '#1192e8',
                '#0072c3',
                '#00539a'
              ],
              hoverOffset: 25
            }
          ]
        })
        setLoading(false)
      })
  }, [targetRegion.msaCode])

  const chartOptions = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      title: {
        display: true,
        text: "Population % by Race",
        align: "start",
        font: {
          size: 20
        }
      },
      legend: {
        position: "top",
        align: "start",
        labels: {
          boxWidth: 7,
          usePointStyle: true,
          pointStyle: "circle"
        }
      }
    }
  }

  if(isLoading) {
    return <Loader loadiingText={"Getting race data..."}/>
  }

  return(
    <>
      <h1 className="my-6 text-3xl">Population By Race for {targetRegion.msaName}</h1>
      <div>
        {chartData &&
          <Bar data={chartData} options={chartOptions} />
        }
      </div>
    </>
  )
}

export default DelinquencyByRace