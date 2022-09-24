import { memo } from "react"
import { Bar } from "react-chartjs-2"
import { getPercentage, getDateLabelsForChart, groupDataByRegion, cexFadedColors, cexSolidColors } from "../../public/utils"
import ChartDescription from "./ChartDescription"

const CexSex = ({dateRange, data}) => {

  const labels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)
  const regionalData = Object.values(groupDataByRegion(data, "region_name"))

  const avgAgeData = regionalData.map((region, idx) => {
    const label = region[idx].region_name

    const maleRespondents = region.map(row => {
      return getPercentage(row.total_sample_male, row.total_sample) * -1
    })

    const femaleRespondents = region.map(row => {
      return getPercentage(row.total_sample_female, row.total_sample)
    })

    return {label, maleRespondents, femaleRespondents}
  })

  const rawChartData = avgAgeData.map((region, idx) => {
    return [{
      label: 'Male',
      data: region.maleRespondents,
      backgroundColor: cexFadedColors[idx],
      hoverBorderColor: cexSolidColors[idx],
      hoverBorderWidth: 3,
      title: region.label
    },
    {
      label: 'Female',
      data: region.femaleRespondents,
      backgroundColor: cexSolidColors[idx],
      hoverBorderColor: cexFadedColors[idx],
      hoverBorderWidth: 3
    }]
  })

  const barChartOptions = {
    responsive: true,
    aspectRatio: 2.5,
    indexAxis: 'y',
    interaction: {
      mode: 'index'
    },
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: true,
        labels: {
          usePointStyle: false
        },
        align: 'start'
      },
      tooltip: {
        yAlign: 'bottom',
        titleAlign: 'center',
        usePointStyle: false,
        callbacks: {
          label: function(context){
            return `${context.dataset.label}: ${Math.abs(context.raw)}%`
          }
        },
        boxPadding: 6
      }
    },
    scales: {
      y: {
        stacked: true,
        title: {
          display: false,
          text: "Sex",
          padding: 20,
          font: {
            size: 16
          }
        },
        ticks: {
          callback: function(value){
            return `${this.getLabelForValue(value)}`
          },
          font: {
            size: 12
          },
          stepSize: 1,
          beginAtZero: true
        },
        grid: {
          display: false
        }
      },
      x: {
        stacked: true,
        title: {
          display: false,
          text: "Survey Month",
          padding: 20,
          font: {
            size: 16
          }
        },
        ticks: {
          callback: function(value){
            return Math.abs(value)
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
    <div className="mx-6 space-y-12">
      <div className="relative my-4">
        <h1 className="inline text-2xl">Sex of Respondents</h1>
      </div>
      <ChartDescription
        description={'This chart shows the sex of the "reference person" - the person who is listed as taking primary responsibility for completing the survey.'}
      />
      <div className="grid grid-cols-2 gap-x-2 gap-y-6">
        {rawChartData && rawChartData.map((row, idx) => {
          const barChartData = {
            labels: labels,
            datasets: row
          }
          return (
            <div key={idx}>
              <div className="flex justify-center">
                <h1 className="font-semibold">{row[0].title}</h1>
              </div>
              <div className="flex justify-center p-4 shadow-lg bg-gray-50">
                <Bar data={barChartData} options={barChartOptions}/>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(CexSex)