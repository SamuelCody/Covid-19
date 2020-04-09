$(document).ready(function() {

  //global data
  $.getJSON('https://covidapi.info/api/v1/global')
    .then(function(summary) {
      const {
        confirmed,
        deaths,
        recovered
      } = summary.result;

      $('#totalCase').append(`${formatNumber(confirmed)}`);
      $('#totalRecovered').append(`${formatNumber(recovered)}`);
      $('#totalDeceased').append(`${formatNumber(deaths)}`);

      donutData('morris-donut-global',confirmed, recovered, deaths);
    })

  $.getJSON('https://covidapi.info/api/v1/global/count')
    .then(function(dateCount) {
      const result = dateCount.result;
      const keys = Object.keys(result);
      const values = Object.values(result);

      let recoveredCaseArr = [];
      values.forEach(function(value, i) {
        recoveredCaseArr.push({y: keys[i], a: value.recovered})
      })

      let infectedCaseArr = [];
      values.forEach(function(value, i) {
        infectedCaseArr.push({y: keys[i], a: value.confirmed})
      })

      lineChartData(infectedCaseArr, 'morris-line-global-infected', 'Infected', ['#f9c851']);
      lineChartData(recoveredCaseArr, 'morris-line-global-recovered', 'Recovered', ['#10c469']);

    })


  //nigeria data
  $.getJSON('https://covidapi.info/api/v1/country/NGA/latest')
    .then(function(latest) {
      const nga = Object.values(latest.result);
      const ngaConfirmed = nga[0].confirmed;
      const ngaDeaths = nga[0].deaths;
      const ngaRecovered = nga[0].recovered;

      $('#totalNgCase').append(`${formatNumber(ngaConfirmed)}`);
      $('#totalNgRecovered').append(`${formatNumber(ngaDeaths)}`);
      $('#totalNgDeceased').append(`${formatNumber(ngaRecovered)}`);

      donutData('morris-donut-nigeria', ngaConfirmed, ngaRecovered, ngaDeaths);
    })


    const initialDate = formatDate("2020-03-15");
    const newDate = formatDate(Date.now());
    $.getJSON(`https://covidapi.info/api/v1/country/NGA/timeseries/${initialDate}/${newDate}`)
      .then(function(ngdata) {
        const ng = ngdata.result;
        const newInfectedArr = ng.map(function(data) {
          return {y: data.date, a: formatNumber(data.confirmed)}
        })

        const newRecoveredArr = ng.map(function(data) {
          return {y: data.date, a: formatNumber(data.recovered)}
        })

        lineChartData(newInfectedArr, 'morris-line-nga-infected', 'Infected', ['#f9c851']);
        lineChartData(newRecoveredArr, 'morris-line-nga-recovered', 'Recovered', ['#10c469']);
      })




})

$.getJSON('https://api.covid19api.com/summary')
  .then(function(data) {
    const rawData = data.Countries;
    const newData = rawData.map(function(d) {
      return {country: d.Country, confirmed: d.TotalConfirmed, recovered: d.TotalRecovered, death: d.TotalDeaths}
    })
    newData.forEach(function(data, index) {
      $('#countryData').append(`<tr>
          <td>${index + 1}</td>
          <td>${data.country}</td>
          <td>${data.confirmed}</td>
          <td>${data.recovered}</td>
          <td>${data.death}</td>
      </tr>`);
    })
  })

//functions
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function formatDate(date) {

  const dateVar = new Date(date);
  const formatted = dateVar.toISOString().substr(0,10);
  return formatted
}



function donutData(id, c, r, d) {
  return Morris.Donut({
    element: id,
    data: [
      {label: "Infected", value: c},
      {label: "Recovered", value: r},
      {label: "Death", value: d}
    ],
    resize: !0,
    colors: ["#f9c851", "#10c469", "#ff5b5b"],
    backgroundColor: "#323a46",
    labelColor: "#fff"
  });
}

function lineChartData(data, id, labels, lineColors) {
  return Morris.Line({
    element: id,
    data: data,
    xkey: "y",
    ykeys: ["a"],
    labels: [labels],
    fillOpacity: ["0.9"],
    pointFillColors: ["#ffffff"],
    pointStrokeColors: ["#999999"],
    behaveLikeLine: !0,
    gridLineColor: "#323a46",
    hideHover: "auto",
    resize: !0,
    pointSize: 0,
    gridTextColor: "#98a6ad",
    lineColors: lineColors
  });
}

// f708196056324d8cb96b92f444a0a3a3
