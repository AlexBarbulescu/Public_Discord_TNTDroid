// node /var/www/TNTDroid/droid-Discord/droid-Discord.js
// node --inspect /var/www/TNTDroid/droid-Discord/droid-Discord.js
/* jshint shadow:true */
/* jshint loopfunc: true */
/* jshint eqnull: true */
/* jshint latedef: false*/
/* jshint noempty:false */

// forever -w --watchDirectory /var/www/TNTDroid/droid-Discord --watchIgnore *.log start --killSignal=SIGINT --uid droid-Discord -l /var/www/TNTDroid/droid-Discord/droid-Discord.log --append /var/www/TNTDroid/droid-Discord/droid-Discord.js

// forever -w --watchDirectory /var/www/TNTDroid/droid-Discord --watchIgnore *.log start --killTree --uid droid-Discord -l /var/www/TNTDroid/droid-Discord/droid-Discord.log --append /var/www/TNTDroid/droid-Discord/droid-Discord.js
// forever -w --watchDirectory /var/www/TNTDroid/droid-Discord --watchIgnore *.log restart --killSignal=SIGINT --uid droid-Discord -l /var/www/TNTDroid/droid-Discord/droid-Discord.log --append /var/www/TNTDroid/droid-Discord/droid-Discord.js

// pm2 start /var/www/TNTDroid/droid-Discord/droid-Discord.js --log /var/www/TNTDroid/droid-Discord/droid-Discord.log --watch /var/www/TNTDroid/droid-Discord --name "droid-Discord" 
// pm2 start /var/www/TNTDroid/droid-Discord/droid-Discord.js --merge-logs --log /var/www/TNTDroid/droid-Discord/droid-Discord.log --name "droid-Discord"

//       -l  LOGFILE      Logs the forever output to LOGFILE
//       -o  OUTFILE      Logs stdout from child script to OUTFILE
//       -e  ERRFILE      Logs stderr from child script to ERRFILE

// forever start --killSignal=SIGINT --uid droid-Discord -l /var/www/TNTDroid/droid-Discord.log --append /var/www/TNTDroid/droid-Discord.js
// forever restart --killSignal=SIGINT --uid droid-Discord -l /var/www/TNTDroid/droid-Discord.log --append /var/www/TNTDroid/droid-Discord.js
// forever stop droid-Discord --killSignal=SIGINT

// https://support.discordapp.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-

var AuthDetails = require(__dirname + "/droid-auth.json"),
	settings = require(__dirname + "/modules/settings.json"),
	events = require(__dirname + "/modules/events.js"),
	userCommands = require(__dirname + "/modules/userCommands.js"),
	modCommands = require(__dirname + "/modules/modCommands.js"),
	adminCommands = require(__dirname + "/modules/adminCommands.js"),
	functions = require(__dirname + "/modules/functions.js");

function reload(message){
	delete require.cache[require.resolve(__dirname + "/droid-auth.json")];
	delete require.cache[require.resolve(__dirname + "/modules/settings.json")];
	delete require.cache[require.resolve(__dirname + "/modules/events.js")];
	delete require.cache[require.resolve(__dirname + "/modules/userCommands.js")];
	delete require.cache[require.resolve(__dirname + "/modules/modCommands.js")];
	delete require.cache[require.resolve(__dirname + "/modules/adminCommands.js")];
	delete require.cache[require.resolve(__dirname + "/modules/functions.js")];

	AuthDetails = 		require(__dirname + "/droid-auth.json");
	settings = 			require(__dirname + "/modules/settings.json");
	events = 			require(__dirname + "/modules/events.js");
	userCommands = 		require(__dirname + "/modules/userCommands.js");
	modCommands = 		require(__dirname + "/modules/modCommands.js");
	adminCommands = 	require(__dirname + "/modules/adminCommands.js");
	functions = 		require(__dirname + "/modules/functions.js");

	try { commands = 	require(__dirname + "/droid-auth.json");
	} catch (err) { console.log(" ERROR " + " Problem loading droid-auth.json: " + err); }
	try { commands = 	require(__dirname + "/modules/settings.json");
	} catch (err) { console.log(" ERROR " + " Problem loading /modules/settings.json: " + err); }
	try { commands = 	require(__dirname + "/modules/events.js");
	} catch (err) { console.log(" ERROR " + " Problem loading /modules/events.js: " + err); }
	try { commands = 	require(__dirname + "/modules/userCommands.js");
	} catch (err) { console.log(" ERROR " + " Problem loading /modules/userCommands.js: " + err); }
	try { commands = 	require(__dirname + "/modules/modCommands.js");
	} catch (err) { console.log(" ERROR " + " Problem loading /modules/modCommands.js: " + err); }
	try { commands = 	require(__dirname + "/modules/adminCommands.js");
	} catch (err) { console.log(" ERROR " + " Problem loading /modules/adminCommands.js: " + err); }
	try { commands = 	require(__dirname + "/modules/functions.js");
	} catch (err) { console.log(" ERROR " + " Problem loading /modules/functions.js: " + err); }

	if(message != null){
		// message.channel.sendMessage("**Module Reload Success**").then(message => message.delete(1000));
		functions.sendMessageWho(message, "**Module Reload Success** ``" + functions.dateCurrentLog() +"``");
	}
	console.log('###########################################################################');
	console.log(functions.dateTime());
	console.log("###############        Module Reload Success         ######################");

	functions.parsingError('###########################################################################',() => {});
	functions.parsingError(functions.dateTime(() => {}), () => {});
	functions.parsingError("###############        Module Reload Success         ######################", () => {});
	
}

var exec = require('child_process').exec,
	fs  = require("fs"),
	Discord = require('discord.js'),
	jsonfile = require('jsonfile'),
	mysql = require('mysql'),
	repeat = require('repeat'),
	phantom = require('phantom'),
	moment = require('moment'),
	srs = require('secure-random-string'),
	nodemailer = require('nodemailer');

require("moment-duration-format");

var transporter = nodemailer.createTransport(AuthDetails.gmail);

var uptimeArray = [];
var uptimeString = [];
var uptimeOut = [];

var arrayBannedBots = ['222644584419688448', '202389617691852800', '208181064823341056']; // banned bots from stats and exp

var arrayAllowedChannels = [settings.botCommandsChannel.id, settings.botDevelopmentChannel.id]; // allow commands on this channels
var arrayBannedChannels = [settings.botCommandsChannel.id, settings.botDevelopmentChannel.id, settings.botPublisherPrivateChannel.id]; // banned channels from stats and exp
var arrayNoProfanityChannels = [settings.botAnnouncementChannel.id, settings.botDevelopmentChannel.id, settings.botPrivateChannel.id]; // don't count profanity in this channels
var arrayNotAllowedChannels = [settings.botCommandsChannel.id, settings.botDevelopmentChannel.id,settings.botAnnouncementChannel.id,settings.botPrivateChannel.id,settings.announcementsChannel.id,settings.unityNewsChannel.id]; // don't allow exp and message statistics on this channels

var arrayProfileCardsNoDelete = [settings.botCommandsChannel.id, settings.botDevelopmentChannel.id, settings.botPrivateChannel.id]; // allow Profile Cards to this channels

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Date in form of yyyy-MM-dd HH:mm:ss
function dateCurrentLog(date){

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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

events.phantomKill();

var client = new Discord.Client({fetchAllMembers: true}); // Discord connection

client.login(AuthDetails.token).catch((error) => {
	console.log("Login Error");
	console.log(functions.dateTime(() => {}));
	if(error) { console.log(error); setTimeout(() => { process.exit(1); }, 2000); }
});

// Mysql qunnection
var db_config = {
	host: AuthDetails.dbHost,
	user: AuthDetails.dbUser,
	password: AuthDetails.dbPassword,
	database: AuthDetails.dbDatabase,
	multipleStatements: true,
	waitForConnection: true,
    connectionLimit: 50,
    queueLimit: 0};
var dbremote_config = {
	host: AuthDetails.dbHostRemote,
	user: AuthDetails.dbUser,
	password: AuthDetails.dbPassword,
	database: AuthDetails.dbDatabase,
	multipleStatements: true,
	waitForConnection: true,
	connectionLimit: 50,
    queueLimit: 0};

var con;
var remote = mysql.createConnection(dbremote_config);



/////////////////////////////////////////
function handleDisconnect(config) {
  con = mysql.createConnection(config); // Recreate the connection, since
										   // the old one cannot be reused.
  con.connect(function(err) {              // The server is either down
	if(err) {                              // or restarting (takes a while sometimes).

		console.log('##############');
		console.log(functions.dateTime(() => {}));
		console.log('ERROR: Error connecting to DB. There might be a problem connecting to the server.');
		console.log(err);

	  setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
	}else{
		console.log('###########################################################################');
		console.log('This outputs only when the script start or is restarted.');
		console.log(functions.dateTime(() => {}));
		console.log('Connection established at start of the script. Will end once the script is stopped.');
		console.log('###########################################################################');
	}                             // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
										  // If you're also serving http, display a 503 error.
  con.on('error', function(err) {
	console.log('DB Error', err);
	if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
		handleDisconnect();                       // lost due to either server restart, or a
		//client.logout();
	} else {                                      // connnection idle timeout (the wait_timeout
	  throw err;                                  // server variable configures this)
	}
  });
}

handleDisconnect(db_config);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

client.on("ready", () => {

	var guild = client.guilds.get(settings.serverID.id);

	if (guild.memberCount != guild.members.size) return console.log("-- Not Ready - User Difference!");

	// console.log(`Ready to begin! Serving in ${client.channels.size} channels`);
	console.log('Ready to begin! Serving in '+ client.guilds.size +' Guilds \n' +
	client.channels.filter(channel => {return channel.type == "text"}).size +' Guild text channels \n'+
	client.channels.filter(channel => {return channel.type == "dm"}).size +' Direct Message channels \n' +
	client.channels.filter(channel => {return channel.type == "voice"}).size +' Guild Voice channels \n' +
	client.channels.filter(channel => {return channel.type == "group"}).size +' Group DM channels');

	//////////////////////////////////////////////////

	// sync database if needed
	// checks the databse against the guild for new members or members that left, and syncs the database
	// this is in case the bot is offline when user joins/left


	con.query('SELECT id,username,userid FROM users', function(error,result){
		if(!error){
			if(guild.memberCount !== result.length){
				  	console.log("-- Ready To Sync Database!");

					var usersDatabase = [];
					var usersDiscord = [];

					for (var i = 0; i < result.length; i++) {
						usersDatabase.push(result[i].userid);
					}

					guild.members.forEach(members=> {usersDiscord.push(members.id);});

					var resA = usersDatabase.filter(function(v){ if(usersDiscord.indexOf(v) < 0) { return v; }});
					var resB = usersDiscord.filter(function(v){ if(usersDatabase.indexOf(v) < 0) { return v; }});

					console.log("-- Total Member Count ",guild.memberCount);
					console.log("-- Database Members ",usersDatabase.length);
					console.log("-- Discord Members ",usersDiscord.length);

					// if(resA.length > 0){
					// 	console.log("ID not on Discord - Must remove - ",resA);

					// 	resA.forEach(function(data) {
					// 		con.query('SELECT * FROM users WHERE userid=?', data, function(error,result){
					// 			if(error){
					// 				console.log(error);
					// 			}
					// 			if(!error){

					// 				con.query("DELETE FROM users WHERE userid=?", data, function(error,result){
					// 					if(error){
					// 						console.log(error);
					// 					}
					// 				});

					// 				con.query("INSERT INTO users SET username=?, discriminator=? userid=?, avatar=?, avatarURL=?, bot=?, muted=?, mutedTime=?, joinDate=?, createdDate=?, karma=?, karmaGiven=?, profanity=?, karmaLimit=?, active=?, lastSeen=?, lastMessage=?, status=?, roles=?, packagesAvailable=?, packagesLeft=?, keycode=?, exp=?, expLimit=?, level=?, rank=?, game=?, live=?, liveMessage=?", [result[0].username, result[0].discriminator, result[0].userid, result[0].avatar, result[0].avatarURL, result[0].bot, result[0].muted, result[0].mutedTime, result[0].joinDate, result[0].createdDate, result[0].karma, result[0].karmaGiven, result[0].profanity, result[0].karmaLimit, result[0].active, result[0].lastSeen, result[0].lastMessage, result[0].status, result[0].roles, result[0].packagesAvailable, result[0].packagesLeft, result[0].keycode, result[0].exp, result[0].expLimit, result[0].level, result[0].rank, result[0].game, result[0].live, result[0].liveMessage], function(error,result){
					// 					if(error){
					// 						console.log(error);
					// 					}
					// 				});

					// 			}
					// 		});	

					// 	});

					// }

					if(resB.length > 0){
						console.log("ID not in database - Must add - ",resB);

						resB.forEach(function(data) {

							var member = guild.members.get(data);

							var avatar = member.user.avatar;
							if(avatar == null ) {
									avatar = 0;
							}

							client.channels.get(settings.botAnnouncementChannel.id).sendMessage("User Was added to Database `Sync Offline` - " + member + " - ``" + member.user.username + "#" + member.user.discriminator + "`` - ID - ``" + member.id + "``");

							con.query("INSERT INTO users SET username=?, userid=?, avatar=?, bot=?, status=?, joinDate=?, karmaLimit='2000-01-01 00:00:00', karma=0, karmaGiven=0, exp=0, level=0, rank=0", [member.user.username, member.user.id, avatar, member.user.bot, member.presence.status, functions.dateCurrent(() => {})], function(error,result){
								if(error){
									console.log(error);
								}
							});
						});


					}

					con.query("ALTER TABLE users auto_increment=10; SET @newid=0; UPDATE users SET id=(@newid:=@newid+1) ORDER BY id", function(error,result){
						if(error){
							console.log(error);
						}
					});

  					console.log("-- Sync Database Ended!");
					
			}
		}
		if(error){
			console.log(error);
		}
	});

	//////////////////////////////////////////////////

	// takes all the users online/idle/offline/dnd and insert into database for chart statistics
	// repeats every 60min, and checks if the values were inserted in the last 60min

	con.query('SELECT date FROM settings WHERE id=3', function(error,rows){
		if(!error){
			var closeTime = new Date(rows[0].date);
			var interval = 60 * 60 * 1000;
			var difference = (closeTime - functions.dateCurrent()) + interval;

			console.log('Current Time - ', functions.dateCurrentLog(functions.dateCurrent()));
			console.log('Last Time from Database - ', functions.dateCurrentLog(closeTime,() => {}));

			var closeTimeUpdate = new Date();
			closeTimeUpdate.setTime(closeTime.getTime() + interval);
			console.log('Database Last Time +60min - ', functions.dateCurrentLog(closeTimeUpdate,() => {}));
			// console.log('Difference - ', difference);
			console.log("###########################################################################");

			difference = (closeTime - functions.dateCurrent(() => {})) + interval;

			function repeteMembers(){
				var membersOnline = guild.members.filter(m => m.presence.status == 'online').size;
				var membersIdle = guild.members.filter(m => m.presence.status == 'idle').size;
				var membersDND = guild.members.filter(m => m.presence.status == 'dnd').size;

				var membersTotal = guild.memberCount;
				var membersOffline = membersTotal - (membersOnline + membersIdle + membersDND);

				remote.query("INSERT INTO onlineChart SET online=?, idle=?, dnd=?, offline=?, total=?, date=?", [membersOnline, membersIdle, membersDND,  membersOffline, membersTotal, functions.dateCurrent()], function(error,result){
					if(error){
						console.log(error);
					}
				});
				con.query("UPDATE settings SET date=? WHERE id=3;", [functions.dateCurrent()], function(error,result){
					if(error){
						console.log(error);
					}
				});
			}

			repeat(function() {
				if(difference < 0) {
				  repeteMembers();
				}else{
				  setTimeout(repeteMembers, difference);
				}
			}).every(60, 'minutes').start.now();

		}
		if(error){
			console.log(error);
		}
	});

});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


client.on('guildMemberAdd', (member) => { // Emitted whenever a user joins a guild.
	events.guildMemberAdd(con, client, member,() => {});
});

client.on('guildMemberRemove', (member) => { // Emitted whenever a member leaves a guild, or is kicked.
	events.guildMemberRemove(con, client, member,() => {});
});

client.on('guildMemberUpdate', (oldMember, newMember) => {// Emitted whenever a Guild Member changes - i.e. new role, removed role, nickname.
	events.guildMemberUpdate(con, client, oldMember, newMember,() => {});
});

client.on("presenceUpdate", (oldMember, newMember) => { // Emitted whenever a guild member's presence changes, or they change one of their details.
	events.streaming(con, client, oldMember, newMember,() => {});
	events.presenceUpdate(con, client, oldMember, newMember,() => {});
});

client.on("userUpdate", (oldUser, newUser) => { // Emitted whenever a user's details (e.g. username) are changed.
	events.userUpdate(con, client, oldUser, newUser,() => {});
});

client.on('messageDelete', (message) => { // Emitted whenever a message is deleted.
	events.messageDelete(con, client, message,() => {});
});


client.on('reconnecting', () => {
	console.log("Reconnecting....")
});

client.on('disconnect', () => {
	console.log("Disconnected....")
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Start Message Event
client.on("message", (message) => {
	if(message.channel.type == "text"){
		if (!message.member) return;
	}
	var msg = message.content.trim();
	var parsed = msg.split(" "); // parsed[0] = "Command", parsed[1] = "Action", parsed[2] = "Role"
	var user = message.author;
	var cmd = message.content.split(" ")[0].replace(/\n/g, " ").substring(settings.prefix.length).toLowerCase();

	var guild = client.guilds.get(settings.serverID.id);
	var role;
	// var currentUserRoles = message.member.roles.filter(role => {return role.name != '@everyone'}).map(role => role.name).join(', '); 

	// verify if the user is in database if not add it...
	con.query('SELECT userid FROM users WHERE userid=?', user.id ,function(error, result){
		if(error) return console.log(error);
		if(!error){
			if(result[0] == undefined){
				client.channels.get(settings.botAnnouncementChannel.id).sendMessage("User Was added to Database `on Message` - " + user + " - ``" + user.username + "#" + user.discriminator + "`` - ID - ``" + user.id + "``");
				con.query("INSERT INTO users SET username=?, userid=?, avatar=?, bot=?, status=?, joinDate=?, karmaLimit='2000-01-01 00:00:00', karma=0, karmaGiven=0, exp=0, level=0, rank=0", [user.username, user.id, user.avatar, user.bot, message.member.presence.status, functions.dateCurrent(() => {})], function(error,result){
					if(error){
						console.log(error);
					}
				});
				con.query("ALTER TABLE users auto_increment=10; SET @newid=0; UPDATE users SET id=(@newid:=@newid+1) ORDER BY id", function(error,result){
					if(error){
						console.log(error);
					}
				});
			}
		}
	});

	// handle messages
	if(msg.toLowerCase().startsWith(settings.prefix)) {
		if(settings.maintanance == true && message.author.id != settings.Administrator){
			events.maintanance(message,() => {});
		}else{
			// if(settings.maintanance == true){
			// 	message.channel.sendMessage("**Bot is currently in maintanance mode. **").then(message => message.delete(5*1000));
			// }
			functions.appendFile("-- User " + message.author.username + " Executed the follwoing command ``" + parsed[0] + "`` On channel " + functions.roleChannel(message, 1,() => {}), () => {});
			if(!msg.toLowerCase().match(/!slap|!clear|!codetags|!ping|!ms/gi) || !cmd in adminCommands || !cmd in modCommands) { // if this commands are present do not delete  // guild.members.get(message.author.id).roles.filter(r => {return settings.roleModSquadPermission.roles.includes(r.name)}).size > 0
				if(message.channel.id != settings.botCommandsChannel.id && message.channel.id != settings.botDevelopmentChannel.id && message.channel.id != settings.botFunctionalityChannel.id && message.channel.type === "text") { // if the commands are made in this channel the message is not deleted
					if(msg.toLowerCase().match(/!profile/gi) || guild.members.get(message.author.id).roles.filter(r => {return settings.roleModSquadPermission.roles.includes(r.name)}).size > 0) { // delete the message with command but do not notify
						message.delete(1000*10);
					}else{
						message.delete(1000*10);
						message.author.sendMessage("**Please use #bot-commands or Private Message for commands.**");
					}
				}
			}
			if(cmd == "reload" && guild.members.get(message.author.id).roles.filter(r => {return settings.roleAdministratorPermission.roles.includes(r.name)}).size > 0) { reload(message); message.delete(1000); return; }
			if(cmd == "reboot"){ message.delete(); }
			// if(cmd == "config"){ adminCommands[parsed[0].toLowerCase().substring(1)].process(con, client, message, parsed, guild, user); }
			// if(parsed[0].toLowerCase().substring(1) in userCommands) { // users commands
			if(cmd in userCommands) { // users commands
				userCommands[parsed[0].toLowerCase().substring(1)].process(con, client, message, parsed, guild, user);
				if(userCommands[parsed[0].toLowerCase().substring(1)].deleteCommand == true && functions.contains(settings.arrayAllowedChannels.channels, message.channel.id, 1,() => {})){
					message.delete(5*1000);
				}
			}else if(guild.members.get(message.author.id).roles.filter(r => {return settings.roleModSquadPermission.roles.includes(r.name)}).size > 0 && cmd in modCommands) { // admin commands
				modCommands[parsed[0].toLowerCase().substring(1)].process(con, client, message, parsed, guild, user);
				if(modCommands[parsed[0].toLowerCase().substring(1)].deleteCommand == true){
					message.delete(5*1000);
				}
			}else if(guild.members.get(message.author.id).roles.filter(r => {return settings.roleAdministratorPermission.roles.includes(r.name)}).size > 0 && cmd in adminCommands) { // database reset commands
				adminCommands[parsed[0].toLowerCase().substring(1)].process(con, client, message, parsed, guild, user);
				if(adminCommands[parsed[0].toLowerCase().substring(1)].deleteCommand == true) {
					message.delete(5*1000);
				}
			}else if(parsed[0].toLowerCase().substring(1) in modCommands || cmd in adminCommands){
				message.author.sendMessage("You don't have access to this command. Or you can't use this command inside Private Message.").catch(error => console.log('--- Error on message', error));
			}

		}
	}

	//////////////////////////////////////////
	if(message.channel.type === "text"){
		events.massMention(con, client, message,() => {});
		events.profanity(con, client, message,() => {});

		if(!msg.toLowerCase().startsWith(settings.prefix) && functions.contains(arrayNotAllowedChannels,message.channel.id, 1, () => {}) && functions.contains(arrayBannedBots,message.author.id, 1, () => {})){
			events.levelup(con, client, message,() => {});	// LevelUp card generation works

			// remote.query('UPDATE onlineChart SET messages=messages + 1 ORDER BY id DESC LIMIT 1', message.author.id, function(error,result){
			// 	if(error){
			// 		console.log("Error adding messages statistic - ",error);
			// 	}
			// });
		}
		if(message.mentions.users.size > 0 && msg.toLowerCase().match(/\b\w?(thanks|ty|thank you|thx|thanx|thankyou)\b\w?/i) && !msg.toLowerCase().match(/thanks @user|thank you @user|used profanity word in channel/gi) && functions.contains(arrayBannedBots, message.author.id, 1, () => {}) && functions.contains(arrayBannedBots, message.mentions.users.first().id, 1, () => {})){
			events.thanks(con, client, message,() => {});	// give karma points in form of thanks
		}

	}
	//////////////////////////////////////////
	// notifyies when someone is offline 
	if(message.mentions.users.size > 0 && functions.contains(arrayBannedBots,message.author.id, 1, () => {})){ // passed
		events.offline(message,() => {});
	}
	//////////////////////////////////////////
	// updates lastSeen, lastMessage Date on message
	con.query('UPDATE users SET lastSeen=?, lastMessage=?, avatarURL=? WHERE userid=?',[functions.dateCurrent(() => {}), functions.dateCurrent(() => {}), message.author.avatarURL, message.author.id], function(error,result){
		if(error){
			console.log("Error adding lastMessage - ",error);
		}
	});
});
// End Message Event
//////////////////////////////////////////////////

repeat(function() {
	events.phantomProcess(() => {}); // check phantom process if more than 5 min > kill them, if process > 5 kill them all
	events.renderPackages(con, client,() => {}); // check if any package needs rendering.
	// advertiment every 24h
	con.query('SELECT * FROM settings WHERE id=5', function(error, result){
		var closeTime = new Date(result[0].date);
		var interval = 24 * 60 * 60 * 1000; // 1 day
		var currentTime = new Date();
		var difference = (closeTime - currentTime) + interval;
		if(difference < 0) {
			events.advertismentSchedule(con, client, settings.unityNewsChannel.id, 0,() => {});
		}
	});

	/// 7 day verification for publishers
	events.publisherVerification(con, client,() => {});

}).every(1, 'minutes').start.in(5, 'seconds');

repeat(function() {
	events.parsing24h(con, client, 0,() => {}); // checks for new 24h sales packages
}).every(5, 'minutes').start.in(10, 'seconds');

repeat(function() {
	events.stabilityCheck(con, client); // check if the bot is table, if not reboot
}).every(30, 'minutes').start.in(15, 'seconds');

repeat(function() {
	events.parsingBlog(con, client, 0,() => {}); // checks for new blogs.unity3d.com
}).every(5, 'minutes').start.in(60, 'seconds');

repeat(function() {
	events.fetchPackageData(con, client, function(error, link, time){
		if(error){
			functions.parsingError("-- " + error, () => {});
			functions.parsingError(`-- Run Time Blog - ${time/1000} sec / ${moment.duration(Math.floor(time)).format(' D [days], H [hrs], m [mins], s [secs]')} ---`, () => {});
		}
		if(!error){
			functions.parsingError(`-- Run Time Blog - ${time/1000} sec / ${moment.duration(Math.floor(time)).format(' D [days], H [hrs], m [mins], s [secs]')} ---`, () => {});
			// console.log(array);
		}
	});
}).every(1, 'minutes').start.in(20, 'seconds');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// client.on('reconnecting', () => {
// 	console.log('--- Bot Has Reconnected.');
// 	reload();
// });

client.on('error', (error) => {
  console.log("Client Error - " + error)
});


process.on('SIGINT', function() {
	console.log('Bot Client Disconnected! sigint');
	console.log('###########################################################################');
	//client.sendMessage("206821282258485248", "Something causing me to __**Shut Down**__");
	client.destroy(() => {}); // destroy discord connection
	con.destroy(); // destroy database connection
	remote.destroy(); // destroy database remote connection
	setTimeout(function() {
		process.exit(0);
	}, 2000);
});