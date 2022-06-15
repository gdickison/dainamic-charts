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
import { Bar } from "react-chartjs-2"

import { useEffect, useState } from "react"

const DelinquencyByOriginalBalance = ({dateRange, targetRegion, compRegions}) => {
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
    const JSONdata = JSON.stringify({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      msaCode: targetRegion.msaCode
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
        var minupb = Math.min.apply(Math, data.map(function(o) {
          return o.original_upb; }));
        var maxupb = Math.max.apply(Math, data.map(function(o) {
          return o.original_upb; }));

        const numBrackets = Math.floor(Number((maxupb / divisor) + 1))

        for(let i = 0; i < numBrackets; i++){
          const bracket = `$${(Math.ceil(Number((minupb + (i * divisor)) / divisor) - 1) * divisor).toLocaleString()} - $${((Math.ceil(Number((minupb + (i * divisor)) / divisor)) * divisor) - 1).toLocaleString()}`
          data.map(row => {
            if(row.original_upb >= (Math.ceil(Number((minupb + (i * divisor)) / divisor) - 1) * divisor) && row.original_upb <= ((Math.ceil(Number((minupb + (i * divisor)) / divisor)) * divisor) - 1)){
              row.bracket = bracket
            }
          })
        }

        const filteredData = data.reduce((a, v) => {
          if(a[v.bracket]){
            a[v.bracket].current = Number(a[v.bracket].current) + Number(v.current)
            a[v.bracket].delinquent = Number(a[v.bracket].delinquent) + Number(v.delinquent)
            a[v.bracket].total_loans = Number(a[v.bracket].total_loans) + Number(v.total_loans)
          } else {
            a[v.bracket] = v
          }
          return a
        }, {})

        const labels = []
        const dataset = []
        for(const row of Object.values(filteredData)){
          let delinquencyRate = parseFloat((Number(row.delinquent) / Number(row.total_loans)) * 100).toFixed(2)
          if(delinquencyRate > 0 && delinquencyRate < 100){
            labels.push(row.bracket)
            dataset.push({
              x: row.original_upb,
              y: delinquencyRate,
              totalAtUpb: row.total_loans,
              delinquentAtUpb: row.delinquent
            })
          }
        }

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Delinquency by Original UPB",
              data: dataset,
              backgroundColor: [
                '#e5f6ff',
                '#bae6ff',
                '#82cfff',
                '#33b1ff',
                '#1192ff',
                '#0072ff',
                '#0053ff',
                '#003aff'
              ],
              hoverBorderColor: "#111827",
              hoverBorderWidth: 3
            }
          ]
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
                display: false
              },
              tooltip: {
                callbacks: {
                  beforeTitle: function(context){
                    return `Range: ${context[0].label}`
                  },
                  title: function(context){
                    return `Total in range: ${context[0].raw.totalAtUpb}`
                  },
                  afterTitle: function(context){
                    return `Delinquent in range: ${context[0].raw.delinquentAtUpb}`
                  },
                  label: function(context){
                    return `Delinquecy rate for range: ${context.raw.y}%`
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
                  callback: function(value, index, ticks){
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
  }, [dateRange.endDate, targetRegion.msaCode, dateRange.startDate, divisor])

  if(isLoading){
    return <Loader loadiingText={"Getting original loan balance data..."}/>
  }

  return (
    <div>
      <ChartHeaderWithTooltip
        chartName={"Delinquency By Original Balance"}
        msa={targetRegion.msaName}
        tooltip={"Original balances (OUPB) are grouped into the selected increment (default $50,000). Delinquent loans with a given OUPB are divided by the total loans at that OUPB to show the delinquency rate. Delinquency rates of 0% are not shown. Delinquency rates of 100% generally indicate an anomally based on a very small number of loans at the given data point and are also excluded. Hover over the bars to see details"}
      />
      <section className="-mt-2 mb-8">
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