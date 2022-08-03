import Loader from "./Loader"
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import { Bar } from "react-chartjs-2"
import { useState, useEffect } from "react"
import { groupDataByMsa, chartSolidColors, chartFadedColors } from "../../public/utils"

const DelinquencyByFTBStatus = ({dateRange, selectedRegions}) => {
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

    const endpoint = `/api/get_delinquency_by_ftbs`
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

        const ftbsBarChartData = {
          labels: [],
          datasets: []
        }

        groupedData.forEach((region, regionIdx) => {
          const firstTimeBuyerData = []
          const firstTimeBuyerTooltip = []
          const multiTimeBuyerData = []
          const multiTimeBuyerTooltip = []
          if(regionIdx === 0){
            region.forEach((row, i) => {
              if(i % 2 === 0){
                ftbsBarChartData.labels.push((row.origination_date.split('T')[0]).toString())
              }
            })
          }
          region.forEach(row => {
            if(row.first_time_buyer_indicator === true){
              firstTimeBuyerData.push(((row.delinquent / row.total_loans) * 100).toFixed(2))
              firstTimeBuyerTooltip.push({
                totalAtPoint: row.total_loans,
                delinquentAtPoint: row.delinquent
              })
            } else {
              multiTimeBuyerData.push(((row.delinquent / row.total_loans) * 100).toFixed(2))
              multiTimeBuyerTooltip.push({
                totalAtPoint: row.total_loans,
                delinquentAtPoint: row.delinquent
              })
            }
          })
          ftbsBarChartData.datasets.push(
            {
              label: `1st Time Buyer - ${region[0].name.split(',')[0]}`,
              backgroundColor: chartFadedColors[regionIdx],
              borderColor: chartFadedColors[regionIdx],
              borderWidth: 1,
              data: firstTimeBuyerData,
              tooltip: firstTimeBuyerTooltip
            },
            {
              label: `Multi Time Buyer - ${region[0].name.split(',')[0]}`,
              backgroundColor: chartSolidColors[regionIdx],
              borderColor: chartSolidColors[regionIdx],
              borderWidth: 1,
              data: multiTimeBuyerData,
              tooltip: multiTimeBuyerTooltip
            }
          )
        })

        setChartData({
          labels: ftbsBarChartData.labels,
          datasets: ftbsBarChartData.datasets
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
        chartName={'Delinquency by First Time Buyer Status'}
        msa={selectedRegions.length === 1 ? selectedRegions[0].name : "selected regions"}
      />
      {chartData &&
        <Bar data={chartData} options={chartOptions} />
      }
    </div>
  )
}

export default DelinquencyByFTBStatus