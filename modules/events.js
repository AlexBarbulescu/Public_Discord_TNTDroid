var fs  = require("fs"),
	moment = require('moment'),
	Filter = require('bad-words'),
	Stopwatch = require('statman-stopwatch'),
	webshot = require('webshot'),
	cheerio = require('cheerio'),
	phantom = require("phantom"),
	goorl = require('goorl'),
	now = require('performance-now'),
	AuthDetails = require(__dirname + "/../droid-auth.json"),
	settings = require(__dirname + "/settings.json"),
	functions = require(__dirname + "/functions.js");

var exec = require('child_process').exec;

var filter = new Filter();
var indexPkgCommand = [];
var cooldownEXP = []; // this needs to be replaced
var _ph, _page, _outObj;

require("moment-duration-format");

const start = process.hrtime();

exports.syncUsers = function(con, client, message, parsed, guild){
	con.query('SELECT id,username,userid FROM users', function(error,result){
		if(!error){
			if(guild.memberCount != result.length){

					// http://stackoverflow.com/questions/31413749/node-js-promise-all-and-foreach

					// fs.writeFile(__dirname + "/../db/syncUsers.json", JSON.stringify(result), function (error) {
					//   if(error) return console.log(err);
					// });

					// console.log(JSON.stringify(result).forEach(member => { return guild.members.indexOf(member.userid) < 0 }).size);

					var usersDatabase = result.map(member => member.userid);
					Promise.all( guild.members.map(member => member.id)).then(usersDiscord => {

						var resA = usersDatabase.filter( user => { if(usersDiscord.indexOf(user) === -1) { return user; }});
						var resB = usersDiscord.filter( user => { if(usersDatabase.indexOf(user) === -1) { return user; }});

						message.channel.sendMessage(" \n" +
												"-- Total Member Count " + guild.memberCount + "\n" +
												"-- Database Members " + usersDatabase.length + "\n" +
												"-- Discord Members " + usersDiscord.length + "\n" +
												"-- Must remove " + resA.length + ", Must add " + resB.length).then(message => message.delete(20000));
						console.log(resA);
						console.log(resB);


					});


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

					// if(resB.length > 0){
					// 	console.log("ID not in database - Must add - ",resB);

					// 	resB.forEach(function(data) {

					// 		var member = guild.members.get(data);

					// 		var avatar = member.user.avatar;
					// 		if(avatar == null ) {
					// 				avatar = 0;
					// 		}

					// 		client.channels.get(settings.botAnnouncementChannel.id).sendMessage("User Was added to Database `Sync Offline` - " + member + " - ``" + member.user.username + "#" + member.user.discriminator + "`` - ID - ``" + member.id + "``");

					// 		con.query("INSERT INTO users SET username=?, userid=?, avatar=?, bot=?, status=?, joinDate=?, karmaLimit='2000-01-01 00:00:00', karma=0, karmaGiven=0, exp=0, level=0, rank=0", [member.user.username, member.user.id, avatar, member.user.bot, member.presence.status, dateCurrent()], function(error,result){
					// 			if(error){
					// 				console.log(error);
					// 			}
					// 		});
					// 	});


					// }

					// con.query("ALTER TABLE users auto_increment=10; SET @newid=0; UPDATE users SET id=(@newid:=@newid+1) ORDER BY id", function(error,result){
					// 	if(error){
					// 		console.log(error);
					// 	}
					// });

  					// console.log("-- Sync Database Ended!");
			

			}
		}
		if(error){
			console.log(error);
		}
	});
}


exports.guildMemberAdd = function(con, client, member){

	client.channels.get(settings.generalChannel.id).sendMessage( "A Wild Unity User **"+ member.user.username + "#" + member.user.discriminator  +"** Appears! Welcome to Unity Developer Hub");
	client.channels.get(settings.botAnnouncementChannel.id).sendMessage("User Joined - " + member + " - ``" + member.user.username + "#" + member.user.discriminator + "`` - ID - ``" + member.id + "`` Member Number : " + member.guild.memberCount);

	functions.appendFile(" --- " + member.user.username + " --- JOINED  " + member.user.id,() => {});

	if(member.guild.memberCount == 1000){
		client.channels.get(settings.generalChannel.id).sendMessage( "We have reached 1000 members.");
	}

	if(settings.sendMessageOnJoin == 1){
		member.sendMessage("**Welcome to UDH - Unity3D Developer Hub, Merry Christmas and Happy new Year!!!" + member + "!**\n" +
		"\n" +
		"This community is focused around Unity3D. It's a game engine and for more informations you can visit https://unity3d.com/ also check out the forum at https://forum.unity3d.com/ \n" +
		"Here in Guild you can use the bot for information in general; about other users, the guild and message XP.\n" +
		"Use ``"+ settings.prefix +"help`` to see all commands available. \n" +
		"Use ``"+ settings.prefix +"role add role`` to assign a role, and ``"+ settings.prefix +"role list`` for informationa about our Guild roles.\n" +
		"All mesages typed in chat gives you XP, you can visit our site for your XP ranking - http://tntdroid.xyz \n" +
		"You can also give karma points with ``Thanks @mention`` command, thanks letters are not case-sensitive. Each KP gives a boost for message XP.");
	}

	var avatar = member.user.avatar;
	if(avatar == null) avatar = 0;

	con.query("INSERT INTO users SET username=?, userid=?, discriminator=?, avatar=?, bot=?, status=?, joinDate=?; ALTER TABLE users auto_increment=10; SET @newid=0; UPDATE users SET id=(@newid:=@newid+1) ORDER BY id", [member.user.username, member.id, member.user.discriminator, avatar, member.user.bot, member.presence.status, functions.dateCurrent(() => {})], function(error,result){
		if(error){
			console.log(error);
		}
	});
}


exports.guildMemberRemove = function(con, client, member){

	functions.appendFile(" --- " + member.user.username + " --- LEFT - After " + moment(member.joinedAt).fromNow().replace(/ ago/g, "") + " User - " + member.id,() => {});
	client.channels.get(settings.botAnnouncementChannel.id).sendMessage("User Left - After " + moment(member.joinedAt).fromNow().replace(/ ago/g, "") + " " + member + " - ``" + member.user.username + "#" + member.user.discriminator + "`` - ID - ``" + member.id + "``");

	con.query('SELECT * FROM users WHERE userid=?',  member.id, function(error,result){
		if(error){
			console.log(error);
		}
		if(!error){

			// con.query("DELETE FROM users WHERE userid=?; SET @newid=0; UPDATE users SET id=(@newid:=@newid+1) ORDER BY id; ALTER TABLE users auto_increment=10", member.id, function(error,result){
			con.query("DELETE FROM users WHERE userid=?", member.id, function(error,result){
				if(error){
					console.log(error);
				}
			});

			con.query("INSERT INTO users_remove SET username=?, discriminator=?, userid=?, avatar=?, avatarURL=?, bot=?, muted=?, mutedTime=?, joinDate=?, createdDate=?, karma=?, karmaGiven=?, profanity=?, karmaLimit=?, active=?, lastSeen=?, lastMessage=?, status=?, roles=?, packagesAvailable=?, packagesLeft=?, keycode=?, exp=?, expLimit=?, level=?, rank=?, game=?, live=?, liveMessage=?", [result[0].username, result[0].discriminator, result[0].userid, result[0].avatar, result[0].avatarURL, result[0].bot, result[0].muted, result[0].mutedTime, result[0].joinDate, result[0].createdDate, result[0].karma, result[0].karmaGiven, result[0].profanity, result[0].karmaLimit, result[0].active, result[0].lastSeen, result[0].lastMessage, result[0].status, result[0].roles, result[0].packagesAvailable, result[0].packagesLeft, result[0].keycode, result[0].exp, result[0].expLimit, result[0].level, result[0].rank, result[0].game, result[0].live, result[0].liveMessage], function(error,result){
				if(error){
					console.log(error);
				}
			});

		}
	});	
}


exports.guildMemberUpdate = function(con, client, oldMember, newMember){

	var roleDiffID = functions.arrayDiff(oldMember.roles.map(role => role.id), newMember.roles.map(role => role.id),() => {});
	var roleDiffName = functions.arrayDiff(oldMember.roles.map(role => role.name), newMember.roles.map(role => role.name),() => {});

	if(roleDiffName != null){
		roleDiffName.forEach(role => {
			if(newMember.roles.get(role.toString())){ // check if you remove or add the role
				// console.log(" --- " + newMember.user.username + " --- Added this role : " + role);
				functions.appendFile(" --- " + newMember.user.username + " --- Added this role : " + role,() => {});
			}else{
				// console.log(" --- " + newMember.user.username + " --- Removed this role : " + role);
				functions.appendFile(" --- " + newMember.user.username + " --- Removed this role : " + role,() => {});
			}
		});
	}else{
		// console.log(roleDiffName);
		// console.log(oldMember.user.username, oldMember.roles);
		// console.log(newMember.user.username, newMember.roles);
	}


	if(oldMember.nickname != newMember.nickname){
		client.channels.get(settings.botAnnouncementChannel.id).sendMessage( "User "+ newMember + " changed his nickname " + newMember.nickname);
	}

	var rolesListDB = newMember.roles.filter(role => {return role.name != '@everyone'}).map(role => role.name).join(','); 
	con.query("UPDATE users SET roles=? WHERE userid=?", [rolesListDB, newMember.id], function(error,result){
		if(error) return console.log(error);
	});
}


exports.streaming = function(con, client, oldMember, newMember){
	if(newMember.roles.has(settings.streamerRoleID)){ // check if user has streamer role
		if(newMember.roles.has(settings.streamingRoleID)){ // check if user has streaming role in order to remove it
			newMember.removeRole(settings.streamingRoleID);
			client.channels.get(settings.devStreamChannel.id).sendMessage(":stop_button: Streamer **" + newMember.user.username + "** - Has Ended his stream");
			client.channels.get(settings.botAnnouncementChannel.id).sendMessage(":stop_button: Streamer " + newMember + " - Has Ended his stream");

			con.query("SELECT liveMessage FROM users WHERE userid=?", newMember.id, function(error,result){
				if(error) console.log(error);
				if(!error){
					var liveMessage = result[0].liveMessage;
					// client.channels.get( settings.devStreamChannel.id).fetchMessage(liveMessage).then(message => message.delete(1000));
					con.query("UPDATE users SET live=0, liveMessage=0 WHERE userid=?", newMember.id, function(error,result){
						if(error){
							console.log(error);
						}
					});
				}
			});
		}

		if(newMember.presence.game != null){
			if(newMember.presence.game.streaming){
				client.channels.get(settings.devStreamChannel.id).sendMessage(":record_button: Streamer " + newMember + " - Streaming Right Now, Title **" + newMember.presence.game.name +"**, Link: <"+ newMember.presence.game.url + ">").then(message => {
					con.query("UPDATE users SET liveMessage=? WHERE userid=?", [message.id, newMember.user.id], function(error,result){
						if(error) return console.log(error);
					});
				});
				client.channels.get(settings.botAnnouncementChannel.id).sendMessage(":record_button: Streamer " + newMember + " - Streaming Right Now, Title ``" + newMember.presence.game.name +"``, Link: ``"+ newMember.presence.game.url + "``");

				newMember.addRole(settings.streamingRoleID);
				con.query("UPDATE users SET live=1 WHERE userid=?", newMember.user.id, function(error,result){
					if(error) return console.log(error);
				});
			}
		}
	}
}


exports.presenceUpdate = function(con, client, oldMember, newMember){

	let gameName = "";
	let gameString = "";
	if(newMember.presence.game != null){
		gameString = ", Game - " + newMember.presence.game.name;
		gameName = newMember.presence.game.name;
	}

	// keeps track to file the status of user
	if(!oldMember.user.bot){
		functions.appendFile(" - Presence  --- " + newMember.user.username + " ----- " + oldMember.presence.status + " => " + newMember.presence.status + gameString,() => {});
	}
	// updates status, game playing, lastSeen Date on presence
	con.query('UPDATE users SET status=?, lastSeen=?, game=? WHERE userid=?',[newMember.presence.status, functions.dateCurrent(() => {}), gameName, newMember.user.id], function(error,result){
		if(error) return console.log(error);
	});
}


exports.userUpdate = function(con, client, oldUser, newUser){

	// updated avatar to databse if changed, also keeps track to file

	if(oldUser.avatarURL != newUser.avatarURL){
		con.query("UPDATE users SET avatarURL=?, avatar=?, lastSeen=? WHERE userid=?", [newUser.avatarURL, newUser.avatar, functions.dateCurrent(() => {}), newUser.id], function(error,result){
			if(error) return console.log(error);
		});
		// client.channels.get(settings.botAnnouncementChannel.id).sendMessage( "User **"+ newUser + "** Changed Avatar " + newUser.avatarURL );
		functions.appendFile(" - Avatar --- " + newUser.username + " -----  Changed Avatar",() => {});
	}
	// updates username to database, notifies in channel and also keeps track to file
	if(oldUser.username != newUser.username){
		client.channels.get(settings.botAnnouncementChannel.id).sendMessage("User " + newUser + " - Changed his username from ``" + oldUser.username + "#" + oldUser.discriminator + "`` - to - ``" + newUser.username + "#" + newUser.discriminator +"``").catch((error) => console.log(error));
		functions.appendFile(" - Username --- " + oldUser.username + " - Changed his username to - " + newUser.username,() => {});
	}

}


exports.messageDelete = function(con, client, message){
	var msg = message.content.trim();

	if(functions.contains(settings.arrayAllowedMessageDeleteChannels.channels, message.channel.id, 1,() => {}) && functions.contains(settings.arrayAllowedCMessageDeleteUsers.users, message.author.id, 1,() => {})){
		if(!msg.toLowerCase().startsWith(settings.prefix)) {
			client.channels.get(settings.botAnnouncementChannel.id).sendMessage( "User **"+ message.author.username + "** Deleted ``" + message.content.replace(/'/g, "") + "`` message from channel " + message.channel);
		}
		functions.appendFile(" --- " + message.author.username + " Deleted " + message.content + " message from channel " + message.channel.name,() => {});
	}
}


exports.maintanance = function(message){
	message.channel.sendMessage("**Bot is currently in maintanance mode. **").then(message => message.delete(5*1000)).catch((error) => console.log(error));
	if(functions.contains(arrayAllowedChannels, message.channel.id, 1,() => {})){
		message.delete(5*1000);
	}
}

exports.offline = function(message){
	message.mentions.users.forEach( user => {
		if(user.presence.status == "offline") {
			message.channel.sendMessage("Current user **"+ user.username +"#"+ user.discriminator +"** you have mentioned is offline.").then(wMessage => {
				wMessage.delete(10000);
			}).catch((error) => console.log(error));
		}
	});
}


exports.massMention = function(con, client, message){
	if (message.mentions.length >= 5) {
		message.author.sendMessage(message.author +" Please don't mass mention members. You have been temporarily muted for 1 minute.").catch(error => console.log('--- Error on message', error));
		functions.appendFile(" --- " + message.author.username + " mass mentioned members on the server.",() => {});
		member.addRole(settings.mutedRoleID);
	}
}

exports.profanity = function(con, client, message){
	// Verify Profanity Words
	var msg = message.content.trim();
	var profanityFileSync = fs.readFileSync(__dirname +"/../"+settings.profanityFile).toString().split("\n");
	filter.addWords(profanityFileSync);

	var filtermessage = filter.clean(msg);
	if(msg != filtermessage && message.author.id != settings.TNTDroid && functions.contains(settings.arrayNoProfanityChannels.channels, message.channel.id, 1,() => {})){

		var profanityWord = functions.profanityWordDifference(filtermessage, msg,() => {});
		if(message.mentions.users.size > 0 && settings.convertProfnityIdToUsername == 1){
			message.mentions.users.forEach((item) => {
				msg = msg.replace("<@" + item.id + ">", "@" + item.username);
			});
		}

		message.channel.guild.channels.get(settings.botAnnouncementChannel.id).sendMessage("User "+ message.author +" used profanity word in channel ``" + profanityWord + "``, please verify if it's abusive and take action " + message.channel + "\n" +
			"```His message : " + msg + "```" );

		if(settings.disableProfanityNotification == 1){
			message.author.sendMessage(message.author +" Please don't use profantiy words, You will receive a profanity karma point, that will be substracted from your total karma points.");
		}

		functions.appendFile("--- Profanity word \n" +
			"------------------ \n" +
			message.author.username + " said this profanity word in channel "+ message.channel.name +" --- " + profanityWord + " ---  **" + msg + "**\n" +
			"Filter Message - " + filtermessage + "\n" +
			"Clean Message - " + msg + "\n" +
			"------------------"
			,() => {});

		con.query('UPDATE users SET profanity=profanity + 1 WHERE userid=?', message.author.id, function(error,result){
			if(error){
				console.log("Error adding profanity - ",error);
			}
		});
		profanityWord = profanityWord.join(", ");

		con.query("INSERT INTO profanity SET username=?, userid=?, channel=?,channelName=?, text=?, date=?, word=?, amount='1'", [message.author.username, message.author.id, message.channel.id, message.channel.name, msg, functions.dateCurrent(() => {}), profanityWord], function(error,result){
			if(error){
				console.log("Error adding gave profanity to  - ",error);
			}
			if(!error){
				functions.recalculateProfanity(con,() => {});
			}
		});
	}
}

exports.levelup = function(con, client, message){
	var user = message.author;
	var msg = message.content.trim();
	var randomTime = functions.getRandom(60, 300,() => {});
	var expLimitDate = functions.addMinutes(functions.dateCurrent(), randomTime,() => {});
	var indexPkgCommand = cooldownEXP.indexOf(user.id);
	if (indexPkgCommand > -1) {
		// Needs to wait before reciving EXP points
		// console.log(user.username , " You need to wait to receive xp again.")
	}
	if (indexPkgCommand <= -1) {
		cooldownEXP.push(user.id);

		con.query('SELECT exp, level, rank, profanity, karma, game, roles, avatar, expLimit FROM users WHERE userid=?', user.id, function(error,result){
			if(error){
				console.log(error);
			}
			if(!error){

				var randomBig = functions.getRandom(5, 500,() => {});
				
				var karma = result[0].karma;
				var profanity = result[0].profanity;
				var game = result[0].game;
				var roles = result[0].roles;
				var avatar = result[0].avatar;

				var expSpecial = functions.getRandom(25, 50,() => {});
				var expNormal = functions.getRandom(5, 25,() => {});
				if(game != null){
					if(game.match(/^Unity/)){
						var unityBoost = Math.round(expNormal / 4);
					}else{
						var unityBoost = 0;
					}
				}
				// var expBoost = Math.round((expNormal/100)*(karma-profanity));
				var expBoost = Math.round((expNormal/100)*karma);
				if(expBoost < 0) expBoost = 0; // if profanity is larger than karma then EXP boost is 0
				var expNormalTotal = expNormal + expBoost + unityBoost;

				var exp = result[0].exp;
				var level = result[0].level;
				var half;

				function totalAvatar(total, avatar){
					var noAvatar;
					if(avatar == null){
						return noAvatar = Math.round(total / 5);
					}else{
						return noAvatar = 0;
					}
				}

				function ifAvatar(avatar){
					var ifavatar;
					if(avatar == null){
						return ifavatar = 'false';
					}else{
						return ifavatar = 'true';
					}
				}

				if(randomBig >= 450){
					if(roles == null){
						total = +exp + expSpecial / 2;
						total = total - totalAvatar(total, avatar);
						half = 'true';
					}else{
						total = +exp + expSpecial;
						total = total - totalAvatar(total, avatar);
						half = 'false';
					}
				}else{
					if(roles == null){
						total = +exp + expNormalTotal / 2;
						total = total - totalAvatar(total, avatar);
						half = 'true';
					}else{
						total = +exp + expNormalTotal;
						total = total - totalAvatar(total, avatar);
						half = 'false';
					}
				}

				functions.appendFile(" - Username --- "+user.username+" - Received XP for message in channel "+message.channel.name+", XP Roll Total - "+expNormalTotal+", XP Roll - "+expNormal+", Roll Boost - "+expBoost +", Unity Boost - "+unityBoost+", Total - "+total+", No role assigned? Half XP - "+half+", Special Roll - "+expSpecial+", Has Avatar? - "+ifAvatar(avatar)+", Time limit: "+ randomTime +" /// "+ expLimitDate,() => {});
				//client.channels.get(settings.botXPMessageChannel.id).sendMessage("``User @"+user.username+":"+ user.discriminator+" - Received XP for message in channel #"+message.channel.name+", XP Roll Total - "+expNormalTotal+", XP Roll - "+expNormal+", Roll Boost - "+expBoost +", Unity Boost - "+unityBoost+", Total - "+total+", No role assigned? Half XP - "+half+", Special Roll - "+expSpecial+", Has Avatar? - "+ifAvatar(avatar)+", Time limit: "+ randomTime +" /// Current: "+ functions.dateCurrentLog(functions.dateCurrent(() => {})) +" -> Limit: " + functions.dateLog(expLimitDate) +"``",() => {});
				con.query('INSERT INTO msgLog SET username=?, discriminator=?, userid=?, expNormalTotal=?, expNormal=?, expBoost=?, unityBoost=?, expSpecial=?, exptotal=?, expBefore=?, half=?, channel=?, channelID=?, message=?, avatar=?, date=?', [user.username, user.discriminator, user.id, expNormalTotal, expNormal, expBoost, unityBoost, expSpecial, total, exp, half, message.channel.name, message.channel.id, msg, ifAvatar(avatar), functions.dateCurrent(() => {})], function(error,result){
					if(error) return console.log("Error Message Log - ",error);
				});

				con.query('UPDATE users SET exp=?, expLimit=? WHERE userid=?', [total, expLimitDate, user.id], function(error,result){
					if(error) return console.log("Error Setting exp - ",error);
					if(!error){
						con.query('SELECT id, username, userid, exp, rank FROM users ORDER BY exp DESC', function(error, result){
							if(error) return console.log("Error recalculating server ranking - ",error);
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
									}
									// else{
									// 	con.query('UPDATE users SET rank=? WHERE id=?',[0, result[i].id]);
									// }
								}
								functions.appendFile(" ----- Rank Recalculation Started.",() => {});
							}
						});
					}
				});

				var exp = result[0].exp;
				var explow = 0;

				for(var L=0; L<101; L++) {

					var constant = 69;
					var formula = constant + ((2*L)*constant+L);

					var exphigh = explow + formula;
					var difference = exphigh - explow;
					var xpdifference = exp - explow;

					var barpercent = Math.round(xpdifference / (formula / 100));
					var barpercentNotRound = Math.round(xpdifference / (formula / 100));

					if(total >= explow && total <= exphigh && L > level){
						con.query('UPDATE users SET level=? WHERE userid=?', [L, user.id], function(error, result){
							if(error) return console.log("Error Setting Level - ",error);
							if(!error){
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
								var cardLevelUp = "/var/www/TNTDroid/Profile/levelup/" + user.id +".png";

								webshot('http://localhost/TNTDroid/Profile/levelup.php?id=' + user.id, cardLevelUp, options, function(error) {
									if(error) return console.log(error);
									if(!error){
										sw.stop();
										functions.appendFile("--- " + user.username +" leveled up! - Generation Done - elapsed: "+ Math.round(sw.read()) / 1000 + "s",() => {});

										message.channel.guild.channels.get(message.channel.id).sendFile(cardLevelUp,'',"🆙  | **" + user.username + " leveled up!**").then(message => {
											if(settings.deleteProfileMessagesfromChannels == 1 && functions.contains(settings.arrayProfileCardsNoDelete.channels, message.channel.id, 1,() => {})){
												message.delete(300*1000);
											}
										}).catch((error) => console.log(error));
										message.channel.guild.channels.get(settings.botCommandsChannel.id).sendFile(cardLevelUp,'',"🆙  | **" + user.username + " leveled up!** in channel - " + message.channel).catch((error) => console.log(error));
									}
								});
							}
						});
					}
					explow = exphigh;
				}
			}
		});
	}
	setTimeout(()=>{
		var index = cooldownEXP.indexOf(user.id);
		if (index > -1) {
		    cooldownEXP.splice(index, 1);
		}
		// console.log(user.username , " 60seconds expired.");
	},randomTime*1000);

}

exports.thanks = function(con, client, message){

	con.query('SELECT karmaLimit FROM users WHERE userid=?', message.author.id, function(error,result){
		if(error) return console.log(error);

		let closeTime = new Date(result[0].karmaLimit);
		let currentTime = new Date();
		let interval = 60 * 1000; // 60 seconds
		let limitDate = new Date(currentTime.getTime() + 60000); // limit karma inverval to 1minute

		let selfKarma = message.mentions.users.has(message.author.id);
		if(selfKarma == true){
			message.channel.sendMessage("You can't give karma to yourself. Please don't mention yourself.").catch((error) => console.log(error));
		}else if(closeTime < currentTime) {
			con.query('UPDATE users SET karmaGiven=karmaGiven + 1, karmaLimit=? WHERE userid=?', [limitDate ,message.author.id], function(error, result){ // sets karma given from a user.
				if(error) return console.log("Error limiting karma to 1min - ",error);
			});

			message.mentions.users.forEach( member => {
				con.query("INSERT INTO karma SET gavename=?, gaveid=?, toname=?, toid=?, date=?, amount='1'", [message.author.username, message.author.id, member.username, member.id, functions.dateCurrent(() => {})], function(error,result){
					if(error) return console.log("Error adding gave karma to - ",error);
				});
				functions.appendFile(" --- " + message.author.username + " gave karma to " + member.username + "  With Id - " + member.id,() => {});
				// console.log(message.author.username," gave karma to ", member.username, "  With Id - ", member.id);

				con.query('UPDATE users SET karma=karma + 1 WHERE userid=?', member.id, function(error,result){ // sets karma received as user
					if(error) return console.log("Error Setting karma - ",error);
				});
			});

			if(message.mentions.users.size > 1){
				var mentionsX = 1;
				var mentionUsers = "";
				message.mentions.users.forEach(item => {
					mentionUsers = mentionUsers.concat("**" + item.username + "**");
					if(mentionsX < message.mentions.users.size){
						mentionUsers = mentionUsers.concat(" and ");
					}
					mentionsX++;
				});
				message.channel.sendMessage("**" + message.author.username + "** gave karma to " + mentionUsers + "").catch((error) => console.log(error));
			}else{
				message.channel.sendMessage("**" + message.author.username + "** gave karma to **" + message.mentions.users.first().username + "**").catch((error) => console.log(error));
			}

		}else{
			message.author.sendMessage("You must wait 1 min before granting another Karma point. \n " +
			"Next time please add karma in one line ``thanks @user @user @user``").catch((error) => console.log(error));
		}
	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////

function parsingFrontpage(con, callback){ // parse frontpage of unity3d return link banner
	var sw = new Stopwatch(true);
	phantom.create().then(instance => {
	    _ph = instance;
	    return _ph.createPage();
	}).then(page => {
	    _page = page;
	    page.property('onError', function(msg, trace) { // disable phantom log
	        var msgStack = ['ERROR: ' + msg];
	        if (trace && trace.length) {
	            msgStack.push('TRACE:');
	            trace.forEach(function(t) {
	                msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
	            });
	        }
	    });
	    return _page.open("https://www.assetstore.unity3d.com/en/");
	}).then(status => {
	    return _page.property("content");
	}).then(content => {
	    let $ = cheerio.load(content);
	    // let now = process.hrtime(start);
	    let dailyLink = $("#daily>a").first().attr("href"); // search frontpage unity3d for 24h banner link
	    let dailyName = $(".detail>h3").first().text(); // 24h banner name
	    dailyLink = "https://www.assetstore.unity3d.com/en/" + dailyLink;

	    // let elapsed = (now[0] + now[1]/1000000000).toFixed(2);
		con.query('SELECT packageName FROM rssDiscounted ORDER BY id DESC LIMIT 1', function(error, result){
			sw.stop();
			if(error) callback("-- 24h First Pass - " + error, null, Math.round(sw.read()));
			if(!error){
				if(dailyName != result[0].packageName && dailyName != null){
					callback(null, dailyLink, Math.round(sw.read()));
				}else{
					callback("-- 24h First Pass - Package is the same", null, Math.round(sw.read()));
				}
			}
		});
		_ph.exit();
	}).catch((error) => {
		sw.stop();
		callback("-- 24h First Pass - An error occured. While parsing frontpage... " + error, null, Math.round(sw.read()));
	    _ph.exit();
	});
}


function parsingPackage(con, link, time, callback){ // parse frontpage of unity3d return link banner
	var sw = new Stopwatch(true);
	phantom.create().then(instance => {
	    _ph = instance;
	    return _ph.createPage();
	}).then(page => {
	    _page = page;
	    page.property('onError', function(msg, trace) { // disable phantom log
	        var msgStack = ['ERROR: ' + msg];
	        if (trace && trace.length) {
	            msgStack.push('TRACE:');
	            trace.forEach(function(t) {
	                msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
	            });
	        }
	    });
	    return _page.open(link);
	}).then(status => {
	    return _page.property("content");
	}).then(content => {
	    let $ = cheerio.load(content);
	    // let now = process.hrtime(start);

		let array = [];

		let packageName = $("div h1").first().text();
		let publisherName = $("div.details a:nth-of-type(2)").first().text();
		let percentageDiscount = $(".percentage").first().text().replace(/\%| |\n|OFF/g, "");

		let discountPrice = $(".price").first().text().replace(/\$| |\n/g, "");
		let fullPrice = $(".original-price").first().text().replace(/\$| |\n/g, "");
		let mainImage = $("div.background").attr("style").replace(/background-image: url\(|\);/g, "");

		let smallImage = $("html head meta:nth-of-type(4)").attr("content");
		let description = $(".fulldescription").first().text();
		let categoryDetail = $(".livelink.detaillink").first().text();
		let dateNow = new Date();
		let packageLink = $("a.externallink.link").first().attr("href");
		let packageFullLink = $("meta:nth-of-type(6)").first().attr("content");

		let unrated = $(".rating.inline>span").attr("content");
		let ratingStars, ratingFeedback;
		if (!unrated) {
		    ratingFeedback = 0;
		    ratingStars = 0;
		}else{
		    ratingStars = $(".rating.inline>span").attr("content");
		    ratingFeedback = $("div.count").first().attr("content");
		}

		let date = new Date();
		let test = packageName.replace(/ /g, "_") + "-" + publisherName.replace(/ /g, "_");
		let path = "/var/www/TNTDroid/Discounted/images/";
		let localImage = path + test +".png";

		array.push(packageName, publisherName, percentageDiscount, discountPrice, fullPrice, smallImage, mainImage, description, categoryDetail, date, packageLink, packageFullLink, ratingStars, ratingFeedback, localImage);

	    // let elapsed = (now[0] + now[1]/1000000000).toFixed(2);

		con.query('INSERT INTO rssDiscounted SET packageName=?, publisherName=?, percentageDiscount=?, discountPrice=?, fullPrice=?, smallImage=?, mainImage=?, description=?, categoryDetail=?, date=?, packageLink=?, packageFullLink=?, ratingStars=?, ratingFeedback=?, localImage=?, latest=1', array, function(error, result){
			sw.stop();
			if(error) callback("-- 24h Second Pass - " + error, null, Math.round(sw.read()) + time);
			if(!error){
				callback(null, array, Math.round(sw.read()) + time);
			}
		});
		_ph.exit();
	}).catch((error) => {
		callback("-- 24h Second Pass - An error occured. While getting data from link ... " + error, null, Math.round(sw.read()) + time);
	    _ph.exit();
	});
}


function parsingOutput(con, client, channel, array){ // renders image

	let options = {
	  screenSize: {
	    width: 1024
	  , height: 768
	  }
	, shotSize: {
	    width: 865
	  , height: 389
	  }
	, userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:48.0)' + ' Gecko/20100101 Firefox/48.0'
	};

	webshot('http://localhost/TNTDroid/Discounted/', array[14], options, function(error) {
		if(error) return console.log("-- 24h Third Pass - An error occured. While outputing data..." + error);
		if(!error){
			parsingMessage(con, client, channel, array);
		}
	});

	// phantom.create().then(function(ph) {
	// 	ph.createPage().then(function(page) {

	// 		page.open('http://localhost/TNTDroid/Discounted/');

	// 		page.property('viewportSize', {width: 1024, height: 768});
	// 		page.property('clipRect', { top: 0, left: 0, width: 865, height: 389 });

	// 		page.render(array[14]).then(content => {
	// 			parsingMessage(con, client, channel, array);
	// 		});
	// 	    ph.exit();
	// 	});
	// }).catch((error) => {
	// 	console.log("Third Pass - An error occured. While outputing data..." + error);
	//     _ph.exit();
	// });
}

function parsingMessage(con, client, channel, array){ // sends message into channel
	var x = 0;
	let stars = "";

	let length = 250;
	let end = " […]";
	let message = array[7].replace(/'|^\n+/g,'').replace(/\n/g, ' ').substring(0, length);
	let fullMessage = message + end;

	while(x < array[12]) {
		// stars = stars.concat(":star:");
		stars = stars.concat("★");
	    x++;
	}
	let link = array[11].replace(/\?utm_source=store&utm_medium=menu_right&utm_campaign=AS-Global-24h-Banner/g, "");
	link = link + "?aid=1101lGpz";

	goorl({key: AuthDetails.google, url: link}, (error, url) => {
		if(error) console.error(error);
		if(!error){
			let postMessage = "** --- NEW Package for 24h Sale --- **\n " +
				"\n" +
				"" + array[0] + " made by **" + array[1] + "** at **" + array[2] + "% OFF**\n" +
				"Rating " + stars +" (👤" + array[13] + ")\n" +
				//"Rating " + stars +" (:bust_in_silhouette:" + ratingFeedback + ")\n" +
				"Price **$" + array[3] +"** - ~~$" + array[4] + "~~\n" +
				// "Unity Asset Store Link - **" + array[11] + "**\n" +
				"Unity Asset Store Link - **" + url + "**\n" +
				"```" + fullMessage + "```" +
				"";

			client.channels.get(channel).sendFile(array[14],"",postMessage).catch(console.log);
		}
	})

}

function parsingPackageDB(con, callback){ // check last 24h package from database
	let array = [];
	let now = process.hrtime(start);
	let elapsed = (now[0] + now[1]/1000000000).toFixed(2);
	con.query('SELECT * FROM rssDiscounted ORDER BY id DESC LIMIT 1', function(error, result){
		if(error) return callback(error, null, elapsed);
		if(!error){
			array.push(result[0].packageName, result[0].publisherName, result[0].percentageDiscount, result[0].discountPrice, result[0].fullPrice, result[0].smallImage, result[0].mainImage, result[0].description, result[0].categoryDetail, result[0].date, result[0].packageLink, result[0].packageFullLink, result[0].ratingStars, result[0].ratingFeedback, result[0].localImage);
			callback(null, array, elapsed);
		}
	});
}

exports.parsing24h = function(con, client, forced, channel){ // 24h execution script
	functions.parsingError("###############        24h Parsing Execution         ######################",() => {});
	functions.parsingError(functions.dateTime(() => {}),() => {});

	if(forced != 1){
		parsingFrontpage(con, function(error, link, time){ // parse frontpage of unity3d return link banner
			// if(error && error != "First Pass - Package is the same"){
			if(error){
				functions.parsingError("-- " + error,() => {});
				functions.parsingError(`-- Run Time 24h - ${time/1000} sec / ${moment.duration(Math.floor(time)).format(' D [days], H [hrs], m [mins], s [secs]')} ---`,() => {});
			} 
			if(!error){
				// console.log(link);
				functions.parsingError(`-- Run Time 24h - ${time/1000} sec / ${moment.duration(Math.floor(time)).format(' D [days], H [hrs], m [mins], s [secs]')}---`,() => {});
				parsingPackage(con, link, time, function(error, array, timeTotal){ // parse 24h link of unity3d 
					if(error){
						functions.parsingError("-- " + error,() => {});
						functions.parsingError(`-- Run Time 24h - ${timeTotal/1000} sec / ${moment.duration(Math.floor(timeTotal)).format(' D [days], H [hrs], m [mins], s [secs]')} ---`,() => {});
					} 
					if(!error){
						parsingOutput(con, client, settings.unityNewsChannel.id, array); // renders image 
						functions.parsingError(`-- Run Time 24h - ${timeTotal/1000} sec / ${moment.duration(Math.floor(timeTotal)).format(' D [days], H [hrs], m [mins], s [secs]')} ---`,() => {});
						// console.log(array);
					}
				});
			}
		});
	}else{
		parsingPackageDB(con, function(error, array, timeTotal){ // check last 24h package from database
			// if(error && error != "Package is Different") return console.log(error);
			if(error){
				functions.parsingError("-- " + error,() => {});
				functions.parsingError(`-- Run Time 24h - ${timeTotal/1000} sec / ${moment.duration(Math.floor(timeTotal)).format(' D [days], H [hrs], m [mins], s [secs]')} ---`,() => {});
			}
			if(!error){
				parsingMessage(con, client, channel, array); // sends message into channel
				functions.parsingError(`-- Run Time 24h - ${timeTotal/1000} sec / ${moment.duration(Math.floor(timeTotal)).format(' D [days], H [hrs], m [mins], s [secs]')} ---`,() => {});
				// console.log(array);
			}
		});
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////


function parsingBlogMain(con, callback){ // parse frontpage of unity3d return link banner
	var sw = new Stopwatch(true);
	phantom.create().then(instance => {
	    _ph = instance;
	    return _ph.createPage();
	}).then(page => {
	    _page = page;
	    page.property('onError', function(msg, trace) { // disable phantom log
	        var msgStack = ['ERROR: ' + msg];
	        if (trace && trace.length) {
	            msgStack.push('TRACE:');
	            trace.forEach(function(t) {
	                msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
	            });
	        }
	    });
	    return _page.open("https://blogs.unity3d.com/");
	}).then(status => {
	    return _page.property("content");
	}).then(content => {
	    let $ = cheerio.load(content);

	    let blogLink = $(".cd.tdn").first().attr("href"); // search blog link
	    let blogName = $(".cd.tdn").first().text(); // search blog name

		con.query('SELECT title FROM rssBlog ORDER BY id DESC LIMIT 1', function(error, result){
			sw.stop();
			if(error) callback("First Pass Blog - " + error, null, Math.round(sw.read()));
			if(!error){
				if(blogName != result[0].title && blogName != null){
					callback(null, blogLink, Math.round(sw.read()));
				}else{
					callback("-- Blog First Pass - Name is the same", null, Math.round(sw.read()));
				}
			}
		});
		_ph.exit();
	}).catch((error) => {
		sw.stop();
		callback("-- Blog First Pass - An error occured. While parsing blog main... " + error, null, Math.round(sw.read()));
	    _ph.exit();
	});
}

function parsingBlogLink(con, link, time, callback){ // parse frontpage of unity3d return link banner
	var sw = new Stopwatch(true);
	phantom.create().then(instance => {
	    _ph = instance;
	    return _ph.createPage();
	}).then(page => {
	    _page = page;
	    page.property('onError', function(msg, trace) { // disable phantom log
	        var msgStack = ['ERROR: ' + msg];
	        if (trace && trace.length) {
	            msgStack.push('TRACE:');
	            trace.forEach(function(t) {
	                msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
	            });
	        }
	    });
	    return _page.open(link);
	}).then(status => {
	    return _page.property("content");
	}).then(content => {
	    let $ = cheerio.load(content);
		let array = [];

		let titleBlog = $(".mb10").first().text();
		let linkBlog = link;

		let noimage = $(".post-header-image.ic").attr("style");
		let mainImage;
		if (!noimage) {
		    mainImage = null;
		}else{
		    mainImage = $(".post-header-image.ic").attr("style").replace(/background-image: url\(|\);/g, "");
		}
		let author = $(".avalonbold.post-author>a").first().text();
		if (!author) author = null;

		let descriptionBlog = $(".content.clear.bb.pb30.mb30").first().text().replace(/^\n+/g, '').trim().substring(0, 500);
		let date = new Date();

		array.push(titleBlog, linkBlog, descriptionBlog, mainImage, author, date);
		con.query('INSERT INTO rssBlog SET title=?, link=?, content=?, image=?, author=?, date=?', array, function(error, result){
			sw.stop();
			if(error) callback("-- Blog Second Pass - " + error, null, Math.round(sw.read()) + time);
			if(!error){
				callback(null, array, Math.round(sw.read()) + time);
			}
		});
		_ph.exit();
	}).catch((error) => {
		callback("-- Blog Second Pass - An error occured. While getting data from blog ... " + error, null, Math.round(sw.read()) + time);
	    _ph.exit();
	});
}


function parsingBlogDB(con, callback){ // check last 24h package from database
	let array = [];
	var sw = new Stopwatch(true);
	con.query('SELECT * FROM rssBlog ORDER BY id DESC LIMIT 1', function(error, result){
		sw.stop();
		if(error) return callback(error, null, Math.round(sw.read()));
		if(!error){
			array.push(result[0].title, result[0].link, result[0].content, result[0].image, result[0].author, result[0].date);
			callback(null, array, Math.round(sw.read()));
		}
	});
}

function parsingBlogMessage(con, client, channel, array){ // sends message into channel

	let length = 250;
	let end = " […]";
	let message = array[2].replace('`','').substring(0, length);
	let fullMessage = message + end;
	let author = "";
	if(array[4] != "") author = array[4];

	let blogMessage = "**New on - The Unity Blog** *" + array[1] + "*\n" +
			"\n" +
			"**" + array[0] + "** by "+ author +"\n" +
			"``" + fullMessage + "``\n" +
			"";

	if(array[3] == null){
		client.channels.get(channel).sendMessage(blogMessage).catch(console.log);
	}else{
		client.channels.get(channel).sendFile(array[3],"", blogMessage).catch(console.log);
	}

}

exports.parsingBlog = function(con, client, forced, channel){ // blog execution script
	functions.parsingError("###############       Parsing Blog Execution         ######################",() => {});
	functions.parsingError(functions.dateTime(() => {}),() => {});

	if(forced != 1){
		parsingBlogMain(con, function(error, link, time){ // parse frontpage of blogs.unity3d return link and name
			if(error){
				functions.parsingError("-- " + error,() => {});
				functions.parsingError(`-- Run Time Blog - ${time/1000} sec / ${moment.duration(Math.floor(time)).format(' D [days], H [hrs], m [mins], s [secs]')} ---`,() => {});
			} 
			if(!error){
				functions.parsingError(`-- Run Time Blog - ${time/1000} sec / ${moment.duration(Math.floor(time)).format(' D [days], H [hrs], m [mins], s [secs]')}---`,() => {});
				parsingBlogLink(con, link, time, function(error, array, timeTotal){ // parse link of blogs.unity3d
					if(error){
						functions.parsingError("-- " + error,() => {});
						functions.parsingError(`-- Run Time Blog - ${timeTotal/1000} sec / ${moment.duration(Math.floor(timeTotal)).format(' D [days], H [hrs], m [mins], s [secs]')} ---`,() => {});
					} 
					if(!error){
						parsingBlogMessage(con, client, settings.unityNewsChannel.id, array); // sends the message
						functions.parsingError(`-- Run Time Blog - ${timeTotal/1000} sec / ${moment.duration(Math.floor(timeTotal)).format(' D [days], H [hrs], m [mins], s [secs]')} ---`,() => {});
						// console.log(array);
					}
				});
			}
		});
	}else{
		parsingBlogDB(con, function(error, array, timeTotal){ // parse frontpage of blogs.unity3d return link and name
			// if(error && error != "Package is Different") return console.log(error);
			if(error){
				functions.parsingError("-- " + error,() => {});
				functions.parsingError(`-- Run Time Blog - ${timeTotal/1000} sec / ${moment.duration(Math.floor(timeTotal)).format(' D [days], H [hrs], m [mins], s [secs]')} ---`,() => {});
			}
			if(!error){
				parsingBlogMessage(con, client, channel, array); // sends message into channel
				functions.parsingError(`-- Run Time Blog - ${timeTotal/1000} sec / ${moment.duration(Math.floor(timeTotal)).format(' D [days], H [hrs], m [mins], s [secs]')} ---`,() => {});
				// console.log(array);
			}
		});
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////

exports.renderPackages = function(con, client){ // blog execution script
	con.query('SELECT * FROM advertisment WHERE render=1 LIMIT 1', function(error, result){
		if(error) return console.log(error);
		if(result.length > 0){
			let id = result[0].id;
			let packageName = result[0].packageName;
			let publisherName = result[0].publisherName;
			let path = "/var/www/TNTDroid/Publishers/images/";
			let test = packageName.replace(" ", "_") + "-" + publisherName.replace(" ", "_");
			let pngImage = path + test + '.png';
			let options = {
			  screenSize: {
			    width: 1024
			  , height: 768
			  }
			, shotSize: {
			    // width: 865
			    width: 865
			  , height: 389
			  }
			, userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:48.0)' + ' Gecko/20100101 Firefox/48.0'
			};

			webshot('http://localhost/TNTDroid/Publishers/', pngImage, options, function(error) {
				if(error) return console.log("-- Error While rendering Publisher Packages." + error);
				if(!error){
					con.query('UPDATE advertisment SET render=0, execute=1, localImage=? WHERE id=?',[pngImage, id]);
					functions.parsingError("###############            Render Image              ######################",() => {});
					functions.parsingError(functions.dateTime(() => {}),() => {});
					console.log("Render Image ", pngImage);
				}
			});

			// phantom.create(['']).then(function(ph) {
			// 	ph.createPage().then(function(page) {

			// 		page.open('http://localhost/TNTDroid/Publishers/');

			// 		page.property('viewportSize', {width: 1024, height: 768});
			// 		page.property('clipRect', { top: 0, left: 0, width: 865, height: 389 });

			// 		var pngImage = path + test + '.png';
			// 		page.render(pngImage).then(content => {

			// 			con.query('UPDATE advertisment SET render=0, execute=1, localImage=? WHERE id=?',[pngImage, id]);
			// 			functions.appendFile(" --- Render Image " + pngImage,() => {});
			// 			console.log("Render Image ", pngImage);
			// 		});
			// 	    ph.exit();

			// 	});

			// }).catch((error) => {
			// 	console.log(error);
			//  ph.exit();
			// });

		}
	});
}

exports.advertismentSchedule = function(con, client, channel, override){
	con.query('SELECT COUNT(execute) AS countvalue FROM advertisment WHERE execute=1', function(error, result){
		if(error) return console.log(error);
		if(!error){
			var checkvalue = result[0].countvalue; // row number count
			var guild = client.guilds.get(settings.serverID.id);
			if(checkvalue === 0){
				con.query('UPDATE advertisment SET execute=1');
				exports.advertismentSchedule(con, client, channel, override);
			}else{
				con.query('SELECT * FROM advertisment WHERE execute=1', function(error, result){
					if(error) return console.log(error);
					if(!error){

						var availablePackages = [];

						for (var i = 0; i < result.length; i++) {
							availablePackages.push(result[i].id);
						}

						var packageRandromId = availablePackages[Math.floor(Math.random()*availablePackages.length)];
						var userAway = result[0].away;

						con.query('SELECT * FROM settings WHERE id=5', function(error, result){
							if(error) return console.log(error);
							if(!error){
								var lastPackageId = result[0].value;

								if(lastPackageId == packageRandromId || userAway == 1){
									exports.advertismentSchedule(con, client, channel, override);
								}else{
									con.query('SELECT * FROM advertisment WHERE id=?', packageRandromId, function(error, rows){
										if(error) return console.log(error);
										if(!error){
											availablePackages.length = 0;

											let username = rows[0].username;
											let discriminator = rows[0].discriminator;
											let packageID = rows[0].packageID;
											let user = guild.members.get(rows[0].userid);
											let packageName = rows[0].packageName;
											let publisherName = rows[0].publisherName;
											let price = rows[0].price;
											let smallImage = rows[0].smallImage;
											let mainImage = rows[0].mainImage;
											let description = rows[0].description;
											let categoryDetail = rows[0].categoryDetail;
											let date = rows[0].date;
											let packageLink = rows[0].packageLink;
											let packageFullLink = rows[0].packageFullLink + "?aid=1101lGpz";
											let ratingStars = rows[0].ratingStars;
											let ratingFeedback = rows[0].ratingFeedback;
											let localImage = rows[0].localImage;

											let length = 250;
											let end = " […]";
											let message = description.replace(/'|^\n+/g,'').replace(/\n/g, ' ').substring(0, length);
											let fullMessage = message + end;

											let x = 0;
											let stars = "";
											while(x < ratingStars) {
												// stars = stars.concat(":star:");
												stars = stars.concat("★");
											    x++;
											}
											goorl({key: AuthDetails.google, url: packageFullLink}, (error, url) => {
												if(error) console.error(error);
												if(!error){

													client.channels.get(channel).sendFile(localImage,"","** --- Publisher everyday Advertising --- **\n " +
															"\n" +
															"Today's daily advertising goes to " + user + " ( **" + publisherName +"** ), \n" +
															"with their package : **" + packageName + "**, priced at **$" + price + "**\n" +
															"For any inquiry contact them here on **Unity Developer Hub** by mentioning them in the chat or PM.\n" +
															"\n" +
															// "" + packageName + " made by " + publisherName + " at $" + price + "\n" +
															"Rating " + stars +" (👤" + ratingFeedback + ")\n" +
															// "Unity Asset Store Link -  **" + packageLink + "**\n" +
															"Unity Asset Store Link -  **" + url + "**\n" +
															"```" + fullMessage + "```" +
															"\n" +
															"To be a part of this kind of advertising use ``!pInfo`` for more informations." +
															"").then(message => {
																if(override === 0){
																	let resetDate = functions.dateCurrent(() => {}) + (24*60*60*1000);
																	resetDate = new Date(resetDate);
																	functions.appendFile(" --- Publisher everyday Advertising " + username + " With Package Name " + packageName,() => {});
																	con.query('UPDATE advertisment SET current=0, twitter=0; UPDATE advertisment SET execute=0, current=1, twitter=1 WHERE id=?', rows[0].id);
																	con.query('UPDATE settings SET date=?, value=? WHERE id=5', [resetDate, rows[0].id]);
																}
													})
												}
											})
										}
									});
								}
							}
						});
					}
				});
			}
		}
	});
}

exports.fetchPackageData = function(con, client, callback){
	con.query('SELECT * FROM advertisment WHERE verify=1 LIMIT 1', function(error, result){
		if(error) return console.log(error);
		if(!error){
			if(result != ''){
				var packageID = result[0].packageID;
				var id = result[0].id;
				var sw = new Stopwatch(true);
				phantom.create().then(instance => {
				    _ph = instance;
				    return _ph.createPage();
				}).then(page => {
				    _page = page;
				    page.property('onError', function(msg, trace) { // disable phantom log
				        var msgStack = ['ERROR: ' + msg];
				        if (trace && trace.length) {
				            msgStack.push('TRACE:');
				            trace.forEach(function(t) {
				                msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
				            });
				        }
				    });
				    return _page.open("https://www.assetstore.unity3d.com/en/#!/content/" + packageID);
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
				    
				    array.push(packageName, publisherName, price, smallImage, mainImage, description, categoryDetail, packageLink, packageFullLink, ratingStars, ratingFeedback, localImage, date, id);

				    con.query("UPDATE advertisment SET verify=0, packageName=?, publisherName=?, price=?, smallImage=?, mainImage=?, description=?, categoryDetail=?, packageLink=?, packageFullLink=?, ratingStars=?, ratingFeedback=?, localImage=?, date=?, render=1 WHERE ID=?;", array, function (error, result) {
						sw.stop();
						if(error) callback("-- Publisher Advertising - Error " + error, null, Math.round(sw.read()));
						if(!error){
							callback("-- Publisher Advertising fetchPackageData ", array, Math.round(sw.read()));
						}
				    });
					_ph.exit();
				}).catch((error) => {
					sw.stop();
					callback("-- Publisher Advertising - An error occured. While parsing the package... " + error, null, Math.round(sw.read()));
				    _ph.exit();
				});
			}
		}
	});
}

exports.publisherVerification = function(con, client){
	con.query('SELECT id, username, userid FROM advertisment', function(error, result){
		if(error) return console.log("Error Getting user from advertiment - ",error);
		if(!error){
			var useridAdvert;
			result.forEach( user => {
				con.query('SELECT * FROM users WHERE userid=?', user.userid, function(error, result){
					if(error) return console.log("Error Getting user from advertiment - ",error);
					if(!error){
						var closeTime = new Date(result[0].lastSeen);
						var interval = 7 * 24 * 60 * 60; // 7 day
						var currentTime = new Date();
						var closeTimeWithDifference = functions.addMinutes(closeTime, interval,() => {});
						// console.log(currentTime + "     " + closeTimeWithDifference + "     " + closeTime);
						if(currentTime >= closeTimeWithDifference){
							con.query('UPDATE advertisment SET away=1, execute=0 WHERE userid=?', user.userid , function(error,result){
								if(error) return console.log("Error setting away in advertisment 1 - ",error);
							});
						}else{
							con.query('UPDATE advertisment SET away=0 WHERE userid=?', user.userid , function(error,result){
								if(error) return console.log("Error setting away in advertisment 0 - ",error);
							});
						}
					}
				});
			});
		}
	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////

exports.phantomKill = function(){
	exec("sudo bash /var/www/TNTDroid/droid-Discord/modules/kill.sh", (error, stdout, stderr) => {
		if (error){
			console.error(error);
		}
		if(!error){
			console.log("Phantom Processes Killed at start");
		}
	});
}

exports.phantomProcess = function(){
	exec("sudo ps -ef | grep phantom", (error, stdout, stderr) => {
		if(error) {
			functions.parsingError("###############           Phantom Process            ######################",() => {});
			functions.parsingError(error,() => {});
			functions.parsingError(functions.dateTime(() => {}),() => {});
			return;
		}
		if(!error){
			let lines = stdout.trim().split("\n").filter(line => { if(line.indexOf("/usr/bin/phantomjs") > -1) { return line; }});

			if(lines > 0){
				lines.forEach( line =>{
					let process = line.trim().split(/\ +/);
					let time = process[6].split(":");
					let totaltime = (Number(time[0])*60+Number(time[1]))*60+Number(time[2])
					// console.log(process.length);

					if(totaltime > 300){
						exec("sudo kill " + process[1], (error, stdout, stderr) => { 
							if(error) {
								functions.parsingError("###############           Phantom Process            ######################",() => {});
								functions.parsingError(error,() => {});
								functions.parsingError(functions.dateTime(() => {}),() => {});
								return;
							}
							if(!error){
								functions.parsingError("###############           Phantom Process            ######################",() => {});
								functions.parsingError("• Process has been killed because it lasted for more than 5 minutes. Process ID " + process[1],() => {});
								functions.parsingError(functions.dateTime(() => {}),() => {});
							}
						});

					}
					// console.log(process);
					// console.log(totaltime);
				});
			}else if(lines > 5){
				exec("sudo pkill -f phantom", (error, stdout, stderr) => { 
					if(error) {
						functions.parsingError("###############           Phantom Process            ######################",() => {});
						functions.parsingError(error,() => {});
						functions.parsingError(functions.dateTime(() => {}));
						return;
					}
					if(!error){
						functions.parsingError("###############           Phantom Process            ######################",() => {});
						functions.parsingError("• All PhantomJs Process have been killed because there are more than 5.",() => {});
						functions.parsingError(functions.dateTime(() => {}),() => {});
					}
				});
			}


			// console.log(lines.length);
			// console.log(lines);

			if(stderr){
				functions.parsingError("###############           Phantom Process            ######################",() => {});
				functions.parsingError("stderr - " + stderr,() => {});
				functions.parsingError(functions.dateTime(() => {}),() => {});
			}
		}
	});
}


exports.stabilityCheck = function(con, client, channel){
	if(channel == null || channel == 0){
		channel = settings.botFunctionalityChannel.id;
	}
	var startTime = now();
	client.channels.get(channel).sendMessage("``Ping Started " + functions.dateCurrentLog() +"``")
		.then(message => {
			var pingLimit = 250;
			var endTime = now();
			var currentPing = (new Date().getTime() - message.createdTimestamp)/2;
			var red = ":red_circle: ";
			var blue = ":large_blue_circle: ";
			var messageDot = "";

			pings = [50, 100, 150, 200, 250];

			pings.forEach(value => {
				if (currentPing > value){
					return messageDot = messageDot.concat(red);
				}else{
					return messageDot = messageDot.concat(blue);
				}
			});

			message.edit(functions.reverse(messageDot, " ", "").replace(/\s+/g, '') +" ``• Message Ping - "+ currentPing +" ms , Pong: "+ (new Date().getTime() - message.createdTimestamp) +" ms • Message Total - "+ (endTime - startTime).toFixed(3) +" ms. Time: "+ functions.dateCurrentLog() +"``");
			
			if(currentPing > pingLimit){
				settings.functionalityCheckMs = settings.functionalityCheckMs + 1;

				if(settings.functionalityCheckMs < 5){
					functions.appendFile("Ping is grater than "+ pingLimit +", Reload will procedeed.");
					client.channels.get(channel).sendMessage("``Ping is grater than "+ pingLimit +", Reload will procedeed. Attempts Number : ``**"+ settings.functionalityCheckMs +"**").catch(error => console.log('--- Error on message', error));
					functions.reload(client, channel);
				}else if(settings.functionalityCheckMs >= 5){
					functions.appendFile("Ping is grater than "+ pingLimit +", Reload Attempt Failed, proceeding to Reboot.");
					client.channels.get(channel).sendMessage("``Ping is grater than "+ pingLimit +", Reload Attempt Failed "+ settings.functionalityCheckMs +" times, proceeding to Reboot.``").catch(error => console.log('--- Error on message', error));
					settings.functionalityCheckMs = 0;
					functions.reboot(client, message, 0, 1, channel);
				}
			}else{
				settings.functionalityCheckMs = 0;
			}

		}).catch(error => {
			console.log(error);
		});

}