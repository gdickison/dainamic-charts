import { memo } from "react"
import { Bar, Line } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByRegion, cexFadedColors, cexSolidColors } from "../../public/utils"
import ChartDescription from "./ChartDescription"

const CexSampleAge = ({dateRange, data}) => {
  const labels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)
  const regionalData = Object.values(groupDataByRegion(data, "region_name"))
  const avgAgeData = regionalData.map((region, idx) => {
    const label = region[idx].region_name

    const sampleAvgAge = region.map(row => {
      return parseFloat(Number(row.ref_avg_age)).toFixed(1)
    })

    const ref19to25 = region.map(row => {
      return parseFloat((Number(row.ref_19_25) / (Number(row.total_sample) - Number(row.ref_18_under))) * 100).toFixed(1)
    })

    const incRef19to25 = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_ref_19_25).toFixed(0)
    })

    const ref19to25Tooltip = region.map(row => {
      return row.ref_19_25
    })

    const ref26to35 = region.map(row => {
      return parseFloat((Number(row.ref_26_35) / (Number(row.total_sample) - Number(row.ref_18_under))) * 100).toFixed(1)
    })

    const incRef26to35 = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_ref_26_35).toFixed(0)
    })

    const ref26to35Tooltip = region.map(row => {
      return row.ref_26_35
    })

    const ref36to45 = region.map(row => {
      return parseFloat((Number(row.ref_36_45) / (Number(row.total_sample) - Number(row.ref_18_under))) * 100).toFixed(1)
    })

    const incRef36to45 = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_ref_36_45).toFixed(0)
    })

    const ref36to45Tooltip = region.map(row => {
      return row.ref_36_45
    })

    const ref46to55 = region.map(row => {
      return parseFloat((Number(row.ref_46_55) / (Number(row.total_sample) - Number(row.ref_18_under))) * 100).toFixed(1)
    })

    const incRef46to55 = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_ref_46_55).toFixed(0)
    })

    const ref46to55Tooltip = region.map(row => {
      return row.ref_46_55
    })

    const ref56to65 = region.map(row => {
      return parseFloat((Number(row.ref_56_65) / (Number(row.total_sample) - Number(row.ref_18_under))) * 100).toFixed(1)
    })

    const incRef56to65 = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_ref_56_65).toFixed(0)
    })

    const ref56to65Tooltip = region.map(row => {
      return row.ref_56_65
    })

    const ref66to75 = region.map(row => {
      return parseFloat((Number(row.ref_66_75) / (Number(row.total_sample) - Number(row.ref_18_under))) * 100).toFixed(1)
    })

    const incRef66to75 = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_ref_66_75).toFixed(0)
    })

    const ref66to75Tooltip = region.map(row => {
      return row.ref_66_75
    })

    const ref76to85 = region.map(row => {
      return parseFloat((Number(row.ref_76_85) / (Number(row.total_sample) - Number(row.ref_18_under))) * 100).toFixed(1)
    })

    const incRef76to85 = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_ref_76_85).toFixed(0)
    })

    const ref76to85Tooltip = region.map(row => {
      return row.ref_76_85
    })

    const refOver85 = region.map(row => {
      return parseFloat((Number(row.ref_over_85) / (Number(row.total_sample) - Number(row.ref_18_under))) * 100).toFixed(1)
    })

    const incRefOver85 = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_ref_over_85).toFixed(0)
    })

    const refOver85Tooltip = region.map(row => {
      return row.ref_over_85
    })

    const spouseAvgAge = region.map(row => {
      return row.spouse_avg_age
    })

    return {
      label,
      sampleAvgAge,
      spouseAvgAge,
      ref19to25,
      ref26to35,
      ref36to45,
      ref46to55,
      ref56to65,
      ref66to75,
      ref76to85,
      refOver85,
      ref19to25Tooltip,
      ref26to35Tooltip,
      ref36to45Tooltip,
      ref46to55Tooltip,
      ref56to65Tooltip,
      ref66to75Tooltip,
      ref76to85Tooltip,
      refOver85Tooltip,
      incRef19to25,
      incRef26to35,
      incRef36to45,
      incRef46to55,
      incRef56to65,
      incRef66to75,
      incRef76to85,
      incRefOver85
    }
  })

  const rawAgeBracketData = avgAgeData.map((region) => {
    return [
      {
      label: '19-25',
      order: 2,
      data: region.ref19to25,
      tooltip: region.ref19to25Tooltip,
      backgroundColor: cexFadedColors[0],
      hoverBackgroundColor: cexSolidColors[0],
      title: region.label
    },
    {
      label: '26-35',
      order: 2,
      data: region.ref26to35,
      tooltip: region.ref26to35Tooltip,
      backgroundColor: cexFadedColors[1],
      hoverBackgroundColor: cexSolidColors[1],
    },
    {
      label: '36-45',
      order: 2,
      data: region.ref36to45,
      tooltip: region.ref36to45Tooltip,
      backgroundColor: cexFadedColors[2],
      hoverBackgroundColor: cexSolidColors[2],
    },
    {
      label: '46-55',
      order: 2,
      data: region.ref46to55,
      tooltip: region.ref46to55Tooltip,
      backgroundColor: cexFadedColors[3],
      hoverBackgroundColor: cexSolidColors[3],
    },
    {
      label: '56-65',
      order: 2,
      data: region.ref56to65,
      tooltip: region.ref56to65Tooltip,
      backgroundColor: cexFadedColors[4],
      hoverBackgroundColor: cexSolidColors[4],
    },
    {
      label: '66-75',
      order: 2,
      data: region.ref66to75,
      tooltip: region.ref66to75Tooltip,
      backgroundColor: cexFadedColors[5],
      hoverBackgroundColor: cexSolidColors[5],
    },
    {
      label: '76-85',
      order: 2,
      data: region.ref76to85,
      tooltip: region.ref76to85Tooltip,
      backgroundColor: cexFadedColors[6],
      hoverBackgroundColor: cexSolidColors[6],
    },
    {
      label: '86 & Over',
      order: 2,
      data: region.refOver85,
      tooltip: region.refOver85Tooltip,
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

  const rawAgeBracketIncomeData = avgAgeData.map((region) => {
    return [
      {
      label: '19-25',
      order: 2,
      data: region.incRef19to25,
      tooltip: region.ref19to25Tooltip,
      backgroundColor: cexFadedColors[0],
      borderColor: cexFadedColors[0],
      hoverBackgroundColor: cexSolidColors[0],
      title: region.label
    },
    {
      label: '26-35',
      order: 2,
      data: region.incRef26to35,
      tooltip: region.ref26to35Tooltip,
      backgroundColor: cexFadedColors[1],
      borderColor: cexFadedColors[1],
      hoverBackgroundColor: cexSolidColors[1],
    },
    {
      label: '36-45',
      order: 2,
      data: region.incRef36to45,
      tooltip: region.ref36to45Tooltip,
      backgroundColor: cexFadedColors[2],
      borderColor: cexFadedColors[2],
      hoverBackgroundColor: cexSolidColors[2],
    },
    {
      label: '46-55',
      order: 2,
      data: region.incRef46to55,
      tooltip: region.ref46to55Tooltip,
      backgroundColor: cexFadedColors[3],
      borderColor: cexFadedColors[3],
      hoverBackgroundColor: cexSolidColors[3],
    },
    {
      label: '56-65',
      order: 2,
      data: region.incRef56to65,
      tooltip: region.ref56to65Tooltip,
      backgroundColor: cexFadedColors[4],
      borderColor: cexFadedColors[4],
      hoverBackgroundColor: cexSolidColors[4],
    },
    {
      label: '66-75',
      order: 2,
      data: region.incRef66to75,
      tooltip: region.ref66to75Tooltip,
      backgroundColor: cexFadedColors[5],
      borderColor: cexFadedColors[5],
      hoverBackgroundColor: cexSolidColors[5],
    },
    {
      label: '76-85',
      order: 2,
      data: region.incRef76to85,
      tooltip: region.ref76to85Tooltip,
      backgroundColor: cexFadedColors[6],
      borderColor: cexFadedColors[6],
      hoverBackgroundColor: cexSolidColors[6],
    },
    {
      label: '86 & Over',
      order: 2,
      data: region.incRefOver85,
      tooltip: region.refOver85Tooltip,
      backgroundColor: cexFadedColors[7],
      borderColor: cexFadedColors[7],
      hoverBackgroundColor: cexSolidColors[7],
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
        title: 'Age Brackets',
        labels: {
          usePointStyle: true
        }
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          label: function(context){
            return `${context.dataset.label}: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(context.raw)} (${context.dataset.tooltip[context.dataIndex]})`
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
          <h1 className="inline text-2xl">Age of Respondents</h1>
        </div>
        <ChartDescription
          description={`This chart shows respondents' age brackets as a percentage of the entire sample, as well as the average age of the respondents. Hover over the bar chart to see the percentage for a particular age bracket, and the number of respondents in that age bracket.`}
        />
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {rawAgeBracketData && rawAgeBracketData.map((row, idx) => {
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
          <h1 className="inline text-2xl">Income By Age of Respondents</h1>
        </div>
        <ChartDescription
          description={`This chart shows the average family pretax income of households (over the previous 12 months) for each age bracket`}
        />
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {rawAgeBracketIncomeData && rawAgeBracketIncomeData.map((row, idx) => {
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

export default memo(CexSampleAge)