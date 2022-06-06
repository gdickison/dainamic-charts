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

const DelinquencyByUnemploymentRate = ({params, msaName}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()

  const getDelinquencyByUnemploymentChartData = async () => {
    setLoading(true)
    const JSONdata = JSON.stringify({
      startDate: params.startDate,
      endDate: params.endDate,
      msaCode: params.msaCode
    })
    const unemploymentEndpoint = `/api/get_unemployment_rate`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }
    const unemploymentResponse = await fetch(unemploymentEndpoint, options)
    let unemploymentData = await unemploymentResponse.json()
    unemploymentData = unemploymentData.response

    // set up labels
    const chartLabels = []
    unemploymentData.map(row => {
      chartLabels.push(row.origination_date.split('T')[0])
    })

    // set up unemployment rate dataset
    const unemploymentRates = []
    unemploymentData.map(row => {
      unemploymentRates.push(row.unemployment_rate)
    })

    const delinquencyEndpoint = `/api/get_delinquency_data_per_period`
    const delinquencyResponse = await fetch(delinquencyEndpoint, options)
    let delinquencyData = await delinquencyResponse.json()
    delinquencyData = delinquencyData.response

    // set up delinquency rate dataset
    const delinquencyRates = []
    for(const row of delinquencyData){
      delinquencyRates.push(parseFloat((Number(row.delinquent_loans) / Number(row.total_loans)) * 100).toFixed(2))
    }

    setChartData({
      labels: chartLabels,
      datasets: [
        {
          label: "Delinquency Rate",
          data: delinquencyRates,
          borderColor: "#003aff",
          backgroundColor: "#003aff",
          pointRadius: 5,
          pointHitRadius: 15,
          pointHoverRadius: 12
        },
        {
          label: "Unemployment Rate",
          data: unemploymentRates,
          borderColor: "#33b1ff",
          backgroundColor: "#33b1ff",
          pointRadius: 5,
          pointHitRadius: 15,
          pointHoverRadius: 12
        }
      ]
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
              console.log(this.getLabelForValue(value))
              let date = new Date(this.getLabelForValue(value))
              return `${date.toLocaleString('en-us', {month: 'long'})} ${date.getFullYear()}`
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
  }, [params.startDate, params.endDate, params.msaCode])

  if(isLoading) {
    return <Loader/>
  }

  return (
    <div>
      <ChartHeaderWithTooltip
        chartName={"Delinquency by Unemployment Rate"}
        msa={msaName}
      />
      {chartData &&
        <Line data={chartData} options={chartOptions}/>
      }
    </div>
  )
}

export default DelinquencyByUnemploymentRate