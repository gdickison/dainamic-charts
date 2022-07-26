import Loader from "./Loader"

import { Bar, Doughnut, Pie } from "react-chartjs-2"
import { chartFadedColors, chartSolidColors } from "../../public/utils"

const PopulationByIncomePanel = ({populationByIncomeData, compRegionsData}) => {
  const regionalData = []
  compRegionsData.forEach((region) => {
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
      labels: labels.reverse(),
      datasets: [
        {
          label: `${region.name}`,
          data: data.reverse(),
          backgroundColor: bgColors,
          borderColor: bdColors,
          hoverBackgroundColor: hbgColors,
          categoryPercentage: 1.0,
          barPercentage: 1.0
        }
      ]
    }
  })
console.log('structuredData', structuredData)

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    aspectRatio: 1,
    maintainAspectRation: true,
    plugins: {
      datalabels: {
        display: true,
        color: '#000',
        align: 'end',
        formatter: function(value, context){
          return [
            context.chart.data.labels[context.dataIndex],
            // `${value}%`
          ]
        },
        labels: {
          title: {
            font: {
              // weight: 'bold',
              size: 12,
            }
          }
        }
      },
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
          beforeTitle: function(context){
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
    }
  }

  return (
    <div className="border-[1px] border-gray-400 p-6 w-1/3">
      <div className="flex items-center justify-between">
        <img className="h-12" src="/income.svg" alt="" />
        <h1 className="text-[1.2vw] font-bold py-4">
          Population By Income
        </h1>
      </div>
      <div>
        {/* {nationalMedianHomeValue
          ?  <div className="w-full flex justify-between mb-4">
              <p className="text-[1.0vw] font-semibold">
                National
              </p>
              <p className="text-[1.0vw]">
                {(nationalMedianHomeValue).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}
              </p>
            </div>
          : <Loader loadiingText={"Getting national home value..."}/>
        } */}
        {/* {compRegionsData ? compRegionsData.map(region => {
          return (
            <div className="w-full flex justify-between">
              <p className="text-[1.0vw] font-semibold">{(region.name).split(",")[0]}</p>
              <p className="text-[1.0vw]">
                {(region.median_home_value).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}
              </p>
            </div>
          )
        }) : <Loader loadiingText={"Getting regional home value..."}/> } */}
      </div>
      <div className="flex" >

      {structuredData
        ?
          <div className="flex w-full flex-wrap justify-center items-center">
          {console.log('structuredData', structuredData)}
            {structuredData.map((chart, i) => {
              return (
                <div className={`${structuredData.length === 1 ? 'w-3/5' : 'w-5/12'}`}>
                  <Pie data={chart} options={chartOptions}/>
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