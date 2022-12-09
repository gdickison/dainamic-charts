const UbprBankSummary = ({bankData}) => {
  return (
    <div>
      <div className="m-2 border-2 border-gray-400 p-2 flex flex-row gap-8 w-max">
        <div className="">
          <address>
            <p>{bankData.ADDRESS}</p>
            <p><span>{bankData.CITY}, </span><span>{bankData.STNAME}</span><span> {bankData.ZIP}</span></p>
          </address>
          <a href={`https://${bankData.WEBADDR}`} target="_blank">{bankData.WEBADDR}</a>
          <p><span>FDIC Region:</span> <span>{bankData.FDICREGN}</span></p>
          <p><span>Banking Class:</span> <span>{bankData.BKCLASS}</span></p>
          <p><span>Specialization:</span> <span>{bankData.SPECGRPN}</span></p>
        </div>

        <div className="">
          <p><span>Deposits:</span> <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(bankData.DEP * 1000)}</span></p>
          <p><span>Equity:</span> <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(bankData.EQ * 1000)}</span></p>
          <p><span>Return on Equity:</span> <span>{new Intl.NumberFormat('defalut', {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2}).format(bankData.ROE / 100)}</span></p>

          <p><span>Assets:</span> <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(bankData.ASSET * 1000)}</span></p>
          <p><span>Return on Assets:</span> <span>{new Intl.NumberFormat('defalut', {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2}).format(bankData.ROA / 100)}</span></p>

          <p><span>Net Income:</span> <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(bankData.NETINC * 1000)}</span></p>
        </div>
      </div>
      {/* {Object.entries(bankData).map(([key, value], idx) => {
        return (
            <div key={`${idx}`}>
              <p>{key} - {value}</p>
            </div>
          )
      })} */}
    </div>
  )
}

export default UbprBankSummary