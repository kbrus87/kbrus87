const fetch = require('node-fetch');
const fs = require('fs').promises;

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const getWeatherDate = async() => {
    let res = await fetch('http://api.openweathermap.org/data/2.5/weather?q=rosario&appid=45b2fa569efdc7a2702c344b9da9d776');
    let data = await res.json()
    let sky = await `${data.weather[0].main}  <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" />`;
    let temp = await `${(data.main.temp - 273.15).toFixed(2)} °C`;

    return { temp, sky }
}


(async() => {
    const markdownTemplate = await fs.readFile('./README.md.tpl', { encoding: 'utf-8' })
    const { temp, sky } = await getWeatherDate();

    const date = new Date();
    newMarkdown = markdownTemplate
        .replace('%date%', `${days[date.getDay()]} ${date.getDate()} of ${months[date.getMonth()]}`)
        .replace('%SKY%', `${sky}`)
        .replace('%TEMP%', `${temp}`);


    //writes readme with changes
    await fs.writeFile('./README.md', newMarkdown);


})();