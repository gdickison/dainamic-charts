import { memo } from "react"
import ChartTitle from "./ChartTitle"
import ChartDescription from "./ChartDescription"
import { Line } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByRegion, chartFadedColors, chartSolidColors, pointStyles } from "../../public/utils"

const DelinquencyByUnemploymentRate = ({dateRange, unemploymentRateData, delinquencyRateData}) => {
    const unemploymentDataByMsa = Object.values(groupDataByRegion(unemploymentRateData, "msa"))

    const unemploymentRateStructuredData = unemploymentDataByMsa.map((region, idx) => {
      const unemploymentRateDataRaw = region.map(row => {
        return row.unemployment_rate
      })

      return {
        label: `${region[0].name.split(",")[0]} Unemployment Rate`,
        data: unemploymentRateDataRaw,
        borderColor: chartFadedColors[idx],
        backgroundColor: chartFadedColors[idx],
        pointRadius: 5,
        pointHitRadius: 5,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: chartSolidColors[idx],
        pointStyle: pointStyles[idx]
      }
    })

    const delinquencyDataByMsa = Object.values(groupDataByRegion(delinquencyRateData, "msa"))

    const delinquencyRateStructuredData = delinquencyDataByMsa.map((region, idx) => {
      const delinquencyRateDataRaw = region.map(row => {
        return parseFloat((Number(row.delinquent) / Number(row.total) * 100).toFixed(2))
      })

      return {
        label: `${region[0].name.split(",")[0]} Delinquency Rate`,
        data: delinquencyRateDataRaw,
        borderColor: chartSolidColors[idx],
        backgroundColor: chartSolidColors[idx],
        pointRadius: 5,
        pointHitRadius: 5,
        pointHoverRadius: 7,
        pointStyle: pointStyles[idx]
      }
    })

    const chartLabels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)

    const chartData = {
      labels: chartLabels,
      datasets: [].concat(delinquencyRateStructuredData, unemploymentRateStructuredData)
    }

    const chartOptions = {
      responsive: true,
      aspectRatio: 2.5,
      interaction: {
        mode: 'index'
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            usePointStyle: true
          }
        },
        tooltip: {
          usePointStyle: true,
          callbacks: {
            label: function(context){
              return `${context.dataset.label} ${context.raw}%`
            }
          },
          boxPadding: 6
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
            callback: function(value){
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
    }

  return (
    <div>
      <div className="my-4">
        <ChartTitle
          chartTitle={"Delinquency by Unemployment Rate"}
          msa={delinquencyRateStructuredData.length === 1 ? delinquencyRateData[0].name : "Selected Regions"}
        />
        <ChartDescription
          description={"For each month in the selected date range the unemployment rate for that month is shown, and the delinquency rate for loans that originaed in that month. Click on the legend to show/hide that data in the chart. Hover over the data points to see more detail."}
        />
      </div>
      {chartData &&
        <Line data={chartData} options={chartOptions}/>
      }
    </div>
  )
}

export default memo(DelinquencyByUnemploymentRate)