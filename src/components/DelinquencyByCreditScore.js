import { useState, useEffect } from "react"

const DelinquencyByCreditScore = ({params}) => {
  const [msaName, setMsaName] = useState()
  const [chartData, setChartData] = useState()

  const getLoanStatusByCreditScore = async () => {
    const JSONdata = JSON.stringify({
      msaCode: params.msaCode,
      startDate: params.startDate,
      endDate: params.endDate
    })

    const endpoint = `/api/get_loan_status_by_credit_score`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }
    const response = await fetch(endpoint, options)
    let status = response.status
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error getting the loan status by credit score")
    } else if(status === 200){
      const labels = []
      for(let i = 0; i < data.length; i++){
        labels.push(data[i].origination_date.split('T')[0])
      }
    }
  }

  const getMsaName = async () => {
    const JSONdata = JSON.stringify({
      msaCode: params.msaCode
    })

    const endpoint = `/api/get_msa_name`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }
    const response = await fetch(endpoint, options)
    const status = response.status
    let data = await response.json()
    data = data.response

    if(status === 404){
      console.log("There was an error getting the msa name")
    } else if(status === 200){
      setMsaName(data)
    }
  }

  useEffect(() => {
    getLoanStatusByCreditScore()
    getMsaName()
  }, [params])


  return (
    <>
      {msaName &&
        <h1 className="my-6 text-4xl">Delinquency By Credit Score for {msaName}</h1>
      }
    </>
  )
}

export default DelinquencyByCreditScore