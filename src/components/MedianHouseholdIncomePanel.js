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

const MedianHouseholdIncomePanel = ({nationalMedianHouseholdIncome, compRegionsData}) => {
  const homeIncomeChartData = compRegionsData.map(region => {
    return region.median_home_income
  })

  const homeIncomeChartLabels = compRegionsData.map(region => {
    return region.name
  })

  const lineData = compRegionsData.map(region => {
    return nationalMedianHouseholdIncome
  })

  const linePointRadius = compRegionsData.length > 2 ? 10 : 30

  const chartData = {
    labels: homeIncomeChartLabels,
    datasets: [
      {
        type: 'bar',
        label: "Regional Median Incoome",
        data: homeIncomeChartData,
        backgroundColor: 'rgba(255, 0, 0, 0.3)',
        hoverBackgroundColor: 'rgba(255, 0, 0, 0.7)',
        borderColor: 'rgba(255, 0, 0, 0.7)',
        borderWidth: 3,
        maxBarThickness: 100,
        order: 2
      },
      {
        type: 'line',
        label: 'National Median Income',
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
          title: function(){
            return "Median Household Income"
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
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function(value){
            return (value).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})
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
        <img className="h-12" src="/dollars.svg" alt="" />
        <h1 className="text-[1.2vw] font-bold py-4">
          Median Household Income
        </h1>
      </div>
      <div>
        {nationalMedianHouseholdIncome
          ?  <div className="w-full flex justify-between mb-4">
              <p className="text-[1.0vw] font-semibold">
                National
              </p>
              <p className="text-[1.0vw]">
                {(nationalMedianHouseholdIncome).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}
              </p>
            </div>
          : <Loader loadiingText={"Getting national population..."}/>
        }
        {compRegionsData ? compRegionsData.map(region => {
          return (
            <div className="w-full flex justify-between">
              <p className="text-[1.0vw] font-semibold">{(region.name).split(",")[0]}</p>
              <p className="text-[1.0vw]">
                {(region.median_home_income).toLocaleString('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 0})}
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

export default MedianHouseholdIncomePanel