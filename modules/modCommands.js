var fs  = 			require("fs"),
	moment = 		require('moment'),
	webshot = 		require('webshot'),
	Discord = 		require('discord.js'),
	Stopwatch = 	require('statman-stopwatch'),
	now = 			require('performance-now'),
	settings = 		require(__dirname + "/settings.json"),
	functions = 	require(__dirname + "/functions.js"),
	events = 		require(__dirname + "/events.js"),
	userCommands = 	require(__dirname + "/userCommands.js");

var exec = require('child_process').exec;

require("moment-duration-format");
//////////////////////

var modCommands = {
	"admin": { 
		desc: "Informations about admin commands.",
		usage: "[command]",
		deleteCommand: true, shouldDisplay: false, cooldown: 1,
		process: function(con, client, message, parsed) {
			var suffix = parsed[1];
			var toSend = [];
			if (!suffix) {
				toSend.push("Use `"+ settings.prefix + "admin <command name>` to get more info on a command.\n");
				toSend.push("**Admin COMMANDS:**```glsl\n");
				Object.keys(modCommands).forEach(cmd=>{
					if (modCommands[cmd].hasOwnProperty("shouldDisplay")) {
						if (modCommands[cmd].shouldDisplay) toSend.push("\n"+ settings.prefix + cmd + ", Execute: " + modCommands[cmd].usage + "\n\t#" + modCommands[cmd].desc);
					}else{
						toSend.push("\n"+ settings.prefix + cmd + " " + modCommands[cmd].usage + "\n\t# " + modCommands[cmd].desc);
					}
				});
				toSend = toSend.join('');
				if(toSend.length >= 1990){
					message.channel.sendMessage(toSend.substr(0, 1990).substr(0, toSend.substr(0, 1990).lastIndexOf('\n\t')) + "```");
					setTimeout(()=>{message.channel.sendMessage("```glsl" + toSend.substr(toSend.substr(0, 1990).lastIndexOf('\n\t')) + "```");}, 1000);
				}else{
					message.channel.sendMessage(toSend + "```");
				}
			}else{

				if(modCommands.hasOwnProperty(suffix)){
					toSend.push("`" + modCommands[suffix].usage + "`");
					if (modCommands[suffix].hasOwnProperty("info")) toSend.push(modCommands[suffix].info);
					else if (modCommands[suffix].hasOwnProperty("desc")) toSend.push(modCommands[suffix].desc);
					if (modCommands[suffix].hasOwnProperty("cooldown")) toSend.push("__Cooldown:__ " + modCommands[suffix].cooldown + " seconds");
					if (modCommands[suffix].hasOwnProperty("deleteCommand")) toSend.push("*Can delete the activating message*");
					message.channel.sendMessage(toSend);

				}else{
					message.channel.sendMessage("Command `" + settings.prefix + "` not found. Aliases aren't allowed.").then(wMessage => {
						wMessage.delete(10000);
					}).catch(error => console.log('--- Error on message', error));
				}
			}
		}
	},
	"role": { // command passed
		desc: "Admin Command for adding and removing user role.",
		usage: "[command assign/take @user role]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild, user) {
			if(parsed[1] == null){
				userCommands[parsed[0].toLowerCase().substring(1)].process(con, client, message, parsed, guild, user);
			}else{
				if(parsed[1].toLowerCase() == "assign" || parsed[1].toLowerCase() == "take"){
					if(parsed[2] == null){
						message.channel.sendMessage("You need to provide a user to assign a role").catch(error => console.log('--- Error on message', error));
					}else{
						var member = guild.members.get(message.mentions.users.first().id);

						var parsedRoleIDfromServer = guild.roles.array().filter(role => {return role.name.toUpperCase() == parsed[3].toUpperCase() }).map(role => role.id).toString();
						var checkifRole = member.roles.has(parsedRoleIDfromServer).catch(error => console.log('--- Error on message', error)); // checks if user has role
						var rolesMention = guild.roles.has(parsedRoleIDfromServer).catch(error => console.log('--- Error on message', error)); // check if role mention exists

						if(parsed[3] == null){
							message.channel.sendMessage("You did not specify a role, please mention one.");
						}else{
							var roleListArray = rolesBotCanNotAssign.join('|');
							var regex = new RegExp(roleListArray, 'gi' );

							if(parsed[1].toLowerCase() == "assign" ){
								if(rolesMention == false || checkifRole == true || parsed[3].match(regex)){

									if(checkifRole == true){ // check if role is already assigned
										message.channel.sendMessage("You already have the role assigned ``" + capitalize(parsed[3]) +"``").catch(error => console.log('--- Error on message', error));
									}else if(parsed[3].match(regex)){
										message.channel.sendMessage("Bot can't assign " + parsed[3] + " role, type another role.").catch(error => console.log('--- Error on message', error));
									}else{
										message.channel.sendMessage("There's no role with the name ``" + parsed[3] + "``, double check what you typed.").catch(error => console.log('--- Error on message', error));
									}
								}else{
									var roleName = guild.roles.get(parsedRoleIDfromServer).name;
									member.addRole(parsedRoleIDfromServer).catch(error => console.log('--- Error on message', error));

									message.channel.sendMessage("User " + member.user + " now has the role of ``" + roleName + "`` assigned By "+ message.author).catch(error => console.log('--- Error on message', error));
									message.channel.guild.channels.get(settings.botAnnouncementChannel.id).sendMessage("``User ``" + member.user +"`` has been added to role : " + roleName + "`` By "+ message.author).catch(error => console.log('--- Error on message', error));
									functions.appendFile(" --- " + member.user.username + " --- has been added to role :  " + roleName + " By " + message.author.username,() => {});
								}
							}else if(parsed[1].toLowerCase() == "take"){
								if (rolesMention == false || checkifRole == false || parsed[3].match(regex)){
									if(checkifRole == false){ // check if role is already assigned
										message.channel.sendMessage("You don't have this role assigned ``" + capitalize(parsed[3]) +"``");
									}else if(parsed[3].match(regex)){
										message.channel.sendMessage("Bot can't remove " + parsed[3] + " role, type another role.");
									}else{
										message.channel.sendMessage("There's no role with the name ``" + parsed[3] + "``, double check what you typed.");
									}
								}else{
									var roleName = guild.roles.get(parsedRoleIDfromServer).name;
									message.member.removeRole(parsedRoleIDfromServer).catch(error => console.log('--- Error on message', error));

									message.channel.sendMessage("User " + member.user + " no longer has the role of ``" + roleName + "`` removed By "+ message.author).catch(error => console.log('--- Error on message', error));
									message.channel.guild.channels.get(settings.botAnnouncementChannel.id).sendMessage("``User ``" + member.user +"`` has been removed from role : " + roleName + "`` By "+ message.author).catch(error => console.log('--- Error on message', error));
									functions.appendFile(" --- " + member.user.username + " --- has been removed from role :  " + roleName + " By " + message.author.username,() => {});
								}
							}
						}
					}
				}
			}
		}
	},


	// "chartstats": {
	// 	desc: "Show current Statistics for the server.",
	// 	usage: "[command]",
	// 	shouldDisplay: true, deleteCommand: true, cooldown: 10,
	// 	process: function(con, client, message) {
	// 		try {
	// 		message.channel.sendMessage("**Generating Statistics Chart.**").then(msg => {
	// 	        var sw = new Stopwatch(true);
	// 			var options = {
	// 			  screenSize: {
	// 			    width: 1024
	// 			  , height: 768
	// 			  }
	// 			, shotSize: {
	// 			    width: 865
	// 			  , height: 415
	// 			  }
	// 			, userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:48.0)'
	// 			    + ' Gecko/20100101 Firefox/48.0'
	// 			};
	// 			var cardStatistics = "/var/www/TNTDroid/Stats/droidStatistic.png";

	// 			webshot('http://localhost/TNTDroid/Stats/', cardStatistics, options, function(err) {
	// 			  if(err){
	// 			 	 console.log(err);
	// 			  }
	// 			  if(!err){
	// 				sw.stop();
	// 				functions.appendFile(" Render Droid Statistic Done - elapsed: "+ Math.round(sw.read()) / 1000 + "s",() => {});
	// 				msg.delete();
	// 				message.channel.sendFile(cardStatistics,'',"**Chart Server Statistics - GMT+0**").catch((error) => {
	// 					console.log(error);
	// 				});
	// 			  }
	// 			});
	// 		});
	// 		} catch(error){console.log(" ERROR " + error)}
	// 	}
	// },


	
	"clear": {
		desc: "Clear last messages as bulk.",
		usage: "[command number]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed) {
			if(!parsed[1] || parsed[1] == null || parsed[1] < 1 || !functions.isNumber(parsed[1]))
						return message.channel.sendMessage('You must enter a number of messages to clear from the channel')
			.then((res) => res.delete(5000));	
		
			if(functions.isNumber(parsed[1])){
				var deleteNumber = Math.round(parsed[1]);
				message.channel.fetchMessages({limit: deleteNumber, before: message.id}).then(messages => {
					messages.forEach(message => {
						message.delete();
					});
					if(message.channel.id == settings.botAnnouncementChannel.id && message.author.id != "200160671084707841"){
						message.channel.guild.channels.get(settings.botAnnouncementChannel.id).sendMessage( "``User ``"+ message.author + "`` tried to Deleted " + parsed[1] + " messages from channel ``" + message.channel);
						functions.appendFile(" --- " + message.author.username + " tried to Deleted " + parsed[1] + " messages from channel " + message.channel.name,() => {});
					}else{
						message.channel.guild.channels.get(settings.botAnnouncementChannel.id).sendMessage( "``User ``"+ message.author + "`` Deleted " + parsed[1] + " messages from channel ``" + message.channel);
						functions.appendFile(" --- " + message.author.username + " Deleted " + parsed[1] + " messages from channel " + message.channel.name,() => {});
					}
				}).catch(error => {
					console.log(error);
					console.log("Error Getting channel messages");
				});
			}
		}
	},
	"prune": {
		desc: "Remove the last given quantity of messages for the provided member.",
		usage: "[command @member quantity]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild) {
			let quantity = parsed[2];
			var count = 0;
			var countDelete = 0;
			if (!parsed[2] || parsed[2] < 1)
						return message.channel.sendMessage('You must enter a number of messages to prune from the channel')
			.then((res) => res.delete(5000));

			if (!parsed[1] || parsed[1] < 1 || message.mentions.length < 1)
						return message.channel.sendMessage('You need to specify a member to remove the messages from.')
			.then((res) => res.delete(5000));

			message.channel.fetchMessages({ limit: 100 }).then(fetchMessages => {
				message.channel.sendMessage('**Prune operation in progress...**').then(msg => {

					fetchMessages.filter( a => a.author.id == message.mentions.users.first().id).forEach(message => {
						if(count < quantity){
							message.delete()
							.then(out => {
								countDelete++;
								if(countDelete == quantity){
									msg.edit('**Prune operation completed.**').catch(error => console.log('--- Error on message', error));
								}
							})
						}
						count++;
					});

				})
			}).catch(error => console.log('--- Error on message', error));
		}
	},
	"mute": {
		desc: "Mute user for time, Time is in ms.",
		usage: "[command @member time]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild) {
			if (parsed[1] == null || parsed[2] == null || message.mentions.length < 1) {
				message.channel.sendMessage("You need to specify the the person being muted and the duration of the mute in seconds.");
			} else {
				if(functions.isNumber(parsed[2],() => {})){
					var time = parseInt(parsed[2])*1000;
					var member = message.channel.guild.members.get(message.mentions.users.first().id);

					var mutedRoleID = guild.roles.find("name", "Muted").id;
					member.addRole(settings.mutedRoleID).catch(console.log);

					con.query('UPDATE users SET muted=1, mutedTime=? WHERE userid=?', [time, member.user.id]);
					message.channel.sendMessage("**"+ member.user.username +"#"+ member.user.discriminator + "** - User has been muted for " + parsed[2] + " seconds");

					setTimeout(function() {
						member.removeRole(settings.mutedRoleID).catch(console.log);
						con.query("UPDATE users SET muted = 0, mutedTime = 0 WHERE userid=?", member.user.id);
					}, time);
				}else{
					message.author.sendMessage("You did not specify a value for interval.");
				}
			}
		}
	},
	"unmute": {
		desc: "unMute user.",
		usage: "[command @member]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild) {
			let member = guild.members.get(message.mentions.users.first().id);
			let rolesMention = member.roles.has(settings.mutedRoleID);

			if(parsed[1] == null || message.mentions.length < 1  || rolesMention == false) {
				message.channel.sendMessage("You need to specify the the person being unmuted or this person is not muted.");
			}else{
				member.removeRole(settings.mutedRoleID).catch(console.log);
				con.query("UPDATE users SET muted = 0, mutedTime = 0 WHERE userid=?", member.user.id);
				message.channel.sendMessage("**"+ member.user.username +"#"+ member.user.discriminator + "** - User has been unMuted");
			}
		}
	},
	"kick": { // command passed
		desc: "Kick user from servers",
		usage: "[command @member reason]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild, channel) {
			con.query('SELECT id FROM modLog ORDER by id DESC LIMIT 1', function(error, result){
				if(error){
					console.log("Error kicking", error);
				}
				if(!error){
					if(parsed[2] == null){
						message.channel.sendMessage("You didn't specify a reason, [command @user reason]").then(message => message.delete(8000));
					}else{
						var lastID = +result[0].id + 1;
						var parsedUser = message.mentions.users.first();
						var reason = joinParsed(parsed, " ",2,parsed.length);

						var kickMessage = "\n" +
										"**Kick** | Case " + lastID + "\n" +
										"**User:** " + parsedUser.username + "#" + parsedUser.discriminator + " (" + parsedUser.id + ")" + "\n" +
										"**Reason:** " + reason + "\n" +
										"**Responsible Moderator:** " + message.author.username + "#" + message.author.discriminator;

						message.channel.sendMessage(kickMessage).then(message => message.delete(10000));
						message.channel.guild.channels.get(settings.botCommandsChannel.id).sendMessage(kickMessage);

						message.guild.members.get(parsedUser.id).kick();
						con.query("INSERT INTO modLog SET type='kick', reason=?, username=?, userid=?, modusername=?, modid=?, date=?, ", [reason, parsedUser.username,  parsedUser.id, message.author.username, message.author.id, functions.dateCurrent(() => {})], function(error,result){
							if(error){
								console.log(error);
							}
						});
						functions.appendFile(" --- " + message.author.username + " Kicked " + parsedUser.username + " Reason : " + reason,() => {});
					}
				}
			});
		}
	},
	"ban": { // command passed
		desc: "Ban user from the server. " +
		"Days Number, how many days to go back and delete messages from that user [Between 0 and 7].",
		usage: "[command @member days reason]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild, channel) {
			con.query('SELECT id FROM modLog ORDER by id DESC LIMIT 1', function(error, result){
				if(error){
					console.log("Error Banning", error);
				}
				if(!error){

					if(parsed[3] == null){
						message.channel.sendMessage("You didn't specify a reason, [command @user days reason]").then(message => message.delete(8000));
					}else{
						if(parsed[2] == null){
							client.sendMessage(message, "You didn't specify a day, [command @user days reason]").then(message => message.delete(8000));
						}else{

							var lastID = +result[0].id + 1;
							var parsedUser = message.mentions.users.first();
							var reason = joinParsed(parsed, " ",2,parsed.length);

							var banMessage = "\n" +
											"**Ban** | Case " + lastID + "\n" +
											"**User:** " + parsedUser.username + "#" + parsedUser.discriminator + " (" + parsedUser.id + ")" + "\n" +
											"**Reason:** " + reason + "\n" +
											"**Responsible Moderator:** " + message.author.username + "#" + message.author.discriminator;

							message.channel.sendMessage(kickMessage).then(message => message.delete(10000));
							message.channel.guild.channels.get(settings.botCommandsChannel.id).sendMessage(banMessage);

							message.guild.members.get(parsedUser.id).ban(deleteLength);
							con.query("INSERT INTO modLog SET type='ban', reason=?, username=?, userid=?, modusername=?, modid=?, date=?, ", [reason, parsedUser.username, parsedUser.id, message.author.username, message.author.id, functions.dateCurrent(() => {})], function(error,result){
								if(error){
									console.log(error);
								}
							});
							functions.appendFile(" --- " + message.author.username + " Banned " + parsedUser.username + " Reason : " + reason,() => {});

						}
					}

				}
			});
		}
	},
	"uptime": {
		desc: "Displays the bot Uptime.",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: false, cooldown: 0,
		process: function(con, client, message) {
			exec("sudo bash /var/www/TNTDroid/droid-Discord/modules/uptime.sh", (error, stdout, stderr) => {
				if (error) {
					console.log(error);
					console.log("Error getting forever list");
					console.log(functions.dateTime(() => {}));
					return;
				}
				let uptime = moment.duration(parseInt(stdout.trim())).format(' D [days], H [hrs], m [mins], s [secs]');
				let duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
				message.channel.sendMessage("**UPTIME** : ``" + duration + "`` \n" +
											"   **SERVER UPTIME**  : ``" + uptime + " ``");
			})
		}
	},
	"ms": {
		desc: "Displays the bot ping",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: false, cooldown: 0,
		process: function(con, client, message) {
			events.stabilityCheck(con, client, message.channel.id,() => {});
		}
	},
	"reboot": {
		desc: "Force bot restart.",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild) {
			functions.reboot(client, message, 0, 0, message.channel.id,() => {});
		}
	},
	"date": { 
		desc: "Show current server date.",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			let duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');

			console.log('###########################################################################');
			console.log(functions.dateTime(() => {}));
			console.log( 'Uptime : '+ duration +'\n'+
						'###########################################################################');
			var dateCurrentTimezone = new Date(functions.dateCurrent(() => {}).valueOf() + functions.dateCurrent(() => {}).getTimezoneOffset() * 60000);

			message.channel.sendMessage("``Current time : " + functions.dateCurrentLog(dateCurrentTimezone,() => {}) + " GMT+0``");
		}
	},
	"guild": { 
		desc: "Provides some details about the bot and guild.",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: false, cooldown: 0,
		process: function(con, client, message, parsed, guild) {
			let duration = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
			functions.sendMessageWho(message, `
\`\`\`
STATISTICS
• Guild Name        : ${guild.name}
• Creation Date     : ${guild.createdAt}
• Guild Owner       : ${guild.owner.user.username}#${message.guild.owner.user.discriminator}
#################################################
• Mem Usage         : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
• Uptime            : ${duration}
• Discord.js        : v${Discord.version}
#################################################
• Users             : ${guild.memberCount} 
• • Online          : ${guild.members.filter(u => u.presence.status == 'online' || u.presence.status == 'idle' || u.presence.status == 'dnd').size}, Idle : ${client.users.filter(u => u.presence.status == 'idle').size}, DND : ${client.users.filter(u => u.presence.status == 'dnd').size}
• • Offline         : ${guild.members.filter(u => u.presence.status == 'offline').size}
• Roles Number      : ${guild.roles.size}
• Server Region     : ${guild.region}
#################################################
• Servers           : ${client.guilds.size}
• Channels          : ${client.channels.size}
• Text channels     : ${client.channels.filter(channel => channel.type == "text").size}
• DM Channels       : ${client.channels.filter(channel => channel.type == "dm").size}
• Voice Channels    : ${client.channels.filter(channel => channel.type == 'voice').size}
• Group DM Channels : ${client.channels.filter(channel => channel.type == "group").size }
\`\`\``,() => {});
		}
	}
};


// exports.modCommands = modCommands;
module.exports = modCommands;