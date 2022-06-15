import { useEffect, useState } from "react"

const TempLogin = ({setLoggedIn, isLoggedIn}) => {
  const [credentials, setCredentials] = useState({})
  const [isLoading, setLoading] = useState(true)

  const handleChange = e => {
    e.preventDefault()
    setCredentials({...credentials, [e.target.name]: e.target.value})
  }

  const setLoginCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  const checkLoginCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        setLoggedIn(true)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    checkLoginCookie("isLoggedIn")
  },[])

  return (
    <>
      {!isLoading &&
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            </div>
            <form className="mt-8 space-y-6" action="#" method="POST">
              <input type="hidden" name="remember" value="true"/>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="username" className="sr-only">Username</label>
                  <input id="username" name="username" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Username" onChange={handleChange}/>
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input id="password" name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder="Password" onChange={handleChange}/>
                </div>
              </div>
            </form>
              <div>
                <button
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    if(credentials.username === "dainamic demo" && credentials.password === "dainamicdata"){
                      setLoggedIn(true)
                      setLoginCookie('isLoggedIn', true, 1)
                    } else {
                      alert("Incorrect username and password combination")
                    }
                    }}>
                  Sign in
                </button>
              </div>
          </div>
        </div>
      }
    </>
  )
}

export default TempLogin