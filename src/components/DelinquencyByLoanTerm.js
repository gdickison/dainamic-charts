import Loader from "./Loader"
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import { getLinearRegression, groupDataByMsa, chartSolidColors } from "../../public/utils"
import { useState, useEffect } from "react"
import { Scatter } from "react-chartjs-2"

const DelinquencyByLoanTerm = ({dateRange, selectedRegions}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()

  useEffect(() => {
    setLoading(true)

    const msaCodes = selectedRegions.map(region => {
      return region.msa
    })
    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })
    const endpoint = `/api/get_delinquency_by_loan_term`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    fetch(endpoint, options)
      .then(res => res.json())
      .then(data => data.response)
      .then(data => {

        const groupedData = groupDataByMsa(data, "msa")

        Object.values(groupedData).forEach(row => {
          row.forEach(item => {
            item.delinquencyRate =  parseFloat((Number(item.delinquent) / Number(item.total)) * 100).toFixed(2)
          })
        })

        const pointStyles = [
          'circle',
          'rect',
          'triangle'
        ]

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
            borderColor: chartSolidColors[idx],
            borderWidth: 0,
            hoverBorderWidth: 3,
            hoverBorderColor: chartSolidColors[idx],
            backgroundColor: chartSolidColors[idx],
            hoverBackgroundColor: chartSolidColors[idx],
            pointRadius: 8,
            pointHoverBorderWidth: 3,
            pointHitRadius: 5,
            pointHoverRadius: 8,
            msa: region[0].msa,
            pointStyle: pointStyles[idx]
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
            borderColor: '#94A3B8',
            backgroundColor: '#94A3B8',
            borderWidth: 3,
            pointRadius: 0,
            pointHitRadius: 0,
            showLine: true,
            hidden: true
          }
        })

        setChartData({
          datasets: lineData.concat(regressionData)
        })

        setChartOptions({
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
                filter: function(item, chart) {
                  return !item.text.includes('Regression');
                },
                font: {
                  size: 16
                },
                usePointStyle: true
              },
              onHover: function(event, legendItem, legend){
                const loanTermChart = legend.chart
                loanTermChart.show(legendItem.datasetIndex + lineData.length)
                loanTermChart.update()
                loanTermChart.setActiveElements([{datasetIndex: legendItem.datasetIndex, index: 0}])
              },
              onLeave: function(event, legendItem, legend){
                const loanTermChart = legend.chart
                loanTermChart.hide(legendItem.datasetIndex + lineData.length)
                loanTermChart.update()
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
        })
        setLoading(false)
      })
  }, [dateRange, selectedRegions])

  if(isLoading) {
    return (
      <Loader loadiingText={"Getting loan term data..."}/>
    )
  }

  return (
    <div>
      <ChartHeaderWithTooltip
        chartName={"Delinquency by Loan Term"}
        msa={selectedRegions.length === 1 ? selectedRegions[0].name : "selected regions"}
        tooltip={"Delinquent loans at the given term are divided by the total loans at that term to show the delinquency rate. Delinquency rates of 0% are not shown. Delinquency rates of 100% generally indicate an anomally based on a very small number of loans at the given rate and are also excluded. Hover over the data points to see details"}
      />
      {chartData &&
        <Scatter id={"loanTermChart"} data={chartData} options={chartOptions}/>
      }
    </div>
  )
}

export default DelinquencyByLoanTerm