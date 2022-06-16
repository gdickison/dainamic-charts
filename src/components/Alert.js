/* eslint-disable @next/next/no-img-element */
const Alert = ({message, closeAlert}) => {
  return (
    <div className="flex justify-around items-center w-96 min-h-[100px] h-max-content my-[20px] mx-auto absolute top-40 left-0 right-0 bg-blue-400 p-4 border-4 border-blue-800 rounded-lg shadow-lg text-rbRed">
      <span className="w-3/5 text-white text-2xl">{message}</span>
      <span className="text-4xl text-center hover:cursor-pointer hover:scale-150" onClick={closeAlert}>&times;</span>
    </div>
  )
}

export default Alert