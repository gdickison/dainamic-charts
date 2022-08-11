import { memo} from "react"
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import { Line } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByMsa, chartFadedColors, chartSolidColors } from "../../public/utils"

const DelinquencyByUnemploymentRate = ({dateRange, unemploymentRateData, delinquencyRateData}) => {
    const unemploymentDataByMsa = Object.values(groupDataByMsa(unemploymentRateData, "msa"))

    const unemploymentRateStructuredData = unemploymentDataByMsa.map((region, idx) => {
      const unemploymentRateData = region.map(row => {
        return row.unemployment_rate
      })

      return {
        label: `${region[0].name.split(",")[0]} Unemployment Rate`,
        data: unemploymentRateData,
        borderColor: chartFadedColors[idx],
        backgroundColor: chartFadedColors[idx],
        pointRadius: 5,
        pointHitRadius: 15,
        pointHoverRadius: 12,
        pointHoverBackgroundColor: chartSolidColors[idx]
      }
    })

    const delinquencyDataByMsa = Object.values(groupDataByMsa(delinquencyRateData, "msa"))

    const delinquencyRateStructuredData = delinquencyDataByMsa.map((region, idx) => {
      const delinquencyRateData = region.map(row => {
        return parseFloat((Number(row.delinquent) / Number(row.total) * 100).toFixed(2))
      })

      return {
        label: `${region[0].name.split(",")[0]} Delinquency Rate`,
        data: delinquencyRateData,
        borderColor: chartSolidColors[idx],
        backgroundColor: chartSolidColors[idx],
        pointRadius: 5,
        pointHitRadius: 15,
        pointHoverRadius: 12
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
      <ChartHeaderWithTooltip
        chartName={"Delinquency by Unemployment Rate"}
        msa={delinquencyRateStructuredData.length === 1 ? delinquencyRateData[0].name : "selected regions"}
      />
      {chartData &&
        <Line data={chartData} options={chartOptions}/>
      }
    </div>
  )
}

export default memo(DelinquencyByUnemploymentRate)