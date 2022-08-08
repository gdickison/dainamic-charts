import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import { Bar } from "react-chartjs-2"
import { chartFadedColors, chartSolidColors } from "../../public/utils"

const DelinquencyByEducation = ({regionalDelinquencyRateForAllDates, delinquencyByEducation}) => {
  const delinquencyData = regionalDelinquencyRateForAllDates.map(region => ({
    ...region,
    regionalDelinquencyRate: ((Number(region.delinquent) / Number(region.total)) * 100).toFixed(2)
  }))

  const labels = []
  const dataset = []
  delinquencyByEducation.map((row, i) => {
    const dataGroup = []
    for(const [key, value] of Object.entries(row)){
      if(i === 0 && key !== 'msa'){
        labels.push(key)
      }
      if(key !== 'msa' && key !== 'name'){
        dataGroup.push(value)
      }
    }
    dataset.push(dataGroup)
  })

  const barChartStructuredData = dataset.map((row, i) => {
    const newRow = row.map(rate => {
      return parseFloat(rate * (delinquencyData[i].regionalDelinquencyRate)).toFixed(2)
    })

    const tooltipData = {
      regionDelinquencyRate: delinquencyData[i].regionalDelinquencyRate,
      regionDelinquent: delinquencyData[i].delinquent_msa,
      regionTotal: delinquencyData[i].total_msa,
      minDate: delinquencyData[i].min,
      maxDate: delinquencyData[i].max
    }

    return {
      label: delinquencyData[i].name,
      data: newRow,
      backgroundColor: chartFadedColors[i],
      borderColor: chartSolidColors[i],
      hoverBackgroundColor: chartSolidColors[i],
      borderWidth: 3,
      tooltip: tooltipData
    }
  })

  const chartData = {
    labels: labels,
    datasets: barChartStructuredData
  }

  const chartOptions = {
    responsive: true,
    aspectRatio: 2.5,
    plugins: {
      legend: {
        display: true,
        labels: {
          fontSize: 16
        }
      },
      tooltip: {
        callbacks: {
          title: function(context){
            return `${context[0].dataset.label}`
          },
          beforeLabel: function(context){
            return `Delinquency Rate for region: ${context.dataset.tooltip.regionDelinquencyRate}%`
          },
          label: function(context){
            return `Delinquency Rate for ${context.label}: ${context.raw}%`
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Delinquency Rate",
          padding: 20,
          font: {
            size: 20
          }
        },
        ticks: {
          callback: function(value, index, title){
            return `${value}%`
          },
          font: {
            size: 20
          }
        }
      },
      x: {
        title: {
          display: true,
          text: "Education Level",
          padding: 20,
          font: {
            size: 20
          }
        },
        ticks: {
          font: {
            size: 20
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
        {chartData &&
          <>
            <ChartHeaderWithTooltip
              chartName={"Delinquency Rate by Education Level"}
              msa={delinquencyData.length === 1 ? delinquencyData[0].name : "selected regions"}
              tooltip={"Dainamics' model determines what portion of a regions overall delinquency rate for the chosen period is attributable to education level segments. Delinquency is aggragated for all available dates rather than selected start and end dates."}
            />
            <Bar data={chartData} options={chartOptions} />
          </>
        }
    </div>
  )
}

export default DelinquencyByEducation