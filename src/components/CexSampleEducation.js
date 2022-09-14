import { memo } from "react"
import { Bar } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByRegion, chartFadedColors, chartSolidColors } from "../../public/utils"
import ChartDescription from "./ChartDescription"

const CexSampleEducation = ({dateRange, data}) => {
  const labels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)
  const regionalData = Object.values(groupDataByRegion(data, "region_name"))

  const educationData = regionalData.map((region, idx) => {
    const label = region[idx].region_name

    const lessThanHSDiploma = region.map(row => {
      return row.sample_none + row.sample_less_than_hs + row.sample_some_hs
    })

    const percentLessThanHSDiploma = region.map(row => {
      return parseFloat(((Number(row.sample_none) + Number(row.sample_less_than_hs) + Number(row.sample_some_hs)) / Number(row.total_sample)) * 100).toFixed(1)
    })

    const hsDiploma = region.map(row => {
      return row.sample_hs_diploma
    })

    const percentHsDiploma = region.map(row => {
      return parseFloat(row.percent_sample_hs_diploma).toFixed(1)
    })

    const someCollege = region.map(row => {
      return row.sample_some_college
    })

    const percentSomeCollege = region.map(row => {
      return parseFloat(row.percent_sample_some_college).toFixed(1)
    })

    const assocDegree = region.map(row => {
      return row.sample_associate
    })

    const percentAssocDegree = region.map(row => {
      return parseFloat(row.percent_sample_associate).toFixed(1)
    })
    const bachDegree = region.map(row => {
      return row.sample_bachelors
    })

    const percentBachDegree = region.map(row => {
      return parseFloat(row.percent_sample_bachelors).toFixed(1)
    })
    const postGradDegree = region.map(row => {
      return row.sample_post_grad_degree
    })

    const percentPostGradDegree = region.map(row => {
      return parseFloat(row.percent_sample_post_grad_degree).toFixed(1)
    })

    return {
      label,
      lessThanHSDiploma,
      percentLessThanHSDiploma,
      hsDiploma,
      percentHsDiploma,
      someCollege,
      percentSomeCollege,
      assocDegree,
      percentAssocDegree,
      bachDegree,
      percentBachDegree,
      postGradDegree,
      percentPostGradDegree
    }
  })

  const rawChartData = educationData.map((region) => {
    return [
      {
      label: '< High School Diploma',
      data: region.percentLessThanHSDiploma,
      tooltip: region.lessThanHSDiploma,
      backgroundColor: chartFadedColors[0],
      hoverBackgroundColor: chartSolidColors[0],
      title: region.label
    },
    {
      label: 'High School Diploma',
      data: region.percentHsDiploma,
      tooltip: region.hsDiploma,
      backgroundColor: chartFadedColors[1],
      hoverBackgroundColor: chartSolidColors[1],
    },
    {
      label: 'Some College',
      data: region.percentSomeCollege,
      tooltip: region.someCollege,
      backgroundColor: chartFadedColors[2],
      hoverBackgroundColor: chartSolidColors[2],
    },
    {
      label: "Associate's Degree",
      data: region.percentAssocDegree,
      tooltip: region.assocDegree,
      backgroundColor: chartFadedColors[3],
      hoverBackgroundColor: chartSolidColors[3],
    },
    {
      label: "Bachelor's Degree",
      data: region.percentBachDegree,
      tooltip: region.bachDegree,
      backgroundColor: chartFadedColors[4],
      hoverBackgroundColor: chartSolidColors[4],
    },
    {
      label: 'Post Grad Degree',
      data: region.percentPostGradDegree,
      tooltip: region.postGradDegree,
      backgroundColor: chartFadedColors[5],
      hoverBackgroundColor: chartSolidColors[5],
    },
    ]
  })

  const chartOptions = {
    responsive: true,
    aspectRatio: 2.5,
    interaction: {
      intersect: false
    },
    plugins: {
      title: {
        display: false
      },
      legend: {
        display: true,
        labels: {
          usePointStyle: true
        }
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          label: function(context){
            const tip = context.datasetIndex === 8
              ? `${context.dataset.label}: ${context.raw}`
              : `${context.dataset.label}: ${context.raw}% (${context.dataset.tooltip[context.datasetIndex]})`
            return tip
          }
        },
        boxPadding: 6
      }
    },
    scales: {
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Education Level %",
          padding: 20,
          font: {
            size: 16
          }
        },
        ticks: {
          callback: function(value){
            return `${value}`
          },
          font: {
            size: 12
          },
          stepSize: 10
        },
        max: 100,
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
    <div className="mx-6">
      <div className="relative my-4">
        <h1 className="inline text-2xl">Education Level of Respondents</h1>
      </div>
      <ChartDescription
        description={`This chart shows respondents' education level as a percentage of all respondents. Hover over the bar chart to see the percentage for a particular education level, and the number of respondents with that education.`}
      />
      <div className="grid grid-cols-2 gap-x-2 gap-y-6">
        {rawChartData && rawChartData.map((row, idx) => {
          const chartData = {
            labels: labels,
            datasets: row
          }
          return (
            <div key={idx}>
              <div className="flex justify-center">
                <h1 className="font-semibold">{row[0].title}</h1>
              </div>
              <div className="flex justify-center p-4 shadow-lg bg-gray-50">
                <Bar data={chartData} options={chartOptions}/>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(CexSampleEducation)