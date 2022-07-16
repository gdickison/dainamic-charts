import {
  Chart as ChartJS,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"

ChartJS.register(
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

import Loader from "./Loader"
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import { Bar, Doughnut } from "react-chartjs-2"
import { useState, useEffect } from "react"
import { chartSolidColors, chartFadedColors } from "../../public/utils"

const DelinquencyByCreditScoreByPeriod = ({dateRange, targetRegion, compRegions}) => {
  const [isLoading, setLoading] = useState(false)
  const [barChartData, setBarChartData] = useState()
  const [barChartOptions, setBarChartOptions] = useState()
  const [pieChartData, setPieChartData] = useState()
  const [pieChartOptions, setPieChartOptions] = useState()

  useEffect(() => {
    setLoading(true)

    const msaCodes = []
    msaCodes.push(targetRegion.msa)
    if(compRegions.length > 0){
      compRegions.map(region => {
        msaCodes.push(region.msa)
      })
    }

    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })

    const endpoint = `/api/get_loan_status_by_credit_score`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    fetch(endpoint, options)
      .then(res => res.json())
      .then(data => data.response)
      .then(data => {
        const barLabels = []
        const barFair = []
        const barGood = []
        const barVeryGood = []
        const barExceptional = []
        const tooltipFair = []
        const tooltipGood = []
        const tooltipVeryGood = []
        const tooltipExceptional = []
        data.map(region => {
          barLabels.push(region.region_name)
          barFair.push((Number(region.fair_delinquent) / Number(region.fair_total) * 100).toFixed(2))
          tooltipFair.push({
            delinquent: region.fair_delinquent,
            total: region.fair_total,
            regionalDelinquencyRate: ((Number(region.delinquent) / Number(region.total)) * 100).toFixed(2),
            regionalTotal: region.total,
            regionalDelinquent: region.delinquent
          })
          barGood.push((Number(region.good_delinquent) / Number(region.good_total) * 100).toFixed(2))
          tooltipGood.push({
            delinquent: region.good_delinquent,
            total: region.good_total,
            regionalDelinquencyRate: ((Number(region.delinquent) / Number(region.total)) * 100).toFixed(2),
            regionalTotal: region.total,
            regionalDelinquent: region.delinquent
          })
          barVeryGood.push((Number(region.very_good_delinquent) / Number(region.very_good_total) * 100).toFixed(2))
          tooltipVeryGood.push({
            delinquent: region.very_good_delinquent,
            total: region.very_good_total,
            regionalDelinquencyRate: ((Number(region.delinquent) / Number(region.total)) * 100).toFixed(2),
            regionalTotal: region.total,
            regionalDelinquent: region.delinquent
          })
          barExceptional.push((Number(region.exceptional_delinquent) / Number(region.exceptional_total) * 100).toFixed(2))
          tooltipExceptional.push({
            delinquent: region.exceptional_delinquent,
            total: region.exceptional_total,
            regionalDelinquencyRate: ((Number(region.delinquent) / Number(region.total)) * 100).toFixed(2),
            regionalTotal: region.total,
            regionalDelinquent: region.delinquent
          })
        })

        const barChartStructuredData = {
          labels: barLabels,
          datasets: [
            {
              type: "bar",
              label: "580-669 (Fair)",
              backgroundColor: chartFadedColors[0],
              borderColor: chartSolidColors[0],
              hoverBackgroundColor: chartSolidColors[0],
              borderWidth: 3,
              data: barFair,
              tooltip: tooltipFair,
              order: 1
            },
            {
              type: "bar",
              label: "670-739 (Good)",
              backgroundColor: chartFadedColors[1],
              borderColor: chartSolidColors[1],
              hoverBackgroundColor: chartSolidColors[1],
              borderWidth: 3,
              data: barGood,
              tooltip: tooltipGood,
              order: 2
            },
            {
              type: "bar",
              label: "740-799 (Very Good)",
              backgroundColor: chartFadedColors[2],
              borderColor: chartSolidColors[2],
              hoverBackgroundColor: chartSolidColors[2],
              borderWidth: 3,
              data: barVeryGood,
              tooltip: tooltipVeryGood,
              order: 3
            },
            {
              type: "bar",
              label: "800+ (Exceptional)",
              backgroundColor: chartFadedColors[3],
              borderColor: chartSolidColors[3],
              hoverBackgroundColor: chartSolidColors[3],
              borderWidth: 3,
              data: barExceptional,
              tooltip: tooltipExceptional,
              order: 4
            }
          ]
        }

        const barOptions = {
          showLabel: false,
          responsive: true,
          aspectRatio: 1.75,
          maxBarThickness: 125,
          plugins: {
            title: {
              text: "Delinquency Rate per Category",
              display: false
            },
            legend: {
              display: true
            },
            tooltip: {
              callbacks: {
                beforeTitle: function(context){
                  return [
                    `${context[0].label}`
                  ]
                },
                title: function(context){
                  return `Credit score: ${context[0].dataset.label}`
                },
                beforeLabel: function(context){
                  return [
                    `Total loans in range: ${context.dataset.tooltip[context.dataIndex].total}`,
                    `Total delinquent loans in range: ${context.dataset.tooltip[context.dataIndex].delinquent}`
                  ]
                },
                label: function(context){
                  return `Delinquency rate: ${context.raw}%`
                }
              }
            }
          },
          scales: {
            x: {
              title: {
                display: false,
                text: "Region",
                padding: 20,
                font: {
                  size: 16
                }
              },
              ticks: {
                callback: function(value, index, ticks){
                  return this.getLabelForValue(value).split('-')[0]
                },
                font: {
                  weight: 'bold'
                }
              },
              grid: {
                display: false
              }
            },
            y: {
              title: {
                display: false,
                text: "Delinquency Rate",
                padding: 20,
                font: {
                  size: 16
                }
              },
              ticks: {
                callback: function(value, index, ticks){
                  return value + "%"
                },
                font: {
                  size: 16
                }
              },
              grid: {
                display: true
              }
            }
          }
        }

        const pieChartStructuredData = []
        data.map(region => {
          pieChartStructuredData.push({
            labels: [
              '580-669 (Fair)',
              '670-739 (Good)',
              '740-799 (Very Good)',
              '800+ (Exceptional)'
            ],
            datasets: [
              {
                label: `${region.region_name}`,
                data: [
                  (Number(region.fair_delinquent) / Number(region.delinquent) * 100).toFixed(2),
                  (Number(region.good_delinquent) / Number(region.delinquent) * 100).toFixed(2),
                  (Number(region.very_good_delinquent) / Number(region.delinquent) * 100).toFixed(2),
                  (Number(region.exceptional_delinquent) / Number(region.delinquent) * 100).toFixed(2)
                ],
                tooltip: {
                  fairDelinquent: region.fair_delinquent,
                  fairTotal: region.fair_total,
                  goodDelinquent: region.good_delinquent,
                  goodTotal: region.good_total,
                  veryGoodDelinquent: region.very_good_delinquent,
                  veryGoodTotal: region.very_good_total,
                  exceptionalDelinquent: region.exceptional_delinquent,
                  exceptionalTotal: region.exceptional_total,
                  total: region.total,
                  delinquent: region.delinquent,
                  regionalDelinquencyRate: (Number(region.delinquent) / (Number(region.total)) * 100).toFixed(2)
                },
                backgroundColor: [
                  chartFadedColors[0],
                  chartFadedColors[1],
                  chartFadedColors[2],
                  chartFadedColors[3]
                ],
                borderColor: [
                  chartSolidColors[0],
                  chartSolidColors[1],
                  chartSolidColors[2],
                  chartSolidColors[3]
                ],
                hoverBackgroundColor: [
                  chartSolidColors[0],
                  chartSolidColors[1],
                  chartSolidColors[2],
                  chartSolidColors[3]
                ]
              }
            ]
          })
        })

        const pieOptions = {
          responsive: true,
          aspectRatio: 1,
          plugins: {
            title: {
              text: function(chart){
                return [
                  `${chart.chart.getDatasetMeta(0).label}`,
                  `${(Number(chart.chart.getDatasetMeta(0)._dataset.tooltip.total)).toLocaleString("en-us")} Total Loans`
                ]
              },
              position: 'bottom',
              display: true
            },
            label: {
              display: true
            },
            legend: {
              display: false
            },
            tooltip: {
              position: "nearest",
              callbacks: {
                beforeTitle: function(context){
                  return `${context[0].dataset.label}`
                },
                title: function(context){
                  return `${context[0].label}`
                },
                beforeLabel: function(context){
                  return [
                    `Delinquent loans in region: ${context.dataset.tooltip.delinquent}`,
                    `Delinquent loans in range: ${context.dataIndex === 0
                      ? context.dataset.tooltip.fairDelinquent
                      : context.dataIndex === 1
                        ? context.dataset.tooltip.goodDelinquent
                        : context.dataIndex === 2
                          ? context.dataset.tooltip.veryGoodDelinquent
                          : context.dataset.tooltip.exceptionalDelinquent}`
                  ]
                },
                label: function(context){
                  return [`Share of Regional`, `Delinquency Rate:`, `${context.raw}%`]
                }
              }
            },
            rotation: 180
          }
        }

        setBarChartData(barChartStructuredData)
        setBarChartOptions(barOptions)
        setPieChartData(pieChartStructuredData)
        setPieChartOptions(pieOptions)
        setLoading(false)
      })
  }, [dateRange.endDate, targetRegion.msa, dateRange.startDate])

  if(isLoading) {
    return <Loader loadiingText={"Getting credit score by region data..."}/>
  }

  return (
    <div className="h-max">
      <ChartHeaderWithTooltip
        chartName={"Delinquency Rate by Credit Score"}
        msa={compRegions.length > 0 ? "selected regions" : targetRegion.name}
        tooltip={"Credit scores are grouped into standard ranges corresponding to 'Fair', 'Good', 'Very Good', and 'Exceptional'. The number of delinquent loans for each range in each period is divided by the corresponding total number of loans to get the delinquency rate. Delinquency rates of 0% are not shown. Delinquency rates of 100% generally indicate an anomally based on a very small number of loans at the given data point and are also excluded. Hover over the data points to see details"}
      />
      {barChartData && <p className="text-base">The bar chart shows the delinquency rate within each credit score category. It is to be expected that lower credit scores will have a higher frequency of delinquency. However, those scores also typically represent a smaller portion of the overall loan portfolio, as shown in {barChartData.labels.length === 1 ? 'the' : 'each'} region's corresponding doughnut chart.</p>}
      <div className="flex justify-around w-full">
        <div className="w-1/3 justify-evenly flex flex-col">
          {barChartData && barChartData.labels.map((label, i) => {
            return (
              <div className="flex flex-col">
                <p key={i} className="pl-3 py-2 text-xl">{label.split(',')[0]} Region</p>
                <ul className="pl-5 text-base space-y-2">
                  <li>In the {label} Region <span className="font-semibold">{Number(barChartData.datasets[0].tooltip[i].regionalTotal).toLocaleString()}</span> loans were originated from {dateRange.startDate} through {dateRange.endDate}</li>
                  <li>Of those loans <span className="font-semibold">{Number(barChartData.datasets[0].tooltip[i].regionalDelinquent).toLocaleString()}</span> are delinquent, resulting in a Regional Delinquency Rate of <span className="font-semibold">{barChartData.datasets[0].tooltip[i].regionalDelinquencyRate}%</span></li>
                </ul>
              </div>
            )
          })}
        </div>
        <div className="flex flex-col items-center space-y-8 px-12 py-4 w-7/12">
          <p>Delinquency Rate By Credit Score Range</p>
          {barChartData &&
            <div className="flex w-11/12">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          }
          <p>Credit Score Range Share of Regional Delinquency Rate</p>
          {pieChartData &&
            <div className="flex">
              {pieChartData.map((chart, i) => {
                return (
                  <div key={i} className="flex">
                    <Doughnut data={chart} options={pieChartOptions} width={pieChartData.length === 1 ? 250 : 200} />
                  </div>
                )
              })}
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default DelinquencyByCreditScoreByPeriod