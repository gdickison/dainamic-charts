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
import { Bar } from "react-chartjs-2"
import { useState, useEffect } from "react"

const DelinquencyByCreditScore = ({dateRange, targetRegion, compRegions}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()

  useEffect(() => {
    setLoading(true)

    const msaCodes = []
    msaCodes.push(targetRegion.msaCode)
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
        const groupDataByMsa = (list, key) => {
          return list.reduce(function(rv, x){
            (rv[x[key]] = rv[x[key]] || []).push(x)
            return rv
          }, {})
        }
        const groupedData = Object.entries(groupDataByMsa(data, "region"))

        const delinquencyRateStructuredData = []
        groupedData.map((group, i) => {
          const delinquencyRateFeatureData = {
            labels: [],
            datasets: [
              {
                label: "580-669",
                backgroundColor: "#bae6ff",
                borderColor: "#bae6ff",
                borderWidth: 1,
                data: [],
                tooltip: [],
                region: {
                  code: group[1][0].region,
                  name: group[1][0].region_name
                }
              },
              {
                label: "670-739",
                backgroundColor: "#33b1ff",
                borderColor: "#33b1ff",
                borderWidth: 1,
                data: [],
                tooltip: [],
                region: {
                  code: group[1][0].region,
                  name: group[1][0].region_name
                }
              },
              {
                label: "740-799",
                backgroundColor: "#0072c3",
                borderColor: "#0072c3",
                borderWidth: 1,
                data: [],
                tooltip: [],
                region: {
                  code: group[1][0].region,
                  name: group[1][0].region_name
                }
              },
              {
                label: "800+",
                backgroundColor: "#003a6d",
                borderColor: "#003a6d",
                borderWidth: 1,
                data: [],
                tooltip: [],
                region: {
                  code: group[1][0].region,
                  name: group[1][0].region_name
                }
              }
            ],
            misc: []
          }

          group[1].map(row => {
            delinquencyRateFeatureData.misc.push('bananas')
            delinquencyRateFeatureData.labels.push(row.origination_date.split('T')[0])
            delinquencyRateFeatureData.datasets[0].data.push(((row.fair_delinquent_for_period / row.fair_total_for_period) * 100).toFixed(2))
            delinquencyRateFeatureData.datasets[0].tooltip.push({
              totalAtPoint: row.fair_total_for_period,
              delinquentAtPoint: row.fair_delinquent_for_period
            })
            delinquencyRateFeatureData.datasets[1].data.push(((row.good_delinquent_for_period / row.good_total_for_period) * 100).toFixed(2))
            delinquencyRateFeatureData.datasets[1].tooltip.push({
              totalAtPoint: row.good_total_for_period,
              delinquentAtPoint: row.good_delinquent_for_period
            })
            delinquencyRateFeatureData.datasets[2].data.push(((row.very_good_delinquent_for_period / row.very_good_total_for_period) * 100).toFixed(2))
            delinquencyRateFeatureData.datasets[2].tooltip.push({
              totalAtPoint: row.very_good_total_for_period,
              delinquentAtPoint: row.very_good_delinquent_for_period
            })
            delinquencyRateFeatureData.datasets[3].data.push(((row.exceptional_delinquent_for_period / row.exceptional_total_for_period) * 100).toFixed(2))
            delinquencyRateFeatureData.datasets[3].tooltip.push({
              totalAtPoint: row.exceptional_total_for_period,
              delinquentAtPoint: row.exceptional_delinquent_for_period
            })
          })

          delinquencyRateStructuredData.push(delinquencyRateFeatureData)
        })

        const delinquencyRateFeatureOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true
            },
            tooltip: {
              callbacks: {
                beforeTitle: function(context){
                  return `Credit Score: ${context[0].dataset.label}`
                },
                title: function(context){
                  return `Total loans: ${context[0].dataset.tooltip[context[0].dataIndex].totalAtPoint}`
                },
                afterTitle: function(context){
                  return `Delinquent loans: ${context[0].dataset.tooltip[context[0].dataIndex].delinquentAtPoint}`
                },
                label: function(context){
                  return(`Delinquency rate: ${context.raw}%`)
                }
              }
            }
          },
          scales: {
            y: {
              title: {
                display: false,
                text: "Delinquency Rate",
                padding: 20,
                font: {
                  size: 12
                }
              },
              ticks: {
                callback: function(value, index, ticks){
                  return `${value}%`
                },
                font: {
                  size: 12
                }
              },
              grace: 5
            },
            x: {
              title: {
                display: true,
                text: function(chart){
                  return chart.chart.getDatasetMeta(0)._dataset.region.name
                },
                padding: 20,
                font: {
                  size: 14
                }
              },
              ticks: {
                callback: function(value){
                  let date = new Date(this.getLabelForValue(value))
                  return `${date.toLocaleString('en-us', {month: 'long'})} ${date.getFullYear()}`
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

        setChartData(delinquencyRateStructuredData)
        setChartOptions(delinquencyRateFeatureOptions)
        setLoading(false)
      })
  }, [dateRange.endDate, targetRegion.msaCode, dateRange.startDate])

  if(isLoading) {
    return <Loader loadiingText={"Getting credit score data..."}/>
  }

  return (
    <div>
      <ChartHeaderWithTooltip
        chartName={"Delinquency Rate by Credit Score and Origination Date"}
        msa={compRegions.length > 0 ? "selected regions" : targetRegion.msaName}
        tooltip={"Credit scores are grouped into standard ranges corresponding to 'Fair', 'Good', 'Very Good', and 'Exceptional'. The number of delinquent loans for each range in each period is divided by the corresponding total number of loans to get the delinquency rate. Delinquency rates of 0% are not shown. Delinquency rates of 100% generally indicate an anomally based on a very small number of loans at the given data point and are also excluded. Hover over the data points to see details"}
      />
      <div className="flex">
      {chartData && chartData.map(dataRow => {
        return (
          <div className={chartData.length === 1 ? "w-full h-[80vh]" : chartData.length === 2 ? "w-1/2 h-[80vh]" : "w-1/3 h-[80vh]"}>
            <Bar data={dataRow} options={chartOptions} />
          </div>
        )
      })}

      </div>
    </div>
  )
}

export default DelinquencyByCreditScore