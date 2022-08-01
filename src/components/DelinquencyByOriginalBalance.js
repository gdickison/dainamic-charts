import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

import Loader from "./Loader"
import ChartHeaderWithTooltip from "./ChartHeaderWithTooltip"
import ChartDescription from "./ChartDescription"
import { Bar } from "react-chartjs-2"
import { groupDataByMsa, chartSolidColors, chartFadedColors } from "../../public/utils"

import { useEffect, useState } from "react"

const DelinquencyByOriginalBalance = ({dateRange, selectedRegions}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()
  const [divisor, setDivisor] = useState(50000)

  const handleChange = e => {
    e.preventDefault()
    setDivisor(e.target.value)
  }

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

    const endpoint = `/api/get_delinquency_by_original_balance`
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
        // Set up the data for a bar chart divided into increments
        const minupb = Math.min.apply(Math, data.map(function(o) {
          return o.original_upb; }));
        const maxupb = Math.max.apply(Math, data.map(function(o) {
          return o.original_upb; }));
        const numBrackets = Math.floor(Number((maxupb / divisor) + 1))

        const groupedData = groupDataByMsa(data, "msa")

        for(let i = 0; i < numBrackets; i++){
          const bracket = `$${(Math.ceil(Number((minupb + (i * divisor)) / divisor) - 1) * divisor).toLocaleString()} - $${((Math.ceil(Number((minupb + (i * divisor)) / divisor)) * divisor) - 1).toLocaleString()}`
          Object.values(groupedData).map(group => {
            group.map(row => {
              if(row.original_upb >= (Math.ceil(Number((minupb + (i * divisor)) / divisor) - 1) * divisor) && row.original_upb <= ((Math.ceil(Number((minupb + (i * divisor)) / divisor)) * divisor) - 1)){
                row.bracket = bracket
              }
            })
          })
        }

        const filteredData = []
        Object.values(groupedData).map(value => {
          filteredData.push(value.reduce((a, v) => {
            if(a[v.bracket]){
              a[v.bracket].current = Number(a[v.bracket].current) + Number(v.current)
              a[v.bracket].delinquent = Number(a[v.bracket].delinquent) + Number(v.delinquent)
              a[v.bracket].total_loans = Number(a[v.bracket].total_loans) + Number(v.total_loans)
            } else {
              a[v.bracket] = v
            }
            return a
          }, {}))
        })

        const datasets = []
        const labels = []
        filteredData.map((region, i) => {
          const dataArray = []
          const tooltipArray = []
          for(const [key, value] of Object.entries(region)){
            value.delinquencyRate =  parseFloat((Number(value.delinquent) / Number(value.total_loans)) * 100).toFixed(2)
            value.name = selectedRegions.find(row => row.msa === value.msa).name
            dataArray.push(value.delinquencyRate)
            tooltipArray.push({
              totalAtUpb: value.total_loans,
              delinquentAtUpb: value.delinquent,
              msa: value.msa,
              name: value.name
            })
            if(labels.indexOf(key) === -1){
              labels.push(key)
            }
          }
          datasets.push({
            label: region[Object.keys(region)[0]].name,
            data: dataArray,
            tooltip: tooltipArray,
            backgroundColor: chartFadedColors[i],
            borderColor: chartSolidColors[i],
            hoverBackgroundColor: chartSolidColors[i],
            borderWidth: 3,
            msa: region[Object.keys(region)[0]].msa
          })
        })

        setChartData({
          labels: labels,
          datasets: datasets
        })

        setChartOptions(
          {
            responsive: true,
            aspectRatio: 2.5,
            plugins: {
              title: {
                display: false
              },
              legend: {
                display: true
              },
              tooltip: {
                callbacks: {
                  title: function(context){
                    return `${context[0].dataset.label}`
                  },
                  beforeBody: function(context){
                    return [
                      `Range: ${context[0].label}`,
                      `Total in range: ${context[0].dataset.tooltip[context[0].dataIndex].totalAtUpb}`,
                      `Delinquent in range: ${context[0].dataset.tooltip[context[0].dataIndex].delinquentAtUpb}`
                    ]
                  },
                  label: function(context){
                    return `Delinquecy rate for range: ${context.raw}%`
                  }
                }
              }
            },
            scales: {
              y: {
                title: {
                  display: true,
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
                grace: 5,
                beginAtZero: true
              },
              x: {
                title: {
                  display: true,
                  text: "Original Balance",
                  padding: 20,
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
        )

        setLoading(false)
      })
  }, [dateRange.endDate, selectedRegions, dateRange.startDate, divisor])

  if(isLoading){
    return <Loader loadiingText={"Getting original loan balance data..."}/>
  }

  return (
    <div>
      <ChartHeaderWithTooltip
        chartName={"Delinquency By Original Balance"}
        msa={selectedRegions.length === 1 ? selectedRegions[0].name : "selected regions"}
        tooltip={"Original balances (OUPB) are grouped into the selected increment (default $50,000). Delinquent loans with a given OUPB are divided by the total loans at that OUPB to show the delinquency rate. Delinquency rates of 0% are not shown. Delinquency rates of 100% generally indicate an anomally based on a very small number of loans at the given data point and are also excluded. Hover over the bars to see details"}
      />
      <ChartDescription
        description={`Hover over a bar to see specific details. Click the legend to show and hide datasets.`}
      />
      <section className="mt-2 mb-8">
        <form action="#">
          <label className="text-xl mr-2" htmlFor="increment">Select Increment</label>
          <select className="mx-2 w-max text-center md:text-left md:px-2 border-2 border-blue-400 bg-white rounded-md text-xl" name="increment" id="increment" defaultValue={divisor} onChange={handleChange}>
            <option disabled></option>
            <option key="10000" value="10000">$10,000</option>
            <option key="25000" value="25000">$25,000</option>
            <option key="50000" value="50000">$50,000</option>
            <option key="100000" value="100000">$100,000</option>
          </select>
        </form>
      </section>
      {chartData &&
        <Bar data={chartData} options={chartOptions} />
      }
    </div>
  )
}

export default DelinquencyByOriginalBalance