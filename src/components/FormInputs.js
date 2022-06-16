const FormInputs = ({handleDateChange, monthOptions, handleTargetRegionChange, targetRegion, msaOptions, handleCompRegionChange, compRegions, removeCompRegion, dateRange, getData}) => {
  return (
    <section className="flex flex-col items-center justify-center px-20">
      <form className="flex flex-col items-center" action="#">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex flex-col md:space-y-4">
            <label className="text-2xl mx-2" htmlFor="startDate">Select a start date: </label>
            <select className="mx-2 w-max text-center md:text-left md:px-2 border-2 border-blue-400 bg-white rounded-md text-xl" id="startDate" name="startDate" defaultValue="" onChange={handleDateChange}>
              <option disabled></option>
              {monthOptions && monthOptions.map(month => {
                return (
                  <option key={month} value={month}>{month}</option>
                )
              })}
            </select>
          </div>
          <div className="flex flex-col md:space-y-4">
            <label className="text-2xl mx-2"  htmlFor="endDate">Select an end date: </label>
            <select className="mx-2 w-max text-center md:text-left md:px-2 border-2 border-blue-400 bg-white rounded-md text-xl" id="endDate" name="endDate" defaultValue="" onChange={handleDateChange}>
              <option disabled></option>
              {monthOptions && monthOptions.map(month => {
                return (
                  <option key={month} value={month}>{month}</option>
                )
              })}
            </select>
          </div>
{/* Select Target Region */}
          <div className="flex flex-col md:space-y-4">
            <label className="text-2xl mx-2" htmlFor="targetMsaCode">Select a Target Region: </label>
            <select className="mx-2 w-80 md:w-max text-center md:text-left md:px-2 border-2 border-blue-400 bg-white rounded-md text-xl" id="targetMsaCode" name="targetMsaCode" defaultValue="" onChange={handleTargetRegionChange}>
              <option disabled></option>
              {msaOptions && msaOptions.map(singleMsa => {
                return (
                  <option key={singleMsa.msa_code} value={singleMsa.msa_code} data-display={`${singleMsa.msa_name} (${singleMsa.msa_code})`}>{singleMsa.msa_name} ({singleMsa.msa_code})</option>
                )
              })}
            </select>
          </div>
        </div>
{/* Select & display comparison regions */}
        {targetRegion &&
          <div className="w-full mt-4 flex flex-col space-y-2">
            <div>
              <div className="flex flex-col md:space-y-4 float-right">
                <label className="text-2xl mx-2" htmlFor="compMsaCode">Select Up to Two Comparison Regions (optional): </label>
                <select className="mx-2 w-80 md:w-max text-center md:text-left md:px-2 border-2 border-blue-400 bg-white rounded-md text-xl" id="compMsaCode" name="compMsaCode" defaultValue="" onChange={handleCompRegionChange}>
                  <option disabled></option>
                  {msaOptions && msaOptions.map(singleMsa => {
                    return (
                      <option key={singleMsa.msa_code} value={singleMsa.msa_code} data-display={`${singleMsa.msa_name} (${singleMsa.msa_code})`}>{singleMsa.msa_name} ({singleMsa.msa_code})</option>
                    )
                  })}
                </select>
              </div>
            </div>
            <div>
              <div className="w-1/2 float-right">
                <div className="text-2xl mx-2">Comparison Regions</div>
                <div className="min-h-[44px] m-2 text-center md:text-left border-2 border-blue-400 p-1 bg-white rounded-md text-xl">
                  {compRegions.length > 0 &&
                    compRegions.map(region => {
                      return (
                        <p key={region.compMsaCode} className="inline-block w-max text-center md:text-left m-1 border-2 border-gray-300 md:px-2 bg-gray-200 text-xl leading-8 space-x-4">
                          <span>{region.displayText}</span>
                          <span className=" h-6 w-6 group hover:cursor-pointer" onClick={removeCompRegion}>
                            <img id={region.compMsaCode} className="h-6 inline align-text-top" src="/close.svg" alt="remove region" />
                          </span>
                        </p>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        }
      </form>

      {(!dateRange.startDate || !dateRange.endDate || !targetRegion) &&
        <div className="flex items-center justify-center h-12 my-8 text-2xl">Select a start date, end date, and MSA to see results</div>
      }
      {dateRange.startDate && dateRange.endDate && targetRegion &&
        <button className="flex items-center justify-center w-40 h-12 my-8 rounded-md p-4 bg-blue-600 hover:bg-blue-800 text-gray-100" onClick={getData}>See Results</button>
      }
    </section>
  )
}

export default FormInputs