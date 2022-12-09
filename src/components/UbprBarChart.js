import { memo } from "react";
import { Bar } from "react-chartjs-2";
import { rconCodesNames } from "../../public/utils";

const UbprBarChart = ({bankData, statsData, selectedMetric}) => {
  const rawChartData = statsData

  const labels = rawChartData.map(bank => {
    return bank.QUARTER
  })

  const dataArray = rawChartData.map(bank => {
    return bank[selectedMetric]
  })

  function nullData(arr){
    return arr.every(element => element === null)
  }

  function zeroData(arr){
    return arr.every(element => element === "0")
  }

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'chart',
      data: dataArray,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)'
      ],
      borderWidth: 1
    }]
  }

  const chartTitle = rconCodesNames.filter(rcon => rcon.code === selectedMetric)[0].text

  const barChartOptions = {
    responsive: true,
    aspectRatio: 2.5,
    interaction: {
      intersect: false
    },
    plugins: {
      title: {
        display: true,
        text: `${chartTitle} - ${selectedMetric}`,
        font: {
          size: 16,
          weight: 'normal'
        },
        padding: 16
      },
      legend: {
        display: false
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          title: function(context){
            return ''
          },
          label: function(context){
            return `${Number(context.raw).toLocaleString()}`
          }
        },
        boxPadding: 6,
        displayColors: false
      }
    },
    scales: {
      y: {
        stacked: true,
        title: {
          display: false
        },
        ticks: {
          callback: function(value){
            return `${value.toLocaleString()}`
          },
          font: {
            size: 12
          }
        },
        grid: {
          display: true
        }
      },
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Quarter",
          font: {
            size: 14
          }
        },
        ticks: {
          callback: function(value){
            return `${this.getLabelForValue(value)}`
          },
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        }
      }
    }
  }

  return (
    <div>
      {nullData(dataArray)
        ? <div className="flex flex-col gap-2 px-4 py-8 m-2 shadow-lg bg-gray-50">
            <h1 className="text-center">{barChartOptions.plugins.title.text}</h1>
            <h2 className="text-center">No data available</h2>
          </div>
        : zeroData(dataArray)
          ? <div className="flex flex-col gap-2 px-4 py-8 m-2 shadow-lg bg-gray-50">
              <h1 className="text-center">{barChartOptions.plugins.title.text}</h1>
              <h2 className="text-center">This institution does not have loans in this category</h2>
            </div>
          : <div className="flex justify-center p-4 m-2 shadow-lg bg-gray-50">
              <Bar data={chartData} options={barChartOptions}/>
            </div>
      }
    </div>
  )
}

export default memo(UbprBarChart)
