var searchTerm = $("#searchTerm");
var searchButton = $("#searchButton");
var currentWeather = $(".currentWeather");

// on click, current weather api searched 
searchButton.on("click", function (event) {
    event.preventDefault();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm.val().trim() + "&appid=a0eab1d4c4a0b9a91854301eece7ccae"
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        // getting city name
        var cityName = $("<h2>");
        cityName.text(response.name);
        $(".currentWeather").append(cityName);

        // getting current temp, converting to celcius, displaying to one decimal point
        var currentTemp = $("<p>");
        currentTemp.text(response.main.temp - 273.15);
        var temp = (Math.round(currentTemp.text() * 100) / 100).toFixed(1);
        $(".currentWeather").append("Temperature: " + temp);

        // getting humidity
        // response.main.humidity 
        var humidity = $("<p>");
        humidity.text(response.main.humidity);
        $(".currentWeather").append("Humidity: " + humidity.text());

        // getting wind speed
        // response.wind.speed
        var windSpeed = $("<p>");
        windSpeed.text(response.wind.speed);
        $(".currentWeather").append("Wind Speed: " + windSpeed.text() + " MPH");
    });
});

// pseudo code:
// 1. get data from api using ajax
// 2. THEN create a function to bring up response
// 3. identify and call upon required data to be displayed on the screen
// i.e. city name, date, icon representation of weather conditions, temperature,
// humidity, wind speed and UV index (colour coded for favourable/moderate/severe)
// 4. display 5 day forecast with date, icon representation of weather conditions,
// temperature and humidity
// 5. create a list and store searched city in there
// 6. make that list a button so the city can be searched again
// 7. store searches in local storage and redisplay to screen upon refreshing
