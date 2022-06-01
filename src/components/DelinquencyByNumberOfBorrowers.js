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
import { Bar } from "react-chartjs-2"
import { useState, useEffect } from "react"

const DelinquencyByNumberOfBorrowers = ({params, msaName}) => {
  const [isLoading, setLoading] = useState(false)
  const [chartData, setChartData] = useState()
  const [chartOptions, setChartOptions] = useState()

  useEffect(() => {
    setLoading(true)
    const JSONdata = JSON.stringify({
      msaCode: params.msaCode,
      startDate: params.startDate,
      endDate: params.endDate
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
        console.log(data)
        const borrowersData = {
          labels: [],
          datasets: [
              {
                label: "1 Borrower",
                backgroundColor: "#33b1ff",
                borderColor: "#33b1ff",
                borderWidth: 1,
                data: []
              },
              {
                label: "2 Borrowers",
                backgroundColor: "#003a6d",
                borderColor: "#003a6d",
                borderWidth: 1,
                data: []
              }
            ]
        }

        data.map((row, i) => {
          if(i % 2 === 0){
            borrowersData.labels.push(row.origination_date.split('T')[0])
          }
          if(row.num_borrowers === 1){
            borrowersData.datasets[0].data.push(((row.delinquent / row.total_loans) * 100).toFixed(2))
          } else {
            borrowersData.datasets[1].data.push(((row.delinquent / row.total_loans) * 100).toFixed(2))
          }
        })

        const ftbsChartOptions = {
          responsive: true,
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: "Something Goes Here"
          }
        }

        setChartData(borrowersData)
        setChartOptions(ftbsChartOptions)
        setLoading(false)
      })
  }, [params])

  if(isLoading){
    return <Loader/>
  }

  return (
    <>
      {msaName &&
      <>
        <h1 className="my-6 text-3xl">Delinquency By Number of Borrowers for {msaName}</h1>
        <div>
          {chartData &&
            <Bar data={chartData} options={chartOptions} />
          }
        </div>
        </>
      }
    </>
  )
}

export default DelinquencyByNumberOfBorrowers