import Loader from "./Loader"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

import { Bar } from "react-chartjs-2"

const RegionalPopulationPanel = ({nationalPopulation, compRegionsData}) => {
  console.log('compRegionsData', compRegionsData)

  const populationChartData = compRegionsData.map(region => {
    return region.total_population
  })

  const populationChartLabels = compRegionsData.map(region => {
    return region.name
  })


console.log('populationChartData', populationChartData)
console.log('populationChartLabels', populationChartLabels)

  const chartData = {
    labels: populationChartLabels,
    datasets: [
      {
        label: 'Population',
        data: populationChartData,
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        hoverBackgroundColor: 'rgba(255, 0, 0, 0.7)',
        borderColor: 'rgba(255, 0, 0, 0.7)',
        borderWidth: 3,
        maxBarThickness: 100
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
        display: true
      },
      tooltip: {
        callbacks: {
          title: function(context){
            return context[0].label.split(",")[0]
          },
          label: function(context){
            return (context.raw).toLocaleString('en-US', {maximumFractionDigits: 0})
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(0, 0, 0, 1)',
        titleColor: 'rgba(0, 0, 0, 1)',
        titleFont: {
          size: 16,
          weight: 'normal'
        },
        borderColor: '#2563EB',
        bodyFont: {
          size: 16
        },
        borderWidth: 3,
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value){
            return (value).toLocaleString('en-US', {maximumFractionDigits: 0})
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
          }
        },
        grid: {
          display: false
        }
      }
    }
  }

  return (
    <div className="my-4 mx-2 border-4 border-blue-400 rounded-md p-6 w-1/3">
      <div className="flex items-center justify-between">
        <img className="h-12" src="/group.svg" alt="" />
        <h1 className="text-[1.2vw] font-bold py-4">
          Regional Population
        </h1>
      </div>
      <div>
        {nationalPopulation
          ?  <div className="w-full flex justify-between mb-4">
              <p className="text-[1.0vw] font-semibold">
                National
              </p>
              <p className="text-[1.0vw]">
                {(nationalPopulation.national_population).toLocaleString('en-US', {maximumFractionDigits: 0})}
              </p>
            </div>
          : <Loader loadiingText={"Getting national population..."}/>
        }
        {compRegionsData ? compRegionsData.map(region => {
          return (
            <div className="w-full flex justify-between">
              <p className="text-[1.0vw] font-semibold">{(region.name).split(",")[0]}</p>
              <p className="text-[1.0vw]">
                {(region.total_population).toLocaleString('en-US', {maximumFractionDigits: 0})}
              </p>
            </div>
          )
        }) : <Loader loadiingText={"Getting regional population..."}/> }
      </div>
      <div className="mt-4">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

export default RegionalPopulationPanel