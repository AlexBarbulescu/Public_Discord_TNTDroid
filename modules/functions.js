var fs  = require("fs"),
	settings = require(__dirname + "/settings.json");

var exec = require('child_process').exec;

/////////////////////////////////////////////////////
exports.contains = function(a, obj, invert) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
       		if(invert == 0){
				return true;
       		}else{
				return false;
       		}
       }
    }
	if(invert == 0){
		return false;
	}else{
		return true;
	}
}

/////////////////////////////////////////////////////

exports.sendMessageWho = function(message, varmessage, del, time) { // sent reply to either channel or PM
	// console.log(message.content.split(" ")[0].replace(/\n/g, " ").substring(settings.prefix.length).toLowerCase());
	// console.log(exports.contains(settings.arrayAllowedCommands.commands, message.content.split(" ")[0].replace(/\n/g, " ").substring(settings.prefix.length).toLowerCase() , 1));

	if(exports.contains(settings.arrayAllowedChannels.channels, message.channel.id, 1) && exports.contains(settings.arrayAllowedCommands.commands, message.content.split(" ")[0].replace(/\n/g, " ").substring(settings.prefix.length).toLowerCase() , 1) && !message.content.trim().toLowerCase().match(/!slap|!clear|!codetags|!ping|!ms/gi)) {
		return message.author.sendMessage(varmessage).catch(error => console.log('--- Error on message', error));
	}else{
		if(del = 'delete'){
			return message.channel.sendMessage(varmessage).catch(error => console.log('--- Error on message', error));
			message.delete(time);
		}else{
			return message.channel.sendMessage(varmessage).catch(error => console.log('--- Error on message', error));
		}
	}
}

// http://stackoverflow.com/questions/4744299/how-to-get-datetime-in-javascript
exports.dateCurrent = function() { // Function that updates the date
	return new Date();
}

exports.dateLog = function(date){

	function pad_2(number){
		return (number < 10 ? '0' : '') + number;
	}
		return pad_2(date.getDate()) + '/' +
			pad_2(date.getMonth()+1) + '/' +
			(date.getFullYear() + ' - ') +
			pad_2(date.getHours()) + ":" +
			pad_2(date.getMinutes()) + ":" +
			pad_2(date.getSeconds());
}

// Date in form of yyyy-MM-dd HH:mm:ss
exports.dateCurrentLog = function(){

	function pad_2(number){
		return (number < 10 ? '0' : '') + number;
	}
		var date = new Date();
		return pad_2(date.getDate()) + '/' +
			pad_2(date.getMonth()+1) + '/' +
			(date.getFullYear() + ' - ') +
			pad_2(date.getHours()) + ":" +
			pad_2(date.getMinutes()) + ":" +
			pad_2(date.getSeconds());
}

exports.dateReturn = function(){
	var currentdate = new Date();
	return "Current Time : " + ("0" + currentdate.getDate()).slice(-2) + "/" +
				 ("0" + (currentdate.getMonth() + 1)).slice(-2)  + "/" +
				 currentdate.getFullYear() + " - " +
				 ("0" + currentdate.getHours()).slice(-2) + ":" +
				 ("0" + currentdate.getMinutes()).slice(-2) + ":" +
				 ("0" + currentdate.getSeconds()).slice(-2);
}

exports.dateTime = function(){
	var currentdate = new Date();
	var dt = "Current Time : " + ("0" + currentdate.getDate()).slice(-2) + "/" +
				 ("0" + (currentdate.getMonth() + 1)).slice(-2)  + "/" +
				 currentdate.getFullYear() + " - " +
				 ("0" + currentdate.getHours()).slice(-2) + ":" +
				 ("0" + currentdate.getMinutes()).slice(-2) + ":" +
				 ("0" + currentdate.getSeconds()).slice(-2);
	return('############### '+ dt +' ######################');
};

/////////////////////////////////////////////////////////

exports.parsingError = function(message){
	return fs.appendFile(__dirname + "/.." + settings.parsing, message + "\n");
}

exports.pythonError = function(message){
	return fs.appendFile(__dirname + "/.." + settings.pyfile, message + "\n");
}

exports.appendFile = function(message){
	return fs.appendFile(__dirname + "/.." + settings.file, exports.dateCurrentLog(exports.dateCurrent()) + message + "\n");
}

exports.isNumber = function(number) {
 return /^-?[\d.]+(?:e-?\d+)?$/.test(number);
}

exports.roleChannel = function(message, append){ // passed
	if(message.channel.type == "dm"){
		var channel = "Private Message";
	}else{
		if(append == 0){
			var channel = message.channel;
		}else{
			var channel = "#"+message.channel.name;
		}
	}
	return channel;
}

exports.verifyParsed = function(parsed, low, high){
	if(parsed != null){
		if(parsed.match(/^[0-9]+$/gi) && parsed.length >= low && parsed.length <= high){
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}

}

exports.capitalize = function(text){
    return text.charAt(0).toUpperCase() + text.slice(1);
}

exports.getRandom = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

exports.profanityWordDifference = function(filtermessage, msg){
	var a = filtermessage.split(" ");
	var b = msg.split(" ");

	var result = [];
	for (var i = 0; i < a.length; i++) {
		if (b.indexOf(a[i]) === -1) {
				result.push(b[i]);
		}
	}
	return result;
}

exports.addMinutes = function(date, seconds) {
	return new Date(date.getTime() + seconds*1000);
}

exports.arrayDiff = function(a1, a2) {
	var a = [], diff = [];
	for (var i = 0; i < a1.length; i++) {
		a[a1[i]] = true;
	}
	for (var i = 0; i < a2.length; i++) {
		if (a[a2[i]]) {
			delete a[a2[i]];
		} else {
			a[a2[i]] = true;
		}
	}
	for (var k in a) {
		diff.push(k);
	}
	if(diff.length > 0){
		return diff;
	}else{
		return null;
	}
}

/////////////////////////////////////////////////////////

exports.recalculateProfanity = function(con){
	con.query('SELECT *, count(*) as profanity FROM profanity GROUP BY userid', function(error,result){
		if(error) console.log(error);
		if(!error){
			con.query("UPDATE users SET profanity=0");
			exports.appendFile(" ---  Profanity has been recalculated from table profanity.");
			for (var i = 0; i < result.length; i++) { //takes all the roles
				con.query("UPDATE users SET profanity=? WHERE userid=?", [result[i].profanity, result[i].userid], function(error,result){
					if(error){
						console.log(error);
					}
				});

			}
			con.query("SET @newid=0; UPDATE profanity SET id=(@newid:=@newid+1) ORDER BY id;ALTER TABLE profanity auto_increment=10");
		}
	});
}

exports.recalculateKarma = function(con){
	con.query('SELECT *, count(*) as karma FROM karma GROUP BY toid', function(error,result){
		if(error) console.log(error);
		if(!error){
			con.query("UPDATE users SET karma=0");
			exports.appendFile(" ---  Karma has been recalculated from table karma.");
			for (var i = 0; i < result.length; i++) { //takes all the roles
				con.query("UPDATE users SET karma=? WHERE userid=?", [result[i].karma, result[i].toid], function(error,result){
					if(error) console.log(error);
				});

			}
			con.query("SET @newid=0; UPDATE karma SET id=(@newid:=@newid+1) ORDER BY id; ALTER TABLE karma auto_increment=10");
		}
	});

	con.query('SELECT *, count(*) as give FROM karma GROUP BY gaveid', function(error,result){
		if(error) console.log(error);
		if(!error){
			con.query("UPDATE users SET karmaGiven=0");
			exports.appendFile(" ---  Karma Given has been recalculated from table karma.");
			for (var i = 0; i < result.length; i++) { //takes all the roles
				con.query("UPDATE users SET karmaGiven=? WHERE userid=?", [result[i].give, result[i].gaveid], function(error,result){
					if(error) console.log(error);
				});

			}
		}
	});

}

exports.reverse = function(string, split, join){
    return string.split(split).reverse().join(join);
}

function typeOf (obj) {
  return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
}
// console.log(typeOf(stdout.trim()));

exports.reload = function(client, channelID){
	delete require.cache[require.resolve(__dirname + "/../droid-auth.json")];
	delete require.cache[require.resolve(__dirname + "/settings.json")];
	delete require.cache[require.resolve(__dirname + "/events.js")];
	delete require.cache[require.resolve(__dirname + "/userCommands.js")];
	delete require.cache[require.resolve(__dirname + "/modCommands.js")];
	delete require.cache[require.resolve(__dirname + "/adminCommands.js")];
	delete require.cache[require.resolve(__dirname + "/functions.js")];

	AuthDetails = 		require(__dirname + "/../droid-auth.json");
	settings = 			require(__dirname + "/settings.json");
	events = 			require(__dirname + "/events.js");
	userCommands = 		require(__dirname + "/userCommands.js");
	modCommands = 		require(__dirname + "/modCommands.js");
	adminCommands = 	require(__dirname + "/adminCommands.js");
	functions = 		require(__dirname + "/functions.js");

	try { commands = 	require(__dirname + "/../droid-auth.json");
	} catch (err) { console.log(" ERROR " + " Problem loading droid-auth.json: " + err); }
	try { commands = 	require(__dirname + "/settings.json");
	} catch (err) { console.log(" ERROR " + " Problem loading /settings.json: " + err); }
	try { commands = 	require(__dirname + "/events.js");
	} catch (err) { console.log(" ERROR " + " Problem loading /events.js: " + err); }
	try { commands = 	require(__dirname + "/userCommands.js");
	} catch (err) { console.log(" ERROR " + " Problem loading /userCommands.js: " + err); }
	try { commands = 	require(__dirname + "/modCommands.js");
	} catch (err) { console.log(" ERROR " + " Problem loading /modCommands.js: " + err); }
	try { commands = 	require(__dirname + "/adminCommands.js");
	} catch (err) { console.log(" ERROR " + " Problem loading /adminCommands.js: " + err); }
	try { commands = 	require(__dirname + "/functions.js");
	} catch (err) { console.log(" ERROR " + " Problem loading /functions.js: " + err); }

	client.channels.get(channelID).sendMessage( "``Module Auto-Reload Success " + functions.dateCurrentLog() +"``").catch(error => console.log('--- Error on message', error));
	
}

exports.reboot = function(client, message, valueTime, forced, channelID){

	setTimeout(function() {
		if(forced == 0){
			client.channels.get(settings.botAnnouncementChannel.id).sendMessage("``"+ message.author.username +" Rebooted Me!``").catch(error => console.log('--- Error on message', error));
		}
		client.channels.get(channelID).sendMessage("``Hello there, I'm going to restart right now.``").then(message => message.delete(valueTime)).catch(error => console.log('--- Error on message', error));
		exec("forever -w --watchDirectory /var/www/TNTDroid/droid-Discord --watchIgnore *.log restart --killSignal=SIGINT --uid droid-Discord -l /var/www/TNTDroid/droid-Discord/droid-Discord.log --append /var/www/TNTDroid/droid-Discord/droid-Discord.js", (error, stdout, stderr) => {
			if (error) {
				console.log(error);
				console.log("Error Attept Executing forever restart");
				console.log(exports.dateTime());
				return;
			}
			console.log(stdout);
		});

	}, valueTime + 2000);
}