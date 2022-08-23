import { Bar, Pie } from "react-chartjs-2"
import { memo } from "react"
import ChartTitle from "./ChartTitle"
import ChartDescription from "./ChartDescription"
import { chartFadedColors, chartSolidColors, split } from "./../../public/utils"

const DelinquencyByEducation = ({data}) => {
  const barLabels = []
  const barDataLessThanHS = []
  const barDataSomeCollege = []
  const barDataCollegeDegree = []
  const barDataPostGrad = []
  const bartooltipLessThanHS = []
  const bartooltipSomeCollege = []
  const bartooltipCollegeDegree = []
  const bartooltipPostGrad = []

  data.map(row => {
    barLabels.push(row.name)
    barDataLessThanHS.push(row.less_than_hs)
    barDataSomeCollege.push(row.some_college)
    barDataCollegeDegree.push(row.college_degree)
    barDataPostGrad.push(row.college_post_grad)
    bartooltipLessThanHS.push({
      name: row.name,
      region_delinquency_rate: row.delinquency_rate,
      borrower_delinquency_rate: row.less_than_hs
    })
    bartooltipSomeCollege.push({
      name: row.name,
      region_delinquency_rate: row.delinquency_rate,
      borrower_delinquency_rate: row.some_college
    })
    bartooltipCollegeDegree.push({
      name: row.name,
      region_delinquency_rate: row.delinquency_rate,
      borrower_delinquency_rate: row.college_degree
    })
    bartooltipPostGrad.push({
      name: row.name,
      region_delinquency_rate: row.delinquency_rate,
      borrower_delinquency_rate: row.college_post_grad
    })
  })

  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        type: "bar",
        label: "< High School Diploma",
        backgroundColor: chartFadedColors[0],
        borderColor: chartSolidColors[0],
        hoverBackgroundColor: chartSolidColors[0],
        borderWidth: 3,
        data: barDataLessThanHS,
        tooltip: bartooltipLessThanHS,
        order: 1
      },
      {
        type: "bar",
        label: "Some College",
        backgroundColor: chartFadedColors[1],
        borderColor: chartSolidColors[1],
        hoverBackgroundColor: chartSolidColors[1],
        borderWidth: 3,
        data: barDataSomeCollege,
        tooltip: bartooltipSomeCollege,
        order: 2
      },
      {
        type: "bar",
        label: "College Degree",
        backgroundColor: chartFadedColors[2],
        borderColor: chartSolidColors[2],
        hoverBackgroundColor: chartSolidColors[2],
        borderWidth: 3,
        data: barDataCollegeDegree,
        tooltip: bartooltipCollegeDegree,
        order: 3
      },
      {
        type: "bar",
        label: "Post Grad",
        backgroundColor: chartFadedColors[3],
        borderColor: chartSolidColors[3],
        hoverBackgroundColor: chartSolidColors[3],
        borderWidth: 3,
        data: barDataPostGrad,
        tooltip: bartooltipPostGrad,
        order: 4
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
        "< High School Diploma",
        "Some College",
        "College Degree",
        "Post Grad"
      ],
      datasets: [
        {
          label: `${region.name}`,
          data: [
            (Number(region.less_than_hs) / Number(region.delinquency_rate)) * 100,
            (Number(region.some_college) / Number(region.delinquency_rate)) * 100,
            (Number(region.college_degree) / Number(region.delinquency_rate)) * 100,
            (Number(region.college_post_grad) / Number(region.delinquency_rate)) * 100
          ],
          tooltip: {
            totalDelinquent: region.delinquency_rate,
            hsDelinquent: region.less_than_hs,
            someCollegeDelinquent: region.some_college,
            collegeDegreeDelinquent: region.college_degree,
            postGradDelinquent: region.college_post_grad
          },
          backgroundColor: chartFadedColors.slice(0, 4),
          borderColor: chartSolidColors.slice(0, 4),
          hoverBackgroundColor: chartSolidColors.slice(0, 4)
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
          beforeTitle: function(context){
            return context[0].label
          },
          title: function(){
            return null
          },
          label: function(context){
            return `Share: ${Number(context.raw).toFixed(2)}%`
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
      <ChartTitle
        chartName={"Delinquency By Education"}
        msa={data.length === 1 ? data[0].name : "Selected Regions"}
      />
      <div>
        <ChartDescription
          description={"Dainamic's model determines what part of a region's overall delinquency rate is attributable to each available level of education. For each region, the overall regional delinquecy rate is shown, the delinquency rate for each educational level, and the education level's proportional share of the overall regional delinquency rate. Education data is not broken down by month, so delinquency is aggragated for all available dates rather than selected start and end dates."}
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
                  <p>&lt; High School Diploma Delinquency - Rate / Share:</p>
                  <p>{Number(barChartData.datasets[0].tooltip[i].borrower_delinquency_rate).toFixed(2)}% / {(Number(pieChartData[i].datasets[0].tooltip.hsDelinquent) / Number(pieChartData[i].datasets[0].tooltip.totalDelinquent) * 100).toFixed(2)}%</p>
                </div>
                <div className="w-full flex justify-between">
                  <p>Some College Delinquency - Rate / Share:</p>
                  <p>{Number(barChartData.datasets[1].tooltip[i].borrower_delinquency_rate).toFixed(2)}% / {(Number(pieChartData[i].datasets[0].tooltip.someCollegeDelinquent) / Number(pieChartData[i].datasets[0].tooltip.totalDelinquent) * 100).toFixed(2)}%</p>
                </div>
                <div className="w-full flex justify-between">
                  <p>College Degree Delinquency - Rate / Share:</p>
                  <p>{Number(barChartData.datasets[2].tooltip[i].borrower_delinquency_rate).toFixed(2)}% / {(Number(pieChartData[i].datasets[0].tooltip.collegeDegreeDelinquent) / Number(pieChartData[i].datasets[0].tooltip.totalDelinquent) * 100).toFixed(2)}%</p>
                </div>
                <div className="w-full flex justify-between">
                  <p>Post Grad Delinquency - Rate / Share:</p>
                  <p>{Number(barChartData.datasets[3].tooltip[i].borrower_delinquency_rate).toFixed(2)}% / {(Number(pieChartData[i].datasets[0].tooltip.postGradDelinquent) / Number(pieChartData[i].datasets[0].tooltip.totalDelinquent) * 100).toFixed(2)}%</p>
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

export default memo(DelinquencyByEducation)