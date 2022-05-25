import { useState, useEffect } from "react"
import DelinquencyByCreditScore from "./DelinquencyByCreditScore"
import DelinquencyByUnemploymentRate from "./DelinquencyByUnemploymentRate"

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

  if (isLoading){
    return <p>Loading top feature data...</p>
  }

  return (
    <div className="mx-auto px-0 md:px-24">
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
      <div>
        {topFeatures && topFeatures.includes("Credit Score") &&
          <DelinquencyByCreditScore
            params={params}
            msaName={msaName}
          />
        }
      </div>
      <div>
        {!isLoading && topFeatures && topFeatures.includes("Unemployment Rate") &&
          <DelinquencyByUnemploymentRate
            params={params}
            msaName={msaName}
          />
        }
      </div>
    </div>
  )
}

export default TopFeatures