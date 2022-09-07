import { memo } from "react"
import { Line } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByRegion, chartFadedColors, chartSolidColors, pointStyles } from "../../public/utils"

const CexSampleSize = ({dateRange, sampleSizeData}) => {
  const labels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)
  const regionalData = Object.values(groupDataByRegion(sampleSizeData, "region_name"))
  const structuredData = regionalData.map((region, idx) => {

    const data = region.map(row => {
      return row.sample_size
    })

    return {
      label: region[idx].region_name,
      data: data,
      borderColor: chartFadedColors[idx],
      backgroundColor: chartFadedColors[idx],
      pointRadius: 5,
      pointHitRadius: 5,
      pointHoverRadius: 7,
      pointHoverBackgroundColor: chartSolidColors[idx],
      pointStyle: pointStyles[idx]
    }
  })

  const chartData = {
    labels: labels,
    datasets: structuredData
  }

  const chartOptions = {
    responsive: true,
    aspectRatio: 2.5,
    interaction: {
      mode: 'index'
    },
    plugins: {
      title: {
        display: true,
        text: "Sample Size",
        font: {
          size: 16
        }
      },
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
            return `${context.dataset.label}: ${context.raw}`
          }
        },
        boxPadding: 6
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Sample Size",
          padding: 20,
          font: {
            size: 16
          }
        },
        ticks: {
          callback: function(value){
            return `${value}`
          },
          font: {
            size: 12
          },
          stepSize: 100
        }
      },
      x: {
        title: {
          display: true,
          text: "Survey Month",
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
            size: 12
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
      {chartData &&
        <div className="flex justify-center w-1/2 p-4 shadow-lg bg-gray-50">
          <Line data={chartData} options={chartOptions} />
        </div>
      }
    </div>
  )
}

export default CexSampleSize