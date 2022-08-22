import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import { getLinearRegression, groupDataByMsa, chartSolidColors, pointStyles, regressionLineColor } from "../../public/utils"
import { memo } from "react"
import { Scatter } from "react-chartjs-2"

const DelinquencyByLoanTerm = ({data}) => {
  const groupedData = groupDataByMsa(data, "msa")

  Object.values(groupedData).forEach(row => {
    row.forEach(item => {
      item.delinquencyRate =  parseFloat((Number(item.delinquent) / Number(item.total)) * 100).toFixed(2)
    })
  })

  const lineData = Object.values(groupedData).map((region, idx) => {
    const dataArray = []
    for(const row of region){
      if(row.total > 2 && row.delinquencyRate > 0 && row.delinquencyRate < 100){
        dataArray.push({
          x: row.loan_term,
          y: row.delinquencyRate,
          totalAtTerm: row.total,
          delinquentAtTerm: row.delinquent,
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

  const regressionData = Object.values(groupedData).map((region, idx) => {
    const regressionX = []
    const regressionY = []

    for(const row of region){
      if(row.total > 2 && row.delinquencyRate > 0 && row.delinquencyRate < 100){
        regressionX.push(Number(row.loan_term))
        regressionY.push(Number(row.delinquencyRate))
      }
    }

    const lr = getLinearRegression(regressionY, regressionX)
    const regressionData = region.map(row => {
      if((lr.intercept + (lr.slope * Number(row.loan_term))) > 0){
        return {
          x: Number(row.loan_term),
          y: lr.intercept + (lr.slope * Number(row.loan_term))
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
          const loanTermChart = legend.chart
          loanTermChart.show(legendItem.datasetIndex)
          loanTermChart.show(legendItem.datasetIndex + lineData.length)
          loanTermChart.update()
          loanTermChart.setActiveElements([{datasetIndex: legendItem.datasetIndex, index: 0}])
        },
        onLeave: function(event, legendItem, legend){
          const loanTermChart = legend.chart
          loanTermChart.hide(legendItem.datasetIndex + lineData.length)
          loanTermChart.update()
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
              `Loan Term: ${context[0].raw.x} months`,
              `Total Loans at Term: ${context[0].raw.totalAtTerm}`,
              `Delinquent Loans at Term: ${context[0].raw.delinquentAtTerm}`
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
          text: "Loan Term (months)",
          padding: 20,
          font: {
            size: 16
          }
        },
        ticks: {
          callback: function(value){
            return value
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
      <ChartHeaderWithTooltip
        chartName={"Delinquency by Loan Term"}
        msa={lineData.length === 1 ? lineData[0].label : "selected regions"}
        tooltip={"Delinquent loans at the given term are divided by the total loans at that term to show the delinquency rate. Delinquency rates of 0% are not shown. Delinquency rates of 100% generally indicate an anomally based on a very small number of loans at the given rate and are also excluded. Hover over the data points to see details"}
      />
      {chartData &&
        <Scatter id={"loanTermChart"} data={chartData} options={chartOptions}/>
      }
    </div>
  )
}

export default memo(DelinquencyByLoanTerm)