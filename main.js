const input = document.getElementById('search');
const button = document.getElementById('search-btn');
const weatherEl = document.getElementById('weather');
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const gpsBtn = document.getElementById("gps-btn");
const dateEl = document.querySelector(".date");//日付取得
const historyEl = document.getElementById("history");//履歴要素を取得
const clearBtn = document.getElementById("clear-history");//履歴要素削除
const suggestEl = document.getElementById("suggest");//検索候補取得
const forecastEl = document.getElementById("forecast");//5日間天気予報取得

const API_KEY = '868203e3e952779fb2fc8c20424ba166';

//候補都市
const cities = [
    "Tokyo",
    "Osaka",
    "Kyoto",
    "Sapporo",
    "London",
    "Paris",
    "New York",
    "Seoul"
];

// ====================
//日付表示
// ====================
function renderDate() {
  //年月日取得
  const today = new Date();

  let year = today.getFullYear();//年
  let month = String(today.getMonth() +1).padStart(2, '0');//月
  let day = String(today.getDate()).padStart(2, '0');//日

  //曜日取得
  const Week = ["日","月","火","水","木","金","土"];
  const w = Week[today.getDay()];

  dateEl.textContent = `${year}/${month}/${day} （${w}）`;

  //曜日で色変更
  if (w === "日") {
    dateEl.style.color = "red";
  } else if (w === "土") {
    dateEl.style.color = "blue";
  } else {
    dateEl.style.color = "black";
  }
}

// ====================
// 背景変更（時間帯 + 天気）
// ====================
function setBackground(main, hour) {
  let time = "";
  let weather = "";

  // 🌤 時間帯
  if (hour >= 5 && hour < 19) {
    time = "day";
  } else {
    time = "night";
  }

  // ☁️ 天気
  if (main === "Clear") {
    weather = "clear";// 🌞 晴れ
  } else if (main === "Rain") {
    weather = "rain";// ☔ 雨
  } else if (main === "Clouds") {
    weather = "cloud";// ☁️ 曇り
  } else if (main === "Snow") {
    weather = "snow";// ❄️ 雪
  } else {
    weather = "other";
  }

  // クラス合体！！
  document.body.className = `${time}-${weather}`;

}

// ====================
// ユーティリティ
// ====================
function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ====================
// ランダムコメント
// ====================
const clearComments = [
  "今日は洗濯日和！☀️",
  "気持ちいい天気だね✨",
  "お出かけしたくなるね🚶",
  "最高の空だよ！"
];

const rainComments = [
  "傘を忘れずにね☔",
  "足元注意だよ！",
  "今日はのんびりもアリ😊",
  "無理しないでね✨"
];

// ====================
// アニメーション
// ====================

//曇りアニメーション
function createClouds() {
  const container = document.querySelector(".cloud-container");
  container.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const cloud = document.createElement("div");
    cloud.classList.add("cloud");
    cloud.textContent = "☁️";
    cloud.style.top = Math.random() * 60 + "%";
    cloud.style.animationDuration = 10 + Math.random() * 10 + "s";
    container.appendChild(cloud);
  }
}

//雨アニメーション
function createRain() {
  const container = document.querySelector(".rain-container");
  container.innerHTML = "";
  for (let i = 0; i < 80; i++) {
    const rain = document.createElement("div");
    rain.classList.add("rain");
    rain.style.left = Math.random() * 100 + "vw";
    rain.style.animationDuration = 0.4 + Math.random() * 1.2 + "s";
    container.appendChild(rain);
  }
}

//雪アニメーション
function createSnow() {
  const container = document.querySelector(".snow-container");
  container.innerHTML = "";

  for (let i = 0; i < 40; i++) {
    const snow = document.createElement("div");
    snow.classList.add("snow");
    snow.style.left = Math.random() * 100 + "vw";
    snow.style.animationDuration = 3 + Math.random() * 5 + "s";
    snow.style.width = 5 + Math.random() * 10 + "px";
    snow.style.height = snow.style.width;
    snow.style.opacity = 0.5 + Math.random() * 0.5;
    container.appendChild(snow);
  }
}

//晴れアニメーション
function createSun() {
  const container = document.querySelector(".sun-container");
  container.innerHTML = "";

  const sun = document.createElement("div");
  sun.classList.add("sun");
  container.appendChild(sun);
}

// アニメーション初期化
function clearAnimations() {
  document.querySelector(".cloud-container").innerHTML = "";
  document.querySelector(".rain-container").innerHTML = "";
  document.querySelector(".snow-container").innerHTML = "";
  document.querySelector(".sun-container").innerHTML = "";
}

// ====================
// 天気表示
// ====================
function renderWeather(data) {

  //天気で背景変更
  const main = data.weather[0].main;

  //Dateオブジェクトから｢時｣｢分｣の数値を取り出す
  //時刻を2桁表示
  const now = new Date();//現在時刻
  const hour = now.getHours();//時
  const min = String(now.getMinutes()).padStart(2, '0');//分
  const displayHour = String(hour).padStart(2, "0");// 表示専用

  setBackground(main, hour);//背景変更
    
  clearAnimations();
    
  //天気アイコン追加
  let weatherIcon = "";
  //天気用コメント
  let comment = "";

  if (main === "Clear") {
    weatherIcon = "☀️";
    createSun();
    comment = getRandom(clearComments);
  } 
  else if (main === "Rain") {
    weatherIcon = "☔";
    createRain();
    comment = getRandom(rainComments);
  } 
  else if (main === "Clouds") {
    weatherIcon = "☁️";
    createClouds();
    comment = "過ごしやすいかも？";
  }
  else if (main === "Snow") {
    weatherIcon = "❄️";
    createSnow();
    comment = "滑りやすいので足元注意！"
  } 
  else {
    weatherIcon = "🌈";
    comment = "今日もいい一日を✨";
  }
    
  //アイコン取得
  const icon = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  //表示&都市名表示
  weatherEl.innerHTML = `
    <img src="${iconUrl}">
    <p>${weatherIcon} 天気 : ${data.weather[0].description}</p>
    <p class="comment">${comment}</p>
    <p>🌡 気温 : ${data.main.temp}℃</p>
    <p>🤔 体感 : ${data.main.feels_like}℃</p>
    <p>💧 湿度 : ${data.main.humidity}%</p>
    <p>🍃 風速 : ${data.wind.speed}m/s</p>
    <p>📍 ${data.displayName || data.name}</p>
    <p>🕒 最終更新 : ${displayHour}:${min}</p>
  `;
} 

// ====================
// 5日間天気予報（都市名）
// ====================
async function fetchForecast(city) {
  try {
    const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ja`
    );
  
    if (!res.ok) {
      throw new Error("予報取得エラー: " + res.status);
    }

    const data = await res.json();

    const forecast = data.list
      .filter(item => item.dt_txt.includes("12:00:00"));//毎日12時取得

    forecastEl.innerHTML = forecast
      .map(day => {
        const main = day.weather[0].main;

        let weatherIcon = "🌈";
        if (main === "Clear") weatherIcon = "☀️";
        else if (main === "Clouds") weatherIcon = "☁️";
        else if (main === "Rain") weatherIcon = "☔";
        else if (main === "Snow") weatherIcon = "❄️";

        const date = day.dt_txt.slice(5, 10).replace("-", "/");

        return `
          <div class="forecast-card">
            <p class="forecast-date">${date}</p>
            <p class="forecast-icon">${weatherIcon}</p>
            <p class="forecast-temp">${Math.round(day.main.temp)}℃</p>
            <p class="forecast-desc">${day.weather[0].description}</p>
          </div>
        `;
     })
     .join("");
 } catch (error) {
   console.error(error);
   forecastEl.innerHTML = "<p>週間予報の取得に失敗しました</p>";
 }
}

// ====================
// 5日間天気予報（現在地）
// ====================
async function fetchForecastByLocation(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`
    );

    if (!res.ok) {
      throw new Error("予報取得エラー: " + res.status);
    }

    const data = await res.json();

    const forecast = data.list
      .filter(item => item.dt_txt.includes("12:00:00")); // 毎日12時取得

    forecastEl.innerHTML = forecast
      .map(day => {
        const main = day.weather[0].main;

        let weatherIcon = "🌈";
        if (main === "Clear") weatherIcon = "☀️";
        else if (main === "Clouds") weatherIcon = "☁️";
        else if (main === "Rain") weatherIcon = "☔";
        else if (main === "Snow") weatherIcon = "❄️";

        const date = day.dt_txt.slice(5, 10).replace("-", "/");

        return `
          <div class="forecast-card">
            <p class="forecast-date">${date}</p>
            <p class="forecast-icon">${weatherIcon}</p>
            <p class="forecast-temp">${Math.round(day.main.temp)}℃</p>
            <p class="forecast-desc">${day.weather[0].description}</p>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error(error);
    forecastEl.innerHTML = "<p>週間予報の取得に失敗しました</p>";
  }
}

// ====================
// 都市名から天気取得
// ====================
async function fetchWeather(city) {

  //検索中ボタンロック
  button.disabled = true;

  // ローディング表示
  statusEl.style.display = "flex";
  statusEl.style.opacity = "1";
  statusEl.innerHTML = `
    <div class="loader"></div>
    <span>読み込み中...</span>
  `;

  //初期化
  resultEl.textContent = "";

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ja`);//APIにアクセス

    if (!res.ok) {
      throw new Error('HTTPエラー: ' + res.status);//エラーチェック
    }

    const data = await res.json();//JSONに変換

    renderWeather(data);
    fetchForecast(city);
    saveHistory(city);
    renderHistory();
  } catch (error) {
    console.error(error);
    weatherEl.textContent = '天気情報の取得に失敗しました';
  //ボタンロック解除
  } finally {
    //ローディング薄く→消す
    statusEl.style.opacity = "0";

    setTimeout(() => {
      statusEl.style.display = "none";
    }, 300); // transitionと同じ時間
    
    button.disabled = false;
  }
}

// ====================
// 現在地から天気取得
// ====================
async function fetchWeatherByLocation(lat, lon, ) {
  //検索中ボタンロック
  button.disabled = true;

  // ローディング表示
  statusEl.style.display = "flex"
  statusEl.style.opacity = "1";
  statusEl.innerHTML = `
    <div class="loader"></div>
    <span>読み込み中...</span>
  `;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ja`
    );

    if (!res.ok) {
      throw new Error('HTTPエラー: ' + res.status);//エラーチェック
    }

    const data = await res.json();

    const locationName = await getLocationName(lat, lon, );
    data.displayName = locationName;

    renderWeather(data);
    fetchForecastByLocation(lat, lon);
  } catch (error) {
    console.error(error);
    weatherEl.textContent = "天気情報の取得に失敗しました";
    forecastEl.innerHTML = "";
  } finally {
    statusEl.style.opacity = "0";

    setTimeout(() => {
      statusEl.style.display = "none";
    }, 300);

    button.disabled = false;
  }
}

// ====================
// 現在地の地名取得（逆ジオコーディング）
// ====================
async function getLocationName(lat, lon, ) {
  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
  );

  const data = await res.json();
  const place = data[0];

  if (!place) {
    return "現在地"
  }

  return place.local_names?.ja || place.name;
}

// ====================
// 検索候補
// ====================
input.addEventListener("input", () => {

  const keyword = input.value.trim().toLowerCase();

  if (!keyword) {
    suggestEl.innerHTML = "";
    return;
  }

  const result = cities
    .filter(city => city.toLowerCase().includes(keyword))
    .slice(0,5);

  suggestEl.innerHTML = result
    .map(city => `<li class="suggest-item">${city}</li>`)
    .join("");
});

suggestEl.addEventListener("click", (e) => {
  const item = e.target.closest(".suggest-item"); 
  if (!item) return;

  const city = item.textContent;

  input.value = city;// 入力欄に入れる
  fetchWeather(city);// 天気取得
  suggestEl.innerHTML = "";// 候補消す
});

// ====================
// 履歴機能
// ====================
function getHistory() {
  return JSON.parse(localStorage.getItem("history")) || [];
}

function renderHistory() {
  const history = getHistory();

  historyEl.innerHTML = history
    .map(city => `<li><button class="history-btn">${city}</button></li>`)
    .join("");
}

function saveHistory(city) {
  let history = getHistory();

  history = history.filter(c => c !== city);
  history.unshift(city);

  history = history.slice(0, 5);//先頭5件だけ残す

  localStorage.setItem("history", JSON.stringify(history));
}

//検索履歴から再検索
historyEl.addEventListener("click", (e) => {
  if (e.target.classList.contains("history-btn")) {
     const city = e.target.textContent;
     fetchWeather(city);
  }
});

//履歴削除機能
clearBtn.addEventListener("click", () => {
  localStorage.removeItem("history");
  historyEl.innerHTML = "";
});

// ====================
// 現在地ボタン
// ====================
gpsBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;//緯度
      const lon = position.coords.longitude;//経度
      const accuracy = position.coords.accuracy;

      fetchWeatherByLocation(lat, lon, accuracy);
    },
    (error) => {
      alert("位置情報が取得できませんでした");
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
});

// ====================
// 検索ボタン
// ====================
button.addEventListener('click', () => {
  const city = input.value.trim();

  if (!city) {
    weatherEl.textContent = '都市名を入力してください';
    return;
  }

  suggestEl.innerHTML = "";
  fetchWeather(city);
});

//Enter押して検索
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    button.click();
  }
});

// ====================
// 初期表示
// ====================
renderDate();
renderHistory();

const history = getHistory();

//前回の都市を自動表示
if (history.length > 0) {
  fetchWeather(history[0]);
}
