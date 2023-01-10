import { memo } from "react";
import { Bar } from "react-chartjs-2";

const UbprBarChart = ({bankData, dataFlag, statsData, selectedMetric}) => {
  const rawChartData = statsData
  const labels = rawChartData.map(bank => {
    return bank.QUARTER
  })

  const dataArray = rawChartData.map(bank => {
    return dataFlag === "rcon" ? bank[selectedMetric.value] : bank[selectedMetric.value]/10
  })

  function nullData(arr){
    return arr.every(element => element === null)
  }

  function zeroData(arr){
    return arr.every(element => element === "0" || element === 0)
  }

  const backgroundColor = dataFlag === "rcon" ? 'rgba(255, 99, 132, 0.3)' : 'rgba(54, 162, 235, 0.3)'
  const borderColor = dataFlag === "rcon" ? 'rgb(255, 99, 132)' : 'rgb(54, 162, 235)'

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'chart',
      data: dataArray,
      backgroundColor: [
        `${backgroundColor}`
      ],
      borderColor: [
        `${borderColor}`
      ],
      borderWidth: 1
    }]
  }

  const titleCode = selectedMetric.label.split(' - ')[0]
  const titleText = selectedMetric.label.split(' - ')[1].match(/.{50}\w*\W*|.*/g)

  const barChartOptions = {
    responsive: true,
    aspectRatio: 1.5,
    interaction: {
      intersect: false
    },
    plugins: {
      title: {
        display: true,
        text: [titleCode,"", ...titleText],
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
            return `${Number(context.raw).toLocaleString()}${dataFlag === "rcon" ? '' : '%'}`
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
            return `${value.toLocaleString()}${dataFlag === "rcon" ? '' : '%'}`
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
        ? <div className="ubpr-no-data">
            <h1 className="text-center">{barChartOptions.plugins.title.text}</h1>
            <h2 className="text-center">No data available</h2>
          </div>
        : zeroData(dataArray)
          ? <div className="ubpr-no-data">
              <h1 className="text-center">{barChartOptions.plugins.title.text}</h1>
              <h2 className="text-center">This institution does not have loans in this category</h2>
            </div>
          : <div className="ubpr-bar-chart">
              <Bar data={chartData} options={barChartOptions}/>
            </div>
      }
    </div>
  )
}

export default memo(UbprBarChart)
