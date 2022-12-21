import Alert from "./Alert"

const UbprFormInputs = ({
  handleNameParamChange,
  handleSpecializationParamChange,
  handleCityParamChange,
  handleStateParamChange,
  handleFdicRegionChange,
  getData,
  rconOptions,
  handleSelectedRconChange,
  selectedRcons,
  removeRcon,
  ubprOptions,
  handleSelectedUbprChange,
  selectedUbprs,
  removeUbpr,
  handleQuarterChange,
  quarters,
  showAlert,
  closeAlert
}) => {
  return (
    <>
      <div className="mx-auto my-6">
        <form className="ubpr-form" action="#">
          <div className="bank-input-group">
            <div className="bank-input">
              <label htmlFor="bankName">Bank Name </label>
              <input type="text" id="bankName" onChange={handleNameParamChange}/>
            </div>
            <div className="bank-input">
              <label htmlFor="bankCity">City </label>
              <input type="text" id="bankCity" onChange={handleCityParamChange}/>
            </div>
            <div className="bank-input">
              <label htmlFor="bankState">State </label>
              <input type="text" id="bankState" onChange={handleStateParamChange}/>
            </div>
            <div className="bank-input">
              <label htmlFor="specialization">Specialization </label>
              <input type="text" id="specialization" onChange={handleSpecializationParamChange}/>
            </div>
            <div className="bank-input">
              <label htmlFor="bankFdicRegion">FDIC Region </label>
              <input type="text" id="bankFdicRegion" onChange={handleFdicRegionChange}/>
            </div>
          </div>
          <div className="metric-input-group">
            <div className="metric-input space-y-2">
              <h1>Loans and Leases (RCON)</h1>
              <div className="pr-4 space-y-4">
                <label htmlFor="ubpr">RCON Metrics</label>
                <select id="rcon" name="rcon" defaultValue="" onChange={handleSelectedRconChange}>
                  <option disabled></option>
                  {rconOptions && rconOptions.map(rcon => {
                    return (
                      <option key={rcon} value={rcon} data-display={`${rcon}`}>{rcon}</option>
                    )
                  })}
                </select>
              </div>
              <div className="space-y-4">
                <label htmlFor="rcon-selected-metrics">Selected RCON Metrics</label>
                <div id="rcon-selected-metrics">
                  {selectedRcons.length > 0 &&
                    selectedRcons.map(rcon => {
                      return (
                        <p key={rcon}>
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
              <div className="h-full flex justify-center items-center">
                <p>Data is currently available for Q1 and Q2 of 2021 and 2022</p>
              </div>
            </div>
            <div className="metric-input space-y-2">
              <h1>Credit Concentrations (UBPR)</h1>
              <div className="pr-4 space-y-4">
                <label htmlFor="rcon">UBPR Metrics</label>
                <select id="ubpr" name="ubpr" defaultValue="" onChange={handleSelectedUbprChange}>
                  <option disabled></option>
                  {ubprOptions && ubprOptions.map(ubpr => {
                    return (
                      <option key={ubpr} value={ubpr} data-display={`${ubpr}`}>{ubpr}</option>
                    )
                  })}
                </select>
              </div>
              <div className="space-y-4">
                <label htmlFor="ubpr-selected-metrics">Selected UBPR Metrics</label>
                <div id="ubpr-selected-metrics">
                  {selectedUbprs.length > 0 &&
                    selectedUbprs.map(ubpr => {
                      return (
                        <p key={ubpr}>
                          <span>{ubpr}</span>
                          <span className="h-6 w-6 group hover:cursor-pointer" onClick={removeUbpr}>
                            <img id={ubpr} src="/close.svg" alt="remove metric" />
                          </span>
                        </p>
                      )
                    })
                  }
                </div>
              </div>
              <div className="pr-4 space-y-4">
                <label htmlFor="rcon">Select Starting Quarter</label>
                <select className="mx-2 text-center border-2 border-blue-400 bg-white rounded-md text-[1.7vw] 3xl:text-3xl" id="startQuarter" name="startQuarter" defaultValue="" onChange={handleQuarterChange}>
                  <option disabled></option>
                  {quarters && quarters.map(quarter => {
                    return (
                      <option key={quarter} value={quarter}>{quarter}</option>
                    )
                  })}
                </select>
              </div>
              <div className="pr-4 space-y-4">
                <label htmlFor="rcon">Select Ending Quarter</label>
                <select className="mx-2 text-center border-2 border-blue-400 bg-white rounded-md text-[1.7vw] 3xl:text-3xl" id="endQuarter" name="endQuarter" defaultValue="" onChange={handleQuarterChange}>
                  <option disabled></option>
                  {quarters && quarters.map(quarter => {
                    return (
                      <option key={quarter} value={quarter}>{quarter}</option>
                    )
                  })}
                </select>
              </div>
            </div>
          </div>
        </form>
        <button className="w-52 my-2 mx-6 rounded-md p-2 px-6 bg-blue-600 hover:bg-blue-800 text-gray-100 text-[1.7vw] 3xl:text-3xl" onClick={getData}>See Results</button>
      </div>
      {showAlert &&
        <Alert
          message={"Select start and end quarters for credit concentration metrics"}
          closeAlert={closeAlert}
        />
      }
    </>
  )
}

export default UbprFormInputs