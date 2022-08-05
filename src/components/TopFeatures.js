import { useState, useEffect } from "react"
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

const TopFeatures = ({dateRangeParams, compRegionsParams}) => {
  const [isLoading, setLoading] = useState(false)
  const [topFeaturesForList, setTopFeaturesForList] = useState()
  const [topFeaturesForCharts, setTopFeaturesForCharts] = useState()

  const getRegionalTopFeatures = async () => {
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

    let regionalTopFeatures = await fetch(endpoint, options)
    regionalTopFeatures = await regionalTopFeatures.json()
    regionalTopFeatures = regionalTopFeatures.response
    regionalTopFeatures.forEach(row => {
      const uniqueFeatures = Object.keys(row)
        .filter((key) => key.includes("feat"))
        .reduce((obj, key) => {
            return Object.assign(obj, {
              [key]: row[key]
            });
      }, {});

      row.featureList = [...new Set(Object.values(uniqueFeatures))].slice(0,5)
    })

    let featuresForCharts = regionalTopFeatures.map(row => {
      return row.featureList
    })
    featuresForCharts = [...new Set([].concat.apply([], featuresForCharts))]

    setTopFeaturesForList(regionalTopFeatures)
    setTopFeaturesForCharts(featuresForCharts)
  }


  useEffect(() => {
    setLoading(true)
    setTopFeaturesForList(null)
    setTopFeaturesForCharts(null)
    getRegionalTopFeatures()
    setLoading(false)
  }, [dateRangeParams, compRegionsParams])

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
            {topFeaturesForList &&
              topFeaturesForList.map((region, idx) => {
                return (
                  <div key={idx}>
                    <h1 className="my-6 text-[1.2vw] font-semibold">{`${region.name.split(",")[0]}`}</h1>
                    <div className="flex space-x-2">
                      {region.featureList.map((feature, idx) => {
                        return (
                          <div key={feature} className="flex flex-col w-full border-4 border-blue-400 rounded-md py-4 space-y-2">
                            <h1 className="w-full text-[1.2vw] text-center text-blue-500 font-bold">
                              {idx + 1}
                            </h1>
                            <h1 className="w-full text-2xl text-center">
                              {feature === "Loan Balance" ? "Original Loan Balance" : feature}
                            </h1>
                          </div>
                        )
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
        {topFeaturesForCharts && topFeaturesForCharts.map((feature, i) => {
          switch(feature) {
            case "Credit Score":
              return (
                <div key={feature} className="border-2 border-slate-400 rounded-md p-4 divide-y-2">
                  <div>
                    <DelinquencyByCreditScoreByPeriod
                      dateRange={dateRangeParams}
                      selectedRegions={compRegionsParams}
                    />
                  </div>
                  <div>
                    <DelinquencyByCreditScore
                      dateRange={dateRangeParams}
                      selectedRegions={compRegionsParams}
                    />
                  </div>
                </div>
              );
            case "Debt-to-Income":
              return (
                <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByDTI
                    dateRange={dateRangeParams}
                    selectedRegions={compRegionsParams}
                  />
                </div>
              );
            case "Education":
              return (
                <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByEducation
                    selectedRegions={compRegionsParams}
                  />
                </div>
              );
            case "First Time Buyer Status":
              return (
                <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByFTBStatus
                    dateRange={dateRangeParams}
                    selectedRegions={compRegionsParams}
                  />
                </div>
              );
            case "High Balance":
              return (
                <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByHighBalance
                    dateRange={dateRangeParams}
                    selectedRegions={compRegionsParams}
                  />
                </div>
              );
            case "Interest Rate":
              return (
                <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByInterestRate
                    dateRange={dateRangeParams}
                    selectedRegions={compRegionsParams}
                  />
                </div>
              );
            case "Loan Balance":
              return (
                <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByOriginalBalance
                    dateRange={dateRangeParams}
                    selectedRegions={compRegionsParams}
                  />
                </div>
              );
            case "Loan Term":
              return (
                <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByLoanTerm
                    dateRange={dateRangeParams}
                    selectedRegions={compRegionsParams}
                  />
                </div>
              );
            case "Loan-to-Value":
              return (
                <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByLTV
                    dateRange={dateRangeParams}
                    selectedRegions={compRegionsParams}
                  />
                </div>
              );
            case "Number of Borrowers":
              return (
                <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByNumberOfBorrowers
                    dateRange={dateRangeParams}
                    selectedRegions={compRegionsParams}
                  />
                </div>
              );
            case "Race":
              return (
                <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByRace
                    selectedRegions={compRegionsParams}
                  />
                </div>
              );
            case "Unemployment Rate":
              return (
                <div key={feature} className="border-2 border-slate-400 rounded-md p-4">
                  <DelinquencyByUnemploymentRate
                    dateRange={dateRangeParams}
                    selectedRegions={compRegionsParams}
                  />
                </div>
              );
          }
        })}
      </div>
    </>
  )
}

export default TopFeatures