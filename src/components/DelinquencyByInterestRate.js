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
import ChartDescription from "./ChartDescription"
import { linearRegression } from "../../public/utils"
import { useState, useEffect, useRef } from "react"
import { Scatter, Line, Bar } from "react-chartjs-2"

const DelinquencyByInterestRate = ({dateRange, targetRegion, compRegions}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()
  const thisChart = useRef(null)

  useEffect(() => {
    setLoading(true)

    const msaCodes = []
    msaCodes.push(targetRegion.msaCode)
    if(compRegions.length > 0){
      compRegions.map(region => {
        msaCodes.push(region.msa)
      })
    }
    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })
    const endpoint = `/api/get_delinquency_by_interest_rate`
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
        for(const row of data){
          row.interest_rate = (Math.round(row.interest_rate * 8) / 8).toFixed(3)
        }
        const groupDataByMsa = (list, key) => {
          return list.reduce(function(rv, x){
            (rv[x[key]] = rv[x[key]] || []).push(x)
            return rv
          }, {})
        }

        const groupedData = groupDataByMsa(data, "msa")

// ***********************************************************************//
// ***********************************************************************//
// THE GOAL IS TO GET MULTIPLE SETS OF DATA INTO A CHART - EACH SET OF    //
// DATA NEEDS TO BE ATTACHED TO A DATASET OBJECT...WHICH SHOULD NOT BE    //
// THAT HARD                                                              //
//                                                                        //
// ALSO - SHOULD THERE BE A "TARGET" WITH "COMPARABLES", OR JUST MULTIPLE //
// DATA LINES LIKE EMSI DOES IT. I'M LEANING TOWARD THE EMSI WAY          //
// ***********************************************************************//
// ***********************************************************************//

        const rawChartData = []
        Object.values(groupedData).map(value => {
          rawChartData.push(value.reduce((a, v) => {
            if(a[v.interest_rate]){
              a[v.interest_rate].current = Number(a[v.interest_rate].current) + Number(v.current)
              a[v.interest_rate].delinquent = Number(a[v.interest_rate].delinquent) + Number(v.delinquent)
              a[v.interest_rate].total_loans = Number(a[v.interest_rate].total_loans) + Number(v.total_loans)
            } else {
              a[v.interest_rate] = v
            }
            return a
          }, {}))
        })

        rawChartData.map(region => {
          Object.values(region).map(value => {
            value.delinquencyRate =  parseFloat((Number(value.delinquent) / Number(value.total_loans)) * 100).toFixed(2)
            if(value.msa === targetRegion.msaCode){
              value.name = targetRegion.msaName
            } else {
              value.name = compRegions.find(row => row.msa === value.msa).name
            }
          })
        })

        const dataForChart = rawChartData.map(region => {
          const dataset = []
          const regressionX = []
          const regressionY = []
          for(const row of Object.values(region)){
            if(row.delinquencyRate > 0 && row.delinquencyRate < 100){
              dataset.push({
                x: row.interest_rate,
                y: row.delinquencyRate,
                totalAtRate: row.total_loans,
                delinquentAtRate: row.delinquent,
                msa: row.msa,
                name: row.name
              })
              regressionX.push(Number(row.interest_rate))
              regressionY.push(Number(row.delinquencyRate))
            }
          }
          return {dataset, regressionX, regressionY}
        })

        const colors = [
          'rgba(130, 207, 255, 1)',
          'rgba(17, 146, 255, 1)',
          'rgba(0, 83, 255, 1)'
        ]

        const pointStyles = [
          'circle',
          'rect',
          'triangle'
        ]

        const datasets = []
        dataForChart.map((row, i) => {
          const yArray = []
          row.dataset.map(set => {
            yArray.push(Number(set.y))
          })
          const normalized = yArray.filter(outliers())
          const normalHigh = Math.max(...normalized)
          const normalLow = Math.min(...normalized)

          const lineData = []
          for(const dataRow of Object.values(row.dataset)){
            if(dataRow.y <= normalHigh && dataRow.y >= normalLow){
              lineData.push({
                x: dataRow.x,
                y: dataRow.y,
                totalAtRate: dataRow.totalAtRate,
                delinquentAtRate: dataRow.delinquentAtRate,
                msa: dataRow.msa,
                name: dataRow.name
              })
            }
          }

          datasets.push({
            label: `${row.dataset[0].name}`,
            data: lineData,
            borderColor: colors[i],
            borderWidth: 0,
            hoverBorderWidth: 3,
            hoverBorderColor: colors[i],
            backgroundColor: colors[i],
            hoverBackgroundColor: colors[i],
            pointRadius: 8,
            pointHoverBorderWidth: 3,
            pointHitRadius: 5,
            pointHoverRadius: 8,
            msa: row.dataset[0].msa,
            pointStyle: pointStyles[i]
          })

          const regressionData = []
          Object.keys(row.regressionX).forEach(key => {
            const lr = linearRegression(row.regressionY, row.regressionX)
            if((lr.intercept + (lr.slope * Number(row.dataset[key].x))) > 0){
              regressionData.push({
                x: Number(row.dataset[key].x),
                y: lr.intercept + (lr.slope * Number(row.dataset[key].x))
              })
            }
          })

          datasets.push({
            label: `${row.dataset[0].name} Regression`,
            data: regressionData,
            borderColor: '#9CA3AF',
            backgroundColor: '#9CA3AF',
            borderWidth: 3,
            pointRadius: 0,
            pointHitRadius: 0,
            showLine: true,
            hidden: true
          })
        })

        setChartData({datasets})

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
                const myChart = legend.chart
                myChart.show(legendItem.datasetIndex + 1)
                myChart.update()
                myChart.setActiveElements([{datasetIndex: legendItem.datasetIndex, index: 0}])
              },
              onLeave: function(event, legendItem, legend){
                const myChart = legend.chart
                myChart.hide(legendItem.datasetIndex + 1)
                myChart.update()
              }
            },
            tooltip: {
              usePointStyle: true,
              callbacks: {
                beforeTitle: function(context) {
                  return `${context[0].dataset.label}`
                },
                beforeBody: function(context) {
                  return [ `Interest Rate: ${context[0].raw.x}%`, `Total Loans at Rate: ${context[0].raw.totalAtRate}`, `Delinquent Loans at Rate: ${context[0].raw.delinquentAtRate}`]
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
                callback: function(value, index, ticks){
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
                text: "Interest Rate (grouped by .125%)",
                padding: 20,
                font: {
                  size: 16
                }
              },
              ticks: {
                callback: function(value, index, ticks){
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
  }, [dateRange.endDate, targetRegion.msaCode, dateRange.startDate])

  if(isLoading) {
    return (
      <Loader loadiingText={"Getting interest rate data..."}/>
    )
  }

  return (
    <div>
      <ChartHeaderWithTooltip
        chartName={"Delinquency by Interest Rate"}
        msa={compRegions.length > 0 ? "selected regions" : targetRegion.msaName}
        tooltip={"All loans during the selected date range are grouped into increments of .125%. Delinquent loans at the given rate are divided by the total loans at that rate to show the delinquency rate. Delinquency rates of 0% are not shown. Delinquency rates of 100% generally indicate an anomally based on a very small number of loans at the given rate and are also excluded. Hover over the data points to see details"}
      />
      <ChartDescription
        description={`Hover over the legend to see the datapoints and trend line for a region. Hover over a datapoint on the chart for specific details.`}
      />
      {chartData &&
        <div className="relative flex items-center">
          <Scatter id={"intChart"} ref={thisChart} className="my-6" data={chartData} options={chartOptions}/>
        </div>
      }
    </div>
  )
}

export default DelinquencyByInterestRate