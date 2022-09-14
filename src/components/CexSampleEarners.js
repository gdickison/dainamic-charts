import { memo } from "react"
import { Bar } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByRegion, chartFadedColors, chartSolidColors } from "../../public/utils"
import ChartDescription from "./ChartDescription"

const CexSampleEarners = ({dateRange, data}) => {
  const labels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)
  const regionalData = Object.values(groupDataByRegion(data, "region_name"))

  const earnerData = regionalData.map((region, idx) => {
    const label = region[idx].region_name

    const refOnly = region.map(row => {
      return row.ref_only
    })

    const percentRefOnly = region.map(row => {
      return parseFloat(row.percent_ref_only).toFixed(1)
    })

    const refAndSpouse = region.map(row => {
      return row.ref_and_spouse
    })

    const percentRefAndSpouse = region.map(row => {
      return parseFloat(row.percent_ref_and_spouse).toFixed(1)
    })

    const refAndSpouseAndOthers = region.map(row => {
      return row.ref_and_spouse_and_others
    })

    const percentRefAndSpouseAndOthers = region.map(row => {
      return parseFloat(row.percent_ref_and_spouse_and_others).toFixed(1)
    })

    const refAndOthers = region.map(row => {
      return row.ref_and_others
    })

    const percentRefAndOthers = region.map(row => {
      return parseFloat(row.percent_ref_and_others).toFixed(1)
    })

    const spouseOnly = region.map(row => {
      return row.spouse_only
    })

    const percentSpouseOnly = region.map(row => {
      return parseFloat(row.percent_spouse_only).toFixed(1)
    })

    const spouseAndOthers = region.map(row => {
      return row.spouse_and_others
    })

    const percentSpouseAndOthers = region.map(row => {
      return parseFloat(row.percent_spouse_and_others).toFixed(1)
    })

    const othersOnly = region.map(row => {
      return row.others_only
    })

    const percentOthersOnly = region.map(row => {
      return parseFloat(row.percent_others_only).toFixed(1)
    })

    const noEarners = region.map(row => {
      return row.no_earners
    })

    const percentNoEarners = region.map(row => {
      return parseFloat(row.percent_no_earners).toFixed(1)
    })

    const oneEarner = region.map(row => {
      return Number(row.ref_only) + Number(row.spouse_only)
    })

    const percentOneEarner = region.map(row => {
      return parseFloat(((Number(row.ref_only) + Number(row.spouse_only)) / Number(row.total_sample)) * 100).toFixed(1)
    })

    const twoEarners = region.map(row => {
      return row.ref_and_spouse
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

    return {
      label,
      refOnly,
      percentRefOnly,
      refAndSpouse,
      percentRefAndSpouse,
      refAndSpouseAndOthers,
      percentRefAndSpouseAndOthers,
      refAndOthers,
      percentRefAndOthers,
      spouseOnly,
      percentSpouseOnly,
      spouseAndOthers,
      percentSpouseAndOthers,
      othersOnly,
      percentOthersOnly,
      noEarners,
      percentNoEarners,
      oneEarner,
      percentOneEarner,
      twoEarners,
      percentTwoEarners,
      multiEarners,
      percentMultiEarners
    }
  })

  const rawEarnersWhoData = earnerData.map((region) => {
    return [
      {
        label: 'Reference Person Only',
        data: region.percentRefOnly,
        tooltip: region.refOnly,
        backgroundColor: chartFadedColors[0],
        hoverBackgroundColor: chartSolidColors[0],
        title: region.label
      },
      {
        label: 'Reference Person and Spouse',
        data: region.percentRefAndSpouse,
        tooltip: region.refAndSpouse,
        backgroundColor: chartFadedColors[1],
        hoverBackgroundColor: chartSolidColors[1],
      },
      {
        label: 'Spouse Only',
        data: region.percentSpouseOnly,
        tooltip: region.spouseOnly,
        backgroundColor: chartFadedColors[2],
        hoverBackgroundColor: chartSolidColors[2],
      },
      {
        label: 'Reference Person, Spouse, and Others',
        data: region.percentRefAndSpouseAndOthers,
        tooltip: region.refAndSpouseAndOthers,
        backgroundColor: chartFadedColors[3],
        hoverBackgroundColor: chartSolidColors[3],
      },
      {
        label: 'Reference Person and Others',
        data: region.percentRefAndOthers,
        tooltip: region.refAndOthers,
        backgroundColor: chartFadedColors[4],
        hoverBackgroundColor: chartSolidColors[4],
      },
      {
        label: 'Spouse and Others',
        data: region.percentSpouseAndOthers,
        tooltip: region.spouseAndOthers,
        backgroundColor: chartFadedColors[5],
        hoverBackgroundColor: chartSolidColors[5],
      },
      {
        label: 'Others Only',
        data: region.percentOthersOnly,
        tooltip: region.othersOnly,
        backgroundColor: chartFadedColors[6],
        hoverBackgroundColor: chartSolidColors[6],
      },
      {
        label: 'No Earners',
        data: region.percentNoEarners,
        tooltip: region.noEarners,
        backgroundColor: chartFadedColors[7],
        hoverBackgroundColor: chartSolidColors[7],
      }
    ]
  })

  const rawEarnersNumData = earnerData.map(region => {
    return [
      {
        label: 'One Earner',
        data: region.percentOneEarner,
        tooltip: region.oneEarner,
        backgroundColor: chartFadedColors[0],
        hoverBackgroundColor: chartSolidColors[0],
        title: region.label
      },
      {
        label: 'Two Earners',
        data: region.percentTwoEarners,
        tooltip: region.twoEarners,
        backgroundColor: chartFadedColors[1],
        hoverBackgroundColor: chartSolidColors[1],
      },
      {
        label: 'Multiple Earners',
        data: region.percentMultiEarners,
        tooltip: region.multiEarners,
        backgroundColor: chartFadedColors[2],
        hoverBackgroundColor: chartSolidColors[2],
      },
      {
        label: 'No Earners',
        data: region.percentNoEarners,
        tooltip: region.noEarners,
        backgroundColor: chartFadedColors[3],
        hoverBackgroundColor: chartSolidColors[3],
      },
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

  return (
    <div className="mx-6">
      <div className="relative my-4">
        <h1 className="inline text-2xl">Who The Earners Are</h1>
      </div>
      <ChartDescription
        description={`This chart shows who the household earners are. Is it the Reference Person, the Spouse, Others, or a combination? Hover over the bars to see the percentage and the raw numbers for each category.`}
      />
      <div className="grid grid-cols-2 gap-x-2 gap-y-6">
        {rawEarnersWhoData && rawEarnersWhoData.map((row, idx) => {
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
      <div className="relative my-4">
        <h1 className="inline text-2xl">Number of Earners</h1>
      </div>
      <ChartDescription
        description={`This chart shows how many earners are supporting the household - one earner (the Reference Person or the Spouse), two earners (both the Reference Person and the Spouse), or multiple earners (this includes all categories where earners include "Others"). This chart also shows the number of households with no earners.`}
      />
      <div className="grid grid-cols-2 gap-x-2 gap-y-6">
        {rawEarnersNumData && rawEarnersNumData.map((row, idx) => {
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

export default memo(CexSampleEarners)