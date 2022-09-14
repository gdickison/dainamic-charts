import { memo } from "react"
import { Bar } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByRegion, chartFadedColors, chartSolidColors } from "../../public/utils"
import ChartDescription from "./ChartDescription"

const CexSampleMaritalStatus = ({dateRange, data}) => {
  const labels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)
  const regionalData = Object.values(groupDataByRegion(data, "region_name"))

  const maritalStatusData = regionalData.map((region, idx) => {
    const label = region[idx].region_name

    const married = region.map(row => {
      return row.married
    })

    const percentMarried = region.map(row => {
      return parseFloat(row.percent_married).toFixed(1)
    })

    const separated = region.map(row => {
      return row.separated
    })

    const percentSeparated = region.map(row => {
      return parseFloat(row.percent_separated).toFixed(1)
    })

    const divorced = region.map(row => {
      return row.divorced
    })

    const percentDivorced = region.map(row => {
      return parseFloat(row.percent_divorced).toFixed(1)
    })

    const widowed = region.map(row => {
      return row.widowed
    })

    const percentWidowed = region.map(row => {
      return parseFloat(row.percent_widowed).toFixed(1)
    })

    const neverMarried = region.map(row => {
      return row.never_married
    })

    const percentNeverMarried = region.map(row => {
      return parseFloat(row.percent_never_married).toFixed(1)
    })

    return {
      label,
      married,
      percentMarried,
      separated,
      percentSeparated,
      divorced,
      percentDivorced,
      widowed,
      percentWidowed,
      neverMarried,
      percentNeverMarried
    }
  })

  const rawChartData = maritalStatusData.map((region) => {
    return [
      {
      label: 'Married',
      data: region.percentMarried,
      tooltip: region.married,
      backgroundColor: chartFadedColors[0],
      hoverBackgroundColor: chartSolidColors[0],
      title: region.label
    },
    {
      label: 'Separated',
      data: region.percentSeparated,
      tooltip: region.separated,
      backgroundColor: chartFadedColors[1],
      hoverBackgroundColor: chartSolidColors[1],
    },
    {
      label: 'Divorced',
      data: region.percentDivorced,
      tooltip: region.divorced,
      backgroundColor: chartFadedColors[2],
      hoverBackgroundColor: chartSolidColors[2],
    },
    {
      label: 'Widowed',
      data: region.percentWidowed,
      tooltip: region.widowed,
      backgroundColor: chartFadedColors[3],
      hoverBackgroundColor: chartSolidColors[3],
    },
    {
      label: 'Never Married',
      data: region.percentNeverMarried,
      tooltip: region.neverMarried,
      backgroundColor: chartFadedColors[4],
      hoverBackgroundColor: chartSolidColors[4],
    }
    ]
  })

  const chartOptions = {
    responsive: true,
    aspectRatio: 2.5,
    interaction: {
      intersect: false
    },
    plugins: {
      title: {
        display: false
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
            const tip = context.datasetIndex === 8
              ? `${context.dataset.label}: ${context.raw}`
              : `${context.dataset.label}: ${context.raw}% (${context.dataset.tooltip[context.dataIndex]})`
            return tip
          }
        },
        boxPadding: 6
      }
    },
    scales: {
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Marital Status %",
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
          stepSize: 10
        },
        max: 100,
        grid: {
          display: false
        }
      },
      x: {
        stacked: true,
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
    <div className="mx-6">
      <div className="relative my-4">
        <h1 className="inline text-2xl">Marital Status of Respondents</h1>
      </div>
      <ChartDescription
        description={`This chart shows respondents' marital status as a percentage of all respondents. Hover over the bar chart to see the percentage for a particular marital status, and the number of respondents with that marital status.`}
      />
      <div className="grid grid-cols-2 gap-x-2 gap-y-6">
        {rawChartData && rawChartData.map((row, idx) => {
          const chartData = {
            labels: labels,
            datasets: row
          }
          return (
            <div key={idx}>
              <div className="flex justify-center">
                <h1 className="font-semibold">{row[0].title}</h1>
              </div>
              <div className="flex justify-center p-4 shadow-lg bg-gray-50">
                <Bar data={chartData} options={chartOptions}/>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(CexSampleMaritalStatus)