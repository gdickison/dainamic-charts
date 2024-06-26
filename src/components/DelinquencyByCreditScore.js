import ChartTitle from "./ChartTitle"
import ChartDescription from "./ChartDescription"
import { Bar, Doughnut } from "react-chartjs-2"
import { chartSolidColors, chartFadedColors } from "../../public/utils"
import { memo } from "react"

const DelinquencyByCreditScore = ({data}) => {
  const barLabels = []
  const barFair = []
  const barGood = []
  const barVeryGood = []
  const barExceptional = []
  const tooltipFair = []
  const tooltipGood = []
  const tooltipVeryGood = []
  const tooltipExceptional = []

  const startDate = new Date(data[0].start_date).toLocaleDateString('en-us', {year: "numeric", month: "long", day: "numeric"})
  const endDate = new Date(data[0].end_date).toLocaleDateString('en-us', {year: "numeric", month: "long", day: "numeric"})

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
          title: function(context){
            return context[0].dataset.label
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
          callback: function(value){
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

  const pieOptions = {
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
        position: "nearest",
        callbacks: {
          title: function(context){
            return `${context[0].label}`
          },
          beforeLabel: function(context){
            return [
              `Delinquent in region: ${context.dataset.tooltip.delinquent}`,
              `Delinquent in range: ${context.dataIndex === 0
                ? context.dataset.tooltip.fairDelinquent
                : context.dataIndex === 1
                  ? context.dataset.tooltip.goodDelinquent
                  : context.dataIndex === 2
                    ? context.dataset.tooltip.veryGoodDelinquent
                    : context.dataset.tooltip.exceptionalDelinquent}`
            ]
          },
          label: function(context){
            return [`Share: ${context.raw}%`]
          }
        },
        boxPadding: 6
      },
      rotation: 180
    },
    radius: '95%',
    hoverOffset: 10
  }

  return (
    <>
      {barChartStructuredData && pieChartStructuredData &&
        <div className="h-max">
          <ChartTitle
            chartTitle={"Delinquency Rate by Credit Score"}
            msa={data.length === 1 ? data[0].region_name : "Selected Regions"}
          />
          <ChartDescription
            description={`Credit scores are grouped into standard ranges corresponding to 'Fair', 'Good', 'Very Good', and 'Exceptional'. The number of delinquent loans for each range in each period is divided by the corresponding total number of loans to get the delinquency rate. Delinquency rates of 0% are not shown. Delinquency rates of 100% generally indicate an anomally based on a very small number of loans at the given data point and are also excluded. The bar chart shows the delinquency rate within each credit score category. The doughnut chart shows each credit score category's share of ${barChartStructuredData.labels.length === 1 ? 'the' : 'each'} corresponding region's delinquency rate.`}
          />
          <div className="flex justify-around w-full">
            <div className="w-1/3 justify-evenly flex flex-col">
              {barChartStructuredData && barChartStructuredData.labels.map((label, i) => {
                return (
                  <div key={i} className="flex flex-col space-y-1 p-4 shadow-lg bg-gray-50">
                    <p className="pl-3 py-2 text-xl font-medium">{label.split(',')[0]}</p>
                    <ul className="pl-5 text-base space-y-2">
                      <li>In the {label} Region <span className="font-semibold">{Number(barChartStructuredData.datasets[0].tooltip[i].regionalTotal).toLocaleString()}</span> loans were originated from {startDate} through {endDate}</li>
                      <li>Of those loans <span className="font-semibold">{Number(barChartStructuredData.datasets[0].tooltip[i].regionalDelinquent).toLocaleString()}</span> are delinquent, resulting in a Regional Delinquency Rate of <span className="font-semibold">{barChartStructuredData.datasets[0].tooltip[i].regionalDelinquencyRate}%</span></li>
                    </ul>
                  </div>
                )
              })}
            </div>
            <div className="flex flex-col justify-center items-center space-y-8 px-12 py-4 w-7/12">
              {barChartStructuredData &&
                <>
                  <p>Delinquency Rate By Credit Score Range</p>
                  <div className="flex w-11/12">
                    <Bar data={barChartStructuredData} options={barOptions} />
                  </div>
                </>
              }
              {pieChartStructuredData &&
                <>
                  <p>Credit Score Range Share of Regional Delinquency Rate</p>
                  <div className="flex">
                    {pieChartStructuredData.map((chart, i) => {
                      return (
                        <div key={i} className="flex">
                          <Doughnut data={chart} options={pieOptions} width={230} />
                        </div>
                      )
                    })}
                  </div>
                </>
              }
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default memo(DelinquencyByCreditScore)