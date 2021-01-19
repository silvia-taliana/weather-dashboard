var searchTerm = $("#searchTerm");
var searchButton = $("#searchButton");
var currentWeather = $(".currentWeather");
var cityList = JSON.parse(localStorage.getItem("searchHistory")) || [];
var searchHistory;

// on click, current weather api searched 
searchButton.on("click", function (event) {
    event.preventDefault();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm.val().trim() + "&units=metric&appid=a0eab1d4c4a0b9a91854301eece7ccae"
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);

        // getting city name and storing to local storage
        var cityName = $("<h2>");
        cityName.text(response.name);
        cityList.push(cityName.text());
        localStorage.setItem("searchHistory", JSON.stringify(cityList));
        $(".currentWeather").append(cityName);

        // getting icon
        var icon = $("<img />").attr({
            "id": "icon",
            "src": "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png",
        });
        $(".currentWeather").append(icon);

        // getting current temp displaying to one decimal point
        var currentTemp = $("<p>");
        currentTemp.text(response.main.temp);
        var temp = (Math.round(currentTemp.text() * 100) / 100).toFixed(1);
        $(".currentWeather").append("Temperature: " + temp + "°C");

        // getting humidity
        var humidity = $("<p>");
        humidity.text(response.main.humidity);
        $(".currentWeather").append("Humidity: " + humidity.text() + "%");

        // getting wind speed
        var windSpeed = $("<p>");
        windSpeed.text(response.wind.speed);
        $(".currentWeather").append("Wind Speed: " + windSpeed.text() + " MPH");

        // UV index 
        var lon = response.coord.lon;
        var lat = response.coord.lat;

        var UVRating = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=a0eab1d4c4a0b9a91854301eece7ccae"
        $.ajax({
            url: UVRating,
            method: "GET"
        }).then(function (response) {
            var uvIndex = $("<p>");
            var uvSpan = $("<span>");
            uvIndex.text("UV Index: ");
            uvSpan.text(response.value);
            if (response.value >= 8) {
                uvSpan.addClass("high");
            }
            else {
                uvSpan.addClass("low");
            };
            uvIndex.append(uvSpan);
            $(".currentWeather").append(uvIndex);
        });

        // 5 Day forecast
        var futureURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchTerm.val().trim() + "&units=metric&appid=a0eab1d4c4a0b9a91854301eece7ccae"
        $.ajax({
            url: futureURL,
            method: "GET",
        }).then(function (response) {
            console.log(response)

            // temperature
            for (var i = 0; i < 5; i++) {
                var futureTemp = $("<p>");
                futureTemp.text(response.list[i].main.temp);
                var temps = (Math.round(futureTemp.text() * 100) / 100).toFixed(1);
                $(".futureWeather").append("Temperature: " + temps + "°C");

                //wind speed
                var futureWind = $("<p>");
                futureWind.text(response.list[i].wind.speed);
                $(".futureWeather").append("Wind Speed: " + futureWind.text() + " MPH");
            }
        });
    });
    displayButtons();
});

// retrieving search history and showing on page 
function displayButtons() {
    for (var i = 0; i < cityList.length; i++) {
        var search = $("<button>");
        search.text(cityList[i]);
        $(".cityList").prepend(search);
    }
};


// $(".cityList").prepend(cityList);


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
// if time, create toggle buttons for different units