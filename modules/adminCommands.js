var fs  = 			require("fs"),
	moment = 		require('moment'),
	webshot = 		require('webshot'),
	Discord = 		require('discord.js'),
	Stopwatch = 	require('statman-stopwatch'),
	now = 			require('performance-now'),
	settings = 		require(__dirname + "/settings.json"),
	events = 		require(__dirname + "/events.js"),
	functions = 	require(__dirname + "/functions.js");

var settingsName = './settings.json';

require("moment-duration-format");
//////////////////////

const adminCommands = {
	"config": { // edit bot config command
		desc: "Force current 24h advertising card.",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed){
		
			function confirm(message, command, setting, path){
				functions.appendFile("Settings "+ command +" has been updated to "+ setting +", writing to " + path,() => {});
				message.channel.sendMessage("**Settings "+ command +" has been updated to "+ setting +" **");
			}

			if(parsed[1] == 'm' && parsed[2] != null && (parsed[2] == 'true' || parsed[2] == 'false')){
				if(parsed[2] == 'true'){
					settings.maintanance = true;
				}else if(parsed[2] == 'false'){
					settings.maintanance = false;
				}
				fs.writeFile(__dirname + "/settings.json", JSON.stringify(settings), function (error) {
					if(error) return console.log(err);
					confirm(message, 'maintanance', settings.maintanance, __dirname + "/settings.json");
				});
			}

		}
	},
	"dbupdate": { 
		desc: "Force Database Update for users",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild) {
			// http://stackoverflow.com/questions/31413749/node-js-promise-all-and-foreach

			var members = guild.memberCount;
			var number = 0;
			var percent = 0;
			var percentCheck = 0;
			message.channel.sendMessage("**Database Update in Progress...**").then(msg => {

				guild.members.map(member =>{
					var roles = member.roles.array().filter(role => {return role.name != '@everyone'}).map(role => role.name).join(',');

					con.query('SELECT userid FROM users WHERE userid=?', member.user.id ,function(error, result){
						if(error) return console.log(error);
						if(!error){
							number = number + 1;
							percent = Math.floor((number / members) * 100);

							if(percent == 1){
								percentCheck = 0 + 20;
							}else if(percent == percentCheck){
								msg.edit("**Database Update in Progress... " + percent +"% **");
								percentCheck = percent + 20;
							}

							if(number == members){
								message.channel.sendMessage(" "+ message.author +" **Database Update forced has finished.**");
								functions.appendFile(" --- " + message.author.username + " forced an Database Update",() => {});
							}

							if(result[0] == undefined){
								client.channels.get(settings.botAnnouncementChannel.id).sendMessage("User Was added to Database `Forced Update` - " + member.user + " - ``" + member.user.username + "#" + member.user.discriminator + "`` - ID - ``" + member.user.id + "``");
								con.query("INSERT INTO users SET username=?, userid=?, avatar=?, bot=?, status=?, joinDate=?, karmaLimit='2000-01-01 00:00:00', karma=0, karmaGiven=0, exp=0, level=0, rank=0", [member.user.username, member.user.id, member.user.avatar, member.user.bot, member.presence.status, functions.dateCurrent(() => {})], function(error, result){
									if(error) return console.log(error);
								});
								con.query("ALTER TABLE users auto_increment=10; SET @newid=0; UPDATE users SET id=(@newid:=@newid+1) ORDER BY id", function(error,result){
									if(error) return console.log(error);
								});
							}else{
								var gameName = "";
								if(member.presence.game != null){
									gameName = member.presence.game.name;
								}
								con.query("UPDATE users SET roles=?, username=?, discriminator=?, joinDate=?, createdDate=?, avatarURL=?, avatar=?, status=?, game=? WHERE userid=?", [roles, member.user.username, member.user.discriminator, member.joinedAt, member.user.createdAt, member.user.avatarURL, member.user.avatar, member.presence.status, gameName, member.user.id], function(error, result){
									if(error) return console.log(error);
								});
							}
						}
					});
				});
			});
		}
	},
	"sync": { 
		desc: "Sync Discord Users with Database",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild) {
			events.syncUsers(con, client, message, parsed, guild,() => {});
		}
	},
	"process": { 
		desc: "Sync Discord Users with Database",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild) {
  			let duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
			functions.sendMessageWho(message, `
\`\`\`
STATISTICS
• Guild Name        : ${guild.name}
#################################################
• Mem Usage         : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Current pid       : ${process.pid}
• Uptime            : ${duration}
• Discord.js        : v${Discord.version}
#################################################
\`\`\``,() => {});
		}
	},
	"jsondb": { // command passed
		desc: "Force Database Update for users",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild) {

			message.channel.sendMessage("**Database Update JSON**").then(msg => {

				// fs.writeFile(__dirname + "/../db/guild.json", JSON.stringify(guild), function (error) {
				fs.writeFile(__dirname + "/../db/guild.json", JSON.stringify(guild), function (error) {
				  if(error) return console.log(err);
				});
				console.log(guild);

				// Promise.all(guild.members.map(member =>{
				// 	var roles = member.roles.array().filter(role => {return role.name != '@everyone'}).map(role => role.name).join(',');
				// 	// con.query("UPDATE users SET roles=?, username=?, discriminator=?, joinDate=?, createdDate=?, avatarURL=?, avatar=?, status=?, game=? WHERE userid=?", [roles, member.user.username, member.user.discriminator, member.joinedAt, member.user.createdAt, member.user.avatarURL, member.user.avatar, member.presence.status, member.user.game.name, member.user.id], function(error,result){
				// 	con.query("UPDATE users SET roles=?, username=?, discriminator=?, joinDate=?, createdDate=?, avatarURL=?, avatar=?, status=? WHERE userid=?", [roles, member.user.username, member.user.discriminator, member.joinedAt, member.user.createdAt, member.user.avatarURL, member.user.avatar, member.presence.status, member.user.id], function(error,result){
				// 		if(error){
				// 			console.log(error);
				// 		}
				// 	});
				// })
				// ).then(log => {
				// 	msg.delete();
				// 	message.channel.sendMessage(" "+ message.author +" **Database Update forced has finished.**");
				// 	functions.appendFile(" --- " + message.author.username + " forced an Database Update",() => {});
				// });
			});
		}
	},
	"24h": {
		desc: "Force current 24h advertising card.",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			events.parsing24h(con, client, 1, message.channel.id,() => {});
		}
	},
	"blog": {
		desc: "Force current news from blog feed.",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			events.parsingBlog(con, client, 1, message.channel.id,() => {});
		}
	},
	"discount": { 
		desc: "Force Publisher Latest advertising",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			// postDiscount(message, settings.botAnnouncementChannel.id, 1);
			events.renderPackages(con, client,() => {});
		}
	},
	"phproc": {
		desc: "",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			events.phantomProcess(con, client,() => {});
		}
	},
	"pkill": {
		desc: "",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			events.phantomKill(() => {});
		}
	},
	"lvl": { // command passed
		desc: "Show current card Level.",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild) {
			message.channel.sendMessage("**Generating Profile Level Card.**").then(msg => {

				if(parsed[1] == null){
					member = message.member;
				}else{
					member = guild.members.get(message.mentions.users.first().id);
				}

		        var sw = new Stopwatch(true);
				var options = {
				  screenSize: {
				    width: 1024
				  , height: 768
				  }
				, shotSize: {
				    width: 200
				  , height: 76
				  }
				, userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:48.0)' + ' Gecko/20100101 Firefox/48.0'
				};
				var cardLevelUp = "/var/www/TNTDroid/Profile/levelup/"+ member.user.id +".png";

				webshot('http://localhost/TNTDroid/Profile/levelup.php?id=' + member.user.id, cardLevelUp, options, function(err) {
				  if(err){
				 	 console.log(err);
				  }
				  if(!err){
					sw.stop();
					functions.appendFile("**Level Up Card** for **" + member.user.username +" Render Done in -> elapsed: "+ Math.round(sw.read()) / 1000 + "s",() => {});
					msg.delete();
					// message.channel.sendFile(cardLevelUp,'',"**Level Up Card** for **" + member.user.username + "** - Generated in - " + Math.round(sw.read()) / 1000 + "s").catch(console.log);
					message.channel.sendFile(cardLevelUp,'',"**Level Up Card** for **" + member.user.username + "**").catch(console.log);
				  }
				});

			});
		}
	},
	"lxl": { // command passed
		desc: "Show current card Level.",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild) {
			message.channel.sendMessage("**Generating Profile Level Card.**").then(msg => {

				if(parsed[1] == null){
					member = message.member;
				}else{
					member = guild.members.get(message.mentions.users.first().id);
				}

		        var sw = new Stopwatch(true);
				var options = {
				  screenSize: {
				    width: 1024
				  , height: 768
				  }
				, shotSize: {
				    width: 200
				  , height: 76
				  }
				, userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:48.0)' + ' Gecko/20100101 Firefox/48.0'
				};
				var cardLevelUp = "/var/www/TNTDroid/Profile/levelup/"+ member.user.id +".png";

				webshot('http://localhost/TNTDroid/Profile/levelup.php?id=' + member.user.id, cardLevelUp, options, function(err) {
				  if(err){
				 	 console.log(err);
				  }
				  if(!err){
					sw.stop();
					functions.appendFile("**Level Up Card** for **" + member.user.username +" Render Done in -> elapsed: "+ Math.round(sw.read()) / 1000 + "s",() => {});
					msg.delete();
					// message.channel.sendFile(cardLevelUp,'',"**Level Up Card** for **" + member.user.username + "** - Generated in - " + Math.round(sw.read()) / 1000 + "s").catch(console.log);
					message.channel.sendFile(cardLevelUp,'',"**Level Up Card** for **" + member.user.username + "**").catch(console.log);
				  }
				});

			});
		}
	},
	"rstadvert": {
		desc: "",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			var resetDate = dateCurrent() - (24*60*60*1000) - (60*1000);
			resetDate = new Date(resetDate);

			con.query("UPDATE settings SET date=? WHERE id=5", resetDate,function(error,result){
				if(error){
					console.log("Error reseting publisher advertising - ",error);
				}else{
					console.log("-- Publisher Advertising Has Been Reseted");
				}
			});

			message.channel.sendMessage("``User ``"+ message.author +"`` Reseted Publisher Advertising ``").then(message => message.delete(8000));
			functions.appendFile(" --- " + message.author.username + " Reseted Publisher Advertising",() => {});
		}
	},
	"rstdiscount": {
		desc: "",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed) {
			if(parsed[1] == null){
				// console.log("-- execute command discount");
			}else if(parsed[1].toLowerCase() == "reset"){
				con.query('UPDATE settings SET value=1 WHERE id=2', function(error,rows){

				});
				// console.log("-- execute reset discount");

				message.channel.sendMessage("``User ``"+ message.author +"`` reseted Discount ``").then(message => message.delete(8000));
				functions.appendFile(" --- " + message.author.username + " Reseted Discount",() => {});
			}
		}
	},
	"rstkarma": {
		desc: "",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			con.query("UPDATE users SET karmaGiven=0 , karmaLimit='2000-01-01 00:00:00', karma=0 ",  function(error,result){
					if(error){
						console.log("Error reseting karma - ",error);
					}else{
						console.log("-- Karma points have been reseted, no turning back from this.");
					}
				});

			message.channel.sendMessage("``User ``"+ message.author +"`` reseted Karma Points ``").then(message => message.delete(8000));
			functions.appendFile(" --- " + message.author.username + " Reseted Karma Points",() => {});
		}
	},
	"rstprofanity": {
		desc: "",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			con.query('UPDATE users SET profanity=0; truncate profanity; ALTER TABLE users auto_increment=1', function(error,rows){

			});

			message.channel.sendMessage(message, "``User ``"+ message.author +"`` reseted Profanity ``").then(message => message.delete(8000));
			functions.appendFile(" --- " + message.author.username + " Reseted Profanity",() => {});
		}
	},
	"rstrender": {
		desc: "",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			con.query("UPDATE advertisment SET render=1, execute=0",  function(error,result){
					if(error){
						console.log("Error reseting image - ",error);
					}else{
						console.log("-- Render Images Has Been Reseted");
					}
				});

			message.channel.sendMessage("``User ``"+ message.author +"`` Reseted Render Image ``").then(message => message.delete(8000));
			functions.appendFile(" --- " + message.author.username + " Reseted Render Image",() => {});
		}
	},
	"rstrank": {
		desc: "",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			con.query('SELECT exp,id FROM users ORDER BY exp DESC', function(error, result){
				if(error){
					console.log("Error recalculating server ranking - ", error);
				}
				if(!error){
					for (var i = 0; i < result.length; i++) {
						if(result[i].exp > 0){
							con.query('UPDATE users SET rank=? WHERE id=?',[i+1, result[i].id]);
						}else{
							con.query('UPDATE users SET rank=? WHERE id=?',[0, result[i].id]);
						}
					}
				}
			});
			message.channel.sendMessage("``User ``"+ message.author +"`` Reseted Server Ranking ``").then(message => message.delete(8000));
			functions.appendFile(" --- " + message.author.username + " Reseted Server Ranking",() => {});
		}
	},
	"rstexp": {
		desc: "",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			con.query('UPDATE users SET exp=0, level=0, rank=0', function(error, result){
				if(error){
					console.log("Error reseting experience - ", error);
				}
			});
			message.channel.sendMessage("``User ``"+ message.author +"`` Reseted Experience Message ``").then(message => message.delete(8000));
			functions.appendFile(" --- " + message.author.username + " Reseted Experience Message",() => {});
		}
	},
	"rekarma": {
		desc: "",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			functions.recalculateKarma(() => {});
			message.channel.sendMessage("``User ``"+ message.author +"`` Forced Karma Recalculation ``").then(message => message.delete(8000));
			functions.appendFile(" --- " + message.author.username + " Forced Karma Recalculation",() => {});
		}
	},
	"reprofanity": {
		desc: "",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			functions.recalculateProfanity(() => {});
			message.channel.sendMessage("``User ``"+ message.author +"`` Forced Profanity Recalculation ``").then(message => message.delete(8000));
			functions.appendFile(" --- " + message.author.username + " Forced Profanity Recalculation",() => {});
		}
	},
	"guilds": {
		desc: "",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {

			var dmChannels = client.channels.map(channel => {

				if(channel.type === "dm"){
					// console.log(channel.recipient.username);
					console.log(channel);
				}

			})
			// console.log(client.guilds.map(guild => guild.name));
			// console.log(client.channels.map(channel => channel.name));
			console.log(dmChannels);

		}
	},
	"avatar": {
		desc: "",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed) {
			let member;
			if(parsed[1] == null){
				member = message.author;
			}else{
				member = message.mentions.users.first();
			}
			if(member.avatarURL != null){
				message.channel.sendMessage("**"+ member.username +"**, This is the avatar you requested **" + member.avatarURL + "**");
			}else{
				message.channel.sendMessage("**"+ member.username +"**, There's no avatar link to provide.");
			}

		}
	},
	"rerank": {
		desc: "",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {

			con.query('SELECT id, username, userid, exp, rank FROM users ORDER BY exp DESC', function(error, result){
				if(error){
					console.log("Error recalculating server ranking - ", error);
				}
				if(!error){
					var rankAfter = 0;
					for (var i = 0; i < result.length; i++) {
						var rankBefore = result[i].rank;
						if(result[i].exp > 0){
							rankAfter++;
							if(rankBefore != rankAfter){
								con.query('UPDATE users SET rank=? WHERE id=?',[rankAfter, result[i].id]);
								functions.appendFile(" ------ Rank Update - "+ result[i].username +" From "+ rankBefore +" to "+ rankAfter,() => {});
							}
						}else{
							con.query('UPDATE users SET rank=? WHERE id=?',[0, result[i].id]);
						}
					}
					message.channel.sendMessage("``User ``"+ message.author +"`` Forced Rank Recalculation ``").then(message => message.delete(8000));
					functions.appendFile(" --- " + message.author.username + " Forced Rank Recalculation",() => {});
				}
			});

		}
	},
	"restats": {
		desc: "",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {

			con.query('SELECT * , count(*) FROM onlineChart GROUP BY hour( date ) , day( date ) , month( date ) ORDER BY id ASC', function(error, result){
				if(error){
					console.log("Error recalculating server ranking - ", error);
				}
				if(!error){
					result.forEach( chart =>{

						// remote.query('INSERT INTO onlineChart SET online=?, idle=?, offline=?, total=?, messages=?, date=? ',[chart.online, chart.idle, chart.offline, chart.total, chart.messages, chart.date] ,function(error, result){
						con.query('INSERT INTO onlineChart2 SET online=?, idle=?, offline=?, total=?, messages=?, date=? ',[chart.online, chart.idle, chart.offline, chart.total, chart.messages, chart.date] ,function(error, result){
							if(error){
								console.log("Error inserting data into remote ", error);
							}
							if(!error){
								
							}
						});

					});
				}
			});

		}
	},
	"reload": {
		desc: " Reloads required modules",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			reload(message);
		}
	},
	"test": {
		desc: " Test Config settings",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			functions.sendMessageWho(message, "Config Setting " + settings.testconfig, "delete", 10000,() => {});
		}
	}
};

// exports.adminCommands = adminCommands;
module.exports = adminCommands;