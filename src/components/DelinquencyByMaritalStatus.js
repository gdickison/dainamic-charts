import { Fragment, memo } from "react"
import { Bar } from "react-chartjs-2"
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import { chartFadedColors, chartSolidColors } from "../../public/utils"

const MaritalStatus = ({data}) => {
  const labels = [
    "Married",
    "Unmarried"
  ]

  const delinquencyByMaritalStatus = []

  const barChartStructuredData = data.map((region, i) => {

    const dataset = []
    Object.entries(region).map(row => {
      if(row[0] === "Married" || row[0] === "Unmarried"){
        dataset.push(parseFloat(row[1]).toFixed(2))
      }
    })
    delinquencyByMaritalStatus.push(dataset)

    const tooltipData = {
      regionDelinquencyRate: parseFloat(region.delinquency_rate).toFixed(2),
      regionDelinquent: region.delinquent_msa,
      regionTotal: region.total_msa,
      minDate: region.min,
      maxDate: region.max
    }

    return {
      label: region.name,
      data: delinquencyByMaritalStatus[i],
      backgroundColor: chartFadedColors[i],
      borderColor: chartSolidColors[i],
      hoverBackgroundColor: chartSolidColors[i],
      borderWidth: 3,
      tooltip: tooltipData
    }
  })

  const chartData = {
    labels: labels,
    datasets: barChartStructuredData
  }

  const chartOptions = {
    responsive: true,
    aspectRatio: 2.5,
    plugins: {
      legend: {
        display: true,
        onHover: function(event, legendItem, legend){
          const thisChart = legend.chart
          const indices = []
          for(let i = 0; i < thisChart.getDatasetMeta(0).data.length; i++){
            indices.push(
              {
                datasetIndex: legendItem.datasetIndex,
                index: i
              }
            )
          }
          thisChart.setActiveElements(indices)
          thisChart.update()
        },
        onLeave: function(event, legendItem, legend){
          const thisChart = legend.chart
          thisChart.update()
        },
        labels: {
          fontSize: 16
        }
      },
      tooltip: {
        callbacks: {
          title: function(context){
            return `${context[0].dataset.label}`
          },
          beforeLabel: function(context){
            return `Delinquency Rate for region: ${context.dataset.tooltip.regionDelinquencyRate}%`
          },
          label: function(context){
            return `Delinquency Rate for ${context.label}: ${context.raw}%`
          }
        }
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
            size: 20
          }
        }
      },
      x: {
        title: {
          display: true,
          text: "Marital Status",
          padding: 20,
          font: {
            size: 20
          }
        },
        ticks: {
          font: {
            size: 20
          }
        },
        grid: {
          display: false
        }
      }
    }
  }

  return(
    <Fragment>
      {chartData &&
        <div>
          <ChartHeaderWithTooltip
            chartName={"Delinquency Rate by Marital Status"}
            msa={data.length === 1 ? data[0].name : "selected regions"}
            tooltip={"Dainamics' model determines what portion of a regions overall delinquency rate for the chosen period is attributable to marital status. Delinquency is aggragated for all available dates rather than selected start and end dates."}
          />
          <Bar data={chartData} options={chartOptions} />
        </div>
      }
    </Fragment>
  )
}

export default memo(MaritalStatus)
