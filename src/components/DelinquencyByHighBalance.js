import ChartTitle from "./ChartTitle"
import ChartDescription from "./ChartDescription"
import { Line } from "react-chartjs-2"
import { groupDataByMsa, chartSolidColors, chartFadedColors, pointStyles } from "../../public/utils"
import { memo } from "react"

const DelinquencyByHighBalance = ({data}) => {
  const groupedData = Object.values(groupDataByMsa(data, "msa"))

  const hbBarChartData = {
    labels: [],
    datasets: []
  }

  groupedData.forEach((region, idx) => {
    const highBalanceData = []
    const highBalanceTooltip = []
    const lowBalanceBuyerData = []
    const lowBalanceBuyerTooltip = []
    if(idx === 0){
      region.forEach((row, i) => {
        if(i % 2 === 0){
          hbBarChartData.labels.push((row.origination_date.split('T')[0]).toString())
        }
      })
    }
    region.forEach(row => {
      if(row.highBalance === true){
        highBalanceData.push(((row.delinquent / row.total) * 100).toFixed(2))
        highBalanceTooltip.push({
          totalAtPoint: row.total,
          delinquentAtPoint: row.delinquent
        })
      } else {
        lowBalanceBuyerData.push(((row.delinquent / row.total) * 100).toFixed(2))
        lowBalanceBuyerTooltip.push({
          totalAtPoint: row.total,
          delinquentAtPoint: row.delinquent
        })
      }
    })
    hbBarChartData.datasets.push(
      {
        label: `High Balance Buyer - ${region[0].name.split(',')[0]}`,
        backgroundColor: chartFadedColors[idx],
        borderColor: chartFadedColors[idx],
        borderWidth: 3,
        hoverBorderWidth: 3,
        pointRadius: 5,
        pointHitRadius: 5,
        pointHoverRadius: 7,
        pointStyle: pointStyles[idx],
        data: highBalanceData,
        tooltip: highBalanceTooltip
      },
      {
        label: `Non-High Balance Buyer - ${region[0].name.split(',')[0]}`,
        backgroundColor: chartSolidColors[idx],
        borderColor: chartSolidColors[idx],
        borderWidth: 3,
        hoverBorderWidth: 3,
        pointRadius: 5,
        pointHitRadius: 5,
        pointHoverRadius: 7,
        pointStyle: pointStyles[idx],
        data: lowBalanceBuyerData,
        tooltip: lowBalanceBuyerTooltip
      }
    )
  })

  const chartData = {
    labels: hbBarChartData.labels,
    datasets: hbBarChartData.datasets
  }

  const chartOptions = {
    responsive: true,
    aspectRatio: 2.5,
    hover: {
      mode: 'dataset',
      intersect: true
    },
    plugins: {
      legend: {
        display: true
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          beforeTitle: function(context){
            return `${context[0].dataset.label}`
          },
          title: function(context){
            return `Total loans: ${context[0].dataset.tooltip[context[0].dataIndex].totalAtPoint}`
          },
          afterTitle: function(context){
            return `Delinquent loans: ${context[0].dataset.tooltip[context[0].dataIndex].delinquentAtPoint}`
          },
          label: function(context){
            return `Delinquency rate: ${context.raw}%`
          }
        },
        boxPadding: 6,
        caretPadding: 20
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Delinquency Rate",
          padding: 20,
          font: {
            size: 20
          }
        },
        ticks: {
          callback: function(value){
            return `${value}%`
          },
          font: {
            size: 16
          }
        }
      },
      x: {
        title: {
          display: true,
          text: "Origination Month",
          padding: 20,
          font: {
            size: 20
          }
        },
        ticks: {
          callback: function(value){
            let date = new Date(this.getLabelForValue(value))
            return `${date.toLocaleString('en-us', {timeZone: 'UTC', month: 'long', year: 'numeric'})}`
          },
          font: {
            size: 16
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
      <div className="my-4">
        <ChartTitle
          chartTitle={'Delinquency by High Balance Indicator Status'}
          msa={groupedData.length === 1 ? groupedData[0][0].name : "Selected Regions"}
        />
        <ChartDescription
          description={""}
        />
      </div>
      {chartData &&
        <Line data={chartData} options={chartOptions} />
      }
    </div>
  )
}

export default memo(DelinquencyByHighBalance)