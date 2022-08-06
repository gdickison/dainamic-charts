import Loader from "./Loader"
import { Bar } from "react-chartjs-2"

const MedianHomeValuePanel = ({nationalMedianHomeValue, selectedRegionsData}) => {
  const homeValueChartData = selectedRegionsData.map(region => {
    return region.median_home_value
  })

  const homeValueChartLabels = selectedRegionsData.map(region => {
    return region.name
  })

  const chartData = {
    labels: homeValueChartLabels,
    datasets: [
      {
        type: 'bar',
        label: "Regional",
        data: homeValueChartData,
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
        callbacks: {
          title: function(){
            return "Median Home Value"
          },
          beforeLabel: function(context){
            return context.datasetIndex === 0 ? context.label.split(",")[0] : 'National'
          },
          label: function(context){
            return (context.raw).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 1)',
        bodyColor: 'rgba(0, 0, 0, 1)',
        borderColor: '#2563EB',
        titleColor: 'rgba(0, 0, 0, 1)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 14,
          style: 'italic'
        },
        borderWidth: 3,
        boxPadding: 6
      },
      datalabels: {
        display: true,
        color: '#000',
        align: 'start',
        anchor: 'end',
        formatter: function(value, context){
          return (value).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})
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
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: nationalMedianHomeValue,
            yMax: nationalMedianHomeValue,
            borderColor: 'rgba(0, 0, 255, 1)',
            borderWidth: 3,
            label: {
              display: true,
              content: `National: ${nationalMedianHomeValue && nationalMedianHomeValue.toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}`,
              position: (context, opts) => {
                if(selectedRegionsData.length === 1){
                  return "start"
                }
                if(selectedRegionsData.length === 3){
                  return "33.33%"
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
        <img className="h-12" src="/house.svg" alt="" />
        <h1 className="text-[1.4vw] font-bold py-4">
          Median Home Value
        </h1>
      </div>
      <div className="flex space-x-6 justify-evenly">
        <div className="flex flex-col justify-center w-2/5">
          {nationalMedianHomeValue
            ?  <div className="w-full flex justify-between mb-4">
                <p className="text-[1.2vw] font-semibold">
                  National
                </p>
                <p className="text-[1.2vw]">
                  {(nationalMedianHomeValue).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}
                </p>
              </div>
            : <Loader loadiingText={"Getting national home value..."}/>
          }
          {selectedRegionsData ? selectedRegionsData.map((region, idx) => {
            return (
              <div key={idx} className="w-full flex justify-between">
                <p className="text-[1.2vw] font-semibold">{(region.name).split(",")[0]}</p>
                <p className="text-[1.2vw]">
                  {(region.median_home_value).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}
                </p>
              </div>
            )
          }) : <Loader loadiingText={"Getting regional home value..."}/> }
        </div>
        <div className="flex justify-center w-1/2">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default MedianHomeValuePanel