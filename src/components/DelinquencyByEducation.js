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
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
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
        backgroundColor: backgroundColors[i],
        hoverBorderColor: "#111827",
        hoverBorderWidth: 3
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
          display: true,
          labels: {
            fontSize: 16
          }
        },
        tooltip: {
          callbacks: {
            beforeTitle: function(context){
              return `${context[0].dataset.label}`
            },
            title: function(context){
              return `Delinquency Rate for ${context[0].label}: `
            },
            label: function(context){
              return(`${context.raw}%`)
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
              size: 20
            }
          },
          ticks: {
            callback: function(value, index, title){
              return `${value}%`
            },
            font: {
              size: 20
            }
          }
        },
        x: {
          title: {
            display: true,
            text: "Education Level",
            padding: 20,
            font: {
              size: 20
            }
          },
          ticks: {
            font: {
              size: 20
            }
          },
          grid: {
            display: false
          }
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
      <ChartHeaderWithTooltip
        chartName={"Delinquency Rate by Education Level"}
        msa={targetRegion.msaName}
        tooltip={"Dainamics' model determines what portion of a regions overall delinquency rate for the chosen period is attributable to education level segments."}
      />
        {chartData &&
          <Bar data={chartData} options={chartOptions} />
        }
    </div>
  )
}

export default DelinquencyByEducation