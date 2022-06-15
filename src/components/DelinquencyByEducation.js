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

const DelinquencyByEducation = ({targetRegion, compRegions, regionalDelinquencyRates}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()

  const getDelinquencyByEducationChartData = async () => {
    setLoading(true)
    const msaCodes = []
    msaCodes.push(targetRegion.msaCode)
    if(compRegions.length > 0){
      compRegions.map(region => {
        msaCodes.push(region.msa)
      })
    }

    const JSONdata = JSON.stringify({
      msaCodes: msaCodes
    })

    const endpoint = `api/get_population_by_education`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    const educationResponse = await fetch(endpoint, options)
    let educationData = await educationResponse.json()
    educationData = educationData.response

    const labels = []
    const dataset = []
    educationData.map((row, i) => {
      const dataGroup = []
      for(const [key, value] of Object.entries(row)){
        if(i === 0 && key !== 'msa'){
          labels.push(key)
        }
        if(key !== 'msa'){
          dataGroup.push(value)
        }
      }
      dataset.push(dataGroup)
    })

    const backgroundColors = [
      '#bae6ff',
      '#33b1ff',
      '#0072c3',
      '#003a6d'
    ]

    const rawChartData = dataset.map((row, i) => {
      const newRow = row.map(rate => {
        return parseFloat(rate * Number(regionalDelinquencyRates[i].delinquencyRate)).toFixed(2)
      })

      return {
        label: i === 0 ? targetRegion.msaName : compRegions[i - 1].name,
        data: newRow,
        backgroundColor: backgroundColors[i]
      }
    })


    setChartData({
      labels: labels,
      datasets: rawChartData
    })

    setChartOptions({
      responsive: true,
      aspectRatio: 2.5,
      plugins: {
        legend: {
          display: true
        }
      }
    })
    setLoading(false)
  }

  useEffect(() => {
    getDelinquencyByEducationChartData()
  }, [])

  if(isLoading) {
    return <Loader/>
  }

  return (
    <div>
      <h1 className="my-6 text-3xl">Population By Education for {targetRegion.msaName}</h1>
      <div>
        {chartData &&
          <Bar data={chartData} options={chartOptions} />
        }
      </div>
    </div>
  )
}

export default DelinquencyByEducation