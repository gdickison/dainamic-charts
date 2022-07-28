import Loader from "./Loader"
import { Bar } from "react-chartjs-2"

const RegionalDelinquencyRatePanel = ({compRegionsData, regionalDelinquencyRates, nationalDelinquencyRate}) => {
  const regionalData = []
  compRegionsData.forEach((region) => {
    regionalDelinquencyRates.forEach(rate => {
      if(region.msa === rate.msa){
        regionalData.push({...region, ...rate})
      }
    })
  })

  const barData = regionalData.map(region => {
    return region.delinquencyRate
  })

  const lineData = regionalData.map(region => {
    return nationalDelinquencyRate
  })

  const dataLabels = regionalData.map(region => {
    return region.name
  })

  const linePointRadius = compRegionsData.length > 1 ? 10 : 30

  const delinquencyChartData = {
    labels: dataLabels,
    datasets: [
      {
        type: 'bar',
        label: 'Regional',
        data: barData,
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        hoverBackgroundColor: 'rgba(255, 0, 0, 0.7)',
        borderColor: 'rgba(255, 0, 0, 0.7)',
        borderWidth: 3,
        maxBarThickness: 100,
        order: 2
      },
      {
        type: 'line',
        label: 'National',
        data: lineData,
        showLine: true,
        borderColor: 'rgba(0, 0, 255, 1)',
        backgroundColor: 'rgba(0, 0, 255, 0.3)',
        pointBackgroundColor: 'rgba(0, 0, 255, 0.3)',
        pointRadius: linePointRadius,
        pointStyle: 'line',
        borderWidth: 3,
        hoverBorderWidth: 3,
        order: 1
      }
    ]
  }

  const delinquencyChartOptions = {
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
          title: function(){
            return "Delinquency Rate"
          },
          beforeLabel: function(context){
            return context.datasetIndex === 0 ? context.label.split(",")[0] : 'National'
          },
          label: function(context){
            return `${context.raw}%`
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
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value){
            if(value !== 0){
              return `${value}%`
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
        <img className="h-12" src="/history.svg" alt="" />
        <h1 className="text-[1.4vw] font-bold py-4">
          Delinquency Rates
        </h1>
      </div>
      <div className="flex space-x-6 justify-evenly">
        <div className="flex flex-col justify-center w-2/5">
          {nationalDelinquencyRate
            ?  <div className="w-full flex justify-between mb-4">
                <p className="text-[1.2vw] font-semibold">
                  National
                </p>
                <p className="text-[1.2vw]">
                  {`${nationalDelinquencyRate}%`}
                </p>
              </div>
            : <Loader loadiingText={"Getting national delinquency data..."}/>
          }
          {regionalData ? regionalData.map((region, idx) => {
            return (
              <div key={idx} className="w-full flex justify-between">
                <p className="text-[1.2vw] font-semibold">{(region.name).split(",")[0]}</p>
                <p className="text-[1.2vw]">
                  {`${region.delinquencyRate}%`}
                </p>
              </div>
            )
          }) : <Loader loadiingText={"Getting regional delinquency data..."}/> }
        </div>
        <div className="flex justify-center w-1/2">
          <Bar data={delinquencyChartData} options={delinquencyChartOptions} />
        </div>
      </div>
    </div>
  )
}

export default RegionalDelinquencyRatePanel