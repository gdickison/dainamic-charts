import dynamic from "next/dynamic"

import { useState, useEffect, Suspense } from "react"
import DelinquencyByCreditScore from "./DelinquencyByCreditScore"
import DelinquencyByCreditScoreByPeriod from "./DelinquencyByCreditScoreByPeriod"
import DelinquencyByDTI from "./DelinquencyByDTI"
import DelinquencyByEducation from "./DelinquencyByEducation"
import DelinquencyByFTBStatus from "./DelinquencyByFTBStatus"
import DelinquencyByInterestRate from "./DelinquencyByInterestRate"
import DelinquencyByHighBalance from "./DelinquencyByHighBalance"
import DelinquencyByOriginalBalance from "./DelinquencyByOriginalBalance"
import DelinquencyByLoanTerm from "./DelinquencyByLoanTerm"
import DelinquencyByLTV from "./DelinquencyByLTV"
import DelinquencyByNumberOfBorrowers from "./DelinquencyByNumberOfBorrowers"
import DelinquencyByRace from "./DelinquencyByRace"
import DelinquencyByUnemploymentRate from "./DelinquencyByUnemploymentRate"
import Loader from "./Loader"

const DynamicComponent = dynamic(() => import('./lazyComponent'), {
  suspense: true
})

const TopFeatures = ({dateRangeParams, targetRegionParams, compRegionsParams, regionalDelinquencyRates}) => {
  const [isLoading, setLoading] = useState(false)
  const [regionalTopFeatures, setRegionalTopFeatures] = useState()
  const [featuresList, setFeaturesList] = useState()

  const getTopFeaturesForRegions = async () => {
    setLoading(true)

    const msaCodes = compRegionsParams.map(region => {
      return region.msa
    })
    const JSONdata = JSON.stringify({
      msaCodes: msaCodes
    })

    const endpoint = `/api/get_top_features`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSONdata
    }

    let topFeaturesResponse = await fetch(endpoint, options)
    topFeaturesResponse = await topFeaturesResponse.json()
    topFeaturesResponse = topFeaturesResponse.response

    let featuresOnly = []
    topFeaturesResponse.forEach(row => {
      for(const [key, value] of Object.entries(row)){
        if(key !== 'msa' && key !== 'name'){
          featuresOnly.push(value)
        }
      }
    })

    featuresOnly = [...new Set(featuresOnly)]

    setRegionalTopFeatures(topFeaturesResponse)
    setFeaturesList(featuresOnly)
    setLoading(false)
  }
  useEffect(() => {
    getTopFeaturesForRegions()
  }, [compRegionsParams])

  if(isLoading) {
    return <Loader loadiingText={"Getting the top delinquency predictors..."}/>
  }

  return (
    <>
    <section className="border-[1px] border-gray-200 rounded-md shadow-md p-6 mx-10 my-2">
      <div className="flex items-center space-x-4">
        <img className="h-12" src="/five.svg" alt="" />
        <h1 className="text-[1.4vw] font-bold py-4">
          Top Five Delinquency Predictors
        </h1>
      </div>
      <header className="flex space-x-6 justify-evenly">
        <div className="flex flex-col justify-center w-full">
          {regionalTopFeatures &&
            regionalTopFeatures.map((region, idx) => {
              return (
                <div key={idx}>
                  <h1 className="my-6 text-[1.2vw] font-semibold">{`${region.name.split(",")[0]}`}</h1>
                  <div className="flex space-x-2">
                    {Object.entries(region).map((row, idx) => {
                      if(!row.includes('msa') && !row.includes('name')){
                        return (
                          <div key={row[0]} className="flex flex-col w-full border-4 border-blue-400 rounded-md py-4 space-y-2">
                            <h1 className="w-full text-[1.2vw] text-center text-blue-500 font-bold">
                              {row[0].split("feat")[1]}
                            </h1>
                            <h1 className="w-full text-2xl text-center">
                              {row[1] === "Loan Balance" ? "Original Loan Balance" : row[1]}
                            </h1>
                          </div>
                        )
                      }
                    })}
                  </div>
                </div>
              )
            })
          }
        </div>
      </header>
    </section>
      <div className="space-y-6">
        {featuresList && featuresList.map((feature, i) => {
          switch(feature) {
            case "Credit Score":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4 divide-y-2">
                  <div key={`credit_score_by_period_${i}`} >
                    <DelinquencyByCreditScoreByPeriod
                      dateRange={dateRangeParams}
                      selectedRegions={compRegionsParams}
                    />
                  </div>
                  <div key={`credit_score_${i}`} >
                    <DelinquencyByCreditScore
                      dateRange={dateRangeParams}
                      selectedRegions={compRegionsParams}
                    />
                  </div>
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
                    targetRegion={targetRegionParams}
                    selectedRegions={compRegionsParams}
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
            case "High Balance":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByHighBalance
                    dateRange={dateRangeParams}
                    targetRegion={targetRegionParams}
                    compRegions={compRegionsParams}
                  />
                </div>
              );
            case "Interest Rate":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByInterestRate
                    dateRange={dateRangeParams}
                    selectedRegions={compRegionsParams}
                  />
                </div>
              );
            case "Loan Balance":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByOriginalBalance
                    dateRange={dateRangeParams}
                    selectedRegions={compRegionsParams}
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
                    selectedRegions={compRegionsParams}
                  />
                </div>
              );
            case "Race":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByRace
                    selectedRegions={compRegionsParams}
                  />
                </div>
              );
            case "Unemployment Rate":
              return (
                <div key={i} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByUnemploymentRate
                    dateRange={dateRangeParams}
                    selectedRegions={compRegionsParams}
                  />
                </div>
              );
          }
        })}
      </div>
      <div>
        <Suspense fallback={`Loading...`}>
          <DynamicComponent/>
        </Suspense>
      </div>
    </>
  )
}

export default TopFeatures