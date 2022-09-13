function getAverage(array){
  return (array.reduce((a, b) => Number(a) + Number(b)) / array.length).toFixed(2)
}

function getPercentage(part, whole){
  return ((Number(part) / Number(whole)) * 100).toFixed(2)
}

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

function groupDataByRegion(list, key){
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

function getQuarter(date = new Date()) {
  return Math.floor(date.getMonth() / 3 + 1);
}

function split(str, index) {
  const result = [str.slice(0, index), str.slice(index)];

  return result;
}

const chartFadedColors = [
  'rgb(31,120,180, 0.5)',
  'rgb(51,160,44, 0.5)',
  'rgb(227,26,28, 0.5)',
  'rgb(253,191,111, 0.5)',
  'rgb(255,127,0, 0.5)',
  'rgb(106,61,154, 0.5)',
  'rgb(255,255,100, 0.5)',
  'rgb(177,89,40, 0.5)'
]

const chartSolidColors = [
  'rgb(31,120,180, 0.9)',
  'rgb(51,160,44, 0.9)',
  'rgb(227,26,28, 0.9)',
  'rgb(253,191,111, 0.9)',
  'rgb(255,127,0, 0.9)',
  'rgb(106,61,154, 0.9)',
  'rgb(255,255,100, 0.9)',
  'rgb(177,89,40, 0.9)'
]

const pointStyles = [
  'circle',
  'rect',
  'triangle',
  'rectRot'
]

const regressionLineColor = '#94A3B8'

export {
  getAverage,
  getPercentage,
  getDateLabelsForChart,
  groupDataByRegion,
  getLinearRegression,
  getQuarter,
  split,
  chartFadedColors,
  chartSolidColors,
  pointStyles,
  regressionLineColor
}