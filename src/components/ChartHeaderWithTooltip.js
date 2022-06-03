const ChartHeaderWithTooltip = ({chartName, msa, tooltip}) => {
  return (
    <div className="relative">
      <h1 className="inline my-2 text-2xl">{chartName} for {msa}</h1>
      <div className="inline-block h-6 w-6 group hover:cursor-pointer">
        <img className="h-4 mx-3" src="/more_info.png" alt="learn more" />
        <div className="hidden group-hover:inline absolute top-0 right-8 bottom-0 h-min w-1/2 bg-slate-50 z-10 border-2 border-slate-400 rounded-md p-2 text-sm">
          <p>{tooltip}</p>
        </div>
      </div>
    </div>
  )
}

export default ChartHeaderWithTooltip