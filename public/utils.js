const getDateLabelsForChart = (start, end) => {
  let start_date = new Date(start)
  let end_date = new Date(end)
  const generatedLabels = []
  while(end_date >= start_date){
    generatedLabels.push(start_date.toLocaleString('default', { month: 'long' , year: 'numeric'}))
    start_date.setMonth(start_date.getMonth() + 1);
  }
  return generatedLabels
}

function groupDataByMsa(list, key){
  return list.reduce(function(rv, x){
    (rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

function getLinearRegression(y,x){
  var lr = {};
  var n = y.length;
  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_xx = 0;
  var sum_yy = 0;

  for (var i = 0; i < y.length; i++) {

      sum_x += x[i];
      sum_y += y[i];
      sum_xy += (x[i]*y[i]);
      sum_xx += (x[i]*x[i]);
      sum_yy += (y[i]*y[i]);
  } 

  lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
  lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
  lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

  return lr;
}

const chartFadedColors = [
  "rgba(255, 0, 0, 0.3)",
  "rgba(0, 83, 255, 0.3)",
  "rgba(255, 225, 0, 0.3)",
  "rgba(0, 180, 0, 0.3)",
  "rgba(51, 177, 255, 0.3)",
  "rgba(255, 130, 0, 0.3)",
  "rgba(56, 245, 39, 0.3)",
  "rgba(245, 172, 39, 0.3)"
]

const chartSolidColors = [
  "rgba(255, 0, 0, 0.7)",
  "rgba(0, 83, 255, 0.7)",
  "rgba(255, 225, 0, 0.7)",
  "rgba(0, 180, 0, 0.7)",
  "rgba(51, 177, 255, 0.7)",
  "rgba(255, 130, 0, 0.7)",
  "rgba(56, 245, 39, 0.7)",
  "rgba(245, 172, 39, 0.7)"
]

const chartFadedBlues = [
  "#0005ffbf",
  "#1D4ED8bf",
  "#2563EBbf",
  "#3B82F6bf",
  "#60A5FAbf",
  "#93C5FDbf",
  "#BFDBFEbf",
  "#499adebf"
]

const chartSolidBlues = [
  "#0005ff",
  "#1D4ED8",
  "#2563EB",
  "#3B82F6",
  "#60A5FA",
  "#93C5FD",
  "#BFDBFE",
  "#499ade"
]
// const chartSolidBlues = [
//   "#1e05ff",
//   "#005cff",
//   "#3f8bff",
//   "#81b5ff",
//   "#c3dbff",
//   "#a8cbf7",
//   "#8dbaef",
//   "#6eaae6",
//   "#499ade"
// ]

export {
  getDateLabelsForChart,
  groupDataByMsa,
  getLinearRegression,
  chartFadedColors,
  chartSolidColors,
  chartFadedBlues,
  chartSolidBlues
}