import outliers from "outliers"
import ChartTitle from "./ChartTitle"
import ChartDescription from "./ChartDescription"
import { getLinearRegression, groupDataByMsa, chartSolidColors, pointStyles, regressionLineColor } from "../../public/utils"
import { Scatter } from "react-chartjs-2"
import { memo } from "react"

const DelinquencyByInterestRate = ({data}) => {
  for(const row of data){
    row.interest_rate = (Math.round(row.interest_rate * 8) / 8).toFixed(3)
  }

  const groupedData = groupDataByMsa(data, "msa")

  const numRegions = Object.keys(groupedData).length
  const rawChartData = []
  Object.values(groupedData).map(value => {

    rawChartData.push(value.reduce((a, v) => {
      if(a[v.interest_rate]){
        a[v.interest_rate].current = Number(a[v.interest_rate].current) + Number(v.current)
        a[v.interest_rate].delinquent = Number(a[v.interest_rate].delinquent) + Number(v.delinquent)
        a[v.interest_rate].total_loans = Number(a[v.interest_rate].total_loans) + Number(v.total_loans)
      } else {
        a[v.interest_rate] = v
      }
      return a
    }, {}))
  })

  rawChartData.map(region => {
    Object.values(region).map(value => {
      value.delinquencyRate =  parseFloat((Number(value.delinquent) / Number(value.total_loans)) * 100).toFixed(2)
    })
  })

  const dataForChart = rawChartData.map(region => {
    const dataset = []
    const regressionX = []
    const regressionY = []

    for(const row of Object.values(region)){
      if(row.delinquencyRate > 0 && row.delinquencyRate < 100){
        dataset.push({
          x: row.interest_rate,
          y: row.delinquencyRate,
          totalAtRate: row.total_loans,
          delinquentAtRate: row.delinquent,
          msa: row.msa,
          name: row.name
        })
        regressionX.push(Number(row.interest_rate))
        regressionY.push(Number(row.delinquencyRate))
      }
    }

    return {dataset, regressionX, regressionY}
  })

  const datasets = []
  dataForChart.map((row, i) => {
    const yArray = row.dataset.map(set => {
      return Number(set.y)
    })

    const normalized = yArray.filter(outliers())
    const normalHigh = Math.max(...normalized)
    const normalLow = Math.min(...normalized)

    const lineData = []
    for(const dataRow of Object.values(row.dataset)){
      if(dataRow.y <= normalHigh && dataRow.y >= normalLow){
        lineData.push({
          x: dataRow.x,
          y: dataRow.y,
          totalAtRate: dataRow.totalAtRate,
          delinquentAtRate: dataRow.delinquentAtRate,
          msa: dataRow.msa,
          name: dataRow.name
        })
      }
    }

    datasets.push({
      label: `${row.dataset[0].name}`,
      data: lineData,
      borderColor: 'transparent',
      borderWidth: 0,
      hoverBorderWidth: 3,
      hoverBorderColor: chartSolidColors[i],
      backgroundColor: chartSolidColors[i],
      hoverBackgroundColor: chartSolidColors[i],
      pointRadius: 5,
      pointHoverBorderWidth: 3,
      pointHitRadius: 5,
      pointHoverRadius: 7,
      msa: row.dataset[0].msa,
      pointStyle: pointStyles[i],
      showLine: true
    })

    const regressionData = []
    Object.keys(row.regressionX).forEach(key => {
      const lr = getLinearRegression(row.regressionY, row.regressionX)
      if((lr.intercept + (lr.slope * Number(row.dataset[key].x))) > 0){
        regressionData.push({
          x: Number(row.dataset[key].x),
          y: lr.intercept + (lr.slope * Number(row.dataset[key].x))
        })
      }
    })

    datasets.push({
      label: `${row.dataset[0].name} Regression`,
      data: regressionData,
      borderColor: regressionLineColor,
      backgroundColor: regressionLineColor,
      borderWidth: 3,
      pointRadius: 0,
      pointHitRadius: 0,
      showLine: true,
      hidden: true
    })
  })

  const chartOptions = {
    responsive: true,
    aspectRatio: 2.5,
    hover: {
      mode: 'dataset',
      intersect: true,
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          filter: function(item) {
            return !item.text.includes('Regression');
          },
          font: {
            size: 16
          },
          usePointStyle: true
        },
        onHover: function(event, legendItem, legend){
          const intChart = legend.chart
          intChart.show(legendItem.datasetIndex)
          intChart.show(legendItem.datasetIndex + 1)
          intChart.update()
          intChart.setActiveElements([{datasetIndex: legendItem.datasetIndex, index: 0}])
        },
        onLeave: function(event, legendItem, legend){
          const intChart = legend.chart
          intChart.hide(legendItem.datasetIndex + 1)
          intChart.update()
        },
        onClick: function(){
          return null
        }
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          title: function(context) {
            return `${context[0].dataset.label}`
          },
          beforeBody: function(context) {
            return [
              `Interest Rate: ${context[0].raw.x}%`,
              `Total Loans at Rate: ${context[0].raw.totalAtRate}`,
              `Delinquent Loans at Rate: ${context[0].raw.delinquentAtRate}`
            ]
          },
          label: function(context) {
            let label = `Delinquency Rate: ${context.raw.y}%`
            return label
          },
          labelPointStyle: function(context) {
            return {
              pointStyle: `${context.dataset.pointStyle}`,
              rotation: 0
            }
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
            size: 16
          }
        },
        ticks: {
          callback: function(value){
            return value + "%"
          },
          font: {
            size: 16
          }
        },
        grace: 5,
        beginAtZero: true
      },
      x: {
        title: {
          display: true,
          text: "Interest Rate (grouped by .125%)",
          padding: 20,
          font: {
            size: 16
          }
        },
        ticks: {
          callback: function(value){
            return value + "%"
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
      {datasets &&
          <>
            <div className="my-4">
              <ChartTitle
                chartTitle={"Delinquency by Interest Rate"}
                msa={numRegions === 1 ? datasets[0].label : "Selected Regions"}
              />
              <ChartDescription
                description={`All loans during the selected date range are grouped into increments of .125%. Delinquent loans at the given rate are divided by the total loans at that rate to show the delinquency rate. Delinquency rates of 0% are not shown. Delinquency rates of 100% generally indicate an anomally based on a very small number of loans at the given rate and are also excluded. Hover over the data points to see details. Hover over the legend to see the datapoints and trend line for a region. Hover over a datapoint on the chart for specific details. Click the legend to show and hide datasets`}
              />
            </div>
            <div className="relative flex items-center">
              <Scatter id={"intChart"} className="my-6" data={{datasets}} options={chartOptions}/>
            </div>
          </>
      }
    </div>
  )
}

export default memo(DelinquencyByInterestRate)