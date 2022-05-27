import { useState, useEffect } from "react"
import DelinquencyByBalance from "./DelinquencyByBalance"
import DelinquencyByCreditScore from "./DelinquencyByCreditScore"
import DelinquencyByDTI from "./DelinquencyByDTI"
import DelinquencyByEducation from "./DelinquencyByEducation"
import DelinquencyByFTBStatus from "./DelinquencyByFTBStatus"
import DelinquencyByInterestRate from "./DelinquencyByInterestRate"
import DelinquencyByLoanBalance from "./DelinquencyByLoanBalance"
import DelinquencyByLoanTerm from "./DelinquencyByLoanTerm"
import DelinquencyByLTV from "./DelinquencyByLTV"
import DelinquencyByNumberOfBorrowers from "./DelinquencyByNumberOfBorrowers"
import DelinquencyByRace from "./DelinquencyByRace"
import DelinquencyByUnemploymentRate from "./DelinquencyByUnemploymentRate"
import Loader from "./Loader"

const TopFeatures = ({params, msaName}) => {
  const [isLoading, setLoading] = useState(false)
  const [topFeatures, setTopFeatures] = useState()

  useEffect(() => {
    setLoading(true)
    const JSONdata = JSON.stringify({
      msaCode: params.msaCode
    })

    const endpoint = `/api/get_top_features`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    fetch(endpoint, options)
      .then(res => res.json())
      .then(data => {
        setTopFeatures(Object.values(data.response))
        setLoading(false)
      })
  }, [params.msaCode])

  if(isLoading) {
    return <Loader/>
  }

  return (
    <section className="mx-auto px-0 md:px-24">
      <header>
        <h1 className="my-6 text-3xl">Top Five Delinquency Factors</h1>
        <div className="flex flex-col md:flex-row justify-between">
          {topFeatures &&
            topFeatures.map((feature, i) => {
              return (
                <div key={i} className="w-full md:w-[18%] border-2 border-blue-400 rounded-md p-4">
                  <h1 className="w-full text-xl">
                    {i+1} - {feature}
                  </h1>
                </div>
              )
            })
          }
        </div>
      </header>
      <div className="space-y-6">
        {topFeatures && topFeatures.map((feature, i) => {
          switch(feature) {
            case "Credit Score":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByCreditScore
                    params={params}
                    msaName={msaName}
                  />
                </div>
              );
            case "Debt-to-Income":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByDTI
                    params={params}
                    msaName={msaName}
                  />
                </div>
              );
            case "Education":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByEducation
                    params={params}
                    msaName={msaName}
                  />
                </div>
              );
            case "First Time Buyer Status":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByFTBStatus
                    params={params}
                    msaName={msaName}
                  />
                </div>
              );
            case "High Balance":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByBalance
                    params={params}
                    msaName={msaName}
                  />
                </div>
              );
            case "Interest Rate":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByInterestRate
                    params={params}
                    msaName={msaName}
                  />
                </div>
              );
            case "Loan Balance":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByLoanBalance
                    params={params}
                    msaName={msaName}
                  />
                </div>
              );
            case "Loan Term":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByLoanTerm
                    params={params}
                    msaName={msaName}
                  />
                </div>
              );
            case "Loan-to-Value":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByLTV
                    params={params}
                    msaName={msaName}
                  />
                </div>
              );
            case "Number of Borrowers":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByNumberOfBorrowers
                    params={params}
                    msaName={msaName}
                  />
                </div>
              );
            case "Race":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByRace
                    params={params}
                    msaName={msaName}
                  />
                </div>
              );
            case "Unemployment Rate":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByUnemploymentRate
                    params={params}
                    msaName={msaName}
                  />
                </div>
              );
          }
        })}
      </div>
    </section>
  )
}

export default TopFeatures