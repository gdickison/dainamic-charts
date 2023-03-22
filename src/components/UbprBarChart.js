import { memo } from "react";
import { Bar } from "react-chartjs-2";

const UbprBarChart = ({bankData, dataFlag, statsData, selectedMetric}) => {

  const rawChartData = statsData
  const labels = rawChartData.map(bank => {
    return bank.QUARTER
  })

  const dataArray = rawChartData.map(bank => {
    return dataFlag === "rcon" || selectedMetric.format === "count" || selectedMetric.format === 'pct' ? bank[selectedMetric.value] : bank[selectedMetric.value]/10
  })

  function nullData(arr){
    return arr.every(element => element === null)
  }

  function zeroData(arr){
    return arr.every(element => element === "0" || element === 0)
  }

  function exportTableToExcel(){
    if(document.getElementById('exportTable') !== null) {
      var downloadLink;
      var dataType = 'application/vnd.ms-excel';
      var tableSelect = document.getElementById('exportTable');
      var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
      // Specify file name
      // filename = filename?filename+'.xls':'excel_data.xls';
      const filename = 'download.xls'
      
      // Create download link element
      downloadLink = document.createElement("a");
      
      document.body.appendChild(downloadLink);
      
      if(navigator.msSaveOrOpenBlob){
          var blob = new Blob(['\ufeff', tableHTML], {
              type: dataType
          });
          navigator.msSaveOrOpenBlob( blob, filename);
      }else{
          // Create a link to the file
          downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
      
          // Setting the file name
          downloadLink.download = filename;
          
          //triggering the function
          downloadLink.click()
      }
    }
}

  const backgroundColor = dataFlag === "rcon" ? 'rgba(255, 99, 132, 0.3)' : 'rgba(54, 162, 235, 0.3)'
  const borderColor = dataFlag === "rcon" ? 'rgb(255, 99, 132)' : 'rgb(54, 162, 235)'

  const chartData = {
    labels: labels,
    datasets: [{
      label: 'chart',
      data: dataArray,
      backgroundColor: [
        `${backgroundColor}`
      ],
      borderColor: [
        `${borderColor}`
      ],
      borderWidth: 1
    }]
  }

  const titleCode = selectedMetric.label.split(' - ')[0]
  const titleText = selectedMetric.label.split(' - ').length > 1 ? selectedMetric.label.split(' - ')[1].match(/.{50}\w*\W*|.*/g) : ''

  const barChartOptions = {
    responsive: true,
    aspectRatio: 1.5,
    interaction: {
      intersect: false
    },
    plugins: {
      title: {
        display: true,
        text: [titleCode,"", ...titleText],
        font: {
          size: 16,
          weight: 'normal'
        },
        padding: 16
      },
      legend: {
        display: false
      },
      tooltip: {
        usePointStyle: true,
        callbacks: {
          title: function(context){
            return ''
          },
          label: function(context){
            return `${Number(context.raw).toLocaleString()}${dataFlag === "rcon" || selectedMetric.format === "count" ? '' : '%'}`
          }
        },
        boxPadding: 6,
        displayColors: false
      }
    },
    scales: {
      y: {
        stacked: true,
        title: {
          display: false
        },
        ticks: {
          callback: function(value){
            return `${value.toLocaleString()}${dataFlag === "rcon" || selectedMetric.format === "count" ? '' : '%'}`
          },
          font: {
            size: 12
          }
        },
        grid: {
          display: true
        }
      },
      x: {
        stacked: true,
        title: {
          display: true,
          text: "Quarter",
          font: {
            size: 14
          }
        },
        ticks: {
          callback: function(value){
            return `${this.getLabelForValue(value).split('T')[0]}`
          },
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        }
      }
    }
  }

  return (
    <div>
      {nullData(dataArray)
        ? <div className="ubpr-no-data">
            <h1 className="text-center">{barChartOptions.plugins.title.text}</h1>
            <h2 className="text-center">No data available</h2>
          </div>
        : zeroData(dataArray)
          ? <div className="ubpr-no-data">
              <h1 className="text-center">{barChartOptions.plugins.title.text}</h1>
              <h2 className="text-center">This {dataFlag === 'pndrl' ? 'peer group' : 'institution'} does not have loans in this category</h2>
            </div>
          : <div className="ubpr-bar-chart">
              <Bar data={chartData} options={barChartOptions}/>
            </div>
      }
      <table id='exportTable' className="hidden">
        <thead>
          <tr>
            <th>{selectedMetric.label}</th>
          </tr>
          <tr>
            <th>Quarter</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {chartData.labels.map((label, i) => {
            return (
              <tr key={label.split('T')[0]}>
                <td>{label.split('T')[0]}</td>
                <td>{chartData.datasets[0].data[i]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <button onClick={exportTableToExcel}>Download Data</button>
    </div>
  )
}

export default memo(UbprBarChart)
