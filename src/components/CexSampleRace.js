import { memo } from "react"
import { Bar } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByRegion, cexFadedColors, cexSolidColors } from "../../public/utils"
import ChartDescription from "./ChartDescription"

const CexSampleRace = ({dateRange, data}) => {
  const labels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)
  const regionalData = Object.values(groupDataByRegion(data, "region_name"))

  const raceData = regionalData.map((region, idx) => {
    const label = region[idx].region_name

    const white = region.map(row => {
      return row.sample_white
    })

    const percentWhite = region.map(row => {
      return parseFloat(row.percent_sample_white).toFixed(1)
    })

    const black = region.map(row => {
      return row.sample_black
    })

    const percentBlack = region.map(row => {
      return parseFloat(row.percent_sample_black).toFixed(1)
    })

    const nativeAmerican = region.map(row => {
      return row.sample_native_american
    })

    const percentNativeAmerican = region.map(row => {
      return parseFloat(row.percent_sample_native_american).toFixed(1)
    })

    const asian = region.map(row => {
      return row.sample_asian
    })

    const percentAsian = region.map(row => {
      return parseFloat(row.percent_sample_asian).toFixed(1)
    })

    const pacificIslander = region.map(row => {
      return row.sample_pacific_islander
    })

    const percentPacificIslander = region.map(row => {
      return parseFloat(row.percent_sample_pacific_islander).toFixed(1)
    })

    const mixed = region.map(row => {
      return row.sample_mixed
    })

    const percentMixed = region.map(row => {
      return parseFloat(row.percent_sample_mixed).toFixed(1)
    })

    return {
      label,
      white,
      percentWhite,
      black,
      percentBlack,
      nativeAmerican,
      percentNativeAmerican,
      asian,
      percentAsian,
      pacificIslander,
      percentPacificIslander,
      mixed,
      percentMixed
    }
  })

  const rawChartData = raceData.map((region) => {
    return [
      {
        label: 'White',
        data: region.percentWhite,
        tooltip: region.white,
        backgroundColor: cexFadedColors[0],
        hoverBackgroundColor: cexSolidColors[0],
        title: region.label
      },
      {
        label: 'Black',
        data: region.percentBlack,
        tooltip: region.black,
        backgroundColor: cexFadedColors[1],
        hoverBackgroundColor: cexSolidColors[1],
      },
      {
        label: 'Asian',
        data: region.percentAsian,
        tooltip: region.asian,
        backgroundColor: cexFadedColors[3],
        hoverBackgroundColor: cexSolidColors[3],
      },
      {
        label: 'Mixed',
        data: region.percentMixed,
        tooltip: region.mixed,
        backgroundColor: cexFadedColors[5],
        hoverBackgroundColor: cexSolidColors[5],
      },
      {
        label: 'Pacific Islander',
        data: region.percentPacificIslander,
        tooltip: region.pacificIslander,
        backgroundColor: cexFadedColors[4],
        hoverBackgroundColor: cexSolidColors[4],
      },
      {
        label: 'Native American',
        data: region.percentNativeAmerican,
        tooltip: region.nativeAmerican,
        backgroundColor: cexFadedColors[2],
        hoverBackgroundColor: cexSolidColors[2],
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
          text: "Race %",
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
        <h1 className="inline text-2xl">Race of Respondents</h1>
      </div>
      <ChartDescription
        description={`This chart shows respondents' race as a percentage of all respondents. Hover over the bar chart to see the percentage for a particular race, and the number of respondents in that racial category.`}
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

export default memo(CexSampleRace)