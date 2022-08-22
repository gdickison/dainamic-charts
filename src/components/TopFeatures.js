import Loader from "./Loader"

const TopFeatures = ({topFeatures}) => {
  return (
    <section className="border-[1px] border-gray-200 rounded-md shadow-md p-6 mx-10 my-2">
      <div className="flex items-center space-x-4">
        <img className="h-12" src="/five.svg" alt="" />
        <h1 className="text-[1.6vw] 3xl:text-3xl font-bold py-4">
          Top Five Delinquency Predictors
        </h1>
      </div>
      <header className="flex space-x-6 justify-evenly">
        <div className="flex flex-col justify-center w-full">
          {topFeatures ?
            topFeatures.map((region, idx) => {
              return (
                <div key={idx}>
                  <h1 className="my-6 text-[1.4vw] 3xl:text-2xl font-semibold">{`${region.name.split(",")[0]}`}</h1>
                  <div className="flex space-x-2">
                    {region.featureList.map((feature, idx) => {
                      return (
                        <div key={feature} className="flex flex-col w-full border-4 border-blue-400 rounded-md py-4 space-y-2">
                          <h1 className="w-full text-[1.4vw] 3xl:text-2xl text-center text-blue-500 font-bold">
                            {idx + 1}
                          </h1>
                          <h1 className="w-full text-[1.4vw] 3xl:text-2xl text-center">
                            {feature === "Loan Balance" ? "Original Loan Balance" : feature}
                          </h1>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
            : <Loader loadiingText={"Getting top delinquency features..."}/> 
          }
        </div>
      </header>
    </section>
  )
}

export default TopFeatures