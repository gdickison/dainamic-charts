import { memo } from "react"
import { Line } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByRegion, chartFadedColors, chartSolidColors } from "../../public/utils"

const CexSampleAge = ({dateRange, sampleAgeData}) => {

  const labels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)
  const regionalData = Object.values(groupDataByRegion(sampleAgeData, "region_name"))

  const avgAgeData = regionalData.map((region, idx) => {
    const label = region[idx].region_name
    const sampleAvgAge = region.map(row => {
      return row.sample_avg_age
    })

    const spouseAvgAge = region.map(row => {
      return row.spouse_avg_age
    })

    return {label, sampleAvgAge, spouseAvgAge}
  })

  const rawChartData = avgAgeData.map((region, idx) => {
    return [{
      label: `${region.label} Avg Age`,
      data: region.sampleAvgAge,
      backgroundColor: chartFadedColors[1],
      borderColor: chartSolidColors[1],
      pointRadius: 5,
      pointHitRadius: 5,
      pointHoverRadius: 7,
      pointHoverBackgroundColor: chartSolidColors[1],
      title: region.label
    },
    {
      label: `${region.label} Avg Spouse Age`,
      data: region.spouseAvgAge,
      backgroundColor: chartFadedColors[0],
      borderColor: chartSolidColors[0],
      pointRadius: 5,
      pointHitRadius: 5,
      pointHoverRadius: 7,
      pointHoverBackgroundColor: chartSolidColors[0]
    }]
  })

  const chartOptions = {
    responsive: true,
    aspectRatio: 2.5,
    interaction: {
      mode: 'index'
    },
    plugins: {
      title: {
        display: false,
        text: "Respondent Average Age",
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
          text: "Average Age",
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
          stepSize: 1
        }
      },
      x: {
        title: {
          display: false,
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
      <div className="relative my-4 mx-12">
        <h1 className="inline text-2xl">Average Age of Respondents</h1>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {rawChartData && rawChartData.map(row => {

          const barChartData = {
            labels: labels,
            datasets: row
          }
          return (
            <div>
              <div className="flex justify-center">
                <h1 className="font-semibold">{row[0].title}</h1>
              </div>
              <div className="flex justify-center p-4 shadow-lg bg-gray-50">
                <Line data={barChartData} options={chartOptions}/>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(CexSampleAge)