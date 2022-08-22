const ChartTitle = ({chartName, msa}) => {
  return (
    <div className="relative my-4">
      <h1 className="inline text-2xl">{chartName} for {msa}</h1>
    </div>
  )
}

export default ChartTitle