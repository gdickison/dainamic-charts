import Loader from "./Loader"
import { Bar } from "react-chartjs-2"

const MedianHouseholdIncomePanel = ({nationalMedianHouseholdIncome, selectedRegionsData}) => {
  const homeIncomeChartData = selectedRegionsData.map(region => {
    return region.median_home_income
  })

  const homeIncomeChartLabels = selectedRegionsData.map(region => {
    return region.name
  })

  const chartData = {
    labels: homeIncomeChartLabels,
    datasets: [
      {
        type: 'bar',
        label: "Regional",
        data: homeIncomeChartData,
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        hoverBackgroundColor: 'rgba(255, 0, 0, 0.7)',
        borderColor: 'rgba(255, 0, 0, 0.7)',
        borderWidth: 3,
        maxBarThickness: 100,
        order: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    aspectRatio: 2,
    interaction: {
      mode: 'index'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      },
      datalabels: {
        display: true,
        color: '#000',
        align: 'start',
        anchor: 'end',
        formatter: function(value){
          return (value).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})
        },
        labels: {
          title: {
            font: {
              weight: 'bold',
              size: 16,
            }
          }
        }
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: nationalMedianHouseholdIncome,
            yMax: nationalMedianHouseholdIncome,
            borderColor: 'rgba(0, 0, 255, 1)',
            borderWidth: 3,
            display: nationalMedianHouseholdIncome ? true : false,
            label: {
              display: nationalMedianHouseholdIncome ? true : false,
              content: `National: ${nationalMedianHouseholdIncome && nationalMedianHouseholdIncome.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}`,
              position: () => {
                if(selectedRegionsData.length === 1){
                  return "20%"
                }
                if(selectedRegionsData.length === 3){
                  return "33.33%"
                }
              },
              font: {
                size: () => {
                  if(selectedRegionsData.length < 3){
                    return 14
                  } else {
                    return 12
                  }
                }
              },
              backgroundColor: 'rgba(0, 0, 255, 0.8)'
            }
          }
        }
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value){
            if(value !== 0){
              return (value).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})
            }
          },
          font: function(context) {
            const width = context.chart.width
            const size = Math.round(width / 40)
            return {
              size: size
            }
          }
        },
        grid: {
          display: false
        }
      },
      x: {
        ticks: {
          callback: function(value){
            const labelArray = this.getLabelForValue(value).split(", ")
            let label = labelArray[0].includes("--") ? labelArray[0].split("--") : labelArray[0].split("-")
            label.push(labelArray[1])
            return label
          },
          font: function(context) {
            const width = context.chart.width
            const size = Math.round(width / 42)
            return {
              size: size
            }
          }
        },
        grid: {
          display: false
        }
      }
    }
  }

  const fontSize = selectedRegionsData.length === 1 ? '1.5vw' : '1.4vw'

  return (
    <div className="border-[1px] border-gray-200 rounded-md shadow-md p-6 mx-10 my-2">
      <div className="flex items-center space-x-4">
        <img className="h-12" src="/dollars.svg" alt="" />
        <h1 className="text-[1.6vw] 3xl:text-3xl font-bold py-4">
          Median Household Income
        </h1>
      </div>
      <div className="flex space-x-6 justify-evenly">
        <div className="flex flex-col justify-center w-2/5">
          {nationalMedianHouseholdIncome
            ?  <div className="w-full flex justify-between mb-8">
                <p className={`text-[${fontSize}] 3xl:text-2xl`}>
                  National
                </p>
                <p className={`text-[${fontSize}] 3xl:text-2xl`}>
                  {(nationalMedianHouseholdIncome).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}
                </p>
              </div>
            : <Loader loadiingText={"Getting national population..."}/>
          }
          {selectedRegionsData ? selectedRegionsData.map((region, idx) => {
            return (
              <div key={idx} className="w-full flex justify-between">
                <p className={`text-[${fontSize}] 3xl:text-2xl`}>{(region.name).split(",")[0]}</p>
                <p className={`text-[${fontSize}] 3xl:text-2xl`}>
                  {(region.median_home_income).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}
                </p>
              </div>
            )
          }) : <Loader loadiingText={"Getting regional population..."}/> }
        </div>
        <div className="flex justify-center w-1/2 p-4 shadow-lg bg-gray-50">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default MedianHouseholdIncomePanel