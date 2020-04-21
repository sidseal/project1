$('.carousel').carousel();
 
//When the page loads the screen should be clear of any "errors"
$(window).on( "load", function() {
 
});

//get the capital of the country the user types in
$("#search").on("click", function(event){
  event.preventDefault();
  var country = $("#countryInput").val().trim().toLowerCase();
  if (country) {
        $("#countryInput").val("");
    } 
    getCountryInfo(country);
}) 

//get capital from api to search with
function getCountryInfo(country){
  var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://restcountries-v1.p.rapidapi.com/all",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "restcountries-v1.p.rapidapi.com",
		"x-rapidapi-key": "52dbb116femsh414adea3d2d39b0p1baee8jsn399515d8751e"
	}
}
$.ajax(settings).done(function (response) {
    console.log(response);
  for (var i = 0; i < response.length; i++) {
    var countryMatch = (response[i].name).toLowerCase(); 
    if (country === countryMatch){
      var capital = response[i].capital;
      $("#capital").text(capital + ", " + response[i].name);

      getPictures(capital);
      getWeather(capital);
      getForecast(capital);
    }
    }
});
}

//searched for picture based on the capital
function getPictures(capital){
    var queryURL = "https://api.unsplash.com/search/photos?query=" + capital + "&per_page=20&client_id=tLFvPdAvAFpRTR2LhyEwk38gT8ALPvluLPQTUjttXfc"

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response){
      var picList = response.results;     
      showPictures(picList);
    })
}

//shows pictures in a carousel
function showPictures(picList){
  var count = 1;
  for (var i = 0; i < 20; i++){
    var picWidth = picList[i].width;
    var picHeight = picList[i].height;
    if(picWidth > picHeight){
      var picURL = picList[i].urls.regular;
      $("#pic-" + count).attr("src", picURL );
      $("#pic-" + count).addClass("sizeIt");
      count++;
    }
  }
}

//openweathermap API to get current weather for capital city
function getWeather(capital) { 
  $("#errorMadeArea").hide();   
  var currentQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + capital + "&APPID=62fca606199df2afea0a32e25faffdc5";

  $.ajax({
      url: currentQueryURL,
      method: "GET"
  }).then(function(response){
    var timeZone = (response.timezone)/60/60;
      showWeather(response);
      showTimes(timeZone);
      
      
  }).catch(function(){
      $("#errorMadeArea").show();
  });
}
$("#errorMadeArea").hide();   


function showWeather(response){
  $("#capitalCity").text(response.name)
  var currentDate = moment().format("MM/DD/YY"); 
  $("#date").text("(" + currentDate + ")");
  var icon = response.weather[0].icon;
  var iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
  $("#mainIcon").attr("src", iconURL);
  var mainTemp = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(0); 
  $("#temp").text(mainTemp);   
}

function getForecast(capital){
  var forecastQueryURL= "http://api.openweathermap.org/data/2.5/forecast?q=" + capital + "&APPID=62fca606199df2afea0a32e25faffdc5";;
    $.ajax({
        url:forecastQueryURL,
        method: "GET"
    }).then(showForecast)
}


function showForecast(forecastResponse){
  var list = forecastResponse.list;
  var count = 1;   
  for (var i = 0; i < list.length; i++){
 
    if (list[i].dt_txt.includes("15:00:00")) {
        
        $("#date-"+ count).text(new Date(list[i].dt_txt).toLocaleDateString());
        
        var iconURL = "http://openweathermap.org/img/w/" + list[i].weather[0].icon + ".png";
        $("#icon-"+ count).attr("src", iconURL);

        $("#temp-"+ count).text(((list[i].main.temp- 273.15) * 1.80 +32).toFixed(0));
        
        count++; 
    }
  }
}


//
function showTimes(timeZone){
  var capitalTime = moment().utcOffset(timeZone).format('h:mm A');
  $("#capitalTime").text(capitalTime);

  var capHrs = moment().utcOffset(timeZone).format('h');
  var currentHrs= moment().format('h');
  console.log(capHrs);
  console.log(currentHrs);
  $("#dateTime").text(moment().format('MMMM Do YYYY, h:mm:ss a'));
  $("#currentTimeZone").text(moment().format('LT'));

}


$('#modal1').modal();