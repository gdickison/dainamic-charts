import { useState, useEffect } from "react"

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
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import { Line } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByMsa, chartFadedColors, chartSolidColors } from "../../public/utils"

const DelinquencyByUnemploymentRate = ({dateRange, targetRegion, compRegions}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()

  const getDelinquencyByUnemploymentChartData = async () => {
    setLoading(true)
console.log('targetRegion', targetRegion)
    const msaCodes = []
    msaCodes.push(targetRegion.msa)
    if(compRegions.length > 0) {
      compRegions.map(region => {
        msaCodes.push(region.msa)
      })
    }

    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    // Get unemployment data
    const unemploymentEndpoint = `/api/get_unemployment_rate`
    const unemploymentResponse = await fetch(unemploymentEndpoint, options)
    let unemploymentData = await unemploymentResponse.json()
    unemploymentData = unemploymentData.response

    const unemploymentDataByMsa = Object.values(groupDataByMsa(unemploymentData, "msa"))

    const unemploymentRateStructuredData = unemploymentDataByMsa.map((region, idx) => {
      const unemploymentRateData = region.map(row => {
        return row.unemployment_rate
      })

      return {
        label: `${idx === 0 ? targetRegion.name.split(",")[0] : compRegions[idx - 1].name.split(",")[0]} Unemployment Rate`,
        data: unemploymentRateData,
        borderColor: chartFadedColors[idx],
        backgroundColor: chartFadedColors[idx],
        pointRadius: 5,
        pointHitRadius: 15,
        pointHoverRadius: 12
      }
    })

    // Get delinquency data
    const delinquencyEndpoint = `/api/get_delinquency_data_per_period`
    const delinquencyResponse = await fetch(delinquencyEndpoint, options)
    let delinquencyData = await delinquencyResponse.json()
    delinquencyData = delinquencyData.response

    const delinquencyDataByMsa = Object.values(groupDataByMsa(delinquencyData, "msa"))

    const delinquencyRateStructuredData = delinquencyDataByMsa.map((region, idx) => {
      const delinquencyRateData = region.map(row => {
        return parseFloat((Number(row.delinquent) / Number(row.total) * 100).toFixed(2))
      })

      return {
        label: `${idx === 0 ? targetRegion.name.split(",")[0] : compRegions[idx - 1].name.split(",")[0]} Delinquency Rate`,
        data: delinquencyRateData,
        borderColor: chartSolidColors[idx],
        backgroundColor: chartSolidColors[idx],
        pointRadius: 5,
        pointHitRadius: 15,
        pointHoverRadius: 12
      }
    })

    const chartLabels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)

    setChartData({
      labels: chartLabels,
      datasets: [].concat(delinquencyRateStructuredData, unemploymentRateStructuredData)
    })

    setChartOptions({
      responsive: true,
      aspectRatio: 2.5,
      interaction: {
        mode: 'index'
      },
      plugins: {
        legend: {
          display: true
        },
        tooltip: {
          callbacks: {
            label: function(context){
              return `${context.dataset.label} ${context.raw}%`
            }
          }
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: "Rate",
            padding: 20,
            font: {
              size: 20
            }
          },
          ticks: {
            callback: function(value, index, ticks){
              return `${value}%`
            },
            font: {
              size: 16
            }
          }
        },
        x: {
          title: {
            display: true,
            text: "Origination Month",
            padding: 20,
            font: {
              size: 16
            }
          },
          ticks: {
            callback: function(value){
              return `${this.getLabelForValue(value)}`
            },
            font: {
              size: 16
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
    getDelinquencyByUnemploymentChartData()
  }, [dateRange.startDate, dateRange.endDate, targetRegion.msa])

  if(isLoading) {
    return <Loader loadiingText={"Getting unemployment data..."}/>
  }

  return (
    <div>
      <ChartHeaderWithTooltip
        chartName={"Delinquency by Unemployment Rate"}
        msa={targetRegion.name}
      />
      {chartData &&
        <Line data={chartData} options={chartOptions}/>
      }
    </div>
  )
}

export default DelinquencyByUnemploymentRate