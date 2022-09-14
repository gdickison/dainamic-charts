import { memo } from "react"
import { Bar, Line } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByRegion, cexFadedColors, cexSolidColors } from "../../public/utils"
import ChartDescription from "./ChartDescription"

const CexSampleEarners = ({dateRange, data}) => {
  const labels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)
  const regionalData = Object.values(groupDataByRegion(data, "region_name"))
console.log('regionalData', regionalData)

  const earnerData = regionalData.map((region, idx) => {
    const label = region[idx].region_name

    const refOnly = region.map(row => {
      return row.ref_only
    })

    const percentRefOnly = region.map(row => {
      return parseFloat(row.percent_ref_only).toFixed(1)
    })

    const incRefOnly = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_ref_only).toFixed(0)
    })

    const refAndSpouse = region.map(row => {
      return row.ref_and_spouse
    })

    const percentRefAndSpouse = region.map(row => {
      return parseFloat(row.percent_ref_and_spouse).toFixed(1)
    })

    const incRefAndSpouse = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_ref_and_spouse).toFixed(0)
    })

    const refAndSpouseAndOthers = region.map(row => {
      return row.ref_and_spouse_and_others
    })

    const percentRefAndSpouseAndOthers = region.map(row => {
      return parseFloat(row.percent_ref_and_spouse_and_others).toFixed(1)
    })

    const incRefAndSpouseAndOthers = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_ref_spouse_and_others).toFixed(0)
    })

    const refAndOthers = region.map(row => {
      return row.ref_and_others
    })

    const percentRefAndOthers = region.map(row => {
      return parseFloat(row.percent_ref_and_others).toFixed(1)
    })

    const incRefAndOthers = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_ref_and_others).toFixed(0)
    })

    const spouseOnly = region.map(row => {
      return row.spouse_only
    })

    const percentSpouseOnly = region.map(row => {
      return parseFloat(row.percent_spouse_only).toFixed(1)
    })

    const incSpouseOnly = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_spouse_only).toFixed(0)
    })

    const spouseAndOthers = region.map(row => {
      return row.spouse_and_others
    })

    const percentSpouseAndOthers = region.map(row => {
      return parseFloat(row.percent_spouse_and_others).toFixed(1)
    })

    const incSpouseAndOthers = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_spouse_and_others).toFixed(0)
    })

    const othersOnly = region.map(row => {
      return row.others_only
    })

    const percentOthersOnly = region.map(row => {
      return parseFloat(row.percent_others_only).toFixed(1)
    })

    const incOthersOnly = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_others_only).toFixed(0)
    })

    const noEarners = region.map(row => {
      return row.no_earners
    })

    const percentNoEarners = region.map(row => {
      return parseFloat(row.percent_no_earners).toFixed(1)
    })

    const incNoEarners = region.map(row => {
      return parseFloat(row.avg_family_pretax_income_no_earners).toFixed(0)
    })

    const oneEarner = region.map(row => {
      return Number(row.ref_only) + Number(row.spouse_only)
    })

    const percentOneEarner = region.map(row => {
      return parseFloat(((Number(row.ref_only) + Number(row.spouse_only)) / Number(row.total_sample)) * 100).toFixed(1)
    })

    const incOneEarner = region.map(row => {
      return parseFloat((Number(row.avg_family_pretax_income_ref_only) + Number(row.avg_family_pretax_income_spouse_only)) / 2)
    })

    const twoEarners = region.map(row => {
      return row.ref_and_spouse
    })

    const incTwoEarners = region.map(row => {
      return row.avg_family_pretax_income_ref_and_spouse
    })

    const percentTwoEarners = region.map(row => {
      return parseFloat(row.percent_ref_and_spouse).toFixed(1)
    })

    const multiEarners = region.map(row => {
      return Number(row.ref_and_spouse_and_others) + Number(row.ref_and_others) + Number(row.spouse_and_others) + Number(row.others_only)
    })

    const percentMultiEarners = region.map(row => {
      return parseFloat(((Number(row.ref_and_spouse_and_others) + Number(row.ref_and_others) + Number(row.spouse_and_others) + Number(row.others_only)) / Number(row.total_sample)) * 100).toFixed(1)
    })

    const incMultiEarners = region.map(row => {
      return parseFloat((Number(row.avg_family_pretax_income_ref_spouse_and_others) + Number(row.avg_family_pretax_income_ref_and_others) + Number(row.avg_family_pretax_income_spouse_and_others) + Number(row.avg_family_pretax_income_others_only)) / 4)
    })

    return {
      label,
      refOnly,
      percentRefOnly,
      incRefOnly,
      refAndSpouse,
      percentRefAndSpouse,
      incRefAndSpouse,
      refAndSpouseAndOthers,
      percentRefAndSpouseAndOthers,
      incRefAndSpouseAndOthers,
      refAndOthers,
      percentRefAndOthers,
      incRefAndOthers,
      spouseOnly,
      percentSpouseOnly,
      incSpouseOnly,
      spouseAndOthers,
      percentSpouseAndOthers,
      incSpouseAndOthers,
      othersOnly,
      percentOthersOnly,
      incOthersOnly,
      noEarners,
      percentNoEarners,
      incNoEarners,
      oneEarner,
      percentOneEarner,
      incOneEarner,
      twoEarners,
      percentTwoEarners,
      incTwoEarners,
      multiEarners,
      percentMultiEarners,
      incMultiEarners
    }
  })

  const rawEarners = earnerData.map((region) => {
    return [
      {
        label: 'Ref Person Only',
        data: region.percentRefOnly,
        tooltip: region.refOnly,
        backgroundColor: cexFadedColors[0],
        hoverBackgroundColor: cexSolidColors[0],
        title: region.label
      },
      {
        label: 'Ref Person and Spouse',
        data: region.percentRefAndSpouse,
        tooltip: region.refAndSpouse,
        backgroundColor: cexFadedColors[1],
        hoverBackgroundColor: cexSolidColors[1],
      },
      {
        label: 'Spouse Only',
        data: region.percentSpouseOnly,
        tooltip: region.spouseOnly,
        backgroundColor: cexFadedColors[2],
        hoverBackgroundColor: cexSolidColors[2],
      },
      {
        label: 'Ref Person, Spouse, and Others',
        data: region.percentRefAndSpouseAndOthers,
        tooltip: region.refAndSpouseAndOthers,
        backgroundColor: cexFadedColors[3],
        hoverBackgroundColor: cexSolidColors[3],
      },
      {
        label: 'Ref Person and Others',
        data: region.percentRefAndOthers,
        tooltip: region.refAndOthers,
        backgroundColor: cexFadedColors[4],
        hoverBackgroundColor: cexSolidColors[4],
      },
      {
        label: 'Spouse and Others',
        data: region.percentSpouseAndOthers,
        tooltip: region.spouseAndOthers,
        backgroundColor: cexFadedColors[5],
        hoverBackgroundColor: cexSolidColors[5],
      },
      {
        label: 'Others Only',
        data: region.percentOthersOnly,
        tooltip: region.othersOnly,
        backgroundColor: cexFadedColors[6],
        hoverBackgroundColor: cexSolidColors[6],
      },
      {
        label: 'No Earners',
        data: region.percentNoEarners,
        tooltip: region.noEarners,
        backgroundColor: cexFadedColors[7],
        hoverBackgroundColor: cexSolidColors[7],
      }
    ]
  })

  const rawNumberOfEarners = earnerData.map(region => {
    return [
      {
        label: 'One Earner',
        data: region.percentOneEarner,
        tooltip: region.oneEarner,
        backgroundColor: cexFadedColors[0],
        hoverBackgroundColor: cexSolidColors[0],
        title: region.label
      },
      {
        label: 'Two Earners',
        data: region.percentTwoEarners,
        tooltip: region.twoEarners,
        backgroundColor: cexFadedColors[1],
        hoverBackgroundColor: cexSolidColors[1],
      },
      {
        label: 'Multiple Earners',
        data: region.percentMultiEarners,
        tooltip: region.multiEarners,
        backgroundColor: cexFadedColors[2],
        hoverBackgroundColor: cexSolidColors[2],
      },
      {
        label: 'No Earners',
        data: region.percentNoEarners,
        tooltip: region.noEarners,
        backgroundColor: cexFadedColors[3],
        hoverBackgroundColor: cexSolidColors[3],
      },
    ]
  })

  const rawEarningPowerByEarners = earnerData.map(region => {
console.log('region', region)
    return [
      {
        label: 'Ref Person Only',
        data: region.incRefOnly,
        tooltip: region.refOnly,
        backgroundColor: cexFadedColors[0],
        borderColor: cexFadedColors[0],
        hoverBackgroundColor: cexSolidColors[0],
        title: region.label
      },
      {
        label: 'Ref Person and Spouse',
        data: region.incRefAndSpouse,
        tooltip: region.refAndSpouse,
        backgroundColor: cexFadedColors[1],
        borderColor: cexFadedColors[1],
        hoverBackgroundColor: cexSolidColors[1],
      },
      {
        label: 'Spouse Only',
        data: region.incRefAndSpouseAndOthers,
        tooltip: region.spouseOnly,
        backgroundColor: cexFadedColors[2],
        borderColor: cexFadedColors[2],
        hoverBackgroundColor: cexSolidColors[2],
      },
      {
        label: 'Ref Person, Spouse, and Others',
        data: region.incRefAndOthers,
        tooltip: region.refAndSpouseAndOthers,
        backgroundColor: cexFadedColors[3],
        borderColor: cexFadedColors[3],
        hoverBackgroundColor: cexSolidColors[3],
      },
      {
        label: 'Ref Person and Others',
        data: region.incSpouseOnly,
        tooltip: region.refAndOthers,
        backgroundColor: cexFadedColors[4],
        borderColor: cexFadedColors[4],
        hoverBackgroundColor: cexSolidColors[4],
      },
      {
        label: 'Spouse and Others',
        data: region.incSpouseAndOthers,
        tooltip: region.spouseAndOthers,
        backgroundColor: cexFadedColors[5],
        borderColor: cexFadedColors[5],
        hoverBackgroundColor: cexSolidColors[5],
      },
      {
        label: 'Others Only',
        data: region.incOthersOnly,
        tooltip: region.othersOnly,
        backgroundColor: cexFadedColors[6],
        borderColor: cexFadedColors[6],
        hoverBackgroundColor: cexSolidColors[6],
      },
      {
        label: 'No Earners',
        data: region.incNoEarners,
        tooltip: region.noEarners,
        backgroundColor: cexFadedColors[7],
        borderColor: cexFadedColors[7],
        hoverBackgroundColor: cexSolidColors[7],
      }
    ]
  })

  const rawEarningPowerByNumberOfEarners = earnerData.map(region => {
    return [
      {
        label: 'One Earner',
        data: region.incOneEarner,
        tooltip: region.oneEarner,
        backgroundColor: cexFadedColors[0],
        borderColor: cexFadedColors[0],
        hoverBackgroundColor: cexSolidColors[0],
        title: region.label
      },
      {
        label: 'Two Earners',
        data: region.incTwoEarners,
        tooltip: region.twoEarners,
        backgroundColor: cexFadedColors[1],
        borderColor: cexFadedColors[1],
        hoverBackgroundColor: cexSolidColors[1],
      },
      {
        label: 'Multiple Earners',
        data: region.incMultiEarners,
        tooltip: region.multiEarners,
        backgroundColor: cexFadedColors[2],
        borderColor: cexFadedColors[2],
        hoverBackgroundColor: cexSolidColors[2],
      },
      {
        label: 'No Earners',
        data: region.incNoEarners,
        tooltip: region.noEarners,
        backgroundColor: cexFadedColors[3],
        borderColor: cexFadedColors[3],
        hoverBackgroundColor: cexSolidColors[3],
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
          text: "Earners %",
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
              : `${context.dataset.label}: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(context.raw)} (${context.dataset.tooltip[context.dataIndex]})`
            return tip
          }
        },
        boxPadding: 6
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Avg Income",
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
          <h1 className="inline text-2xl">Who Are the Earners for the Household?</h1>
        </div>
        <ChartDescription
          description={`This chart shows who the household earners are. Is it the Reference Person, the Spouse, Others, or a combination? Hover over the bars to see the percentage and the raw numbers for each category.`}
        />
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {rawEarners && rawEarners.map((row, idx) => {
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
          <h1 className="inline text-2xl">How Many Earners Are In the Household?</h1>
        </div>
        <ChartDescription
          description={`This chart shows how many earners are supporting the household - one earner (the Reference Person or the Spouse), two earners (both the Reference Person and the Spouse), or multiple earners (this includes all categories where earners include "Others"). This chart also shows the number of households with no earners.`}
        />
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {rawNumberOfEarners && rawNumberOfEarners.map((row, idx) => {
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
          <h1 className="inline text-2xl">Household Income By Earner Category</h1>
        </div>
        <ChartDescription
          description={`This chart shows the average family pretax income of households (over the previous 12 months) based on the category of earners.`}
        />
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {rawEarningPowerByEarners && rawEarningPowerByEarners.map((row, idx) => {
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
      <div>
        <div className="relative my-4">
          <h1 className="inline text-2xl">Household Income By Number Of Earners</h1>
        </div>
        <ChartDescription
          description={`This chart shows the average family pretax income of households (over the previous 12 months) based on the number of earners. "One Earner" indicates either the Reference Person or the Reference Person's Spouse. "Two Earners" indicates both the Reference Person and Spouse. "Multiple Earners" indicates all categories that include "others" - either spouse and others, both spouses and others, or others only.`}
        />
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {rawEarningPowerByNumberOfEarners && rawEarningPowerByNumberOfEarners.map((row, idx) => {
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

export default memo(CexSampleEarners)