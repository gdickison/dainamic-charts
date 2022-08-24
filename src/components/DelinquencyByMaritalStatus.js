import { Bar, Pie } from "react-chartjs-2"
import { memo } from "react"
import ChartTitle from "./ChartTitle"
import ChartDescription from "./ChartDescription"

const DelinquencyByMaritalStatus = ({data}) => {
  const barLabels = []
  const barDataMarried = []
  const barDataUnmarried = []
  const barTooltipMarried = []
  const barTooltipUnmarried = []

  data.map(row => {
    barLabels.push(row.name)
    barDataMarried.push(row.Married)
    barDataUnmarried.push(row.Unmarried)
    barTooltipMarried.push({
      name: row.name,
      region_delinquency_rate: row.delinquency_rate,
      borrower_delinquency_rate: row.Married
    })
    barTooltipUnmarried.push({
      name: row.name,
      region_delinquency_rate: row.delinquency_rate,
      borrower_delinquency_rate: row.Unmarried
    })
  })

  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        type: "bar",
        label: "Married",
        backgroundColor: ["rgba(51, 177, 255, 0.5)"],
        borderColor: ["rgba(51, 177, 255, 1)"],
        hoverBackgroundColor: ["rgba(51, 177, 255, 1)"],
        borderWidth: 3,
        data: barDataMarried,
        tooltip: barTooltipMarried,
        order: 1
      },
      {
        type: "bar",
        label: "Unmarried",
        backgroundColor: ["rgba(0, 83, 255, 0.5)"],
        borderColor: ["rgba(0, 83, 255, 1)"],
        hoverBackgroundColor: ["rgba(0, 83, 255, 1)"],
        borderWidth: 3,
        data: barDataUnmarried,
        tooltip: barTooltipUnmarried,
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
          title: function(context){
            return context[0].dataset.label
          },
          label: function(context){
            return `Delinquency rate: ${Number(context.raw).toFixed(2)}%`
          }
        },
        boxPadding: 6
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
            const region = this.getLabelForValue(value).indexOf("-") > -1 ? this.getLabelForValue(value).split("-")[0] : this.getLabelForValue(value).split(",")[0]
            const state = this.getLabelForValue(value).split(", ")[1]
            return `${region}, ${state}`
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
          callback: function(value){
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

  const pieChartData = data.map((region) => {
    return {
      labels: [
        'Married',
        'Unmarried'
      ],
      datasets: [
        {
          label: `${region.name}`,
          data: [
            (Number(region.Married) / Number(region.delinquency_rate)) * 100,
            (Number(region.Unmarried) / Number(region.delinquency_rate)) * 100
          ],
          tooltip: {
            totalDelinquent: region.delinquency_rate,
            marriedDelinquent: region.Married,
            unmarriedDelinquent: region.Unmarried
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
          const region = chart.chart.getDatasetMeta(0).label.indexOf("-") > -1 ? chart.chart.getDatasetMeta(0).label.split("-")[0] : chart.chart.getDatasetMeta(0).label.split(",")[0]
          const state = chart.chart.getDatasetMeta(0).label.split(", ")[1]
          return `${region}, ${state}`
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
          title: function(context){
            return context[0].label
          },
          label: function(context){
            return [`Share: ${Number(context.raw).toFixed(2)}%`]
          }
        },
        boxPadding: 6
      }
    },
    rotation: 180,
    radius: '92%',
    hoverOffset: 10
  }

  return (
    <div className="h-max">
      <div className="my-4">
        <ChartTitle
          chartTitle={"Delinquency By Marital Status"}
          msa={data.length === 1 ? data[0].name : "Selected Regions"}
        />
        <ChartDescription
          description={"Dainamic's model determines what part of a region's overall delinquency rate is attributable to marital status. For each region, the overall regional delinquecy rate is shown, the delinquency rates for married and unmarried, and the married and unmarried proportional shares of the overall regional delinquency rate. Marital status data is not broken down by month, so delinquency is aggragated for all available dates rather than selected start and end dates."}
        />
      </div>
      <div className="flex justify-around w-full">
        <div className="w-[36%] justify-evenly flex flex-col">
          {barChartData && barChartData.labels.map((label, i) => {
            return (
              <div key={i} className="flex flex-col text-sm space-y-2 p-4 shadow-lg bg-gray-50">
                <p className="text-xl font-medium">{label.split(',')[0]}</p>
                <div className="w-full flex justify-between space-y-2">
                  <p>Regional Delinquency Rate:</p>
                  <p>{Number(barChartData.datasets[0].tooltip[i].region_delinquency_rate).toFixed(2)}%</p>
                </div>
                <div className="flex flex-col">
                  <div className="w-full flex justify-between">
                    <p>Married Borrowers Delinquency Rate:</p>
                    <p>{Number(barChartData.datasets[0].tooltip[i].borrower_delinquency_rate).toFixed(2)}%</p>
                  </div>
                  <div className="w-full flex justify-between">
                    <p>Married borrowers share of the Regional Delinquency Rate:</p>
                    <p>{(Number(pieChartData[i].datasets[0].tooltip.marriedDelinquent) / Number(pieChartData[i].datasets[0].tooltip.totalDelinquent) * 100).toFixed(2)}%</p>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="w-full flex justify-between">
                    <p>Unmarried Borrowers Delinquency Rate:</p>
                    <p>{Number(barChartData.datasets[1].tooltip[i].borrower_delinquency_rate).toFixed(2)}%</p>
                  </div>
                  <div className="w-full flex justify-between">
                    <p>Unmarried borrowers share of the Regional Delinquency Rate:</p>
                    <p>{(Number(pieChartData[i].datasets[0].tooltip.unmarriedDelinquent) / Number(pieChartData[i].datasets[0].tooltip.totalDelinquent) * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex flex-col justify-center items-center space-y-8 px-12 py-4 w-7/12">
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

export default memo(DelinquencyByMaritalStatus)