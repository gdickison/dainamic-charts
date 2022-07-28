import Loader from "./Loader"
import { Doughnut } from "react-chartjs-2"
import { chartFadedColors, chartSolidColors } from "../../public/utils"

const PopulationByAgePanel = ({populationByAgeData, compRegionsData}) => {
  const regionalData = []
  compRegionsData.forEach((region) => {
    populationByAgeData.forEach(pop => {
      if(region.msa === pop.msa){
        regionalData.push({...region, ...pop})
      }
    })
  })

  const populationByAgeLabels = []
  for(const [key, value] of Object.entries(populationByAgeData[0])){
    if(key !== 'msa' && key !== 'name'){
      populationByAgeLabels.push(key)
    }
  }

  const structuredData = populationByAgeData.map((region, idx) => {
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
          hoverBackgroundColor: hbgColors
        }
      ]
    }
  })

  const chartOptions = {
    responsive: true,
    aspectRatio: 1,
    maintainAspectRation: true,
    plugins: {
      datalabels: {
        display: true,
        color: '#000',
        align: 'center',
        formatter: function(value, context){
          return [
            context.chart.data.labels[context.dataIndex],
            `${value}%`
          ]
        },
        labels: {
          title: {
            font: {
              weight: 'bold',
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
    <div className="border-[1px] border-gray-200 rounded-md shadow-md p-6 mx-10 my-2">
      <div className="flex items-center space-x-4">
        <img className="h-12" src="/population.svg" alt="" />
        <h1 className="text-[1.4vw] font-bold py-4">
          Population By Age
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
                    <Doughnut data={chart} options={chartOptions}/>
                  </div>
                )
              })}
            </div>
          : <Loader loadiingText={"Getting population by age data..."}/>
        }
      </div>
    </div>
  )
}

export default PopulationByAgePanel