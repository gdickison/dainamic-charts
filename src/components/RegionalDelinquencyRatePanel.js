import Loader from "./Loader"

const RegionalDelinquencyRatePanel = ({targetRegionData, regionalDelinquencyRates, nationalDelinquencyRate}) => {
  return (
    <div className="m-4 border-4 border-blue-400 rounded-md p-6 text-center">
      <h1 className="text-[1.5vw] font-bold py-4">
        Delinquency Rate
      </h1>
      <div>
        <p className="text-[1.1vw] py-2">
          {`The delinquency rate for the selected time period in ${targetRegionData.name} is `}
        </p>
        <p className="text-[3vw]">
          {`${regionalDelinquencyRates[0].delinquencyRate}%`}
        </p>
        {nationalDelinquencyRate
          ?  <>
              <p className="text-[1.1vw] py-2">
                This is {regionalDelinquencyRates[0].delinquencyRate > nationalDelinquencyRate ? 'HIGHER' : 'LOWER'} than the national delinquency rate of
              </p>
              <p className="text-[3vw]">
                {`${nationalDelinquencyRate}%`}
              </p>
              <p className="text-[1.1vw] py-2">
                for the same period.
              </p>
            </>
          : <Loader loadiingText={"Getting national data..."}/>
        }
      </div>
    </div>
  )
}

export default RegionalDelinquencyRatePanel