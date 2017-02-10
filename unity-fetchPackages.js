const cheerio = require('cheerio');
// const mysql = require('mysql');
const phantom = require("phantom");
var _ph, _page, _outObj;

// db = MySQLdb.connect("localhost","root","diablo89","discord_bot")

const start = process.hrtime();

phantom.create().then(instance => {
    _ph = instance;
    return _ph.createPage();
}).then(page => {
    _page = page;
    return _page.open("https://www.assetstore.unity3d.com/en/#!/content/41417");
}).then(status => {
    return _page.property("content");
}).then(content => {
    let $ = cheerio.load(content);
    let array = [];
    let packageName = $("div h1").first().text();
    let publisherName = $("div.details a:nth-of-type(2)").first().text();
    let categoryDetail = $(".livelink.detaillink").first().text();
    let price = $(".price").first().text().replace(/\$| |\n/g, "");
    let mainImage = $("div.background").attr("style").replace(/background-image: url\(|\);/g, "");
    let smallImage = $("html head meta:nth-of-type(4)").attr("content");
    let description = $(".fulldescription").first().text();
    let dateNow = new Date();
    let packageLink = $("a.externallink.link").first().attr("href");
    let packageFullLink = $("meta:nth-of-type(6)").first().attr("content");
    let unrated = $("#contentoverview div div:nth-of-type(2) div div div div span:nth-of-type(2)").first().text();
    let ratingStars, ratingFeedback;
    if (unrated) {
        ratingFeedback = 0;
        ratingStars = 0;
    } else {
        ratingStars = $("#contentoverview div div:nth-of-type(2) div div div div span").attr("content");
        ratingFeedback = $("div.count").first().attr("content");
    }
    let date = new Date();
    let test = packageName.replace(/ /g, "_") + "-" + publisherName.replace(/ /g, "_");
	let path = "/var/www/TNTDroid/Discounted/images/";
	let localImage = path + test +".png";
    array.push(packageName, publisherName, price, smallImage, mainImage, description, categoryDetail, packageLink, packageFullLink, ratingStars, ratingFeedback, localImage, date);
    console.log(`-- -- New Package - ${packageName} from Publisher : ${publisherName}`);
    console.log(`${price}`);
    console.log(`${mainImage}`);
    console.log(`${packageLink}`);
    console.log(`-- -- Rating Stars - ${ratingStars} ratingFeedback : (${ratingFeedback})`);
    // con.query("UPDATE advertisment SET verify=0, packageName=?, publisherName=?, price=?, smallImage=?, mainImage=?, description=?, categoryDetail=?, packageLink=?, packageFullLink=?, ratingStars=?, ratingFeedback=?, localImage=?, date=?, render=1 WHERE ID=?;", array, function (error, result) {
    //     if (error) {
    //         console.log(error);
    //     }
    // });
    console.log("-- Values Inserted into Database");
    let now = process.hrtime(start);
    let elapsed = now[0] + now[1]/1000000000;
    console.log(`-- Run Time - ${elapsed} seconds ---`);
    console.log(array);
    _ph.exit();
}).catch(() => {
    console.log("An error occured. Exiting...");
    _ph.exit();
});
