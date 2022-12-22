import Alert from "./Alert"
import Select from "react-select"

const UbprFormInputs = ({
  handleNameParamChange,
  handleSpecializationParamChange,
  handleCityParamChange,
  handleStateParamChange,
  handleFdicRegionChange,
  getData,
  handleSelectedRconChange,
  selectedRcons,
  handleSelectedUbprChange,
  selectedUbprs,
  handleStartingQuarterChange,
  startingQuarter,
  handleEndingQuarterChange,
  endingQuarter,
  quarters,
  showAlert,
  closeAlert,
  rconOptionsList,
  ubprOptionsList
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
                <Select
                  className="mx-4"
                  options={rconOptionsList}
                  placeholder="Search by code or keyword (you may select more than one)"
                  value={selectedRcons}
                  onChange={handleSelectedRconChange}
                  isSearchable={true}
                  isMulti
                />
              </div>
              <div className="h-full flex justify-center items-center">
                <p>Data is currently available for Q1 and Q2 of 2021 and 2022</p>
              </div>
            </div>
            <div className="metric-input space-y-2">
              <h1>Credit Concentrations (UBPR)</h1>
              <div className="pr-4 space-y-4">
                <label htmlFor="rcon">UBPR Metrics</label>
                <Select
                  className="mx-4"
                  options={ubprOptionsList}
                  placeholder="Search by code or keyword (you may select more than one)"
                  value={selectedUbprs}
                  onChange={handleSelectedUbprChange}
                  isSearchable={true}
                  isMulti
                />
              </div>
              <div className="flex">
                <div className="pr-4 space-y-4 w-1/2">
                  <label htmlFor="rcon">Select Starting Quarter</label>
                  <Select
                    className="mx-4"
                    options={quarters}
                    placeholder="Select starting quarter"
                    value={startingQuarter}
                    onChange={handleStartingQuarterChange}
                    isSearchable={true}
                  />
                </div>
                <div className="pr-4 space-y-4 w-1/2">
                  <label htmlFor="rcon">Select Ending Quarter</label>
                  <Select
                    className="mx-4"
                    options={quarters}
                    placeholder="Select ending quarter"
                    value={endingQuarter}
                    onChange={handleEndingQuarterChange}
                    isSearchable={true}
                  />
                </div>
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