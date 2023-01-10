import Alert from "./Alert"
import Select from "react-select"

const UbprFormInputs = ({
  alertMessage,
  bankNameOptions,
  closeAlert,
  endingQuarter,
  getData,
  handleEndingQuarterChange,
  handleNumberOfOfficesChange,
  handlePeerGroupAssetOptionChange,
  handleSelectedBanksByNameChange,
  handleSelectedLocationChange,
  handleSelectedPeerGroupStateChange,
  handleSelectedRconChange,
  handleSelectedUbprChange,
  handleStartingQuarterChange,
  peerGroupAssetOptions,
  peerGroupHighOfficesOptions,
  peerGroupLocationOptions,
  peerGroupLowOfficesOptions,
  peerGroupStateOptions,
  quarters,
  rconOptionsList,
  selectedAssetOption,
  selectedBanksByName,
  selectedLocation,
  selectedNumberOfOffices,
  selectedPeerGroupState,
  startingQuarter,
  selectedRcons,
  selectedUbprs,
  showAlert,
  ubprOptionsList
}) => {
  return (
    <>
      <div className="mx-auto my-6">
        <form className="ubpr-form" action="#">
          <div className="bank-input-group">
            <div className="metric-input">
              <label htmlFor="bankName">Bank Name</label>
              <Select
                className="mx-4 text-sm"
                options={bankNameOptions}
                placeholder="Select one or more banks by name"
                value={selectedBanksByName}
                onChange={handleSelectedBanksByNameChange}
                isSearchable
                isMulti
                isClearable
              />
            </div>
            <p className="my-auto text-2xl">OR</p>
            <div className="metric-input">
              <label htmlFor="peerGroup">Peer Group by Assets</label>
              <Select
                className="mx-4 text-sm"
                options={peerGroupAssetOptions}
                placeholder="Select banks by peer group"
                value={selectedAssetOption}
                onChange={handlePeerGroupAssetOptionChange}
                isSearchable
                isClearable
              />
              {selectedAssetOption && (selectedAssetOption.value === "BETWEEN 100000 AND 300000" || selectedAssetOption.value === "BETWEEN 50000 AND 100000") &&
                <Select
                  className="mx-4 text-sm"
                  options={peerGroupHighOfficesOptions}
                  placeholder="Select number of offices (required)"
                  value={selectedNumberOfOffices}
                  onChange={handleNumberOfOfficesChange}
                  isSearchable
                />
              }
              {selectedAssetOption && selectedAssetOption.value === "< 50000" &&
                <Select
                  className="mx-4 text-sm"
                  options={peerGroupLowOfficesOptions}
                  placeholder="Select number of offices (required)"
                  value={selectedNumberOfOffices}
                  onChange={handleNumberOfOfficesChange}
                  isSearchable
                  required
                />
              }
              {selectedAssetOption && (selectedAssetOption.value === "BETWEEN 100000 AND 300000" || selectedAssetOption.value === "BETWEEN 50000 AND 100000" || selectedAssetOption.value === "< 50000") &&
                <Select
                  className="mx-4 text-sm"
                  options={peerGroupLocationOptions}
                  placeholder="Select location (required)"
                  value={selectedLocation}
                  onChange={handleSelectedLocationChange}
                  isSearchable
                  required
                />
              }
            </div>
            <p className="my-auto text-2xl">OR</p>
            <div className="metric-input">
              <label htmlFor="peerGroup">Peer Group by State</label>
              <Select
                className="mx-4 text-sm"
                options={peerGroupStateOptions}
                placeholder="Select banks by state"
                value={selectedPeerGroupState}
                onChange={handleSelectedPeerGroupStateChange}
                isSearchable
                isClearable
              />
            </div>
          </div>
          <div className="metric-input-group">
            <div className="metric-input space-y-2">
              <h1>Loans and Leases (RCON)</h1>
              <div className="pr-4 space-y-4">
                <Select
                  className="mx-4"
                  options={rconOptionsList}
                  placeholder="Search for one or more RCON codes or keywords"
                  value={selectedRcons}
                  onChange={handleSelectedRconChange}
                  isSearchable
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
                <Select
                  className="mx-4"
                  options={ubprOptionsList}
                  placeholder="Search for one or more UBPR codes or keywords"
                  value={selectedUbprs}
                  onChange={handleSelectedUbprChange}
                  isSearchable
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
                    isSearchable
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
                    isSearchable
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
        {(selectedBanksByName.length > 0 || selectedAssetOption !== null || selectedPeerGroupState !== null) &&
          <div className="flex justify-center mt-6 mb-2">
            <button className="w-96 rounded-md p-2 px-6 bg-blue-600 hover:bg-blue-800 text-gray-100 text-lg 3xl:text-3xl" onClick={getData}>See Results</button>
          </div>
        }
      </div>
      {showAlert &&
        <Alert
          message={alertMessage}
          closeAlert={closeAlert}
        />
      }
    </>
  )
}

export default UbprFormInputs