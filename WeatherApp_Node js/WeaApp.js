
var express = require('express');
var app = express();
var request = require('request');


var server = app.listen(3000, function () {
var host = server.address().address;
var port = server.address().port;
    console.log('The app listening at http://%s:%s', host, port);
});

//URL for our API request
var APIcallUrl = 'https://api.worldweatheronline.com/premium/v1/weather.ashx?q=52.5275,13.4025&num_of_days=7&key=8fec97d499b046ccbbc70636172004&tp=24&format=json';

function dayOfWeekAsString(dayIndex) {
    var day=["Monday","Tuesday","Wednesday","Thursday","Friday","Saterday","Sunday"];
	return day[dayIndex];
}
//Requested Time
var requestTime = function (req, res, next) {
  req.requestTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  next()
}
app.use(requestTime)

app.get('/', function (req, res) {
    request(APIcallUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            // parse the json result
            var result = JSON.parse(body);

           // generate a HTML table
		    var html = "<h2>Weather Application for seven days </h2>";
			
			html += '<h4>Requested at: ' + req.requestTime + ' </h4>';
            html += '<table style="font-size: 12px; font-family: Times New Roman, Georgia, Serif">';

           // loop through each row
           for (var i = 0; i < 4; i++) {
               html += "<tr >";
                
				switch (i) {
                     case 0:
                        html += "<td > <strong>Day of the weak: </strong></td>";
                         break;
                    case 1:
                         html += "<td></td>";
                         break;
                    case 2:
                        html += "<td><strong>Weather Description:</strong></td>";
                        break;
					case 3:
                        html += "<td><strong>Min-Max Temperature:</strong></td>";
                        break;
				}
				
				result.data.weather.forEach(function(weather) {
                   html += "<td>";
				   if (i==0){
					    html += dayOfWeekAsString(new Date(weather.date).getDay());
				   } else if (i==1){
					    var imgSrc = weather.hourly[0].weatherIconUrl[0].value;
                        html += '<img src="'+ imgSrc + '" alt="" />';
 				   } else if (i==2) {
					    html += weather.hourly[0].weatherDesc[0].value;
				   }else {
					   var TempMax = weather.maxtempC;
					    var TempMin = weather.mintempC;
                        html += '<p> <strong>'+TempMin+ "C - "+ TempMax + ' C</strong></p>';
				   }
				   
                  html += "</td>";
              });
              html += "</tr>";
          }
		 
          res.send(html);
        } else {
           console.log(error, response.statusCode, body);
        }
        res.end("");
    });
});