import { Bar, Pie } from "react-chartjs-2"
import { memo } from "react"
import ChartTitle from "./ChartTitle"
import ChartDescription from "./ChartDescription"
import { chartFadedColors, chartSolidColors, split } from "./../../public/utils"

const DelinquencyByRace = ({data}) => {
  const barLabels = []
  const barDataWhite = []
  const barDataBlack = []
  const barDataNativeAmerican = []
  const barDataAsian = []
  const barDataPacificIslander = []
  const barDataOtherMixed = []
  const bartooltipWhite = []
  const bartooltipBlack = []
  const bartooltipNativeAmerican = []
  const bartooltipAsian = []
  const bartooltipPacificIslander = []
  const bartooltipOtherMixed = []

  data.map(row => {
    barLabels.push(row.name)
    barDataWhite.push(row.white)
    barDataBlack.push(row.black)
    barDataNativeAmerican.push(row.native_american)
    barDataAsian.push(row.asian)
    barDataPacificIslander.push(row.pacific_islander)
    barDataOtherMixed.push(row.other_mixed)
    bartooltipWhite.push({
      name: row.name,
      region_delinquency_rate: row.delinquency_rate,
      borrower_delinquency_rate: row.white
    })
    bartooltipBlack.push({
      name: row.name,
      region_delinquency_rate: row.delinquency_rate,
      borrower_delinquency_rate: row.black
    })
    bartooltipNativeAmerican.push({
      name: row.name,
      region_delinquency_rate: row.delinquency_rate,
      borrower_delinquency_rate: row.native_american
    })
    bartooltipAsian.push({
      name: row.name,
      region_delinquency_rate: row.delinquency_rate,
      borrower_delinquency_rate: row.asian
    })
    bartooltipPacificIslander.push({
      name: row.name,
      region_delinquency_rate: row.delinquency_rate,
      borrower_delinquency_rate: row.pacific_islander
    })
    bartooltipOtherMixed.push({
      name: row.name,
      region_delinquency_rate: row.delinquency_rate,
      borrower_delinquency_rate: row.other_mixed
    })
  })

  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        type: "bar",
        label: "White",
        backgroundColor: chartFadedColors[0],
        borderColor: chartSolidColors[0],
        hoverBackgroundColor: chartSolidColors[0],
        borderWidth: 3,
        data: barDataWhite,
        tooltip: bartooltipWhite,
        order: 1
      },
      {
        type: "bar",
        label: "Black",
        backgroundColor: chartFadedColors[1],
        borderColor: chartSolidColors[1],
        hoverBackgroundColor: chartSolidColors[1],
        borderWidth: 3,
        data: barDataBlack,
        tooltip: bartooltipBlack,
        order: 2
      },
      {
        type: "bar",
        label: "Native American",
        backgroundColor: chartFadedColors[2],
        borderColor: chartSolidColors[2],
        hoverBackgroundColor: chartSolidColors[2],
        borderWidth: 3,
        data: barDataNativeAmerican,
        tooltip: bartooltipNativeAmerican,
        order: 3
      },
      {
        type: "bar",
        label: "Asian",
        backgroundColor: chartFadedColors[3],
        borderColor: chartSolidColors[3],
        hoverBackgroundColor: chartSolidColors[3],
        borderWidth: 3,
        data: barDataAsian,
        tooltip: bartooltipAsian,
        order: 4
      },
      {
        type: "bar",
        label: "Pacific Islander",
        backgroundColor: chartFadedColors[4],
        borderColor: chartSolidColors[4],
        hoverBackgroundColor: chartSolidColors[4],
        borderWidth: 3,
        data: barDataPacificIslander,
        tooltip: bartooltipPacificIslander,
        order: 5
      },
      {
        type: "bar",
        label: "Other/Mixed",
        backgroundColor: chartFadedColors[5],
        borderColor: chartSolidColors[5],
        hoverBackgroundColor: chartSolidColors[5],
        borderWidth: 3,
        data: barDataOtherMixed,
        tooltip: bartooltipOtherMixed,
        order: 6
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
            const region = context[0].label.split("-")[0]
            const state = context[0].label.split(", ")[1]
            return `${region}, ${state}`
          },
          title: function(){
            return ''
          },
          beforeLabel: function(context){
            return `Regional Delinquency Rate: ${Number(context.dataset.tooltip[context.dataIndex].region_delinquency_rate).toFixed(2)}%`
          },
          label: function(context){
            return `${context.dataset.label} delinquency rate: ${Number(context.raw).toFixed(2)}%`
          }
        },
        boxPadding: 6,
        caretPadding: 10
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
            const region = this.getLabelForValue(value).split("-")[0]
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
        "White",
        "Black",
        "Native American",
        "Asian",
        "Pacific Islander",
        "Other/Mixed"
      ],
      datasets: [
        {
          label: `${region.name}`,
          data: [
            (Number(region.white) / Number(region.delinquency_rate)) * 100,
            (Number(region.black) / Number(region.delinquency_rate)) * 100,
            (Number(region.native_american) / Number(region.delinquency_rate)) * 100,
            (Number(region.asian) / Number(region.delinquency_rate)) * 100,
            (Number(region.pacific_islander) / Number(region.delinquency_rate)) * 100,
            (Number(region.other_mixed) / Number(region.delinquency_rate)) * 100
          ],
          tooltip: {
            totalDelinquent: region.delinquency_rate,
            whiteDelinquent: region.white,
            blackDelinquent: region.black,
            nativeAmericanDelinquent: region.native_american,
            asianDelinquent: region.asian,
            pacificIslanderDelinquent: region.pacific_islander,
            otherMixedDelinquent: region.other_mixed
          },
          backgroundColor: chartFadedColors.slice(0, 6),
          borderColor: chartSolidColors.slice(0, 6),
          hoverBackgroundColor: chartSolidColors.slice(0, 6)
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
          const region = chart.chart.getDatasetMeta(0).label.split("-")[0]
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
          beforeTitle: function(context){
            const region = context[0].dataset.label.split("-")[0]
            const state = context[0].dataset.label.split(", ")[1]
            return `${region}, ${state}`
          },
          title: function(){
            return ''
          },
          beforeLabel: function(context){
            return [
              `Regional Delinquency Rate: ${Number(context.dataset.tooltip.totalDelinquent).toFixed(2)}%`,
              '',
              `${context.label}`
            ]
          },
          label: function(context){
            return [`Share of Regional`, `Delinquency Rate: ${Number(context.raw).toFixed(2)}%`]
          }
        },
        boxPadding: 6
      }
    },
    radius: '95%',
    hoverOffset: 10
  }

  return (
    <div className="h-max">
      <div className="my-4">
        <ChartTitle
          chartName={"Delinquency By Race"}
          msa={data.length === 1 ? data[0].name : "Selected Regions"}
        />
        <ChartDescription
          description={"Dainamic's model determines what part of a region's overall delinquency rate is attributable to each racial category. For each region, the overall regional delinquecy rate is shown, the delinquency rate for each racial category, and the racial category's proportional share of the overall regional delinquency rate. Race data is not broken down by month, so delinquency is aggragated for all available dates rather than selected start and end dates."}
        />
      </div>
      <div className="flex justify-around w-full">
        <div className="w-[36%] justify-evenly flex flex-col space-y-2">
          {barChartData && barChartData.labels.map((label, i) => {
            return (
              <div className="flex flex-col text-sm space-y-1 p-4 shadow-lg bg-gray-50">
                <p key={i} className="text-lg font-medium">{label}</p>
                <div className="w-full flex justify-between py-2">
                  <p>Regional Delinquency Rate:</p>
                  <p>{Number(barChartData.datasets[0].tooltip[i].region_delinquency_rate).toFixed(2)}%</p>
                </div>
                <div className="w-full flex justify-between">
                  <p>White Delinquency - Rate / Share:</p>
                  <p>{Number(barChartData.datasets[0].tooltip[i].borrower_delinquency_rate).toFixed(2)}% / {(Number(pieChartData[i].datasets[0].tooltip.whiteDelinquent) / Number(pieChartData[i].datasets[0].tooltip.totalDelinquent) * 100).toFixed(2)}%</p>
                </div>
                <div className="w-full flex justify-between">
                  <p>Black Delinquency - Rate / Share:</p>
                  <p>{Number(barChartData.datasets[1].tooltip[i].borrower_delinquency_rate).toFixed(2)}% / {(Number(pieChartData[i].datasets[0].tooltip.blackDelinquent) / Number(pieChartData[i].datasets[0].tooltip.totalDelinquent) * 100).toFixed(2)}%</p>
                </div>
                <div className="w-full flex justify-between">
                  <p>Native American Delinquency - Rate / Share:</p>
                  <p>{Number(barChartData.datasets[2].tooltip[i].borrower_delinquency_rate).toFixed(2)}% / {(Number(pieChartData[i].datasets[0].tooltip.nativeAmericanDelinquent) / Number(pieChartData[i].datasets[0].tooltip.totalDelinquent) * 100).toFixed(2)}%</p>
                </div>
                <div className="w-full flex justify-between">
                  <p>Asian Delinquency - Rate / Share:</p>
                  <p>{Number(barChartData.datasets[3].tooltip[i].borrower_delinquency_rate).toFixed(2)}% / {(Number(pieChartData[i].datasets[0].tooltip.asianDelinquent) / Number(pieChartData[i].datasets[0].tooltip.totalDelinquent) * 100).toFixed(2)}%</p>
                </div>
                <div className="w-full flex justify-between">
                  <p>Pacific Islander Delinquency - Rate / Share:</p>
                  <p>{Number(barChartData.datasets[4].tooltip[i].borrower_delinquency_rate).toFixed(2)}% / {(Number(pieChartData[i].datasets[0].tooltip.pacificIslanderDelinquent) / Number(pieChartData[i].datasets[0].tooltip.totalDelinquent) * 100).toFixed(2)}%</p>
                </div>
                <div className="w-full flex justify-between">
                  <p>Other/Mixed Delinquency - Rate / Share:</p>
                  <p>{Number(barChartData.datasets[5].tooltip[i].borrower_delinquency_rate).toFixed(2)}% / {(Number(pieChartData[i].datasets[0].tooltip.otherMixedDelinquent) / Number(pieChartData[i].datasets[0].tooltip.totalDelinquent) * 100).toFixed(2)}%</p>
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

export default memo(DelinquencyByRace)