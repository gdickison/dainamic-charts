import Loader from "./Loader"
import { Bar } from "react-chartjs-2"
import { chartFadedColors, chartSolidColors } from "../../public/utils"

const PopulationByIncomePanel = ({populationByIncomeData, selectedRegionsData}) => {
  const regionalData = []
  selectedRegionsData.forEach((region) => {
    populationByIncomeData.forEach(pop => {
      if(region.msa === pop.msa){
        regionalData.push({...region, ...pop})
      }
    })
  })

  const populationByIncomeLabels = []
  for(const [key, value] of Object.entries(populationByIncomeData[0])){
    if(key !== 'msa' && key !== 'name'){
      populationByIncomeLabels.push(key)
    }
  }

  const structuredData = populationByIncomeData.map((region, idx) => {
    const labels = []
    const data = []
    const bgColors = []
    const hbgColors = []
    const bdColors = []

    for(const [key, value] of Object.entries(region)){
      if(key !== 'msa' && key !== 'name'){
        labels.push(key)
        data.push(parseFloat(value * 100).toFixed(2))
      }
    }

    labels.forEach((label,i) => {
      bgColors.push(chartFadedColors[i])
      hbgColors.push(chartSolidColors[i])
      bdColors.push(chartSolidColors[i])
    })

    return {
      labels: labels,
      datasets: [
        {
          label: `${region.name}`,
          data: data,
          backgroundColor: bgColors,
          borderColor: bdColors,
          borderWidth: 3,
          hoverBackgroundColor: hbgColors,
          categoryPercentage: 1.0,
          barPercentage: 1.0
        }
      ]
    }
  })

  const chartOptions = {
    responsive: true,
    aspectRatio: 1,
    maintainAspectRation: true,
    plugins: {
      title: {
        text: function(chart){
          return [
            `${chart.chart.getDatasetMeta(0).label}`
          ]
        },
        position: 'bottom',
        display: true
      },
      label: {
        display: true
      },
      legend: {
        display: false
      },
      tooltip: {
        position: "nearest",
        bodyFont: {
          style: 'italic'
        },
        callbacks: {
          title: function(context){
            return `${context[0].dataset.label}`
          },
          beforeLabel: function(context){
            return context.label
          },
          label: function(context){
            return `${context.raw}%`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          callback: function(value){
            if(value !== 0){
              return `${value}%`
            }
          },
          font: {
            size: 14
          }
        }
      }
    }
  }

  return (
    <div className="border-[1px] border-gray-200 rounded-md shadow-md p-6 mx-10 my-2">
      <div className="flex items-center space-x-4">
        <img className="h-12" src="/income.svg" alt="" />
        <h1 className="text-[1.4vw] font-bold py-4">
          Population By Income
        </h1>
      </div>
      <div>
      </div>
      <div className="flex" >
        {structuredData
          ?
            <div className="flex w-full flex-wrap justify-evenly items-center">
              {structuredData.map((chart, i) => {
                return (
                  <div key={i} className={`${structuredData.length < 3 ? 'w-2/5' : 'w-1/5'}`}>
                    <Bar data={chart} options={chartOptions}/>
                  </div>
                )
              })}
            </div>
          : <Loader loadiingText={"Getting population by income data..."}/>
        }
      </div>
    </div>
  )
}

export default PopulationByIncomePanel