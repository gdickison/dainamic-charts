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

import { Line } from "react-chartjs-2"

const DelinquencyByUnemploymentRate = ({params, msaName}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()

  const getDelinquencyByUnemploymentChartData = async () => {
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
    console.log('unemploymentData', unemploymentData)

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
    console.log('unemploymentRates', unemploymentRates)

    const delinquencyEndpoint = `/api/get_delinquency_data_per_period`
    const delinquencyResponse = await fetch(delinquencyEndpoint, options)
    let delinquencyData = await delinquencyResponse.json()
    delinquencyData = delinquencyData.response
    console.log('delinquencyData', delinquencyData)

    // set up delinquency rate dataset
    const delinquencyRates = []
    for(const row of delinquencyData){
      delinquencyRates.push(parseFloat((Number(row.delinquent_loans) / Number(row.total_loans)) * 100).toFixed(2))
    }

    setChartData({
      labels: chartLabels,
      datasets: [
        {
          label: "Monthly Unemployment Rate",
          data: unemploymentRates,
          borderColor: "blue",
          backgroundColor: "blue",
          yAxisID: 'y'
        },
        {
          label: "Monthly Delinquency Rate",
          data: delinquencyRates,
          borderColor: "red",
          backgroundColor: "red",
          yAxisID: 'y1'
        }
      ]
    })
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          drawnOnChartArea: false
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawnOnChartArea: false
        }
      }
    },
    elements: {
      line: {
        tension: 0.25,
        borderWidth: 2,
        borderColor: '#1192e8'
      },
      point: {
        radius: 5,
        hitRadius: 5
      }
    }
  }

  useEffect(() => {
    setLoading(true)
    getDelinquencyByUnemploymentChartData()
    setLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  if(isLoading) return <p>The data is loading....</p>
  return (
    <div>
      <h1 className="my-6 text-3xl">Delinquency By Unemployment Rate for {msaName}</h1>
      {chartData &&
        <Line data={chartData} options={chartOptions}/>
      }
    </div>
  )
}

export default DelinquencyByUnemploymentRate