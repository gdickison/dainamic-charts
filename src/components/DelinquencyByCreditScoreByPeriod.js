import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import { Bar } from "react-chartjs-2"
import { groupDataByMsa, chartSolidColors, chartFadedColors } from "../../public/utils"
import { memo } from "react"

const DelinquencyByCreditScoreByPeriod = ({data}) => {
  const groupedData = Object.values(groupDataByMsa(data, "msa"))
  const delinquencyRateFeatureData = {
    labels: [],
    datasets: []
  }

  groupedData.map((group, groupIdx) => {
    if(groupIdx === 0){
      group.map(row => {
        delinquencyRateFeatureData.labels.push((row.origination_date.split('T')[0]).toString())
      })
    }
    delinquencyRateFeatureData.datasets.push(
      {
        label: `580-669 - ${group[0].name.split(',')[0]}`,
        backgroundColor: null,
        hoverBackgroundColor: null,
        borderColor: null,
        borderWidth: 1,
        data: [],
        tooltip: []
      },
      {
        label: `670-739 - ${group[0].name.split(',')[0]}`,
        backgroundColor: null,
        hoverBackgroundColor: null,
        borderColor: null,
        borderWidth: 1,
        data: [],
        tooltip: []
      },
      {
        label: `740-799 - ${group[0].name.split(',')[0]}`,
        backgroundColor: null,
        hoverBackgroundColor: null,
        borderColor: null,
        borderWidth: 1,
        data: [],
        tooltip: []
      },
      {
        label: `800+ - ${group[0].name.split(',')[0]}`,
        backgroundColor: null,
        hoverBackgroundColor: null,
        borderColor: null,
        borderWidth: 1,
        data: [],
        tooltip: []
      },
    )

    delinquencyRateFeatureData.datasets.map((dataSet) => {
      group.map((row, idx) => {
        if(dataSet.label.indexOf(`580-669 - ${group[0].name.split(',')[0]}`) !== -1){
          dataSet.data.push(((row.fair_delinquent / row.fair_total) * 100).toFixed(2))
          dataSet.tooltip.push({
            totalAtPoint: row.fair_total,
            delinquentAtPoint: row.fair_delinquent
          })
          dataSet.backgroundColor = chartFadedColors[0]
          dataSet.hoverBackgroundColor = chartSolidColors[0]
          dataSet.borderColor = chartSolidColors[0]
        }
        if(dataSet.label.indexOf(`670-739 - ${group[0].name.split(',')[0]}`) !== -1){
          dataSet.data.push(((row.good_delinquent / row.good_total) * 100).toFixed(2))
          dataSet.tooltip.push({
            totalAtPoint: row.good_total,
            delinquentAtPoint: row.good_delinquent
          })
          dataSet.backgroundColor = chartFadedColors[1]
          dataSet.hoverBackgroundColor = chartSolidColors[1]
          dataSet.borderColor = chartSolidColors[1]
        }
        if(dataSet.label.indexOf(`740-799 - ${group[0].name.split(',')[0]}`) !== -1){
          dataSet.data.push(((row.very_good_delinquent / row.very_good_total) * 100).toFixed(2))
          dataSet.tooltip.push({
            totalAtPoint: row.very_good_total,
            delinquentAtPoint: row.very_good_delinquent
          })
          dataSet.backgroundColor = chartFadedColors[2]
          dataSet.hoverBackgroundColor = chartSolidColors[2]
          dataSet.borderColor = chartSolidColors[2]
        }
        if(dataSet.label.indexOf(`800+ - ${group[0].name.split(',')[0]}`) !== -1){
          dataSet.data.push(((row.exceptional_delinquent / row.exceptional_total) * 100).toFixed(2))
          dataSet.tooltip.push({
            totalAtPoint: row.exceptional_total,
            delinquentAtPoint: row.exceptional_delinquent
          })
          dataSet.backgroundColor = chartFadedColors[3]
          dataSet.hoverBackgroundColor = chartSolidColors[3]
          dataSet.borderColor = chartSolidColors[3]
        }
      })
    })
  })

  const delinquencyRateFeatureOptions = {
    aspectRatio: 2.5,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        onHover: function(event, legendItem, legend){
          const myChart = legend.chart
          const indices = []
          for(let i = 0; i < myChart.getDatasetMeta(0).data.length; i++){
            indices.push(
              {
                datasetIndex: legendItem.datasetIndex,
                index: i
              }
            )
          }
          myChart.setActiveElements(indices)
          myChart.update()
        },
        onLeave: function(event, legendItem, legend){
          const myChart = legend.chart
          myChart.update()
        }
      },
      tooltip: {
        callbacks: {
          beforeTitle: function(context){
            return `Credit Score: ${context[0].dataset.label}`
          },
          title: function(context){
            return `Total loans: ${context[0].dataset.tooltip[context[0].dataIndex].totalAtPoint}`
          },
          afterTitle: function(context){
            return `Delinquent loans: ${context[0].dataset.tooltip[context[0].dataIndex].delinquentAtPoint}`
          },
          label: function(context){
            return(`Delinquency rate: ${context.raw}%`)
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: false,
          text: "Delinquency Rate",
          padding: 20,
          font: {
            size: 12
          }
        },
        ticks: {
          callback: function(value, index, ticks){
            return `${value}%`
          },
          font: {
            size: 12
          }
        },
        grace: 5
      },
      x: {
        title: {
          display: true,
          text: '',
          padding: 20,
          font: {
            size: 14
          }
        },
        ticks: {
          callback: function(value){
            let date = new Date(this.getLabelForValue(value))
            return `${date.toLocaleString('en-us', {timeZone: 'UTC', month: 'long', year: 'numeric'})}`
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
    <div>
      <div>
        <ChartHeaderWithTooltip
          chartName={"Delinquency Rate by Credit Score and Origination Date"}
          msa={"selected regions"}
          tooltip={"Credit scores are grouped into standard ranges corresponding to 'Fair', 'Good', 'Very Good', and 'Exceptional'. The number of delinquent loans for each range in each period is divided by the corresponding total number of loans to get the delinquency rate. Delinquency rates of 0% are not shown. Delinquency rates of 100% generally indicate an anomally based on a very small number of loans at the given data point and are also excluded. Hover over the data points to see details"}
        />
      </div>
      <div className="flex">
      {delinquencyRateFeatureData &&
        <div className="w-full">
          <Bar data={delinquencyRateFeatureData} options={delinquencyRateFeatureOptions} />
        </div>
      }
      </div>
    </div>
  )
}

export default memo(DelinquencyByCreditScoreByPeriod)