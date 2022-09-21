import { memo } from "react"
import { Bar, Line } from "react-chartjs-2"
import { getDateLabelsForChart, groupDataByRegion, cexFadedColors, cexSolidColors } from "../../public/utils"
import ChartDescription from "./ChartDescription"

const CexSampleEducation = ({dateRange, data}) => {
  const labels = getDateLabelsForChart(dateRange.startDate, dateRange.endDate)
  const regionalData = Object.values(groupDataByRegion(data, "region_name"))

  const educationData = regionalData.map((region, idx) => {
    const label = region[idx].region_name

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

    const incFemaleDiplOrLess = region.map(row => {
      return parseFloat(row.inc_female_dipl_or_less).toFixed(0)
    })

    const incFemaleSomeColl = region.map(row => {
      return parseFloat(row.inc_female_some_coll).toFixed(0)
    })

    const incFemaleAssoc = region.map(row => {
      return parseFloat(row.inc_female_assoc).toFixed(0)
    })

    const incFemaleBach = region.map(row => {
      return parseFloat(row.inc_female_bach).toFixed(0)
    })

    const incFemalePostGrad = region.map(row => {
      return parseFloat(row.inc_female_post).toFixed(0)
    })

    const incMaleDiplOrLess = region.map(row => {
      return parseFloat(row.inc_male_dipl_or_less).toFixed(0)
    })

    const incMaleSomeColl = region.map(row => {
      return parseFloat(row.inc_male_some_coll).toFixed(0)
    })

    const incMaleAssoc = region.map(row => {
      return parseFloat(row.inc_male_assoc).toFixed(0)
    })

    const incMaleBach = region.map(row => {
      return parseFloat(row.inc_male_bach).toFixed(0)
    })

    const incMalePost = region.map(row => {
      return parseFloat(row.inc_male_post).toFixed(0)
    })

    const ctHighDiplOrLess = region.map(row => {
      return row.ct_hi_dipl_or_less
    })
    const ctHighSomeColl = region.map(row => {
      return row.ct_hi_some_coll
    })
    const ctHighAssoc = region.map(row => {
      return row.ct_hi_assoc
    })
    const ctHighBach = region.map(row => {
      return row.ct_hi_bach
    })
    const ctHighPostGrad = region.map(row => {
      return row.ct_hi_post_grad
    })

    const pctHighDiplOrLess = region.map(row => {
      return parseFloat(row.pct_hi_dipl_or_less).toFixed(1)
    })
    const pctHighSomeColl = region.map(row => {
      return parseFloat(row.pct_hi_some_coll).toFixed(1)
    })
    const pctHighAssoc = region.map(row => {
      return parseFloat(row.pct_hi_assoc).toFixed(1)
    })
    const pctHighBach = region.map(row => {
      return parseFloat(row.pct_hi_bach).toFixed(1)
    })
    const pctHighPostGrad = region.map(row => {
      return parseFloat(row.pct_hi_post_grad).toFixed(1)
    })

    const incHighDiplOrLess = region.map(row => {
      return parseFloat(row.inc_hi_dipl_or_less).toFixed(0)
    })

    const incHighSomeColl = region.map(row => {
      return parseFloat(row.inc_hi_some_coll).toFixed(0)
    })

    const incHighAssoc = region.map(row => {
      return parseFloat(row.inc_hi_assoc).toFixed(0)
    })

    const incHighBach = region.map(row => {
      return parseFloat(row.inc_hi_bach).toFixed(0)
    })

    const incHighPostGrad = region.map(row => {
      return parseFloat(row.inc_hi_post_grad).toFixed(0)
    })

    return {
      label,
      // ed level by sex
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
      pctFemalePostGrad,
      // income by ed level by sex
      incFemaleDiplOrLess,
      incFemaleSomeColl,
      incFemaleAssoc,
      incFemaleBach,
      incFemalePostGrad,
      incMaleDiplOrLess,
      incMaleSomeColl,
      incMaleAssoc,
      incMaleBach,
      incMalePost,
      // pct and inc by highest ed level in household
      ctHighDiplOrLess,
      ctHighSomeColl,
      ctHighAssoc,
      ctHighBach,
      ctHighPostGrad,
      pctHighDiplOrLess,
      pctHighSomeColl,
      pctHighAssoc,
      pctHighBach,
      pctHighPostGrad,
      incHighDiplOrLess,
      incHighSomeColl,
      incHighAssoc,
      incHighBach,
      incHighPostGrad
    }
  })

  const edLevelChartData = educationData.map((region) => {
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

  const incByFemaleEdLevelChartData = educationData.map(region => {
    return [
      {
        label: 'High School Diploma Or Less',
        data: region.incFemaleDiplOrLess,
        backgroundColor: cexFadedColors[1],
        borderColor: cexFadedColors[1],
        hoverBackgroundColor: cexSolidColors[1],
        title: region.label
      },
      {
        label: 'Some College',
        data: region.incFemaleSomeColl,
        backgroundColor: cexFadedColors[2],
        borderColor: cexFadedColors[2],
        hoverBackgroundColor: cexSolidColors[2]
      },
      {
        label: "Associate's Degree",
        data: region.incFemaleAssoc,
        backgroundColor: cexFadedColors[3],
        borderColor: cexFadedColors[3],
        hoverBackgroundColor: cexSolidColors[3]
      },
      {
        label: "Bachelor's Degree",
        data: region.incFemaleBach,
        backgroundColor: cexFadedColors[4],
        borderColor: cexFadedColors[4],
        hoverBackgroundColor: cexSolidColors[4]
      },
      {
        label: 'Post Grad Degree',
        data: region.incFemalePostGrad,
        backgroundColor: cexFadedColors[5],
        borderColor: cexFadedColors[5],
        hoverBackgroundColor: cexSolidColors[5]
      },
    ]
  })

  const incByMaleEdLevelChartData = educationData.map(region => {
    return [
      {
        label: 'High School Diploma Or Less',
        data: region.incMaleDiplOrLess,
        backgroundColor: cexFadedColors[1],
        borderColor: cexFadedColors[1],
        hoverBackgroundColor: cexSolidColors[1],
        title: region.label
      },
      {
        label: 'Some College',
        data: region.incMaleSomeColl,
        backgroundColor: cexFadedColors[2],
        borderColor: cexFadedColors[2],
        hoverBackgroundColor: cexSolidColors[2]
      },
      {
        label: "Associate's Degree",
        data: region.incMaleAssoc,
        backgroundColor: cexFadedColors[3],
        borderColor: cexFadedColors[3],
        hoverBackgroundColor: cexSolidColors[3]
      },
      {
        label: "Bachelor's Degree",
        data: region.incMaleBach,
        backgroundColor: cexFadedColors[4],
        borderColor: cexFadedColors[4],
        hoverBackgroundColor: cexSolidColors[4]
      },
      {
        label: 'Post Grad Degree',
        data: region.incMalePost,
        backgroundColor: cexFadedColors[5],
        borderColor: cexFadedColors[5],
        hoverBackgroundColor: cexSolidColors[5]
      },
    ]
  })

  const highestEdLevelChartData = educationData.map(region => {
    return [
      {
        label: 'High School Diploma Or Less',
        data: region.pctHighDiplOrLess,
        tooltip: region.ctHighDiplOrLess,
        backgroundColor: cexFadedColors[1],
        hoverBackgroundColor: cexSolidColors[1],
        title: region.label
      },
      {
        label: 'Some College',
        data: region.pctHighSomeColl,
        tooltip: region.ctHighSomeColl,
        backgroundColor: cexFadedColors[2],
        hoverBackgroundColor: cexSolidColors[2]
      },
{
        label: "Associate's Degree",
        data: region.pctHighAssoc,
        tooltip: region.ctHighAssoc,
        backgroundColor: cexFadedColors[3],
        hoverBackgroundColor: cexSolidColors[3]
      },
{
        label: "Bachelor's Degree",
        data: region.pctHighBach,
        tooltip: region.ctHighBach,
        backgroundColor: cexFadedColors[4],
        hoverBackgroundColor: cexSolidColors[4]
      },
{
        label: 'Post Grad Degree',
        data: region.pctHighPostGrad,
        tooltip: region.ctHighPostGrad,
        backgroundColor: cexFadedColors[5],
        hoverBackgroundColor: cexSolidColors[5]
      },
    ]
  })

  const incByHighEdLevelChartData = educationData.map(region => {
    return [
      {
        label: 'High School Diploma Or Less',
        data: region.incHighDiplOrLess,
        backgroundColor: cexFadedColors[1],
        borderColor: cexFadedColors[1],
        hoverBackgroundColor: cexSolidColors[1],
        title: region.label
      },
      {
        label: 'Some College',
        data: region.incHighSomeColl,
        backgroundColor: cexFadedColors[2],
        borderColor: cexFadedColors[2],
        hoverBackgroundColor: cexSolidColors[2]
      },
      {
        label: "Associate's Degree",
        data: region.incHighAssoc,
        backgroundColor: cexFadedColors[3],
        borderColor: cexFadedColors[3],
        hoverBackgroundColor: cexSolidColors[3]
      },
      {
        label: "Bachelor's Degree",
        data: region.incHighBach,
        backgroundColor: cexFadedColors[4],
        borderColor: cexFadedColors[4],
        hoverBackgroundColor: cexSolidColors[4]
      },
      {
        label: 'Post Grad Degree',
        data: region.incHighPostGrad,
        backgroundColor: cexFadedColors[5],
        borderColor: cexFadedColors[5],
        hoverBackgroundColor: cexSolidColors[5]
      },
    ]
  })

  const doubleBarChartOptions = {
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

  const singleBarChartOptions = {
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
          usePointStyle: true
        }
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          title: function(context){
            return ''
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

  const lineChartOptions = {
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
        title: 'Ed Level',
        labels: {
          usePointStyle: true
        },
        align: "end"
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          title: function(context){
            return context[0].dataset.label
          },
          label: function(context){
            return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(context.raw)}`
          }
        },
        boxPadding: 6
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: "Income",
          padding: 20,
          font: {
            size: 16
          }
        },
        ticks: {
          callback: function(value){
            return `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(value)}`
          },
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        }
      },
      x: {
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
    <div className="mx-6 space-y-12">
      <div>
        <div className="relative my-4">
          <h1 className="inline text-2xl">Education Level of Respondents</h1>
        </div>
        <ChartDescription
          description={`This chart shows the education level for both men and women as a percentage of all male and female respondents. The left bar is men, the right bar is women. Hover over the bar chart to see the percentage for a particular education level, and the number of respondents with that education.`}
        />
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {edLevelChartData && edLevelChartData.map((row, idx) => {
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
                  <Bar data={chartData} options={doubleBarChartOptions}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <div className="relative my-4">
          <h1 className="inline text-2xl">Income By Female Education Level</h1>
        </div>
        <ChartDescription
          description={`This chart shows the average family pretax income of households (over the previous 12 months) relative to female education level. This does not take into account the education of any male household members.`}
        />
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {incByFemaleEdLevelChartData && incByFemaleEdLevelChartData.map((row, idx) => {
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
                  <Line data={chartData} options={lineChartOptions}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <div className="relative my-4">
          <h1 className="inline text-2xl">Income By Male Education Level</h1>
        </div>
        <ChartDescription
          description={`This chart shows the average family pretax income of households (over the previous 12 months) relative to male education level. This does not take into account the education of any female household members.`}
        />
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {incByMaleEdLevelChartData && incByMaleEdLevelChartData.map((row, idx) => {
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
                  <Line data={chartData} options={lineChartOptions}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <div className="relative my-4">
          <h1 className="inline text-2xl">Highest Education Level in Household</h1>
        </div>
        <ChartDescription
          description={`This chart shows the highest education level in the household. Hover over the bar chart to see the percentage for a particular education level, and the number of households with that education level.`}
        />
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {highestEdLevelChartData && highestEdLevelChartData.map((row, idx) => {
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
                  <Bar data={chartData} options={singleBarChartOptions}/>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <div>
          <div className="relative my-4">
            <h1 className="inline text-2xl">Income By Highest Education Level in Household</h1>
          </div>
          <ChartDescription
            description={`This chart shows the average family pretax income of households (over the previous 12 months) relative to the highest education level in the household. This does not take into account which household member has the degree (it may be both).`}
          />
          <div className="grid grid-cols-2 gap-x-2 gap-y-6">
            {incByHighEdLevelChartData && incByHighEdLevelChartData.map((row, idx) => {
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
                    <Line data={chartData} options={lineChartOptions}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(CexSampleEducation)