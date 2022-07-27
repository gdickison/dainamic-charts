import Loader from "./Loader"
import { Bar } from "react-chartjs-2"

const RegionalPopulationPanel = ({nationalPopulation, compRegionsData}) => {
  const populationChartData = compRegionsData.map(region => {
    return region.total_population
  })

  const populationChartLabels = compRegionsData.map(region => {
    return region.name
  })

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
        display: false
      },
      tooltip: {
        callbacks: {
          title: function(){
            return "Population"
          },
          beforeLabel: function(context){
            return context.label.split(",")[0]
          },
          label: function(context){
            return (context.raw).toLocaleString('en-US', {maximumFractionDigits: 0})
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(0, 0, 0, 1)',
        titleColor: 'rgba(0, 0, 0, 1)',
        titleFont: {
          size: 14
        },
        borderColor: '#2563EB',
        bodyFont: {
          size: 14,
          style: 'italic'
        },
        borderWidth: 3,
        boxPadding: 6
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value){
            if(value !== 0){
              return (value).toLocaleString('en-US', {maximumFractionDigits: 0})
            }
          },
          font: {
            size: 14
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
    <div className="border-[1px] border-gray-200 rounded-md shadow-md p-6 mx-10 my-2">
      <div className="flex items-center space-x-4">
        <img className="h-12" src="/group.svg" alt="" />
        <h1 className="text-[1.2vw] font-bold py-4">
          Regional Population
        </h1>
      </div>
      <div className="flex space-x-6 justify-evenly">
        <div className="flex flex-col justify-center w-2/5">
          {nationalPopulation
            ?  <div className="w-full flex justify-between mb-4">
                <p className="text-[1.2vw] font-semibold">
                  National
                </p>
                <p className="text-[1.2vw]">
                  {(nationalPopulation.national_population).toLocaleString('en-US', {maximumFractionDigits: 0})}
                </p>
              </div>
            : <Loader loadiingText={"Getting national population..."}/>
          }
          {compRegionsData ? compRegionsData.map((region, idx) => {
            return (
              <div key={idx} className="w-full flex justify-between">
                <p className="text-[1.2vw] font-semibold">{(region.name).split(",")[0]}</p>
                <p className="text-[1.2vw]">
                  {(region.total_population).toLocaleString('en-US', {maximumFractionDigits: 0})}
                </p>
              </div>
            )
          }) : <Loader loadiingText={"Getting regional population..."}/> }
        </div>
        <div className="flex justify-center w-1/2">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default RegionalPopulationPanel