var searchTerm = $("#searchTerm");
var searchButton = $("#searchButton");
var currentWeather = $(".currentWeather");
var cityList = JSON.parse(localStorage.getItem("searchHistory")) || [];

// on click, current weather api searched 
searchButton.on("click", function (event) {
    event.preventDefault();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchTerm.val().trim() + "&units=metric&appid=a0eab1d4c4a0b9a91854301eece7ccae"
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);

        // unhiding current weather display
        $(".currentWeather").css("display", "block");

        // getting city name and storing to local storage
        var cityName = $("<h2>");
        cityName.text(response.name);
        cityList.push(cityName.text());
        localStorage.setItem("searchHistory", JSON.stringify(cityList));
        $(".currentWeather").append(cityName);

        // setting date and time using moment.js library
        let date = $("<span>");
        date.text(" " + moment().format('MMM Do YYYY'));
        $(".currentWeather h2").append(date);

        // getting icon
        var icon = $("<img />").attr({
            "id": "icon",
            "src": "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png",
        });
        $(".currentWeather h2").append(icon);

        // getting current temp
        var currentTemp = $("<p>");
        currentTemp.text("Temperature: " + response.main.temp + "°C");
        $(".currentWeather").append(currentTemp);

        // getting humidity
        var humidity = $("<p>");
        humidity.text("Humidity: " + response.main.humidity + "%");
        $(".currentWeather").append(humidity);

        // getting wind speed
        var windSpeed = $("<p>");
        windSpeed.text("Wind Speed: " + response.wind.speed + " MPH");
        $(".currentWeather").append(windSpeed);

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
            if (response.value >= 11) {
                uvSpan.addClass("extreme");
            }
            else if (response.value >= 8) {
                uvSpan.addClass("veryHigh");
            }
            else if (response.value >= 6) {
                uvSpan.addClass("high");
            }
            else if (response.value >= 3) {
                uvSpan.addClass("moderate");
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

            for (var i = 0; i < response.list.length; i++) {
                let box = $("<div>").attr({
                    "class": "weatherBox"
                });

                // Date 
                let hour = moment(response.list[i].dt_txt);
                if (hour.hour() == 12) {
                    let date = $("<h3>");
                    date.text(moment(response.list[i].dt_txt).format('MMMM Do YYYY'));
                    $(box).append(date);

                    // getting icon
                    var icon = $("<img />").attr({
                        "id": "icon",
                        "src": "http://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png",
                    });
                    $(box).append(icon);

                    // temperature
                    var futureTemp = $("<p>");
                    futureTemp.text("Temperature: " + response.list[i].main.temp + "°C");
                    $(box).append(futureTemp);

                    // humidity
                    var futureHumidity = $("<p>");
                    futureHumidity.text("Humidity: " + response.list[i].main.humidity + "%");
                    $(box).append(futureHumidity);

                    $(".futureWeather").append(box);
                }
            }
        });
    });
});

// retrieving search history and showing on page
displayButtons();
function displayButtons() {
    for (var i = 0; i < cityList.length; i++) {
        localStorage.clear();
        var search = $("<button>").attr({
            "class": "cities"
        });
        search.text(cityList[i]);
        // console.log(search.text(cityList[i]));

        // if (cityList[i] === search.text(cityList[i])) {
        //     return
        // }
        // else {
        $(".cityList").prepend(search);
        // }
        // console.log(cityList[i]);
    }
};


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