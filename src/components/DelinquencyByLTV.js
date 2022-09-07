import { memo } from "react"
import { getLinearRegression, groupDataByRegion, chartSolidColors, pointStyles, regressionLineColor } from "../../public/utils"
import { Scatter } from "react-chartjs-2"
import ChartTitle from "./ChartTitle"
import ChartDescription from "./ChartDescription"

const DelinquencyByLTV = ({data}) => {
  const groupedData = groupDataByRegion(data, "msa")

  Object.values(groupedData).forEach(row => {
    row.forEach(item => {
      item.delinquencyRate = parseFloat((Number(item.delinquent) / Number(item.total)) * 100).toFixed(2)
    })
  })

  const lineData = Object.values(groupedData).map((region, idx) => {
    const dataArray = []
    for(const row of region){
      if(row.total > 2 && row.delinquencyRate > 0 && row.delinquencyRate < 100){
        dataArray.push({
          x: row.ltv,
          y: row.delinquencyRate,
          totalAtLTV: row.total,
          delinquentAtLTV: row.delinquent,
          msa: row.msa,
          name: row.name
        })
      }
    }

    return {
      label: `${region[0].name}`,
      data: dataArray,
      borderColor: 'transparent',
      borderWidth: 0,
      hoverBorderWidth: 3,
      hoverBorderColor: chartSolidColors[idx],
      backgroundColor: chartSolidColors[idx],
      hoverBackgroundColor: chartSolidColors[idx],
      pointRadius: 5,
      pointHoverBorderWidth: 3,
      pointHitRadius: 5,
      pointHoverRadius: 7,
      msa: region[0].msa,
      pointStyle: pointStyles[idx],
      showLine: true
    }
  })

  const regressionData = Object.values(groupedData).map((region) => {
    const regressionX = []
    const regressionY = []

    for(const row of region){
      if(row.total > 2 && row.delinquencyRate > 0 && row.delinquencyRate < 100){
        regressionX.push(Number(row.ltv))
        regressionY.push(Number(row.delinquencyRate))
      }
    }

    const lr = getLinearRegression(regressionY, regressionX)
    const regressionData = region.map(row => {
      if((lr.intercept + (lr.slope * Number(row.ltv))) > 0){
        return {
          x: Number(row.ltv),
          y: lr.intercept + (lr.slope * Number(row.ltv))
        }
      }
    })

    return {
      label: `${region[0].name} Regression`,
      data: regressionData,
      borderColor: regressionLineColor,
      backgroundColor: regressionLineColor,
      borderWidth: 3,
      pointRadius: 0,
      pointHitRadius: 0,
      showLine: true,
      hidden: true
    }
  })

  const chartData = {
    datasets: lineData.concat(regressionData)
  }

  const chartOptions = {
    responsive: true,
    aspectRatio: 2.5,
    hover: {
      mode: 'dataset',
      intersect: true,
    },
    elements: {
      line: {
        borderJoinStyle: 'round'
      }
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
          const ltvChart = legend.chart
          ltvChart.show(legendItem.datasetIndex)
          ltvChart.show(legendItem.datasetIndex + lineData.length)
          ltvChart.update()
          ltvChart.setActiveElements([{datasetIndex: legendItem.datasetIndex, index: 0}])
        },
        onLeave: function(event, legendItem, legend){
          const ltvChart = legend.chart
          ltvChart.hide(legendItem.datasetIndex + lineData.length)
          ltvChart.update()
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
              `Loan-to-Value: ${context[0].raw.x}%`,
              `Total Loans at LTV: ${context[0].raw.totalAtLTV}`,
              `Delinquent Loans at LTV: ${context[0].raw.delinquentAtLTV}`
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
          text: "Loan-to-Value Ratio",
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
      <div className="my-4">
        <ChartTitle
          chartTitle={"Delinquency by Loan-to-Value"}
          msa={lineData.length === 1 ? lineData[0].label : "Selected Regions"}
        />
        <ChartDescription
          description={"Delinquent loans at the given loan-to-value ratio are divided by the total loans at that ratio to show the delinquency rate. Delinquency rates of 0% are not shown. Delinquency rates of 100% generally indicate an anomally based on a very small number of loans at the given rate and are also excluded. Hover over the legend to see the data line and the regression line for that region. Hover over the data points to see more details."}
        />
      </div>
      {chartData &&
        <Scatter id={"ltvChart"} data={chartData} options={chartOptions}/>
      }
    </div>
  )
}

export default memo(DelinquencyByLTV)