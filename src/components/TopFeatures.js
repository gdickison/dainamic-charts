import { useState, useEffect } from "react"
import DelinquencyByCreditScore from "./DelinquencyByCreditScore"
import DelinquencyByDTI from "./DelinquencyByDTI"
import DelinquencyByEducation from "./DelinquencyByEducation"
import DelinquencyByFTBStatus from "./DelinquencyByFTBStatus"
import DelinquencyByInterestRate from "./DelinquencyByInterestRate"
import DelinquencyByOriginalBalance from "./DelinquencyByOriginalBalance"
import DelinquencyByLoanTerm from "./DelinquencyByLoanTerm"
import DelinquencyByLTV from "./DelinquencyByLTV"
import DelinquencyByNumberOfBorrowers from "./DelinquencyByNumberOfBorrowers"
import DelinquencyByRace from "./DelinquencyByRace"
import DelinquencyByUnemploymentRate from "./DelinquencyByUnemploymentRate"
import Loader from "./Loader"

const TopFeatures = ({dateRangeParams, targetRegionParams, compRegionsParams, regionalDelinquencyRates}) => {
  const [isLoading, setLoading] = useState(false)
  const [topFeatures, setTopFeatures] = useState()

  useEffect(() => {
    setLoading(true)
    const JSONdata = JSON.stringify({
      msaCode: targetRegionParams.msaCode
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
  }, [])

  if(isLoading) {
    return <Loader/>
  }

  return (
    <section className="mx-auto px-0 md:px-24">
      <header>
        <h1 className="my-6 text-3xl">Top Five Delinquency Factors</h1>
        <div className="flex flex-col md:flex-row justify-between pb-6 space-x-4 h-40">
          {topFeatures &&
            topFeatures.map((feature, i) => {
              return (
                <div key={i} className="md:w-1/5 border-2 border-blue-400 rounded-md p-4">
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
                    dateRange={dateRangeParams}
                    targetRegion={targetRegionParams}
                    compRegions={compRegionsParams}
                  />
                </div>
              );
            case "Debt-to-Income":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByDTI
                    dateRange={dateRangeParams}
                    targetRegion={targetRegionParams}
                    compRegions={compRegionsParams}
                  />
                </div>
              );
            case "Education":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByEducation
                    dateRange={dateRangeParams}
                    targetRegion={targetRegionParams}
                    compRegions={compRegionsParams}
                    regionalDelinquencyRates={regionalDelinquencyRates}
                  />
                </div>
              );
            case "First Time Buyer Status":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByFTBStatus
                    dateRange={dateRangeParams}
                    targetRegion={targetRegionParams}
                    compRegions={compRegionsParams}
                  />
                </div>
              );
            {/* case "High Balance":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByHighBalance
                    dateRange={dateRangeParams}
                    targetRegion={targetRegionParams}
                    compRegions={compRegionsParams}
                  />
                </div>
              ); */}
            case "Interest Rate":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByInterestRate
                    dateRange={dateRangeParams}
                    targetRegion={targetRegionParams}
                    compRegions={compRegionsParams}
                  />
                </div>
              );
            case "Loan Balance":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByOriginalBalance
                    dateRange={dateRangeParams}
                    targetRegion={targetRegionParams}
                    compRegions={compRegionsParams}
                  />
                </div>
              );
            case "Loan Term":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByLoanTerm
                    dateRange={dateRangeParams}
                    targetRegion={targetRegionParams}
                    compRegions={compRegionsParams}
                  />
                </div>
              );
            case "Loan-to-Value":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByLTV
                    dateRange={dateRangeParams}
                    targetRegion={targetRegionParams}
                    compRegions={compRegionsParams}
                  />
                </div>
              );
            case "Number of Borrowers":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByNumberOfBorrowers
                    dateRange={dateRangeParams}
                    targetRegion={targetRegionParams}
                    compRegions={compRegionsParams}
                  />
                </div>
              );
            case "Race":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByRace
                    dateRange={dateRangeParams}
                    targetRegion={targetRegionParams}
                    compRegions={compRegionsParams}
                  />
                </div>
              );
            case "Unemployment Rate":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByUnemploymentRate
                    dateRange={dateRangeParams}
                    targetRegion={targetRegionParams}
                    compRegions={compRegionsParams}
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