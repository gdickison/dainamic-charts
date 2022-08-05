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
import { Bar } from "react-chartjs-2"
import { chartFadedColors, chartSolidColors } from "../../public/utils"

const DelinquencyByEducation = ({selectedRegions}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()

  const getDelinquencyByEducationChartData = async () => {
    setLoading(true)
    const msaCodes = selectedRegions.map(region => {
      return region.msa
    })

    const JSONdata = JSON.stringify({
      msaCodes: msaCodes
    })

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    // Get regional delinquency rates
    const delinquencyEndpoint = `api/get_regional_delinquency_rate_for_all_dates`
    const delinquencyResponse = await fetch(delinquencyEndpoint, options)
    let delinquencyData = await delinquencyResponse.json()
    delinquencyData = delinquencyData.response

    delinquencyData = delinquencyData.map(region => ({
      ...region,
      regionalDelinquencyRate: ((Number(region.delinquent) / Number(region.total)) * 100).toFixed(2)
    }))

    // Get education data
    const educationEndpoint = `api/get_population_by_education`

    const educationResponse = await fetch(educationEndpoint, options)
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

    const barChartStructuredData = dataset.map((row, i) => {
      const newRow = row.map(rate => {
        return parseFloat(rate * (delinquencyData[i].regionalDelinquencyRate)).toFixed(2)
      })

      const tooltipData = {
        regionDelinquencyRate: delinquencyData[i].regionalDelinquencyRate,
        regionDelinquent: delinquencyData[i].delinquent_msa,
        regionTotal: delinquencyData[i].total_msa,
        minDate: delinquencyData[i].min,
        maxDate: delinquencyData[i].max
      }

      return {
        label: selectedRegions[i].name,
        data: newRow,
        backgroundColor: chartFadedColors[i],
        borderColor: chartSolidColors[i],
        hoverBackgroundColor: chartSolidColors[i],
        borderWidth: 3,
        tooltip: tooltipData
      }
    })

    setChartData({
      labels: labels,
      datasets: barChartStructuredData
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
            title: function(context){
              return `${context[0].dataset.label}`
            },
            beforeLabel: function(context){
              return `Delinquency Rate for region: ${context.dataset.tooltip.regionDelinquencyRate}%`
            },
            label: function(context){
              return `Delinquency Rate for ${context.label}: ${context.raw}%`
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
  }, [selectedRegions])

  if(isLoading) {
    return <Loader loadiingText={"Getting education level data..."}/>
  }

  return (
    <div>
      <ChartHeaderWithTooltip
        chartName={"Delinquency Rate by Education Level"}
        msa={selectedRegions.length === 1 ? selectedRegions[0].name : "selected regions"}
        tooltip={"Dainamics' model determines what portion of a regions overall delinquency rate for the chosen period is attributable to education level segments. Delinquency is aggragated for all available dates rather than selected start and end dates."}
      />
        {chartData &&
          <Bar data={chartData} options={chartOptions} />
        }
    </div>
  )
}

export default DelinquencyByEducation