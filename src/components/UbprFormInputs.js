const UbprFormInputs = ({
  handleNameParamChange,
  handleSpecializationParamChange,
  handleCityParamChange,
  handleStateParamChange,
  getData,
  rconOptions,
  handleSelectedRconChange,
  selectedRcons,
  removeRcon
}) => {
  return (
    <div>
      <div className="m-6">
        <h1 className="text-xl">Search & Filter</h1>
        <h2 className="text-lg">Choose at least one criteria</h2>
        <p>Use the filters to find a target bank or banks, then select metrics to display data for the selected banks</p>
      </div>
      <form className="flex-col w-[60%] min-w-[60%] space-y-4" action="#">
        <div className="flex">
          <div className="flex flex-col w-1/4 space-y-4">
            <label className="text-xl mx-6" htmlFor="bankName">Bank Name </label>
            <input className="border-2 border-blue-500 mx-6 px-2" type="text" id="bankName" onChange={handleNameParamChange}/>
          </div>
          <div className="flex flex-col w-1/4 space-y-4">
            <label className="text-xl mx-6" htmlFor="bankCity">City </label>
            <input className="border-2 border-blue-500 mx-6 px-2" type="text" id="bankCity" onChange={handleCityParamChange}/>
          </div>
          <div className="flex flex-col w-1/4 space-y-4">
            <label className="text-xl mx-6" htmlFor="bankState">State </label>
            <input className="border-2 border-blue-500 mx-6 px-2" type="text" id="bankState" onChange={handleStateParamChange}/>
          </div>
          <div className="flex flex-col w-1/4 space-y-4">
            <label className="text-xl mx-6" htmlFor="specialization">Specialization </label>
            <input className="border-2 border-blue-500 mx-6 px-2" type="text" id="specialization" onChange={handleSpecializationParamChange}/>
          </div>
        </div>
        <div className="pr-4 space-y-4">
          <label className="text-xl mx-6" htmlFor="rcon">Metrics (RCON)</label>
          <select className="w-full mx-6 text-left px-2 border-2 border-blue-400 bg-white rounded-md text-xl" id="rcon" name="rcon" defaultValue="" onChange={handleSelectedRconChange}>
            <option disabled></option>
            {rconOptions && rconOptions.map(rcon => {
              return (
                <option key={rcon} value={rcon} data-display={`${rcon}`}>{rcon}</option>
              )
            })}
          </select>
        </div>
        <div className="space-y-4">
          <div className="text-xl mx-6">Selected Metrics</div>
          <div className="min-h-[2rem] m-6 border-2 border-blue-400 p-1 bg-white rounded-md">
            {selectedRcons.length > 0 &&
              selectedRcons.map(rcon => {
                return (
                  <p key={rcon} className="flex items-center w-max text-center m-1 border-2 border-gray-300 px-2 bg-gray-200 text-xl leading-8 space-x-4">
                    <span>{rcon}</span>
                    <span className="h-6 w-6 group hover:cursor-pointer" onClick={removeRcon}>
                      <img id={rcon} src="/close.svg" alt="remove metric" />
                    </span>
                  </p>
                )
              })
            }
          </div>
        </div>
      </form>
      <button className="my-8 mx-6 rounded-md p-2 px-6 bg-blue-600 hover:bg-blue-800 text-gray-100 text-[1.7vw] 3xl:text-3xl" onClick={getData}>See Results</button>
    </div>
  )
}

export default UbprFormInputs