import Loader from "./Loader"
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import { Bar } from "react-chartjs-2"
import { useState, useEffect } from "react"
import { groupDataByMsa, chartSolidColors, chartFadedColors } from "../../public/utils"

const DelinquencyByHighBalance = ({dateRange, selectedRegions}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()

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

    const endpoint = `/api/get_delinquency_by_high_balance`
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
        const groupedData = Object.values(groupDataByMsa(data, "msa"))

        const hbBarChartData = {
          labels: [],
          datasets: []
        }

        groupedData.forEach((region, regionIdx) => {
          const highBalanceData = []
          const highBalanceTooltip = []
          const lowBalanceBuyerData = []
          const lowBalanceBuyerTooltip = []
          if(regionIdx === 0){
            region.forEach((row, i) => {
              if(i % 2 === 0){
                hbBarChartData.labels.push((row.origination_date.split('T')[0]).toString())
              }
            })
          }
          region.forEach(row => {
            if(row.highBalance === true){
              highBalanceData.push(((row.delinquent / row.total) * 100).toFixed(2))
              highBalanceTooltip.push({
                totalAtPoint: row.total,
                delinquentAtPoint: row.delinquent
              })
            } else {
              lowBalanceBuyerData.push(((row.delinquent / row.total) * 100).toFixed(2))
              lowBalanceBuyerTooltip.push({
                totalAtPoint: row.total,
                delinquentAtPoint: row.delinquent
              })
            }
          })
          hbBarChartData.datasets.push(
            {
              label: `High Balance Buyer - ${region[0].name.split(',')[0]}`,
              backgroundColor: chartFadedColors[regionIdx],
              borderColor: chartFadedColors[regionIdx],
              borderWidth: 1,
              data: highBalanceData,
              tooltip: highBalanceTooltip
            },
            {
              label: `Non-High Balance Buyer - ${region[0].name.split(',')[0]}`,
              backgroundColor: chartSolidColors[regionIdx],
              borderColor: chartSolidColors[regionIdx],
              borderWidth: 1,
              data: lowBalanceBuyerData,
              tooltip: lowBalanceBuyerTooltip
            }
          )
        })

        setChartData({
          labels: hbBarChartData.labels,
          datasets: hbBarChartData.datasets
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
                  return `${context[0].dataset.label}`
                },
                title: function(context){
                  return `Total loans: ${context[0].dataset.tooltip[context[0].dataIndex].totalAtPoint}`
                },
                afterTitle: function(context){
                  return `Delinquent loans: ${context[0].dataset.tooltip[context[0].dataIndex].delinquentAtPoint}`
                },
                label: function(context){
                  return `Delinquency rate: ${context.raw}%`
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
                callback: function(value, index, ticks){
                  return `${value}%`
                },
                font: {
                  size: 16
                }
              },
              grace: 5
            },
            x: {
              title: {
                display: true,
                text: "Origination Month",
                padding: 20,
                font: {
                  size: 20
                }
              },
              ticks: {
                callback: function(value){
                  let date = new Date(this.getLabelForValue(value))
                  return `${date.toLocaleString('en-us', {timeZone: 'UTC', month: 'long', year: 'numeric'})}`
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
  }, [dateRange.endDate, dateRange.startDate, selectedRegions])

  if(isLoading){
    return <Loader loadiingText={"Getting first time buyer data..."}/>
  }

  return (
    <div>
      <ChartHeaderWithTooltip
        chartName={'Delinquency by High Balance Indicator Status'}
        msa={selectedRegions.length === 1 ? selectedRegions[0].name : "selected regions"}
      />
      {chartData &&
        <Bar data={chartData} options={chartOptions} />
      }
    </div>
  )
}

export default DelinquencyByHighBalance