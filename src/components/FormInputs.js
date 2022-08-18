const FormInputs = ({handleDateChange, monthOptions, msaOptions, handleSelectedRegionsChange, selectedRegions, removeRegion, dateRange, getData, inputDisplay, showInputButton, showInputForm}) => {
  return (
    <section className="flex flex-col items-center justify-center px-20">

{/* FORM START */}
      <form className={`${inputDisplay} flex-col w-[60%] min-w-[60%] space-y-2`} action="#">
{/* DATE SELECTION */}
        <div className="flex">
          <div className="flex flex-col w-1/2 space-y-4">
            <label className="text-[1.5vw] mx-2" htmlFor="startDate">Select a start date: </label>
            <select className="mx-2 text-center border-2 border-blue-400 bg-white rounded-md text-[1.5vw]" id="startDate" name="startDate" defaultValue="" onChange={handleDateChange}>
              <option disabled></option>
              {monthOptions && monthOptions.map(month => {
                return (
                  <option key={month} value={month}>{month}</option>
                )
              })}
            </select>
          </div>
          <div className="flex flex-col w-1/2 space-y-4">
            <label className="text-[1.5vw] mx-2"  htmlFor="endDate">Select an end date: </label>
            <select className="mx-2 text-center border-2 border-blue-400 bg-white rounded-md text-[1.5vw]" id="endDate" name="endDate" defaultValue="" onChange={handleDateChange}>
              <option disabled></option>
              {monthOptions && monthOptions.map(month => {
                return (
                  <option key={month} value={month}>{month}</option>
                )
              })}
            </select>
          </div>
        </div>
{/* REGION SELECTION */}
        <div className="pr-4">
          <label className="text-[1.5vw] mx-2" htmlFor="msaCode">Select 1-3 Regions </label>
          <select className="w-full mx-2 text-left px-2 border-2 border-blue-400 bg-white rounded-md text-[1.5vw]" id="msaCode" name="msaCode" defaultValue="" onChange={handleSelectedRegionsChange}>
            <option disabled></option>
            {msaOptions && msaOptions.map(singleMsa => {
              return (
                <option key={singleMsa.msa_code} value={singleMsa.msa_code} data-display={`${singleMsa.msa_name} (${singleMsa.msa_code})`}>{singleMsa.msa_name} ({singleMsa.msa_code})</option>
              )
            })}
          </select>
        </div>
{/* REGION DISPLAY */}
        <div className="text-[1.5vw] mx-2">Selected Regions</div>
        <div className="min-h-[44px] m-2 border-2 border-blue-400 p-1 bg-white rounded-md">
          {selectedRegions.length > 0 &&
            selectedRegions.map(region => {
              return (
                <p key={region.msaCode} className="flex items-center w-max text-center m-1 border-2 border-gray-300 px-2 bg-gray-200 text-[1.4vw] leading-8 space-x-4">
                  <span>{region.displayText}</span>
                  <span className="h-6 w-6 group hover:cursor-pointer" onClick={removeRegion}>
                    <img id={region.msaCode} src="/close.svg" alt="remove region" />
                  </span>
                </p>
              )
            })
          }
        </div>
      </form>
{/* FORM END */}

      {(!dateRange.startDate || !dateRange.endDate || selectedRegions.length === 0) &&
        <div className="h-12 my-8 text-[1.5vw]">Select a start date, end date, and MSA to see results</div>
      }
      {dateRange.startDate && dateRange.endDate && selectedRegions.length > 0 &&
        <button className={`${inputDisplay} my-8 rounded-md py-2 px-6 bg-blue-600 hover:bg-blue-800 text-gray-100 text-[1.5vw]`} onClick={getData}>See Results</button>
      }
      <button className={`${showInputButton} absolute top-0 right-0 m-[3.5rem] rounded-md py-2 px-6 bg-blue-600 hover:bg-blue-800 text-gray-100 text-[1.5vw]`} onClick={showInputForm}>Show Input Form</button>
    </section>
  )
}

export default FormInputs