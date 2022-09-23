import { memo } from "react"
import { Bar, Line } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByRegion, cexFadedColors, cexSolidColors } from "../../public/utils"
import ChartDescription from "./ChartDescription"

const CexRace = ({dateRange, data}) => {
  const labels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)
  const regionalData = Object.values(groupDataByRegion(data, "region_name"))

  const raceData = regionalData.map((region, idx) => {
    const label = region[idx].region_name

    const ctWhite = region.map(row => {
      return row.ct_white
    })

    const pctWhite = region.map(row => {
      return parseFloat(row.pct_white).toFixed(1)
    })

    const incWhite = region.map(row => {
      return parseFloat(row.inc_white).toFixed(0)
    })

    const ctBlack = region.map(row => {
      return row.ct_black
    })

    const pctBlack = region.map(row => {
      return parseFloat(row.pct_black).toFixed(1)
    })

    const incBlack = region.map(row => {
      return parseFloat(row.inc_black).toFixed(0)
    })

    const ctNativeAmerican = region.map(row => {
      return row.ct_native_american
    })

    const pctNativeAmerican = region.map(row => {
      return parseFloat(row.pct_native_american).toFixed(1)
    })

    const incNativeAmerican = region.map(row => {
      return parseFloat(row.inc_native_american).toFixed(0)
    })

    const ctAsian = region.map(row => {
      return row.ct_asian
    })

    const pctAsian = region.map(row => {
      return parseFloat(row.pct_asian).toFixed(1)
    })

    const incAsian = region.map(row => {
      return parseFloat(row.inc_asian).toFixed(0)
    })

    const ctPacificIslander = region.map(row => {
      return row.ct_pacific_islander
    })

    const pctPacificIslander = region.map(row => {
      return parseFloat(row.pct_pacific_islander).toFixed(1)
    })

    const incPacificIslander = region.map(row => {
      return parseFloat(row.inc_pacific_islander).toFixed(0)
    })

    const ctMixed = region.map(row => {
      return row.ct_mixed
    })

    const pctMixed = region.map(row => {
      return parseFloat(row.pct_mixed).toFixed(1)
    })

    const incMixed = region.map(row => {
      return parseFloat(row.inc_mixed).toFixed(0)
    })

    return {
      label,
      ctWhite,
      pctWhite,
      incWhite,
      ctBlack,
      pctBlack,
      incBlack,
      ctNativeAmerican,
      pctNativeAmerican,
      incNativeAmerican,
      ctAsian,
      pctAsian,
      incAsian,
      ctPacificIslander,
      pctPacificIslander,
      incPacificIslander,
      ctMixed,
      pctMixed,
      incMixed
    }
  })

  const barChartData = raceData.map((region) => {
    return [
      {
        label: 'White',
        data: region.pctWhite,
        tooltip: region.ctWhite,
        backgroundColor: cexFadedColors[0],
        hoverBackgroundColor: cexSolidColors[0],
        title: region.label
      },
      {
        label: 'Black',
        data: region.pctBlack,
        tooltip: region.ctBlack,
        backgroundColor: cexFadedColors[1],
        hoverBackgroundColor: cexSolidColors[1],
      },
      {
        label: 'Asian',
        data: region.pctAsian,
        tooltip: region.ctAsian,
        backgroundColor: cexFadedColors[3],
        hoverBackgroundColor: cexSolidColors[3],
      },
      {
        label: 'Mixed',
        data: region.pctMixed,
        tooltip: region.ctMixed,
        backgroundColor: cexFadedColors[5],
        hoverBackgroundColor: cexSolidColors[5],
      },
      {
        label: 'Pacific Islander',
        data: region.pctPacificIslander,
        tooltip: region.ctPacificIslander,
        backgroundColor: cexFadedColors[4],
        hoverBackgroundColor: cexSolidColors[4],
      },
      {
        label: 'Native American',
        data: region.pctNativeAmerican,
        tooltip: region.ctNativeAmerican,
        backgroundColor: cexFadedColors[2],
        hoverBackgroundColor: cexSolidColors[2],
      }
    ]
  })

  const lineChartData = raceData.map((region) => {
    return [
      {
        label: 'White',
        data: region.incWhite,
        tooltip: region.ctWhite,
        backgroundColor: cexFadedColors[0],
        borderColor: cexSolidColors[0],
        title: region.label
      },
      {
        label: 'Black',
        data: region.incBlack,
        tooltip: region.ctBlack,
        backgroundColor: cexFadedColors[1],
        borderColor: cexSolidColors[1]
      },
      {
        label: 'Asian',
        data: region.incAsian,
        tooltip: region.ctAsian,
        backgroundColor: cexFadedColors[3],
        borderColor: cexSolidColors[3]
      },
      {
        label: 'Mixed',
        data: region.incMixed,
        tooltip: region.ctMixed,
        backgroundColor: cexFadedColors[5],
        borderColor: cexSolidColors[5]
      },
      {
        label: 'Pacific Islander',
        data: region.incPacificIslander,
        tooltip: region.ctPacificIslander,
        backgroundColor: cexFadedColors[4],
        borderColor: cexSolidColors[4]
      },
      {
        label: 'Native American',
        data: region.incNativeAmerican,
        tooltip: region.ctNativeAmerican,
        backgroundColor: cexFadedColors[2],
        borderColor: cexSolidColors[2]
      }
    ]
  })

  const barChartOptions = {
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
            return `${context.dataset.label}: ${context.raw}% (${context.dataset.tooltip[context.dataIndex]})`
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

  const lineChartOptions = {
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
        title: 'Ed Level',
        labels: {
          usePointStyle: true
        },
        align: "end"
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          title: function(context){
            return context[0].dataset.label
          },
          label: function(context){
            return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(context.raw)}`
          }
        },
        boxPadding: 6
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Income",
          padding: 20,
          font: {
            size: 16
          }
        },
        ticks: {
          callback: function(value){
            return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(value)}`
          },
          font: {
            size: 12
          }
        },
        grid: {
          display: false
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
    <div className="mx-6 space-y-12">
      <div>
        <div className="relative my-4">
          <h1 className="inline text-2xl">Race of Respondents</h1>
        </div>
        <ChartDescription
          description={`This chart shows respondents' race as a percentage of all respondents. Hover over the bar chart to see the percentage for a particular race, and the number of respondents in that racial category.`}
        />
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {barChartData && barChartData.map((row, idx) => {
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
                  <Bar data={chartData} options={barChartOptions}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <div className="relative my-4">
          <h1 className="inline text-2xl">Earning Power Relative to Race</h1>
        </div>
        <ChartDescription
          description={`This chart shows the average family pretax income of households (over the previous 12 months) relative to the reference person's race. Only racial groups with full income data are shown.`}
        />
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {lineChartData && lineChartData.map((row, idx) => {
            const dataRow = row.filter(obj => {
              return !obj.data.includes("NaN")
            })

            const chartData = {
              labels: labels,
              datasets: dataRow
            }

            return (
              <div key={idx}>
                <div className="flex justify-center">
                  <h1 className="font-semibold">{row[0].title}</h1>
                </div>
                <div className="flex justify-center p-4 shadow-lg bg-gray-50">
                  <Line data={chartData} options={lineChartOptions}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default memo(CexRace)