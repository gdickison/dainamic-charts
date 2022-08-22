const FormInputs = ({handleDateChange, monthOptions, msaOptions, handleSelectedRegionsChange, selectedRegions, removeRegion, dateRange, getData, showChangeOptionsButton, toggleShowOptionsModal, showOptionsModal}) => {

  return (
    <>
      <div className={`${showChangeOptionsButton} justify-center`}>
        <button className="mb-6 rounded-md py-2 px-6 bg-blue-600 hover:bg-blue-800 text-gray-100 text-[1.5vw] 3xl:text-3xl" onClick={toggleShowOptionsModal}>Change Selected Options</button>
      </div>
      <div className={`${showOptionsModal}`}>
        <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none" >
          <section className="w-4/5 max-w-[1500px] flex flex-col items-center justify-center py-20 bg-white rounded-lg">
            <header className="relative -top-14 -left-96">
              <h1 className='text-3xl'>
                Welcome to D<span className='text-yellow-300'>AI</span>NAMIC
              </h1>
            </header>
            <form className="flex-col w-[60%] min-w-[60%] space-y-4" action="#">
              <div className="flex">
                <div className="flex flex-col w-1/2 space-y-4">
                  <label className="text-[1.7vw] 3xl:text-3xl mx-2" htmlFor="startDate">Select a start date: </label>
                  <select className="mx-2 text-center border-2 border-blue-400 bg-white rounded-md text-[1.7vw] 3xl:text-3xl" id="startDate" name="startDate" defaultValue="" onChange={handleDateChange}>
                    <option disabled></option>
                    {monthOptions && monthOptions.map(month => {
                      return (
                        <option key={month} value={month}>{month}</option>
                      )
                    })}
                  </select>
                </div>
                <div className="flex flex-col w-1/2 space-y-4">
                  <label className="text-[1.7vw] 3xl:text-3xl mx-2"  htmlFor="endDate">Select an end date: </label>
                  <select className="mx-2 text-center border-2 border-blue-400 bg-white rounded-md text-[1.7vw] 3xl:text-3xl" id="endDate" name="endDate" defaultValue="" onChange={handleDateChange}>
                    <option disabled></option>
                    {monthOptions && monthOptions.map(month => {
                      return (
                        <option key={month} value={month}>{month}</option>
                      )
                    })}
                  </select>
                </div>
              </div>
              <div className="pr-4 space-y-4">
                <label className="text-[1.7vw] 3xl:text-3xl mx-2" htmlFor="msaCode">Select 1-3 Regions </label>
                <select className="w-full mx-2 text-left px-2 border-2 border-blue-400 bg-white rounded-md text-[1.7vw] 3xl:text-3xl" id="msaCode" name="msaCode" defaultValue="" onChange={handleSelectedRegionsChange}>
                  <option disabled></option>
                  {msaOptions && msaOptions.map(singleMsa => {
                    return (
                      <option key={singleMsa.msa_code} value={singleMsa.msa_code} data-display={`${singleMsa.msa_name} (${singleMsa.msa_code})`}>{singleMsa.msa_name} ({singleMsa.msa_code})</option>
                    )
                  })}
                </select>
              </div>
              <div className="space-y-4">
                <div className="text-[1.7vw] 3xl:text-3xl mx-2">Selected Regions</div>
                <div className="min-h-[44px] m-2 border-2 border-blue-400 p-1 bg-white rounded-md">
                  {selectedRegions.length > 0 &&
                    selectedRegions.map(region => {
                      return (
                        <p key={region.msaCode} className="flex items-center w-max text-center m-1 border-2 border-gray-300 px-2 bg-gray-200 text-[1.4vw] 3xl:text-2xl leading-8 space-x-4">
                          <span>{region.displayText}</span>
                          <span className="h-6 w-6 group hover:cursor-pointer" onClick={removeRegion}>
                            <img id={region.msaCode} src="/close.svg" alt="remove region" />
                          </span>
                        </p>
                      )
                    })
                  }
                </div>
              </div>
            </form>
            {(!dateRange.startDate || !dateRange.endDate || selectedRegions.length === 0) &&
              <div className="h-12 my-8 text-[1.7vw] 3xl:text-3xl">Select a start date, end date, and MSA to see results</div>
            }
            {dateRange.startDate && dateRange.endDate && selectedRegions.length > 0 &&
              <button className="my-8 rounded-md p-2 px-6 bg-blue-600 hover:bg-blue-800 text-gray-100 text-[1.7vw] 3xl:text-3xl" onClick={getData}>See Results</button>
            }
          </section>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
      </div>
    </>
  );
}

export default FormInputs