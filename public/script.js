var moviesByRating, moviesByYear;

google.charts.load('45', { packages: ['corechart', 'table', 'geochart'] });
google.charts.setOnLoadCallback(getJsonData);

function getJsonData() {
    $.ajax({
        url: "/articles",
        dataType: "json",
        success: function (jsonData){
            moviesByRating = sortMoviesByRating(jsonData);
            moviesByYear = sortMoviesByYear(jsonData);
            moviesByDuration = sortMoviesByDuration(jsonData);

            
            drawPieChart(moviesByRating);
            drawColumnChart(moviesByYear);
            drawAreaChart(moviesByYear);
            drawPieChart2(moviesByDuration);
            //drawTable(jsonData);
            
        }
    });
}

function sortMoviesByRating(jsonData) {
    var res = [0,0,0,0];

    for (var i = 0; i <= jsonData.length; i++) {
        if(i == jsonData.length) {
            res[0] = res[0]/jsonData.length;
            res[1] = res[1]/jsonData.length;
            res[2] = res[2]/jsonData.length;
            res[3] = res[3]/jsonData.length;
            return res;
        } else if(Number(jsonData[i].rating) > 9) {
            res[0]++;
        } else if(Number(jsonData[i].rating) > 8) {
            res[1]++;            
        } else if(Number(jsonData[i].rating) > 7) {
            res[2]++;            
        } else {
            res[3]++;
        }
    }
}

function sortMoviesByYear(jsonData) {
    var res = [];
    var oldestMovieYear = new Date().getFullYear() + 1;
    var formatedData = {};

    for (var i = 0; i <= jsonData.length; i++) {
        if(i == jsonData.length) {
            return formatArray();
        }

        if(!formatedData['year_' +jsonData[i].year_type]) {
            oldestMovieYear = (oldestMovieYear > +jsonData[i].year_type) ? +jsonData[i].year_type : oldestMovieYear;
            formatedData['year_' +jsonData[i].year_type] = 0;
        }
        formatedData['year_' +jsonData[i].year_type]++;
    }

    function formatArray() {
        for (var i = oldestMovieYear; i <= new Date().getFullYear() + 1; i++) {
            if(i == new Date().getFullYear() + 1) {
                return res;    
            }
            res.push([i.toString(), formatedData['year_'+i] || 0 ]);
        }
    }
}

function sortMoviesByDuration(jsonData) {
    var resArr = [0,0,0,0];

    for (var i = 0; i <= jsonData.length; i++) {
        if(i == jsonData.length) {
            resArr[0] = resArr[0]/jsonData.length;
            resArr[1] = resArr[1]/jsonData.length;
            resArr[2] = resArr[2]/jsonData.length;
            resArr[3] = resArr[3]/jsonData.length;
            return resArr;
        } else if(Number(jsonData[i].duration) > 120) {
            resArr[0]++;
        } else if(Number(jsonData[i].duration) > 100) {
            resArr[1]++;            
        } else if(Number(jsonData[i].duration) > 90) {
            resArr[2]++;            
        } else {
            resArr[3]++;
        }
    }
}

function drawPieChart(moviesByRating) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Element');
    data.addColumn('number', 'Percentage');

    data.addRows([
        ['> 9', moviesByRating[0] ],
        ['> 8', moviesByRating[1] ],
        ['> 7',  moviesByRating[2] ],
        ['<= 6',  moviesByRating[3] ]
    ]);

    var options = {
        legend: 'left',
        title: 'Rating Measurement',
        is3D: true,
        width: '100%',
        height: '100%'
    };

    // Instantiate and draw the chart.
    var chart = new google.visualization.PieChart(document.getElementById('pie_chart'));
    chart.draw(data, options);
}

function drawColumnChart(moviesByYear) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Year');
    data.addColumn('number', 'Movies');

    data.addRows(moviesByYear);

    var options = {
        title: 'Movies by Year',
        hAxis: { title: 'Year', titleTextStyle: { color: 'red' } }
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('column_chart'));
    chart.draw(data, options);
}


function drawAreaChart(moviesByYear) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Year');
    data.addColumn('number', 'Movies');

    data.addRows(moviesByYear);

    var options = {
        title: 'Movies By Year',
        hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
        vAxis: { minValue: 0 }
    };

    var chart = new google.visualization.AreaChart(document.getElementById('area_chart'));
    chart.draw(data, options);
}

function drawPieChart2(moviesByDuration) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Element');
    data.addColumn('number', 'Percentage');

    data.addRows([
        ['> 120m', moviesByDuration[0] ],
        ['> 100m', moviesByDuration[1] ],
        ['> 90m',  moviesByDuration[2] ],
        ['<= 90m',  moviesByDuration[3] ]
    ]);

    var options = {
        legend: 'left',
        title: 'Duration Measurement',
        width: '100%',
        height: '100%',
        pieHole: 0.4
    };

    // Instantiate and draw the chart.
    var chart = new google.visualization.PieChart(document.getElementById('pie_chart2'));
    chart.draw(data, options);
}

/*
function drawTable(jsonData) {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Title');
            data.addColumn('string', 'Year_Type');
            data.addColumn('string', 'Rating');
            data.addColumn('string', 'Duration');

            for (var i = 0; i < jsonData.length; i++) {
                data.addRow([
                    jsonData[i].title,
                    jsonData[i].year_type,
                    jsonData[i].rating,
                    jsonData[i].duration,
                ]);
            }

            var options = {
                allowHtml: true,
                showRowNumber: true,
                width: '100%',
                height: '100%'
            };

            var table = new google.visualization.Table(document.getElementById('barformat_div'));
            var formatter = new google.visualization.BarFormat({ width: 100 });
            formatter.format(data, 3); // Apply formatter to 3rd column
            table.draw(data, options);
        };

*/

$(window).resize(function () {
    drawPieChart(moviesByRating);
    drawColumnChart(moviesByYear);
    drawAreaChart(moviesByYear);
    drawPieChart2(moviesByDuration);
    //drawTable(jsonData);
});