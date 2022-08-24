import { Fragment, memo } from "react"
import { Bar } from "react-chartjs-2"
import ChartTitle from "./ChartTitle"
import ChartDescription from "./ChartDescription"
import { chartFadedColors, chartSolidColors } from "../../public/utils"

const DelinquencyByIndustry = ({data}) => {
  const labels = [
    "Ag/Mining",
    "Construction",
    "Manufacturing",
    "Wholesale Trade",
    "Retail Trade",
    "Transportation",
    "Information",
    "Finance/Insurance/Real Estate",
    "Professional Services",
    "Education/Healthcare",
    "Arts/Entertainment",
    "Public Sector",
    "Other"
  ]

  const delinquencyByIndustry = []

  const barChartStructuredData = data.map((region, i) => {

    const dataset = []
    Object.entries(region).map(row => {
      if(labels.includes(row[0])){
        dataset.push(parseFloat(row[1]).toFixed(2))
      }
    })
    delinquencyByIndustry.push(dataset)

    const tooltipData = {
      regionDelinquencyRate: parseFloat(region.delinquency_rate).toFixed(2),
      regionDelinquent: region.delinquent_msa,
      regionTotal: region.total_msa,
      minDate: region.min,
      maxDate: region.max
    }

    return {
      label: region.name,
      data: delinquencyByIndustry[i],
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
        },
        boxPadding: 6
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
          text: "Industry",
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
          <div className="my-4">
            <ChartTitle
              chartTitle={"Delinquency Rate by Industry"}
              msa={data.length === 1 ? data[0].name : "Selected Regions"}
            />
            <ChartDescription
              description={"Dainamic's model determines what portion of a region's overall delinquency rate for the chosen period is attributable to employment in particular industries. Delinquency is aggragated for all available dates rather than selected start and end dates. Hover over the legend to highlight that region. Click on the legend to show/hide that region in the chart. Hover over the data points to see more detail."}
            />
          </div>
          <Bar data={chartData} options={chartOptions} />
        </div>
      }
    </Fragment>
  )
}

export default memo(DelinquencyByIndustry)
