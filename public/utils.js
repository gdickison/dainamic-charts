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
  "#00876c",
  "#51a573",
  "#88c27b",
  "#c2dd85",
  "#fff795",
  "#fdcb6e",
  "#f69e56",
  "#e96f4e",
  "#d43d51"
]

const chartHoverColors = [
  "#00876c",
  "#51a573",
  "#88c27b",
  "#c2dd85",
  "#fff795",
  "#fdcb6e",
  "#f69e56",
  "#e96f4e",
  "#d43d51"
]

const chartSolidBlues = [
  "#00876c",
  "#51a676",
  "#88c580",
  "#c2e38c",
  "#ffff9d",
  "#fdd172",
  "#f7a258",
  "#ea714e",
  "#d43d51"
]

const chartBackgroundColors = [
  "#00876c",
  "#50a16e",
  "#86ba71",
  "#bfd177",
  "#fae684",
  "#f8be65",
  "#f29553",
  "#e76b4d",
  "#d43d51"
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
  chartBackgroundColors,
  chartHoverColors,
  chartFadedColors,
  chartSolidColors,
  chartFadedBlues,
  chartSolidBlues
}