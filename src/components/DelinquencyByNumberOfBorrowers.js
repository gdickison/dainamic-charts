import { Bar, Pie } from "react-chartjs-2"
import { memo } from "react"
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import { split } from "../../public/utils"

const DelinquencyByNumberOfBorrowers = ({data}) => {
console.log('num borrowers data', data)
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

  const barChartData = {
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

  const barChartOptions = {
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
          callback: function(value){
            const labelArray = this.getLabelForValue(value).split(", ")
            let label = labelArray[0].includes("--") ? labelArray[0].split("--") : labelArray[0].split("-")
            label.push(labelArray[1])
            return label
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

  const pieChartData = data.map((region, i) => {
    return {
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
    }
  })

  const pieChartOptions = {
    responsive: true,
    aspectRatio: 1,
    plugins: {
      title: {
        text: function(chart){
          const labelArray = chart.chart.getDatasetMeta(0).label.split(", ")
          let label = labelArray[0].includes("--") ? labelArray[0].split("--") : labelArray[0].split("-")
          label.push(labelArray[1])
          return label
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
            const [first, second] = split(context[0].dataset.label, (context[0].dataset.label).indexOf('-', 15))
            return (context[0].dataset.label).length > 30 ? [first, second] : `${context[0].dataset.label}`
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

  return (
    <div className="h-max">
      <ChartHeaderWithTooltip
        chartName={"Delinquency By Number of Borrowers"}
        msa={data.length === 1 ? data[0].region_name : "selected regions"}
        tooltip={"All loans for each month are grouped by number of borrowers (1 or 2+). The number of loans with 3 or more borrowers are statistically insignificant and are included in the '2+' category. Click on the legend to show/hide datasets"}
      />
      <div className="flex justify-around w-full">
        <div className="w-1/3 justify-evenly flex flex-col">
          {barChartData && barChartData.labels.map((label, i) => {
            return (
              <div className="flex flex-col">
                <p key={i} className="pl-3 py-2 text-xl font-medium">{label}</p>
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
            <div className="w-full flex justify-evenly pl-12">
              {pieChartData.map((chart, i) => {
                return (
                  <div key={i} className="flex">
                    <Pie data={chart} options={pieChartOptions} width={230} />
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

export default memo(DelinquencyByNumberOfBorrowers)