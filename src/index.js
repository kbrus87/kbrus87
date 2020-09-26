const fs = require('fs').promises;
const fetch = require('node-fetch');

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];;

const getWeatherDate = async() => {
    let res = await fetch('http://api.openweathermap.org/data/2.5/weather?q=rosario&appid=45b2fa569efdc7a2702c344b9da9d776');
    let data = await res.json()
    let sky = await `${data.weather[0].main}  <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />`;
    let temp = await `${(data.main.temp - 273.15).toFixed(2)} °C`;

    return { temp, sky }
}

//INSTAGRAM FUNCTIONS
const INSTAGRAM_REGEXP = new RegExp(
    /<script type="text\/javascript">window\._sharedData = (.*);<\/script>/
);
const getPhotosFromInstagram = async() => {
    const res = await fetch(`https://www.instagram.com/bruno.j87/`);
    const text = await res.text();
    const json = JSON.parse(text.match(INSTAGRAM_REGEXP)[1]);
    const edges = json.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.splice(
        0,
        8
    );
    return edges.map(({ node }) => ({
        permalink: `https://www.instagram.com/p/${node.shortcode}/`,
        media_url: node.thumbnail_src,
    }));
}
const generateInstagramHTML = ({ media_url, permalink }) => `
<a href='${permalink}' target='_blank'>
  <img width='20%' src='${media_url}' alt='Instagram photo' />
</a>`;


(async() => {
    const markdownTemplate = await fs.readFile('./README.md.tpl', { encoding: 'utf-8' })
    const { temp, sky } = await getWeatherDate();

    const photos = await getPhotosFromInstagram();
    const latestInstagramPhotos = photos
        .slice(0, 4)
        .map(generateInstagramHTML)
        .join("");


    const date = new Date();
    newMarkdown = markdownTemplate
        .replace('%date%', `${days[date.getDay()]} ${date.getDate()} of ${months[date.getMonth()]} at ${date.getHours}`)
        .replace('%SKY%', `${sky}`)
        .replace('%TEMP%', `${temp}`)
        .replace('%LATEST_INSTAGRAM', latestInstagramPhotos);

    //writes readme with changes
    await fs.writeFile('../README.md', newMarkdown);


})();