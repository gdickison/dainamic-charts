import { useEffect, useState } from "react"

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
import { linearRegression } from "../../public/utils"
import { Scatter } from "react-chartjs-2"
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"

const DelinquencyByLTV = ({params, msaName}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()
  const [showDataLine, setShowDataLine] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  const handleLineToggle = e => {
    setIsChecked(!isChecked)
    setShowDataLine(!showDataLine)
    const tempDatasets = [...chartData.datasets]
    tempDatasets[0] = {
      ...tempDatasets[0],
      showLine: !showDataLine
    }
    setChartData({...chartData, datasets: tempDatasets})
  }

  useEffect(() => {
    setLoading(true)
    const JSONdata = JSON.stringify({
      startDate: params.startDate,
      endDate: params.endDate,
      msaCode: params.msaCode
    })
    const endpoint = `/api/get_delinquency_by_ltv`
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
        const dataset = []
        const regressionX = []
        const regressionY = []
        for(const row of data){
          if(row.total_loans > 10){
            const delinquencyRate = parseFloat((Number(row.delinquent) / Number(row.total_loans)) * 100).toFixed(2)
            if(delinquencyRate > 0 && delinquencyRate < 100){
              dataset.push({
                x: row.ltv,
                y: delinquencyRate,
                totalAtLTV: row.total_loans,
                delinquentAtLTV: row.delinquent
              })
              regressionX.push(Number(row.ltv))
              regressionY.push(Number(delinquencyRate))
            }
          }
        }

        const lr = linearRegression(regressionY, regressionX)

        const regressionData = []
        for(const row of dataset){
          if((lr.intercept + (lr.slope * Number(row.x))) > 0){
            regressionData.push({
              x: Number(row.x),
              y: lr.intercept + (lr.slope * Number(row.x))
            })
          }
        }

        setChartData({
          datasets: [
            {
              label: "Delinquency by LTV",
              data: dataset,
              borderColor: "#1192e8",
              backgroundColor: "#1192e8",
              showLine: false,
              pointRadius: 5,
              pointHitRadius: 15,
              pointHoverRadius: 12,
              yAxisID: 'y'
            },
            {
              label: "Regression",
              data: regressionData,
              borderColor: '#94A3B8',
              backgroundColor: '#94A3B8',
              showLine: true,
              borderWidth: 3,
              pointRadius: 0,
              pointHitRadius: 0,
              yAxisID: 'y1'
            }
          ]
        })

        setChartOptions({
          responsive: true,
          aspectRatio: 2.5,
          plugins: {
            legend: {
              display: true
            },
            tooltip: {
              callbacks: {
                beforeTitle: function(context){
                  return `LTV: ${context[0].raw.x}%`
                },
                title: function(context){
                  return `Total Loans at LTV: ${context[0].raw.totalAtLTV}`
                },
                afterTitle: function(context) {
                  return `Delinquent Loans at LTV: ${context[0].raw.delinquentAtLTV}`
                },
                label: function(context){
                  return `Delinquency Rate: ${context.raw.y}%`
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
                  size: 16
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
            y1: {
              display: false
            },
            x: {
              title: {
                display: true,
                text: "Loan-to-Value (%)",
                padding: 20,
                font: {
                  size: 16
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
            }
          }
        })
        setLoading(false)
        setIsChecked(false)
        setShowDataLine(false)
      })
  }, [params.startDate, params.endDate, params.msaCode])


  if(isLoading){
    return <Loader/>
  }

  return (
    <div>
      <ChartHeaderWithTooltip
        chartName={"Delinquency by LTV"}
        msa={msaName}
        tooltip={"Delinquent loans at the given LTV ratio are divided by the total loans at that ratio to show the delinquency rate. Delinquency rates of 0% are not shown. Delinquency rates of 100% generally indicate an anomally based on a very small number of loans at the given rate and are also excluded. Hover over the data points to see details"}
      />
      <section className="-mt-2 mb-8">
        <label htmlFor="toggle-example" className="flex items-center cursor-pointer relative mb-4">
          <input type="checkbox" id="toggle-example" className="sr-only" checked={isChecked} onChange={handleLineToggle}/>
          <div className="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
          <span className="ml-3 text-gray-900 text-sm font-medium">Show Data Line</span>
        </label>
      </section>
      {chartData &&
        <Scatter data={chartData} options={chartOptions}/>
      }
    </div>
  )
}

export default DelinquencyByLTV