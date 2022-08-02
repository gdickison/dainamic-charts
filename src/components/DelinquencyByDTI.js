import { useEffect, useState, useRef } from "react"

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

import outliers from "outliers"
import Loader from "./Loader"
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import { getLinearRegression, groupDataByMsa, chartSolidColors } from "../../public/utils"
import { Scatter } from "react-chartjs-2"

const DelinquencyByDTI = ({dateRange, selectedRegions}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()
  const thisChart = useRef(null)

  useEffect(() => {
    setLoading(true)

    const msaCodes = selectedRegions.map(region => {
      return region.msa
    })
    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })
    const endpoint = `/api/get_delinquency_by_dti`
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

        const groupedData = groupDataByMsa(data, "msa")

        Object.values(groupedData).forEach(row => {
          row.forEach(item => {
            item.delinquencyRate =  parseFloat((Number(item.delinquent) / Number(item.total)) * 100).toFixed(2)
          })
        })

        const pointStyles = [
          'circle',
          'rect',
          'triangle'
        ]

        const lineData = Object.values(groupedData).map((region, idx) => {
          const dataArray = []
          for(const row of region){
            if(row.total > 2 && row.delinquencyRate > 0 && row.delinquencyRate < 100){
              dataArray.push({
                x: row.dti,
                y: row.delinquencyRate,
                totalAtDTI: row.total,
                delinquentAtDTI: row.delinquent,
                msa: row.msa,
                name: row.name
              })
            }
          }

          return {
            label: `${region[0].name}`,
            data: dataArray,
            borderColor: chartSolidColors[idx],
            borderWidth: 0,
            hoverBorderWidth: 3,
            hoverBorderColor: chartSolidColors[idx],
            backgroundColor: chartSolidColors[idx],
            hoverBackgroundColor: chartSolidColors[idx],
            pointRadius: 8,
            pointHoverBorderWidth: 3,
            pointHitRadius: 5,
            pointHoverRadius: 8,
            msa: region[0].msa,
            pointStyle: pointStyles[idx]
          }
        })

        const regressionData = Object.values(groupedData).map((region, idx) => {
          const regressionX = []
          const regressionY = []

          for(const row of region){
            if(row.total > 2 && row.delinquencyRate > 0 && row.delinquencyRate < 100){
              regressionX.push(Number(row.dti))
              regressionY.push(Number(row.delinquencyRate))
            }
          }

          const lr = getLinearRegression(regressionY, regressionX)
          const regressionData = region.map(row => {
            if((lr.intercept + (lr.slope * Number(row.dti))) > 0){
              return {
                x: Number(row.dti),
                y: lr.intercept + (lr.slope * Number(row.dti))
              }
            }
          })

          return {
            label: `${region[0].name} Regression`,
            data: regressionData,
            borderColor: '#94A3B8',
            backgroundColor: '#94A3B8',
            borderWidth: 3,
            pointRadius: 0,
            pointHitRadius: 0,
            showLine: true,
            hidden: true
          }
        })

        setChartData({
          datasets: lineData.concat(regressionData)
        })

        setChartOptions({
          responsive: true,
          aspectRatio: 2.5,
          hover: {
            mode: 'dataset',
            intersect: true,
          },
          plugins: {
            legend: {
              display: true,
              labels: {
                filter: function(item, chart) {
                  return !item.text.includes('Regression');
                },
                font: {
                  size: 16
                },
                usePointStyle: true
              },
              onHover: function(event, legendItem, legend){
                const dtiChart = legend.chart
                dtiChart.show(legendItem.datasetIndex + lineData.length)
                dtiChart.update()
                dtiChart.setActiveElements([{datasetIndex: legendItem.datasetIndex, index: 0}])
              },
              onLeave: function(event, legendItem, legend){
                const dtiChart = legend.chart
                dtiChart.hide(legendItem.datasetIndex + lineData.length)
                dtiChart.update()
              }
            },
            tooltip: {
              usePointStyle: true,
              callbacks: {
                title: function(context) {
                  return `${context[0].dataset.label}`
                },
                beforeBody: function(context) {
                  return [
                    `Debt-to-Income: ${context[0].raw.x}%`,
                    `Total Loans at DTI: ${context[0].raw.totalAtDTI}`,
                    `Delinquent Loans at DTI: ${context[0].raw.delinquentAtDTI}`
                  ]
                },
                label: function(context) {
                  let label = `Delinquency Rate: ${context.raw.y}%`
                  return label
                },
                labelPointStyle: function(context) {
                  return {
                    pointStyle: `${context.dataset.pointStyle}`,
                    rotation: 0
                  }
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
                callback: function(value){
                  return value + "%"
                },
                font: {
                  size: 16
                }
              },
              grace: 5,
              beginAtZero: true
            },
            x: {
              title: {
                display: true,
                text: "Debt-to-Income Ratio",
                padding: 20,
                font: {
                  size: 16
                }
              },
              ticks: {
                callback: function(value){
                  return value + "%"
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
      })
  }, [dateRange.startDate, dateRange.endDate, selectedRegions])


  if(isLoading){
    return <Loader loadiingText={"Getting debt-to-income data..."}/>
  }

  return (
    <div>

      <ChartHeaderWithTooltip
        chartName={"Delinquency by Debt-to-Income"}
        msa={selectedRegions.length === 1 ? selectedRegions[0].name : "selected regions"}
        tooltip={"Delinquent loans at the given DTI ratio are divided by the total loans at that ratio to show the delinquency rate. Delinquency rates of 0% are not shown. Delinquency rates of 100% generally indicate an anomally based on a very small number of loans at the given rate and are also excluded. Hover over the data points to see details"}
      />
      {chartData &&
        <Scatter id={"dtiChart"} ref={thisChart} data={chartData} options={chartOptions}/>
      }
    </div>
  )
}

export default DelinquencyByDTI