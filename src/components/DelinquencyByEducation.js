import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import { Bar } from "react-chartjs-2"
import { chartFadedColors, chartSolidColors } from "../../public/utils"
import { Fragment, memo } from "react"

const DelinquencyByEducation = ({data}) => {
  const labels = [
    "< High School Diploma",
    "Some College",
    "College Degree",
    "College Post Grad"
]
  const delinquencyByEdLevel = []

  const barChartStructuredData = data.map((region, i) => {

    const dataset = []
    Object.entries(region).map(row => {
      if(row[0] === "< High School Diploma" || row[0] === "Some College" || row[0] === "College Degree" || row[0] === "College Post Grad"){
        dataset.push(parseFloat(row[1]).toFixed(2))
      }
    })
    delinquencyByEdLevel.push(dataset)

    const tooltipData = {
      regionDelinquencyRate: parseFloat(region.delinquency_rate).toFixed(2),
      regionDelinquent: region.delinquent_msa,
      regionTotal: region.total_msa,
      minDate: region.min,
      maxDate: region.max
    }

    return {
      label: region.name,
      data: delinquencyByEdLevel[i],
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
          callback: function(value, index, title){
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
          text: "Education Level",
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

  return (
    <Fragment>
      {chartData &&
        <>
          <ChartHeaderWithTooltip
            chartName={"Delinquency Rate by Education Level"}
            msa={data.length === 1 ? data[0].name : "selected regions"}
            tooltip={"Dainamics' model determines what portion of a regions overall delinquency rate for the chosen period is attributable to education level segments. Delinquency is aggragated for all available dates rather than selected start and end dates."}
          />
          <Bar data={chartData} options={chartOptions} />
        </>
      }
    </Fragment>
  )
}

export default memo(DelinquencyByEducation)