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
import { Bar, Pie } from "react-chartjs-2"
import { useState, useEffect } from "react"
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"

const DelinquencyByNumberOfBorrowers = ({dateRange, selectedRegions}) => {
  const [isLoading, setLoading] = useState(false)
  const [barChartData, setBarChartData] = useState()
  const [barChartOptions, setBarChartOptions] = useState()
  const [pieChartData, setPieChartData] = useState()
  const [pieChartOptions, setPieChartOptions] = useState()

  useEffect(() => {
    setLoading(true)

    const msaCodes = selectedRegions.map(region => {
      return region.msa
    })

    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCodes: msaCodes
    })

    const endpoint = `/api/get_delinquency_by_num_borrowers`
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
        const barDataOneBorrower = []
        const barDataMultiBorrower = []
        const barTooltipOneBorrower = []
        const barTooltipMultiBorrower = []

        data.map(row => {
          barLabels.push(row.region_name)
          barDataOneBorrower.push((Number(row.one_borrower_delinquent) / Number(row.one_borrower_total) * 100).toFixed(2))
          barDataMultiBorrower.push((Number(row.multi_borrower_delinquent) / Number(row.multi_borrower_total) * 100).toFixed(2))
          barTooltipOneBorrower.push({
            region: row.region,
            name: row.region_name,
            region_total: row.total_loans,
            region_current: row.total_current,
            region_delinquent: row.total_delinquent,
            region_delinquency_rate: (Number(row.total_delinquent) / Number(row.total_loans) * 100).toFixed(2),
            borrower_total: row.one_borrower_total,
            borrower_current: row.one_borrower_current,
            borrower_delinquent: row.one_borrower_delinquent,
            borrower_delinquency_rate: (Number(row.one_borrower_delinquent) / Number(row.one_borrower_total) * 100).toFixed(2)
          })
          barTooltipMultiBorrower.push({
            region: row.region,
            name: row.region_name,
            region_total: row.total_loans,
            region_current: row.total_current,
            region_delinquent: row.total_delinquent,
            region_delinquency_rate: (Number(row.total_delinquent) / Number(row.total_loans) * 100).toFixed(2),
            borrower_total: row.multi_borrower_total,
            borrower_current: row.multi_borrower_current,
            borrower_delinquent: row.multi_borrower_delinquent,
            borrower_delinquency_rate: (Number(row.multi_borrower_delinquent) / Number(row.multi_borrower_total) * 100).toFixed(2),
          })
        })

        const barChartStructuredData = {
          labels: barLabels,
          datasets: [
            {
              type: "bar",
              label: "1 Borrower",
              backgroundColor: ["rgba(51, 177, 255, 0.5)"],
              borderColor: ["rgba(51, 177, 255, 1)"],
              hoverBackgroundColor: ["rgba(51, 177, 255, 1)"],
              borderWidth: 3,
              data: barDataOneBorrower,
              tooltip: barTooltipOneBorrower,
              order: 1
            },
            {
              type: "bar",
              label: "2+ Borrowers",
              backgroundColor: ["rgba(0, 83, 255, 0.5)"],
              borderColor: ["rgba(0, 83, 255, 1)"],
              hoverBackgroundColor: ["rgba(0, 83, 255, 1)"],
              borderWidth: 3,
              data: barDataMultiBorrower,
              tooltip: barTooltipMultiBorrower,
              order: 2
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
                    `${context[0].label}`,
                    `Regional Delinquency Rate: ${context[0].dataset.tooltip[context[0].dataIndex].region_delinquency_rate}%`,
                    ''
                  ]
                },
                title: function(context){
                  return `${context[0].dataset.label}`
                },
                beforeLabel: function(context){
                  return [
                    `Total loans with ${context.dataset.label}: ${context.dataset.tooltip[context.dataIndex].borrower_total}`,
                    `Total delinquent loans with ${context.dataset.label}: ${context.dataset.tooltip[context.dataIndex].borrower_delinquent}`
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
                  return this.getLabelForValue(value)
                },
                font: {
                  weight: 'bold'
                }
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
                display: false
              }
            }
          }
        }

        const pieChartStructuredData = []
        data.map((region, i) => {
          pieChartStructuredData.push({
            labels: [
              '1 Borrower',
              '2+ Borrowers'
            ],
            datasets: [
              {
                label: `${region.region_name}`,
                data: [
                  (Number(region.one_borrower_delinquent) / Number(region.total_delinquent) * 100).toFixed(2),
                  (Number(region.multi_borrower_delinquent) / Number(region.total_delinquent) * 100).toFixed(2)
                ],
                tooltip: {
                  totalDelinquent: region.total_delinquent,
                  oneBorrowerDelinquent: region.one_borrower_delinquent,
                  multiBorrowerDelinquent: region.multi_borrower_delinquent
                },
                backgroundColor: [
                  "rgba(51, 177, 255, 0.5)",
                  "rgba(0, 83, 255, 0.5)"
                ],
                borderColor: [
                  "rgba(51, 177, 255, 1)",
                  "rgba(0, 83, 255, 1)"
                ],
                hoverBackgroundColor: [
                  "rgba(51, 177, 255, 1)",
                  "rgba(0, 83, 255, 1)"
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
                return chart.chart.getDatasetMeta(0).label
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
              callbacks: {
                beforeTitle: function(context){
                  return `${context[0].dataset.label}`
                },
                title: function(context){
                  return `${context[0].label}`
                },
                beforeLabel: function(context){
                  return [
                    `Total delinquent loans: ${context.dataset.tooltip.totalDelinquent}`,
                    `Delinquent ${context.label} borrower loans: ${context.dataIndex === 0 ? context.dataset.tooltip.oneBorrowerDelinquent : context.dataset.tooltip.multiBorrowerDelinquent}`
                  ]
                },
                label: function(context){
                  return `Share of Regional Delinquency Rate: ${context.raw}%`
                }
              }
            }
          },
          rotation: 180
        }

        setBarChartData(barChartStructuredData)
        setBarChartOptions(barOptions)
        setPieChartData(pieChartStructuredData)
        setPieChartOptions(pieOptions)
        setLoading(false)
      })
  }, [])
  // }, [dateRange.endDate, selectedRegions, dateRange.startDate])

  if(isLoading){
    return <Loader loadiingText={"Getting number of borrowers data..."}/>
  }

  return (
    <div className="h-max">
      <ChartHeaderWithTooltip
        chartName={"Delinquency By Number of Borrowers"}
        msa={selectedRegions.length === 1 ? selectedRegions[0].name : "selected regions"}
        tooltip={"All loans for each month are grouped by number of borrowers (1 or 2+). The number of loans with 3 or more borrowers are statistically insignificant and are included in the '2+' category. Click on the legend to show/hide datasets"}
      />
      <div className="flex justify-around w-full">
        <div className="w-1/3 justify-evenly flex flex-col">
          {barChartData && barChartData.labels.map((label, i) => {
            return (
              <div className="flex flex-col">
                <p key={i} className="pl-3 py-2 text-xl">{label} Region</p>
                <ul className="pl-5 text-sm">
                  <li>Regional Delinquency Rate: {barChartData.datasets[0].tooltip[i].region_delinquency_rate}%</li>
                  <li>Delinquency Rate for loans with 1 borrower: {barChartData.datasets[0].tooltip[i].borrower_delinquency_rate}%</li>
                  <li>Share of the Regional Delinquency Rate for 1 Borrower loans: {(Number(pieChartData[i].datasets[0].tooltip.oneBorrowerDelinquent) / Number(pieChartData[i].datasets[0].tooltip.totalDelinquent) * 100).toFixed(2)}%</li>
                  <li>Delinquency Rate for loans with 2+ borrowers: {barChartData.datasets[1].tooltip[i].borrower_delinquency_rate}%</li>
                  <li>Share of the Regional Delinquency Rate for 2+ Borrower loans: {(Number(pieChartData[i].datasets[0].tooltip.multiBorrowerDelinquent) / Number(pieChartData[i].datasets[0].tooltip.totalDelinquent) * 100).toFixed(2)}%</li>
                </ul>
              </div>
            )
          })}
        </div>
        <div className="flex flex-col items-center space-y-8 px-12 py-4 w-7/12">
          {barChartData &&
            <div className="flex w-11/12">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          }
          {pieChartData &&
            <div className="flex">
              {pieChartData.map((chart, i) => {
                return (
                  <div key={i} className="flex">
                    <Pie data={chart} options={pieChartOptions} width={pieChartData.length === 1 ? 250 : 200} />
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

export default DelinquencyByNumberOfBorrowers