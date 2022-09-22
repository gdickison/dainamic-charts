import { memo } from "react"
import { Bar, Line } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByRegion, cexFadedColors, cexSolidColors } from "../../public/utils"
import ChartDescription from "./ChartDescription"

const CexMaritalStatus = ({dateRange, data}) => {
  const labels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)
  const regionalData = Object.values(groupDataByRegion(data, "region_name"))

  const maritalStatusData = regionalData.map((region, idx) => {
    const label = region[idx].region_name

    const ctMarried = region.map(row => {
      return row.ct_married
    })

    const pctMarried = region.map(row => {
      return parseFloat(row.pct_married).toFixed(1)
    })

    const incMarried = region.map(row => {
      return parseFloat(row.inc_married).toFixed(0)
    })

    const ctSeparated = region.map(row => {
      return row.ct_separated
    })

    const pctSeparated = region.map(row => {
      return parseFloat(row.pct_separated).toFixed(1)
    })

    const incSeparated = region.map(row => {
      return parseFloat(row.inc_separated).toFixed(0)
    })

    const ctDivorced = region.map(row => {
      return row.ct_divorced
    })

    const pctDivorced = region.map(row => {
      return parseFloat(row.pct_divorced).toFixed(1)
    })

    const incDivorced = region.map(row => {
      return parseFloat(row.inc_divorced).toFixed(0)
    })

    const ctWidowed = region.map(row => {
      return row.ct_widowed
    })

    const pctWidowed = region.map(row => {
      return parseFloat(row.pct_widowed).toFixed(1)
    })

    const incWidowed = region.map(row => {
      return parseFloat(row.inc_widowed).toFixed(0)
    })

    const ctNeverMarried = region.map(row => {
      return row.ct_never_married
    })

    const pctNeverMarried = region.map(row => {
      return parseFloat(row.pct_never_married).toFixed(1)
    })

    const incNeverMarried = region.map(row => {
      return parseFloat(row.inc_never_married).toFixed(0)
    })

    return {
      label,
      ctMarried,
      pctMarried,
      incMarried,
      ctSeparated,
      pctSeparated,
      incSeparated,
      ctDivorced,
      pctDivorced,
      incDivorced,
      ctWidowed,
      pctWidowed,
      incWidowed,
      ctNeverMarried,
      pctNeverMarried,
      incNeverMarried
    }
  })

  const barChartData = maritalStatusData.map((region) => {
    return [
      {
        label: 'Married',
        data: region.pctMarried,
        tooltip: region.ctMarried,
        backgroundColor: cexFadedColors[0],
        backgroundColor: cexFadedColors[0],
        hoverBackgroundColor: cexSolidColors[0],
        title: region.label
      },
      {
        label: 'Separated',
        data: region.pctSeparated,
        tooltip: region.ctSeparated,
        backgroundColor: cexFadedColors[1],
        hoverBackgroundColor: cexSolidColors[1],
      },
      {
        label: 'Divorced',
        data: region.pctDivorced,
        tooltip: region.ctDivorced,
        backgroundColor: cexFadedColors[2],
        hoverBackgroundColor: cexSolidColors[2],
      },
      {
        label: 'Widowed',
        data: region.pctWidowed,
        tooltip: region.ctWidowed,
        backgroundColor: cexFadedColors[3],
        hoverBackgroundColor: cexSolidColors[3],
      },
      {
        label: 'Never Married',
        data: region.pctNeverMarried,
        tooltip: region.ctNeverMarried,
        backgroundColor: cexFadedColors[4],
        hoverBackgroundColor: cexSolidColors[4],
      }
    ]
  })

  const lineChartData = maritalStatusData.map(region => {
    return [
      {
        label: 'Married',
        data: region.incMarried,
        tooltip: region.ctMarried,
        backgroundColor: cexFadedColors[0],
        borderColor: cexFadedColors[0],
        title: region.label
      },
      {
        label: 'Separated',
        data: region.incSeparated,
        tooltip: region.ctSeparated,
        backgroundColor: cexFadedColors[1],
        borderColor: cexFadedColors[1]
      },
      {
        label: 'Divorced',
        data: region.incDivorced,
        tooltip: region.ctDivorced,
        backgroundColor: cexFadedColors[2],
        borderColor: cexFadedColors[2]
      },
      {
        label: 'Widowed',
        data: region.incWidowed,
        tooltip: region.ctWidowed,
        backgroundColor: cexFadedColors[3],
        borderColor: cexFadedColors[3]
      },
      {
        label: 'Never Married',
        data: region.incNeverMarried,
        tooltip: region.ctNeverMarried,
        backgroundColor: cexFadedColors[4],
        borderColor: cexFadedColors[4]
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
        align: "center"
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
          <h1 className="inline text-2xl">Marital Status of Respondents</h1>
        </div>
        <ChartDescription
          description={`This chart shows respondents' marital status as a percentage of all respondents. Hover over the bar chart to see the percentage for a particular marital status, and the number of respondents with that marital status.`}
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
          <h1 className="inline text-2xl">Earning Power Relative to Marital Status</h1>
        </div>
        <ChartDescription
          description={`This chart shows the average family pretax income of households (over the previous 12 months) relative to marital status.`}
        />
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {lineChartData && lineChartData.map((row, idx) => {
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

export default memo(CexMaritalStatus)