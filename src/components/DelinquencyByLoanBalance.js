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

import { Bar, Scatter } from "react-chartjs-2"

import { useEffect, useState } from "react"

const DelinquencyByLoanBalance = ({params, msaName}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()
  const [divisor, setDivisor] = useState(50000)

  useEffect(() => {
    setLoading(true)
    const JSONdata = JSON.stringify({
      startDate: params.startDate,
      endDate: params.endDate,
      msaCode: params.msaCode
    })
    const endpoint = `/api/get_delinquency_by_balance`
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
        console.log('data', data)

        // Set up the data for a bar chart divided into increments

        var minupb = Math.min.apply(Math, data.map(function(o) {
          return o.original_upb; }));
        var maxupb = Math.max.apply(Math, data.map(function(o) {
          return o.original_upb; }));

        const numBrackets = Math.floor(Number((maxupb / divisor) + 1))
        const bracketsArray = []
        for(let i = 0; i < numBrackets; i++){
          bracketsArray.push(`${Math.ceil(Number((minupb + (i * divisor)) / divisor) - 1) * divisor} - ${(Math.ceil(Number((minupb + (i * divisor)) / divisor)) * divisor) - 1}`)
          const bracket = `${Math.ceil(Number((minupb + (i * divisor)) / divisor) - 1) * divisor} - ${((Math.ceil(Number((minupb + (i * divisor)) / divisor)) * divisor) - 1)}`
          data.map(row => {
            if(row.original_upb >= (Math.ceil(Number((minupb + (i * divisor)) / divisor) - 1) * divisor) && row.original_upb <= ((Math.ceil(Number((minupb + (i * divisor)) / divisor)) * divisor) - 1)){
              row.bracket = bracket
            }
          })
        }

        const filteredData = data.reduce((a, v) => {
          if(a[v.bracket]){
            a[v.bracket].current_at_upb = Number(a[v.bracket].current_at_upb) + Number(v.current_at_upb)
            a[v.bracket].delinquent_at_upb = Number(a[v.bracket].delinquent_at_upb) + Number(v.delinquent_at_upb)
            a[v.bracket].total_at_upb = Number(a[v.bracket].total_at_upb) + Number(v.total_at_upb)
            a[v.bracket].total_loans = Number(a[v.bracket].total_loans) + Number(v.total_loans)
          } else {
            a[v.bracket] = v
          }
          return a
        }, {})

        console.log('filteredData', filteredData)

        const labels = []
        const dataset = []
        for(const row of Object.values(filteredData)){
          let delinquencyRate = parseFloat((Number(row.delinquent_at_upb) / Number(row.total_at_upb)) * 100).toFixed(2)
          if(delinquencyRate > 0 && delinquencyRate < 100){
            labels.push(row.bracket)
            dataset.push({
              x: row.original_upb,
              y: delinquencyRate,
              totalAtRate: row.total_at_upb,
              delinquentAtRate: row.delinquent_at_upb
            })
          }
        }
console.log('dataset', dataset)
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
              ]
            }
          ]
        })

        setChartOptions(
          {
            responsive: true,
            plugins: {
              title: {
                display: false
              },
              legend: {
                display: false
              }
            }
          }
        )

        setLoading(false)
      })
  }, [params.endDate, params.msaCode, params.startDate, divisor])

  return (
    <div>
      <h1 className="my-6 text-3xl">Delinquency By Original UPB for {msaName}</h1>
      <section>
        <form action="#">
          <label htmlFor="increment">
            <select name="increment" id="increment" onChange={e => setDivisor(e.target.value)}>
              <option key="10000" value="10000">10000</option>
              <option key="25000" value="25000">25000</option>
              <option key="50000" value="50000" selected>50000</option>
              <option key="100000" value="100000">100000</option>
            </select>
          </label>
        </form>
      </section>
      <div>
          {chartData &&
            <Bar data={chartData} options={chartOptions} />
          }
        </div>
    </div>
  )
}

export default DelinquencyByLoanBalance