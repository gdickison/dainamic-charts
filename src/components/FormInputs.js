const FormInputs = ({handleDateChange, monthOptions, msaOptions, handleSelectedRegionsChange, selectedRegions, removeRegion, dateRange, getData}) => {
  return (
    <section className="flex flex-col items-center justify-center px-20">
      <form className="flex flex-col items-center space-y-4" action="#">
        <div className="flex w-full">
          <div className="flex flex-col w-1/2 space-y-4">
            <label className="text-2xl mx-2" htmlFor="startDate">Select a start date: </label>
            <select className="mx-2 text-center border-2 border-blue-400 bg-white rounded-md text-xl" id="startDate" name="startDate" defaultValue="" onChange={handleDateChange}>
              <option disabled></option>
              {monthOptions && monthOptions.map(month => {
                return (
                  <option key={month} value={month}>{month}</option>
                )
              })}
            </select>
          </div>
          <div className="flex flex-col w-1/2 space-y-4">
            <label className="text-2xl mx-2"  htmlFor="endDate">Select an end date: </label>
            <select className="mx-2 text-center border-2 border-blue-400 bg-white rounded-md text-xl" id="endDate" name="endDate" defaultValue="" onChange={handleDateChange}>
              <option disabled></option>
              {monthOptions && monthOptions.map(month => {
                return (
                  <option key={month} value={month}>{month}</option>
                )
              })}
            </select>
          </div>
        </div>
        <div className="w-full mt-4 flex flex-col space-y-2">
          <div>
            <div className="flex flex-col space-y-4 float-right">
              <label className="text-2xl mx-2" htmlFor="compMsaCode">Select 1-3 Regions </label>
              <select className="mx-2 w-80 md:w-max text-center md:text-left md:px-2 border-2 border-blue-400 bg-white rounded-md text-xl" id="compMsaCode" name="compMsaCode" defaultValue="" onChange={handleSelectedRegionsChange}>
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
            <div className="w-full">
              <div className="text-2xl mx-2">Selected Regions</div>
              <div className="min-h-[44px] max-w-[591px] m-2 border-2 border-blue-400 p-1 bg-white rounded-md text-xl">
                {selectedRegions.length > 0 &&
                  selectedRegions.map(region => {
                    return (
                      <p key={region.compMsaCode} className="inline-block w-max text-center m-1 border-2 border-gray-300 md:px-2 bg-gray-200 text-lg leading-8 space-x-4">
                        <span>{region.displayText}</span>
                        <span className=" h-6 w-6 group hover:cursor-pointer" onClick={removeRegion}>
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
      </form>
      {(!dateRange.startDate || !dateRange.endDate || selectedRegions.length === 0) &&
        <div className="flex items-center justify-center h-12 my-8 text-2xl">Select a start date, end date, and MSA to see results</div>
      }
      {dateRange.startDate && dateRange.endDate && selectedRegions.length > 0 &&
        <button className="flex items-center justify-center w-40 h-12 my-8 rounded-md p-4 bg-blue-600 hover:bg-blue-800 text-gray-100" onClick={getData}>See Results</button>
      }
    </section>
  )
}

export default FormInputs