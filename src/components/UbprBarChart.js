import { memo } from "react";
import { Bar } from "react-chartjs-2";
import ChartDescription from "./ChartDescription";
import { rconCodesNames } from "../../public/utils";

const UbprBarChart = ({bankData, statsData, selectedMetric}) => {
  const rawChartData = statsData

  const labels = rawChartData.map(bank => {
    return bank.QUARTER
  })

  const dataArray = rawChartData.map(bank => {
    return bank[selectedMetric]
  })

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'chart',
      data: dataArray,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)'
      ],
      borderWidth: 1
    }]
  }

  const chartTitle = rconCodesNames.filter(rcon => rcon.code === selectedMetric)[0].text

  const singleBarChartOptions = {
    responsive: true,
    aspectRatio: 2.5,
    interaction: {
      intersect: false
    },
    plugins: {
      title: {
        display: true,
        text: `${chartTitle}`
      },
      legend: {
        display: false,
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
            return `${context.dataset.label}: ${context.raw}`
          }
        },
        boxPadding: 6
      }
    },
    scales: {
      y: {
        stacked: true,
        title: {
          display: false,
          text: "Number of Loans",
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
          // stepSize: 10
        },
        // max: 100,
        grid: {
          display: false
        }
      },
      x: {
        stacked: true,
        title: {
          display: false,
          text: "Quarter",
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
        {/* <div className="relative my-4">
          <h1 className="inline text-2xl">UBPR Bar Chart Title</h1>
        </div> */}
        {/* <ChartDescription
          description={`This chart shows respondents' age brackets as a percentage of the entire sample, as well as the average age of the respondents. Hover over the bar chart to see the percentage for a particular age bracket, and the number of respondents in that age bracket.`}
        /> */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-6">
          {/* {rawAgeBracketData && rawAgeBracketData.map((row, idx) => {
            const chartData = {
              labels: labels,
              datasets: row
            }
            return ( */}
              <div>
                <div className="flex justify-center">
                  {/* <h1 className="font-semibold">{row[0].title}</h1> */}
                </div>
                <div className="flex justify-center p-4 shadow-lg bg-gray-50">
                  <Bar data={chartData} options={singleBarChartOptions}/>
                </div>
              </div>
            {/* )
          })} */}
        </div>
      </div>
    </div>
  )
}

export default UbprBarChart

// {ubprRconData.map((row, i) => {
//   return row.map((quarter) => {
//     return (Object.entries(quarter).map(([key, value], idx) => {
//       if(value !== null){
//         return (
//           <div key={`${i}-${idx}`}>
//             <p>{key} - {value}</p>
//           </div>
//         )
//       }
//     }))

//   })
// })}