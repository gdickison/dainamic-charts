const UbprBankSummary = ({bankData}) => {
  return (
    <div>
      <div className="name-address">
        <div className="name-id">
          <h1>{bankData.NAME}</h1>
          <p>I.D. {bankData.BANK_ID}</p>
        </div>
      </div>
      <div className="classification-card-container">
        <div className="classification-card">
          <h2>Location</h2>
          <address>
            <p>{bankData.ADDRESS}</p>
            <p><span>{bankData.CITY}, </span><span>{bankData.STNAME}</span><span> {bankData.ZIP}</span></p>
            {bankData.WEBADDR &&
              <a href={`https://${(bankData.WEBADDR).replace(/^[^w]*/, '')}`} target="_blank">{(bankData.WEBADDR).replace(/^[^w]*/, '')}</a>
            }
          </address>
          <h2>FDIC Region</h2>
          <p>{bankData.FDICREGN}</p>
          <h2>Banking Class</h2>
          <p>{bankData.BKCLASS}</p>
          {bankData.SPECGRPN &&
            <>
              <h2>Specialization</h2>
              <p>{(bankData.SPECGRPN).replace(' Specialization', '')}</p>
            </>
          }
        </div>
        <div className="financial-card">
          <div>
            <h2>Deposits</h2>
            <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(bankData.DEP * 1000)}</p>
          </div>
          <div>
            <h2>Net Income</h2>
            <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(bankData.NETINC * 1000)}</p>

          </div>
        </div>
        <div className="financial-card">
          <div>
            <h2>Equity</h2>
            <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(bankData.EQ * 1000)}</p>
          </div>
          <div>
            <h2>Return on Equity</h2>
            <p>{new Intl.NumberFormat('defalut', {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2}).format(bankData.ROE / 100)}</p>
          </div>
        </div>
        <div className="financial-card">
          <div>
            <h2>Assets</h2>
            <p>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0}).format(bankData.ASSET * 1000)}</p>
          </div>
          <div>
            <h2>Return on Assets</h2>
            <p>{new Intl.NumberFormat('defalut', {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2}).format(bankData.ROA / 100)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UbprBankSummary