// export const getMsaName = async (params) => {
//   const JSONdata = JSON.stringify({
//     msaCode: params.msaCode
//   })

//   const endpoint = `/api/get_msa_name`
//   const options = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSONdata
//   }
//   const response = await fetch(endpoint, options)
//   const status = response.status
//   let data = await response.json()
//   data = data.response

//   if(status === 404){
//     console.log("There was an error getting the msa name")
//   } else if(status === 200){
//     return data
//   }
// }
