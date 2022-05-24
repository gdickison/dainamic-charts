import { useState, useEffect } from "react"
import DelinquencyByCreditScore from "./DelinquencyByCreditScore"

const TopFeatures = ({params}) => {
  const [topFeatures, setTopFeatures] = useState()

  const getTopFeatures = async () => {
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
    const response = await fetch(endpoint, options)
    let status = response.status
    let data = await response.json()

    if(status === 404){
      console.log("There was an error getting the top features")
    } else if(status === 200){
      console.log('top features data', data)
      setTopFeatures(Object.values(data.response))
    }
  }

  useEffect(() => {
    getTopFeatures()
  }, [params.msaCode])

  return (
    <div className="mx-auto px-0 md:px-24">
      <h1 className="my-6 text-4xl">Top Five Delinquency Factors</h1>
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
          />
        }
      </div>
    </div>
  )
}

export default TopFeatures