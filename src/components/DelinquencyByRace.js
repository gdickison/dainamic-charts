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
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import { chartFadedColors, chartSolidColors } from "../../public/utils"

const DelinquencyByRace = ({targetRegion, compRegions}) => {
  const [isLoading, setLoading] = useState(false)
  const [barChartData, setBarChartData] = useState()
  const [barChartOptions, setBarChartOptions] = useState()

  const getDelinquencyByRaceChartData = async () => {
    setLoading(true)
    const msaCodes = []
    msaCodes.push(targetRegion.msa)
    if(compRegions.length > 0){
      compRegions.map(region => {
        msaCodes.push(region.msa)
      })
    }

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

    // Get race data
    const raceEnpoint = `/api/get_population_by_race`

    const raceResponse = await fetch(raceEnpoint, options)
    let raceData = await raceResponse.json()
    raceData = raceData.response

    const chartLabels = []
    const barDataset = []
    raceData.map((row, i) => {
      const dataGroup = []
      for(const [key, value] of Object.entries(row)){
        if(i === 0 && key !== 'msa'){
          chartLabels.push(key)
        }
        if(key !== 'msa'){
          dataGroup.push(value)
        }
      }
      barDataset.push(dataGroup)
    })

    const barChartStructuredData = barDataset.map((row, i) => {
      const delinquencyRateData = row.map(rate => {
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
        label: i === 0 ? targetRegion.name : compRegions[i - 1].name,
        data: delinquencyRateData,
        backgroundColor: chartFadedColors[i],
        borderColor: chartSolidColors[i],
        hoverBackgroundColor: chartSolidColors[i],
        borderWidth: 3,
        tooltip: tooltipData,
        pointHitRadius: 5
      }
    })

    setBarChartData({
      labels: chartLabels,
      datasets: barChartStructuredData
    })

    setBarChartOptions({
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
            text: "Race",
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
    getDelinquencyByRaceChartData()
  }, [])

  if(isLoading) {
    return <Loader loadiingText={"Getting race data..."}/>
  }

  return(
    <div>
      <ChartHeaderWithTooltip
        chartName={"Delinquency Rate by Race"}
        msa={compRegions.length > 0 ? "selected regions" : targetRegion.name}
        tooltip={"Dainamics' model determines what portion of a regions overall delinquency rate for the chosen period is attributable to racial populations. Delinquency is aggragated for all available dates rather than selected start and end dates."}
      />
        {barChartData &&
          <Bar data={barChartData} options={barChartOptions} />
        }
    </div>
  )
}

export default DelinquencyByRace