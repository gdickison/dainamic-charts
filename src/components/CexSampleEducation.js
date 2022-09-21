import { memo } from "react"
import { Bar } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByRegion, cexFadedColors, cexSolidColors } from "../../public/utils"
import ChartDescription from "./ChartDescription"

const CexSampleEducation = ({dateRange, data}) => {
  const labels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)
  const regionalData = Object.values(groupDataByRegion(data, "region_name"))

  const educationData = regionalData.map((region, idx) => {
    const label = region[idx].region_name
console.log('row', region)
    const ctMaleDiplOrLess = region.map(row => {
      return row.ct_male_dipl_or_less
    })

    const pctMaleDiplOrLess = region.map(row => {
      return parseFloat(row.pct_male_dipl_or_less).toFixed(1)
    })

    const ctMaleSomeColl = region.map(row => {
      return row.ct_male_some_coll
    })

    const pctMaleSomeColl = region.map(row => {
      return parseFloat(row.pct_male_some_coll).toFixed(1)
    })

    const ctMaleAssoc = region.map(row => {
      return row.ct_male_assoc
    })

    const pctMaleAssoc = region.map(row => {
      return parseFloat(row.pct_male_assoc).toFixed(1)
    })
    const ctMaleBach = region.map(row => {
      return row.ct_male_bach
    })

    const pctMaleBach = region.map(row => {
      return parseFloat(row.pct_male_bach).toFixed(1)
    })
    const ctMalePostGrad = region.map(row => {
      return row.ct_male_post
    })

    const pctMalePostGrad = region.map(row => {
      return parseFloat(row.pct_male_post).toFixed(1)
    })

    const ctFemaleDiplOrLess = region.map(row => {
      return row.ct_female_dipl_or_less
    })

    const pctFemaleDiplOrLess = region.map(row => {
      return parseFloat(row.pct_female_dipl_or_less).toFixed(1)
    })

    const ctFemaleSomeColl = region.map(row => {
      return row.ct_female_some_coll
    })

    const pctFemaleSomeColl = region.map(row => {
      return parseFloat(row.pct_female_some_coll).toFixed(1)
    })

    const ctFemaleAssoc = region.map(row => {
      return row.ct_female_assoc
    })

    const pctFemaleAssoc = region.map(row => {
      return parseFloat(row.pct_female_assoc).toFixed(1)
    })
    const ctFemaleBach = region.map(row => {
      return row.ct_female_bach
    })

    const pctFemaleBach = region.map(row => {
      return parseFloat(row.pct_female_bach).toFixed(1)
    })
    const ctFemalePostGrad = region.map(row => {
      return row.ct_female_post
    })

    const pctFemalePostGrad = region.map(row => {
      return parseFloat(row.pct_female_post).toFixed(1)
    })

// avg_inc_female_dipl_or_less
// avg_inc_male_dipl_or_less
// inc_female_assoc
// inc_female_bach
// inc_female_post
// inc_female_some_coll
// inc_male_assoc
// inc_male_bach
// inc_male_post
// inc_male_some_coll

    return {
      label,
      ctMaleDiplOrLess,
      pctMaleDiplOrLess,
      ctMaleSomeColl,
      pctMaleSomeColl,
      ctMaleAssoc,
      pctMaleAssoc,
      ctMaleBach,
      pctMaleBach,
      ctMalePostGrad,
      pctMalePostGrad,
      ctFemaleDiplOrLess,
      pctFemaleDiplOrLess,
      ctFemaleSomeColl,
      pctFemaleSomeColl,
      ctFemaleAssoc,
      pctFemaleAssoc,
      ctFemaleBach,
      pctFemaleBach,
      ctFemalePostGrad,
      pctFemalePostGrad
    }
  })

  const rawChartData = educationData.map((region) => {
    return [
      {
        label: 'High School Diploma Or Less',
        data: region.pctMaleDiplOrLess,
        tooltip: region.ctMaleDiplOrLess,
        backgroundColor: cexFadedColors[1],
        hoverBackgroundColor: cexSolidColors[1],
        title: region.label,
        stack: 'Stack 0'
      },
      {
        label: 'High School Diploma Or Less',
        data: region.pctFemaleDiplOrLess,
        tooltip: region.ctFemaleDiplOrLess,
        backgroundColor: cexFadedColors[1],
        hoverBackgroundColor: cexSolidColors[1],
        title: region.label,
        stack: 'Stack 1'
      },
      {
        label: 'Some College',
        data: region.pctMaleSomeColl,
        tooltip: region.ctMaleSomeColl,
        backgroundColor: cexFadedColors[2],
        hoverBackgroundColor: cexSolidColors[2],
        stack: 'Stack 0'
      },
      {
        label: 'Some College',
        data: region.pctFemaleSomeColl,
        tooltip: region.ctFemaleSomeColl,
        backgroundColor: cexFadedColors[2],
        hoverBackgroundColor: cexSolidColors[2],
        stack: 'Stack 1'
      },
      {
        label: "Associate's Degree",
        data: region.pctMaleAssoc,
        tooltip: region.ctMaleAssoc,
        backgroundColor: cexFadedColors[3],
        hoverBackgroundColor: cexSolidColors[3],
        stack: 'Stack 0'
      },
      {
        label: "Associate's Degree",
        data: region.pctFemaleAssoc,
        tooltip: region.ctFemaleAssoc,
        backgroundColor: cexFadedColors[3],
        hoverBackgroundColor: cexSolidColors[3],
        stack: 'Stack 1'
      },
      {
        label: "Bachelor's Degree",
        data: region.pctMaleBach,
        tooltip: region.ctMaleBach,
        backgroundColor: cexFadedColors[4],
        hoverBackgroundColor: cexSolidColors[4],
        stack: 'Stack 0'
      },
      {
        label: "Bachelor's Degree",
        data: region.pctFemaleBach,
        tooltip: region.ctFemaleBach,
        backgroundColor: cexFadedColors[4],
        hoverBackgroundColor: cexSolidColors[4],
        stack: 'Stack 1'
      },
      {
        label: 'Post Grad Degree',
        data: region.pctMalePostGrad,
        tooltip: region.ctMalePostGrad,
        backgroundColor: cexFadedColors[5],
        hoverBackgroundColor: cexSolidColors[5],
        stack: 'Stack 0'
      },
      {
        label: 'Post Grad Degree',
        data: region.pctFemalePostGrad,
        tooltip: region.ctFemalePostGrad,
        backgroundColor: cexFadedColors[5],
        hoverBackgroundColor: cexSolidColors[5],
        stack: 'Stack 1'
      }
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
        align: "end",
        labels: {
          usePointStyle: true,
          filter: function(item){
            if((item.datasetIndex + 1) % 2 == 0){
              return item.text
            }
          }
        }
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          title: function(context){
            return context[0].dataset.stack == 'Stack 0' ? 'Men' : 'Women'
          },
          label: function(context){
            return `${context.dataset.label}: ${context.raw}% (${context.dataset.tooltip[context.dataIndex]})`
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
        description={`This chart shows the education level as a percentage of all respondents. The left bar is men, the right bar is women. Hover over the bar chart to see the percentage for a particular education level, and the number of respondents with that education.`}
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