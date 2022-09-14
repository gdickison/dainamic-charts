import { memo } from "react"
import { Bar } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByRegion, cexFadedColors, cexSolidColors } from "../../public/utils"
import ChartDescription from "./ChartDescription"

const CexSampleAge = ({dateRange, data}) => {
  const labels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)
  const regionalData = Object.values(groupDataByRegion(data, "region_name"))
  const avgAgeData = regionalData.map((region, idx) => {

    const label = region[idx].region_name

    const sampleAvgAge = region.map(row => {
      return parseFloat(Number(row.sample_avg_age)).toFixed(1)
    })

    const sample_19_25 = region.map(row => {
      return parseFloat((Number(row.sample_19_25) / (Number(row.total_sample) - Number(row.sample_18_under))) * 100).toFixed(1)
    })

    const sample_19_25_tooltip = region.map(row => {
      return row.sample_19_25
    })

    const sample_26_35 = region.map(row => {
      return parseFloat((Number(row.sample_26_35) / (Number(row.total_sample) - Number(row.sample_18_under))) * 100).toFixed(1)
    })

    const sample_26_35_tooltip = region.map(row => {
      return row.sample_26_35
    })

    const sample_36_45 = region.map(row => {
      return parseFloat((Number(row.sample_36_45) / (Number(row.total_sample) - Number(row.sample_18_under))) * 100).toFixed(1)
    })

    const sample_36_45_tooltip = region.map(row => {
      return row.sample_36_45
    })

    const sample_46_55 = region.map(row => {
      return parseFloat((Number(row.sample_46_55) / (Number(row.total_sample) - Number(row.sample_18_under))) * 100).toFixed(1)
    })

    const sample_46_55_tooltip = region.map(row => {
      return row.sample_46_55
    })

    const sample_56_65 = region.map(row => {
      return parseFloat((Number(row.sample_56_65) / (Number(row.total_sample) - Number(row.sample_18_under))) * 100).toFixed(1)
    })

    const sample_56_65_tooltip = region.map(row => {
      return row.sample_56_65
    })

    const sample_66_75 = region.map(row => {
      return parseFloat((Number(row.sample_66_75) / (Number(row.total_sample) - Number(row.sample_18_under))) * 100).toFixed(1)
    })

    const sample_66_75_tooltip = region.map(row => {
      return row.sample_66_75
    })

    const sample_76_85 = region.map(row => {
      return parseFloat((Number(row.sample_76_85) / (Number(row.total_sample) - Number(row.sample_18_under))) * 100).toFixed(1)
    })

    const sample_76_85_tooltip = region.map(row => {
      return row.sample_76_85
    })

    const sample_over_85 = region.map(row => {
      return parseFloat((Number(row.sample_over_85) / (Number(row.total_sample) - Number(row.sample_18_under))) * 100).toFixed(1)
    })

    const sample_over_85_tooltip = region.map(row => {
      return row.sample_over_85
    })

    const spouseAvgAge = region.map(row => {
      return row.spouse_avg_age
    })

    return {label,
      sampleAvgAge,
      spouseAvgAge,
      sample_19_25,
      sample_26_35,
      sample_36_45,
      sample_46_55,
      sample_56_65,
      sample_66_75,
      sample_76_85,
      sample_over_85,
      sample_19_25_tooltip,
      sample_26_35_tooltip,
      sample_36_45_tooltip,
      sample_46_55_tooltip,
      sample_56_65_tooltip,
      sample_66_75_tooltip,
      sample_76_85_tooltip,
      sample_over_85_tooltip
    }
  })

  const rawChartData = avgAgeData.map((region) => {
    return [
      {
      label: '19-25',
      order: 2,
      data: region.sample_19_25,
      tooltip: region.sample_19_25_tooltip,
      backgroundColor: cexFadedColors[0],
      hoverBackgroundColor: cexSolidColors[0],
      title: region.label
    },
    {
      label: '26-35',
      order: 2,
      data: region.sample_26_35,
      tooltip: region.sample_26_35_tooltip,
      backgroundColor: cexFadedColors[1],
      hoverBackgroundColor: cexSolidColors[1],
    },
    {
      label: '36-45',
      order: 2,
      data: region.sample_36_45,
      tooltip: region.sample_36_45_tooltip,
      backgroundColor: cexFadedColors[2],
      hoverBackgroundColor: cexSolidColors[2],
    },
    {
      label: '46-55',
      order: 2,
      data: region.sample_46_55,
      tooltip: region.sample_46_55_tooltip,
      backgroundColor: cexFadedColors[3],
      hoverBackgroundColor: cexSolidColors[3],
    },
    {
      label: '56-65',
      order: 2,
      data: region.sample_56_65,
      tooltip: region.sample_56_65_tooltip,
      backgroundColor: cexFadedColors[4],
      hoverBackgroundColor: cexSolidColors[4],
    },
    {
      label: '66-75',
      order: 2,
      data: region.sample_66_75,
      tooltip: region.sample_66_75_tooltip,
      backgroundColor: cexFadedColors[5],
      hoverBackgroundColor: cexSolidColors[5],
    },
    {
      label: '76-85',
      order: 2,
      data: region.sample_76_85,
      tooltip: region.sample_76_85_tooltip,
      backgroundColor: cexFadedColors[6],
      hoverBackgroundColor: cexSolidColors[6],
    },
    {
      label: '86 & Over',
      order: 2,
      data: region.sample_over_85,
      tooltip: region.sample_over_85_tooltip,
      backgroundColor: cexFadedColors[7],
      hoverBackgroundColor: cexSolidColors[7],
    },
    {
      label: 'Avg Age',
      order: 1,
      data: region.sampleAvgAge,
      tooltip: region.sampleAvgAge,
      backgroundColor: 'black',
      borderColor: 'black',
      borderDash: [5,5],
      pointRadius: 5,
      pointHitRadius: 5,
      pointHoverRadius: 7,
      type: 'line',
      yAxisID: 'avg_age'
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
        title: 'Age Brackets',
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
              : `Age: ${context.dataset.label}: ${context.raw}% (${context.dataset.tooltip[context.dataIndex]})`
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
          text: "Age Bracket %",
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
      avg_age: {
        position: 'right',
        beginAtZero: false,
        title: {
          display: true,
          text: 'Average Age',
          padding: 20,
          font: {
            size: 16
          }
        },
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
        <h1 className="inline text-2xl">Age of Respondents</h1>
      </div>
      <ChartDescription
        description={`This chart shows respondents' age brackets as a percentage of all respondents, as well as the average age of the respondents. Hover over the bar chart to see the percentage for a particular age bracket, and the number of respondents in that age bracket.`}
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

export default memo(CexSampleAge)