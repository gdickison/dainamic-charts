import { useState } from "react"

import TempLogin from "../src/components/TempLogin"
import NavCard from "../src/components/NavCard"

const Home = () => {
  const [isLoggedIn, setLoggedIn] = useState(false)

  return (
    <div className="max-w-[1600px] mx-auto">
      {isLoggedIn ?
        <>
          <header className="mx-6">
            <h1 className='py-10 px-4 text-[3.5vw] 3xl:text-6xl text-center'>
              Welcome to D<span className='text-yellow-300'>AI</span>NAMIC
            </h1>
          </header>
          <main>
            <div className="flex my-20">
              <NavCard
                title="Mortgage Data"
                page="/mortgage"
                icon="/fannie_mae_logo.png"
                description="Based on Fannie Mae's Single-Family Loan Performance Data"
              />
              <NavCard
                title="Consumer Expenditure Survey Data"
                page="/cex"
                icon="/bls_logo.svg"
                description="Based on the US Bureau of Labor Statistics Consumer Expenditure Survey"
              />
            </div>
          </main>
        </>
      : <TempLogin
        isLoggedIn={isLoggedIn}
        setLoggedIn={setLoggedIn}
      />
      }
    </div>
  )
}

export default Home
