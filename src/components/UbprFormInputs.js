import Select from "react-select"

const UbprFormInputs = ({
  bankNameOptions,
  peerGroupOptions,
  peerGroupStateOptions,
  rconOptions,
  ubprOptions,
  quartersOptions,

  selectedBankNames,
  selectedPeerGroup,
  selectedPeerGroupState,
  selectedRcons,
  selectedUbprs,
  startingQuarter,
  endingQuarter,

  handleSelectedBankNamesChange,
  handleSelectedPeerGroupChange,
  handleSelectedPeerGroupStateChange,
  handleSelectedRconChange,
  handleSelectedUbprChange,
  handleStartingQuarterChange,
  handleEndingQuarterChange
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
                value={selectedBankNames}
                onChange={handleSelectedBankNamesChange}
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
                options={peerGroupOptions}
                placeholder="Select banks by peer group"
                value={selectedPeerGroup}
                onChange={handleSelectedPeerGroupChange}
                isSearchable
                isClearable
              />
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
          {(selectedBankNames.length > 0 || selectedPeerGroup || selectedPeerGroupState) &&
            <div className="metric-input-group">
              <div className="flex">
                <div className="metric-input space-y-2">
                  <h1>Loans and Leases (RCON)</h1>
                  <div className="pr-4 space-y-4">
                    <Select
                      className="mx-4"
                      options={rconOptions}
                      placeholder="Search for one or more RCON codes or keywords"
                      value={selectedRcons}
                      onChange={handleSelectedRconChange}
                      isSearchable
                      isMulti
                    />
                  </div>
                </div>
                <div className="metric-input space-y-2">
                  <h1>Credit Concentrations (UBPR)</h1>
                  <div className="pr-4 space-y-4">
                    <Select
                      className="mx-4"
                      options={ubprOptions}
                      placeholder="Search for one or more UBPR codes or keywords"
                      value={selectedUbprs}
                      onChange={handleSelectedUbprChange}
                      isSearchable
                      isMulti
                    />
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className="metric-input space-y-2">
                  <label htmlFor="rcon">Select Starting Quarter</label>
                  <Select
                    className="mx-4"
                    options={quartersOptions}
                    defaultValue={quartersOptions[quartersOptions.length - 4]}
                    placeholder="Select starting quarter"
                    value={startingQuarter}
                    onChange={handleStartingQuarterChange}
                    isSearchable
                  />
                </div>
                <div className="metric-input space-y-2">
                  <label htmlFor="rcon">Select Ending Quarter</label>
                  <Select
                    className="mx-4"
                    options={quartersOptions}
                    defaultValue={quartersOptions[quartersOptions.length - 1]}
                    placeholder="Select ending quarter"
                    value={endingQuarter}
                    onChange={handleEndingQuarterChange}
                    isSearchable
                  />
                </div>
              </div>
            </div>
          }
        </form>
      </div>
    </>
  )
}

export default UbprFormInputs