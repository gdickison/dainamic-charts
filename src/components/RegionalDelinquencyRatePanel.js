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
import { chartFadedColors, chartSolidColors } from "../../public/utils"

const RegionalDelinquencyRatePanel = ({targetRegionData, compRegionsData, regionalDelinquencyRates, nationalDelinquencyRate}) => {
// console.log('regionalDelinquencyRates from panel', regionalDelinquencyRates)
// console.log('compRegionsData from panel', compRegionsData)
// console.log('test', Object.is(compRegionsData[0].msa, regionalDelinquencyRates[0].msa) ? 'true' : 'false')
const regionalData = []
compRegionsData.forEach((region, idx) => {
  // console.log('region', region)
  regionalDelinquencyRates.forEach(rate => {
    // console.log('rate', rate)
    if(region.msa === rate.msa){
      regionalData.push({...region, ...rate})
    }
  })
})
// console.log('regionalData', regionalData)

  const barData = regionalData.map(region => {
    return region.delinquencyRate
  })

  const barColors = regionalData.map((region, idx) => {
    return chartFadedColors[idx]
  })

  const barHoverColors = regionalData.map((region, idx) => {
    return chartSolidColors[idx]
  })

  const lineData = regionalData.map(region => {
    return nationalDelinquencyRate
  })

  const dataLabels = regionalData.map(region => {
    return region.name
  })

  const delinquencyChartData = {
    labels: dataLabels,
    datasets: [
      {
        type: 'bar',
        label: 'Regional Delinquency',
        data: barData,
        backgroundColor: barColors,
        hoverBackgroundColor: barHoverColors,
        borderColor: barHoverColors,
        borderWidth: 3,
        order: 2
      },
      {
        type: 'line',
        label: 'National Delinquency',
        data: lineData,
        backgroundColor: 'black',
        borderColor: 'black',
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
        display: false
      },
      tooltip: {
        callbacks: {
          title: function(){
            return ''
          },
          beforeLabel: function(context){
            return context.datasetIndex === 0 ? context.label.split(",")[0] : 'National'
          },
          label: function(context){
            return `${context.raw}%`
          }
        },
        backgroundColor: 'rgba(245, 245, 245, 1)',
        bodyColor: 'rgba(0, 0, 0, 1)',
        borderColor: 'rgba(0, 0, 0, 1)',
        bodyFont: {
          size: 16
        },
        borderWidth: 2,
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value){
            return `${value}%`
          }
        },
        grid: {
          display: false
        }
      },
      x: {
        ticks: {
          display: false
        }
      }
    }
  }


  return (
    <div className="m-4 border-4 border-blue-400 rounded-md p-6 w-1/4">
      <h1 className="text-[1.2vw] font-bold py-4 text-center">
        Delinquency Rates
      </h1>
      <div>
        {/* <p className="text-[1.1vw] py-2">
          {`The delinquency rate for the selected time period in ${targetRegionData.name} is `}
        </p> */}
        {nationalDelinquencyRate
          ?  <div className="w-full flex justify-between mb-4">
              <p className="text-[1.0vw] font-semibold">
                National
              </p>
              <p className="text-[1.0vw]">
                {`${nationalDelinquencyRate}%`}
              </p>
              {/* <p className="text-[1.1vw] py-2">
                for the same period.
              </p> */}
            </div>
          : <Loader loadiingText={"Getting national data..."}/>
        }
        {regionalData && regionalData.map((region, idx) => {
          return (
            <div className="w-full flex justify-between">
              {/* <p className={`text-[1.0vw] font-semibold bg-[${chartFadedColors[idx]}]`}>{(region.name).split(",")[0]}</p> */}
              <p className="text-[1.0vw] font-semibold">{(region.name).split(",")[0]}</p>
              <p className="text-[1.0vw]">
                {`${region.delinquencyRate}%`}
              </p>
            </div>
          )
        })}
        {regionalData.length > 1 &&
            <div className="mt-4">
              <Bar data={delinquencyChartData} options={delinquencyChartOptions} />
            </div>
        }
        {/* <p className="text-[3vw]">
          {`${regionalDelinquencyRates[0].delinquencyRate}%`}
        </p> */}
        {/* {nationalDelinquencyRate
          ?  <>
              <p className="text-[1.5vw] py-2">
                National
              </p>
              <p className="text-[3vw]">
                {`${nationalDelinquencyRate}%`}
              </p>
              <p className="text-[1.1vw] py-2">
                for the same period.
              </p>
            </>
          : <Loader loadiingText={"Getting national data..."}/>
        } */}
      </div>
    </div>
  )
}

export default RegionalDelinquencyRatePanel