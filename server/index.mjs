import * as alt from 'alt-server';
// Weather
let currentWeather = 'SUNNY'
const weathers = [
    'EXTRASUNNY', 
    'CLEAR', 
  //  'NEUTRAL', 
    'SMOG', 
    'FOGGY', 
    'OVERCAST', 
    'CLOUDS', 
  //  'CLEARING', 
    'RAIN', 
    'THUNDER', 
  //  'SNOW', 
  //  'BLIZZARD', 
   // 'SNOWLIGHT', 
   // 'XMAS', 
   // 'HALLOWEEN',
]

// Time
let time = {
    hour: 6,
    minute: 0,
    second: 0,
}
let msperminute = 1000;

// Events
alt.on('playerConnect', (player) => {
    setTimeout(() => {
        alt.emitClient(player, 'syncWeather', currentWeather, 0);
        alt.emitClient(player, 'syncTime', time, msperminute);
    }, 5000)
})
alt.on('changeCurrentWeather', changeCurrentWeather);
alt.on('changeCurrentTime', changeCurrentTime);

// Functions
export function changeCurrentWeather(weather, time) {
    currentWeather = weather;
    console.log(`[AWTS] Changed weather to ${weather}`)
    alt.Player.all.forEach(player => {
        alt.emitClient(player, 'syncWeather', currentWeather, time);
    });
}

export function changeCurrentTime(hour, minute, second) {
    time.hour = hour;
    time.minute = minute;
    time.second = second;
    console.log(`[AWTS] Changed time to ${hour}:${minute}:${second}`)
    alt.Player.all.forEach(player => {
        alt.emitClient(player, 'syncTime', time, msperminute);
    });
}

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

// Intervals

// Weather
setInterval(() => { // Change to random weather every 10 minutes
    let weather = weathers[randomInt(weathers.length)];
    changeCurrentWeather(weather, 30);
}, 10 * 60 * 1000)

// Time
setInterval(() => { // Update time every 2 minutes
    console.log(`[AWTS] Syncing time...`)
    alt.Player.all.forEach(player => {
        alt.emitClient(player, 'syncTime', time, msperminute);
    });
}, 2 * 60 * 1000)

setInterval(() => {
    if((time.minute + 1) < 60) {
        time.minute++;
    } else {
        time.minute = 0;
        time.hour++;
        time.second = 0;
    }
}, msperminute)