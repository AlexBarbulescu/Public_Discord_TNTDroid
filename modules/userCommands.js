var fs  = require("fs"),
	moment = require('moment'),
	webshot = require('webshot'),
	Discord = require('discord.js'),
	Stopwatch = require('statman-stopwatch'),
	now = require('performance-now'),
	settings = require(__dirname + "/settings.json"),
	functions = require(__dirname + "/functions.js"),
	modCommands = require(__dirname + "/modCommands.js"),
	AuthDetails = require(__dirname + "/../droid-auth.json"),
	srs = require('secure-random-string'),
	nodemailer = require('nodemailer'),
	transporter = nodemailer.createTransport(AuthDetails.gmail);

var exec = require('child_process').exec;

require("moment-duration-format");
//////////////////////

var cooldownPKGcommand = []; // this needs to be replaced
var cooldownPublisherVerification = []; // this needs to be replaced

var aliases = {
	"help": "h", "commands": "help",
	"info": "inf",
};

var roleListPublisher = "\n" +
	"**The following roles are available on this server** :\n" +
	"\n" +
	"We offer multiple roles to show what you specialize in, so if you are particularly good at anything, assign your role! \n" +
	"You can have multiple specialties and your color is determined by the highest role you hold \n" +
	"\n" +
	"```Publishers role can be assigned only with verification by executing **"+ settings.prefix +"publisher XXXX** digits from Unity Asset Store Publisher Page.\n"+
	"You will receive a message on the email **Support E-mail** that's provided, if there's no email provided the verification will fail, contact a moderator for verification. \n" +
	"In the email is a verification code that you must type it in chat **"+ settings.prefix +"publisher verify XXXX** code that's provided in email. \n" +
	"https://www.assetstore.unity3d.com/en/#!/search/page=1/sortby=popularity/query=publisher:7285 <= Example Digits```\n";
var roleList = "\n" +
	"```"+ settings.prefix +"role add/remove Artists - The Graphic Designers, Artists and Modellers. \n" +
	settings.prefix +"role add/remove 3DModelers - People behind every vertex. \n" +
	settings.prefix +"role add/remove Coders - The valiant knights of programming who toil away, without rest. \n" +
	settings.prefix +"role add/remove C# - If you are using C# to program in Unity3D \n"+
	settings.prefix +"role add/remove Javascript - If you are using Javascript to program in Unity3D \n"+
	settings.prefix +"role add/remove Game-Designers - Those who specialise in writing, gameplay design and level design.\n" +
	settings.prefix +"role add/remove Audio-Artists - The unsung heroes of sound effects .\n" +
	settings.prefix +"role add/remove Generalists - Generalist may refer to a person with a wide array of knowledge.\n" +
	settings.prefix +"role add/remove Hobbyists - A person who is interested in Unity3D or Game Making as a hobby.\n" +
	settings.prefix +"role add/remove Helpers - A friend and helper of all those who seek to live in the spirit..\n" +
	settings.prefix +"role add/remove Vector-Artists - The people who love to have infinite resolution.\n" +
	settings.prefix +"role add/remove Voxel-Artist - People who love to voxelize the world.\n" +
	settings.prefix +"role add/remove Students - The eager learners among us, never stop learning. \n" +
	settings.prefix +"role add/remove VR-Developers - Passionate people who wants to bridge virtual world with real life. \n" +
	"--------------------------------------------------------------------------------------------\n"+
	settings.prefix +"role add/remove Streamer - If you stream on twitch/youtube or other discord integrated platforms content about tutorials and gaming. \n" +
	"```";

var rolePublisherNotification = "Publisher role can be assigned only with verification by executing ``"+ settings.prefix +"publisher XXXX`` - XXXX digits from Unity Asset Store Publisher Page.\n"+
	"You will receive a message on the email **Support E-mail** that's provided, if there's no email provided the verification will fail, contact a moderator for verification. \n " +
	"In the email is a verification code that you must type it in chat ``"+ settings.prefix +"publisher verify XXXX`` code that's provided in email.";

// COMMAND ARRAYS
const userCommands = {
	"help": {
		desc: "Help command for more informations.",
		usage: "[command]",
		shouldDisplay: false, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed) {
			var suffix = parsed[1];
			var toSend = [];
			if (!suffix) {
				var helpMessage = "\n" +
				"**BOT COMMANDS : ** these commands are not case-sensitive.```glsl\n" +
				settings.prefix +"ping - Execute: "+ userCommands['ping'].usage +"\n" +
				"\t#"+userCommands['ping'].desc +"\n" +
				settings.prefix +"slap - Execute: "+ userCommands['slap'].usage +"\n" +
				"\t#"+userCommands['slap'].desc +"\n" +
				settings.prefix +"codetags - Execute: "+ userCommands['codetags'].usage +"\n" +
				"\t#"+userCommands['codetags'].desc +"\n" +
				settings.prefix +"coinflip - Execute: "+ userCommands['coinflip'].usage +"\n" +
				"\t#"+userCommands['coinflip'].desc +"\n" +
				"-----------------------------------------------------------------------\n" +
				settings.prefix +"role - #Command for Role Assigment on UDH.\n" +
				"\tExecute: [command] - #Display your current roles\n" +
				"\tExecute: [command add/remove role] - #To add or remove roles\n" +
				"\tExecute: [command list] - #To list all the current available roles with description.\n" +
				"-----------------------------------------------------------------------\n" +
				settings.prefix +"profile - Execute: "+ userCommands['profile'].usage +"\n" +
				"\t#"+userCommands['profile'].desc +"\n" +
				settings.prefix +"members - Execute: "+ userCommands['members'].usage +"\n" +
				"\t#"+userCommands['members'].desc +"\n" +
				settings.prefix +"info - Execute: "+ userCommands['info'].usage +"\n" +
				"\t#"+userCommands['info'].desc +"\n" +
				settings.prefix +"online - Execute: "+ userCommands['online'].usage +"\n" +
				"\t#"+userCommands['online'].desc +"\n" +
				"-----------------------------------------------------------------------\n" +
				"#Give Karma Points - Thanks @User, thanks letters are not case-sensitive. This command has few minutes cooldown. \n" +
				settings.prefix +"kp - Execute: "+ userCommands['kp'].usage +"\n" +
				"\t#"+userCommands['kp'].desc +"\n" +
				settings.prefix +"level - Execute: "+ userCommands['level'].usage +"\n" +
				"\t#"+userCommands['level'].desc +"\n" +
				settings.prefix +"top - Execute: "+ userCommands['top'].usage +"\n" +
				"\t#"+userCommands['top'].desc +"\n" +
				"-----------------------------------------------------------------------\n" +
				settings.prefix +"unityinfo - Execute: "+ userCommands['unityinfo'].usage +"\n" +
				"\t#"+userCommands['unityinfo'].desc +"\n" +
				settings.prefix +"pInfo - Execute: "+ userCommands['pinfo'].usage +"\n" +
				"\t#"+userCommands['pinfo'].desc +"\n" +
				settings.prefix +"stats - Execute: "+ userCommands['stats'].usage +"\n" +
				"\t#"+userCommands['stats'].desc +"\n" +
				"```" +
				"You can also view http://tntdroid.xyz/global.php";
				functions.sendMessageWho(message, helpMessage,() => {});
			}else{
				if (userCommands.hasOwnProperty(suffix)) {
					toSend.push("**Informationa about command "+ settings.prefix + suffix +"**" +
					"`" + userCommands[suffix].usage + "`");
					if (userCommands[suffix].hasOwnProperty("info")) toSend.push(userCommands[suffix].info);
					else if (userCommands[suffix].hasOwnProperty("desc")) toSend.push(userCommands[suffix].desc);
					if (userCommands[suffix].hasOwnProperty("cooldown")) toSend.push("__Cooldown:__ " + userCommands[suffix].cooldown + " seconds");
					if (userCommands[suffix].hasOwnProperty("deleteCommand")) toSend.push("*Can delete the activating message*");
					functions.sendMessageWho(message, toSend,() => {});
				} else functions.sendMessageWho(message, "Command `" + settings.prefix + "` not found. Aliases aren't allowed.",() => {}).then(wMessage => {
					wMessage.delete(10000);
				});
			}
		}
	},
	"ping": {
		desc: "Returns the ping command from the server.",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			var pong = [
				"Pong!",
				"no Pong for you today.",
				"Might get more work to make me speak.",
				"here dying, Will talk later.",
				"lag!!! Should We talk later?",
				"0ms from Everywere.",
				"from Center of Universe.",
				"Really!!! I don't know where I am.",
				"HALP!!!",
				"I couldn't ping you even if I want.",
				"My master is killing me, Help!!!"
			];
			var pongID = pong[Math.floor(Math.random() * pong.length)];

			var startTime = now();
			functions.sendMessageWho(message, 'Ping Started',() => {})
				.then(message => {
					var endTime = now();
					var pingLimit = 250;
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

					return message.edit(functions.reverse(messageDot, " ", "",() => {}).replace(/\s+/g, '') +" ``• Message Ping - "+ ((new Date().getTime() - message.createdTimestamp)/2) +" ms, Pong: "+ (new Date().getTime() - message.createdTimestamp) +" ms • Message Total - "+ (endTime - startTime).toFixed(3) +" ms. "+ pongID +"``");
				}).catch(error => {
					console.log(error);
				});
		}
	},
	"slap": {
		desc: "Slaps someone with a trout, IRC command.",
		usage: "[command] OR [command @mention] OR [command @mention @mention]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message) {
			var selfSlap = 0;
			var slap = [
			    "trout",
			    "duck",
			    "truck"
			];
			var slapRandom = slap[Math.floor(Math.random() * slap.length)];

			if(message.mentions.users.size > 1){
				functions.sendMessageWho(message, message.author + " Slaps " + message.mentions.users.map(user=>user.toString()).join(" and ") + " around a bit with a large " + slapRandom,() => {}).catch(error => console.log('--- Error on message', error));
			}else if(message.mentions.users.size > 0){
				functions.sendMessageWho(message, message.author + " Slaps " + message.mentions.users.first() + " around a bit with a large " + slapRandom,() => {}).catch(error => console.log('--- Error on message', error));
			}else{
				functions.sendMessageWho(message, message.author + " Slaps himself around a bit with a large " + slapRandom,() => {}).catch(error => console.log('--- Error on message', error));
			}

		}
	},
	"role": {
		desc: "Managing member roles.",
		usage: "[command add/remove role] OR [command list]",
		shouldDisplay: true, deleteCommand: false, cooldown: 0,
		process: function(con, client, message, parsed, guild, user) {
			if(parsed[1] == null){
				if(message.channel.type == "dm"){
					var rolesList = guild.members.get(message.author.id).roles.array().filter(role => {return role.name != '@everyone'}).map(role => role.name).join(', ');
				}else{
					var rolesList = message.member.roles.array().filter(role => {return role.name != '@everyone'}).map(role => role.name).join(', ');
				}

				if(rolesList.length === 0){
					functions.sendMessageWho(message, message.author.username +" You have no role assigned, to add a new role - ``"+ settings.prefix +"role add RoleName``\n" +
						"To display all the roles use ``"+ settings.prefix +"role list``",() => {});
				}else{
					functions.sendMessageWho(message, "**"+ message.author.username +"**\n" +
										"These are your current roles assigned : ``" + rolesList + "``\n" +
										"\n" +
										"To add a new role - ``"+ settings.prefix +"role add RoleName``.",() => {});
				}
			}else if(parsed[1].toLowerCase() == "assign" || parsed[1].toLowerCase() == "take"){
				if(message.member.roles.filter(r => {return settings.roleModSquadPermission.roles.includes(r.name)})) {
					modCommands[parsed[0].toLowerCase().substring(1)].process(con, client, message, parsed, guild, user);
				}else{
					functions.sendMessageWho(message, message.author.username +" You don't have permission to use this command.",() => {});
				}
			}else{

				if(parsed[1].toLowerCase() == "add" || parsed[1].toLowerCase() == "remove"){

					if(parsed[2] == null){ // check if there's a role written
						functions.sendMessageWho(message, message.author.username +" You did not specify a role, please mention one.",() => {});
					}else{

						var parsedRoleIDfromServer = guild.roles.array().filter(role => {return role.name.toUpperCase() == parsed[2].toUpperCase() }).map(role => role.id).toString();

						if(message.channel.type == "dm"){
							var checkifRole = guild.members.get(message.author.id).roles.has(parsedRoleIDfromServer);
						}else{
							var checkifRole = message.member.roles.has(parsedRoleIDfromServer);
						}

						var rolesMention = guild.roles.has(parsedRoleIDfromServer);

						if(parsed[1].toLowerCase() == "add"){ // add role 

							var roleListArray = settings.rolesBanned.roles.join('|');
							var regex = new RegExp(roleListArray, 'gi' );

							if (rolesMention == false || checkifRole == true || parsed[2].match(regex)){  // check if role mentioned is banned from assign
								if(checkifRole == true){ // check if role is already assigned
									functions.sendMessageWho(message, message.author.username +" You already have the role assigned ``" + functions.capitalize(parsed[2],() => {}) +"``",() => {});
								}else if(parsed[2].match(regex)){ // if banned
									if(parsed[2].match(/Publishers/gi)){ // if role is publisher, notify
										functions.sendMessageWho(message, rolePublisherNotification,() => {});
									}else{ // notify if there are other roles that are banned
										functions.sendMessageWho(message, message.author.username +" You don't have permission to assign this role " + functions.capitalize(parsed[2],() => {}) + " role, type another role.",() => {});
									}
								}else{ // notify that the role doesn't exist on the server
									functions.sendMessageWho(message, message.author.username +" There's no role with the name ``" + parsed[2] + "``, double check what you typed.",() => {});
								}
							}else{ // role is added
								var roleName = guild.roles.get(parsedRoleIDfromServer).name;

								if(message.channel.type == "dm"){
									guild.members.get(message.author.id).addRole(parsedRoleIDfromServer);
								}else{
									message.member.addRole(parsedRoleIDfromServer);
								}

								client.channels.get(settings.botAnnouncementChannel.id).sendMessage("``User ``"+ message.author +"`` added role : " + roleName + "`` In Channel : " + functions.roleChannel(message, 0,() => {}));
								functions.sendMessageWho(message, message.author.username +" You now have the role of ``" + roleName + "``",() => {});
								functions.appendFile(" --- " + message.author.username + " --- Added his role :  " + roleName + " In Channel : " + functions.roleChannel(message, 1,() => {}),() => {});
							}
						}else if(parsed[1].toLowerCase() == "remove"){

							if (checkifRole == false || rolesMention == false ){ // 
								if(rolesMention == false){ // role is on server but not assigned
									functions.sendMessageWho(message, message.author.username +" You don't have this role assigned ``" + functions.capitalize(parsed[2],() => {}) +"``",() => {});
								}else{
									functions.sendMessageWho(message, message.author.username +" There's no role with the name ``" + parsed[2] + "``, double check what you typed.",() => {});
								}
							}else{
								var roleName = guild.roles.get(parsedRoleIDfromServer).name;

								if(message.channel.type == "dm"){
									guild.members.get(message.author.id).removeRole(parsedRoleIDfromServer);
								}else{
									message.member.removeRole(parsedRoleIDfromServer);
								}

								client.channels.get(settings.botAnnouncementChannel.id).sendMessage("``User ``"+ message.author +"`` removed role : " + roleName + "`` In Channel : " + functions.roleChannel(message, 0,() => {}));
								functions.sendMessageWho(message, message.author.username +" You no longer have the role of ``" + roleName + "``",() => {});
								functions.appendFile(" --- " + message.author.username + " --- Removed his role :  " + roleName + " In Channel : " + functions.roleChannel(message, 1,() => {}),() => {});

							}
						}
					}
				}else if(parsed[1].toLowerCase() == "list"){
					// var rolesMention = guild.roles.array().map(role => role.name).join(', ');
					// functions.sendMessageWho(message, message.author + " **These are all the server roles : ** \n" +
					// 	"``" + rolesMention + "``",() => {});
					functions.sendMessageWho(message, roleListPublisher,() => {});
					functions.sendMessageWho(message, roleList,() => {});
				}
			}
		}
	},
	"members": {
		desc: "Show Community Total Members.",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild) {

			var dateCreated = new Date('2016-07-24');
			var dateDifference = Math.abs(functions.dateCurrent(() => {}) - dateCreated) / 1000;
			var daysDifference = Math.floor(dateDifference / 86400);

			var membersTotal = guild.members.filter(u => u.presence.status == 'online' || u.presence.status == 'idle' || u.presence.status == 'dnd').size;
			var membersOnline = guild.members.filter(u => u.presence.status == 'online').size;
			var membersIdle = guild.members.filter(u => u.presence.status == 'idle').size;
			var membersDND= guild.members.filter(u => u.presence.status == 'dnd').size;

			var members = guild.memberCount;
			var membersPerDay = Math.floor(members / daysDifference);

			var membersOffline = membersTotal - (membersOnline + membersIdle);

			var serverMemberList = "\n" +
				"**Server - " + guild.name + "**\n" +
				"``Creation Date - 25/July/2016``\n" +
				"\n" +
				"**Members -** ``" + members + ", with an average of " + membersPerDay + " members per day.``\n" +
				"**Online       -** ``"+ membersTotal + " Total - " + membersOnline + " Online and " + membersIdle + " Idle and " + membersDND + " DND``\n"
				"**Offline      -** ``" + membersOffline + " Total``\n";
			functions.sendMessageWho(message, serverMemberList,() => {});
		}
	},
	"info": { 
		desc: "Information from Discord about yourself or the user you mentioned.",
		usage: "[command] OR [command @username]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild) {
			let member;
			if(parsed[1] != null && message.mentions.users.size >= 1){
				member = guild.members.get(message.mentions.users.first().id);
				if(message.mentions.users.size >= 1){
					infoFunction(member);
				}else{
					client.channels.get(settings.devStreamChannel.id).fetchMessage(liveMessage).then(message => message.delete(1000)).catch(error => console.log('--- Error on message', error));
					functions.sendMessageWho(message, "Your mention is not a username.", 'delete', 1000,() => {})
				}

			}else{
				member = message.member;
				infoFunction(member);
			}

			function infoFunction(member){
				con.query('SELECT joinDate, createdDate, lastSeen, lastMessage FROM users WHERE userid=?', member.user.id, function(error,result){

					let createdDate = new Date(member.user.createdAt).toUTCString();
					let joinedAt = new Date(member.joinedAt).toUTCString();
					let lastSeen = new Date(result[0].lastSeen).toUTCString();
					let lastMessage = new Date(result[0].lastMessage).toUTCString();

					let rolesList = member.roles.array().filter(role => {return role.name != '@everyone'}).map(role => role.name).join(', ');
					if(!rolesList) rolesList = "No role Assigned";
					let nickname = "";
					if(member.nickname != null)	nickname = "  Nickname: " + member.nickname + "\n";
					// "ddd, gg MMM YYYY HH:mm:ss GMT"
					functions.sendMessageWho(message, "** Information about user :** ```" +
					"      User: " + member.user.username + "#" + member.user.discriminator +"\n" +
					"        ID: " + member.user.id + "\n" +
									 nickname +
					"   Created: " + moment(createdDate).startOf('minute').fromNow() +" (" + createdDate + ")" + "\n" +
					"    Joined: " + moment(joinedAt).startOf('minute').fromNow() +" (" + joinedAt + ")" + "\n" +
					" Last Seen: " + moment(lastSeen).startOf('minute').fromNow() +" (" + lastSeen + ")" + "\n" +
					"Last Spoke: " + moment(lastMessage).fromNow() +" (" + lastMessage + ")" + "\n" +
					"     Roles: " + rolesList +
					"```",() => {});

				});
			}
		}
	},
	"profile": {
		desc: "This shows your profile card, Shows your (Profile Image, Level, Server Rank, XP, Karma Points)",
		usage: "[command] OR [command @username]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild) {
			message.channel.sendMessage("**Generating Profile Card.**").then(msg => {

				let member;
				if(parsed[1] != null && message.mentions.users.size >= 1){
					member = guild.members.get(message.mentions.users.first().id);
					if(message.mentions.users.size >= 1){
						profileFunction(member);
					}else{
						client.channels.get(settings.devStreamChannel.id).fetchMessage(liveMessage).then(message => message.delete(1000)).catch(error => console.log('--- Error on message', error));
						functions.sendMessageWho(message, "Your mention is not a username.", 'delete', 1000,() => {})
					}

				}else{
					member = message.member;
					profileFunction(member);
				}

				function profileFunction(member){
			        var sw = new Stopwatch(true);
					var options = {
					  screenSize: {
					    width: 1024
					  , height: 768
					  }
					, shotSize: {
					    width: 400
					  , height: 113
					  }
					, userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:48.0)' + ' Gecko/20100101 Firefox/48.0'
					};
					var path = "/var/www/TNTDroid/Profile/users/"+ member.user.id +".png";
					webshot('http://localhost/TNTDroid/Profile/profile.php?id=' + member.user.id, path, options, function(err) {
					  if(err){
					 	 console.log(err);
					  }
					  if(!err){
						sw.stop();
						functions.appendFile("User Profile for " + member.user.username + " - Done - elapsed: "+ Math.round(sw.read()) / 1000 + "s",() => {});
						msg.delete();
						message.channel.sendFile(path,'',":pushpin: | **User Profile for " + member.user.username + "**").then(botmsg => {
							if(!message.channel.isPrivate && settings.deleteProfileMessagesfromChannels == 1 && functions.contains(settings.arrayProfileCardsNoDelete.channels, message.channel.id, 1,() => {})){
								setTimeout(function() {
									botmsg.delete();
								}, 60*1000);
							}
						}).catch(error => {
							console.log(error);
						});
					  }
					});
				}
			});
		}
	},
	"online": { 
		desc: "Show the current number of online members on UDH.",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild) {
			let membersOnline = guild.members.filter(u => u.presence.status == 'online' || u.presence.status == 'idle' || u.presence.status == 'dnd').size;
			functions.sendMessageWho(message, "**The Unity3D Developer** Hub currently has **" + membersOnline + "** members online!",() => {});
		}
	},
	"kp": {
		desc: "Shows current Karma Points.",
		usage: "[command] Or [command @username]",
		shouldDisplay: true, deleteCommand: false, cooldown: 0,
		process: function(con, client, message, parsed, guild) {
			let member;
			if(parsed[1] == null){
				member = message.author;
			}else{
				member = message.mentions.users.first();
			}
			con.query('SELECT karma FROM users WHERE userid=?', member.id, function(error,result){
				if(error) console.log(error);
				if(!error){
					if(parsed[1] == null){
						functions.sendMessageWho(message, "**"+ member.username +"**, You have **" + result[0].karma + " Karma Points (KP) **",() => {});
					}else{
						functions.sendMessageWho(message, "**"+ member.username +"**, has **" + result[0].karma + " Karma Points (KP) **",() => {});
					}
				}
			});
		}
	},
	"level": {
		desc: "Shows current Level from XP Points.",
		usage: "[command] Or [command @username]",
		shouldDisplay: true, deleteCommand: false, cooldown: 0,
		process: function(con, client, message, parsed, guild) {
			let member;
			if(parsed[1] == null){
				member = message.author;
			}else{
				member = message.mentions.users.first();
			}
			con.query('SELECT level, exp FROM users WHERE userid=?', member.id, function(error,result){
				if(error) console.log(error);
				if(!error) functions.sendMessageWho(message, "**"+ member.username +"**, You have ** Level " + result[0].level + "** and **"+ result[0].exp +" XP**",() => {});
			});
		}
	},
	"top": {
		desc: "Top 10 Karma Points horders on the server.",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 0,
		process: function(con, client, message, parsed, guild) {
			// con.query('SELECT karma, profanity, username FROM users ORDER BY (karma - profanity) DESC LIMIT 10', function(error,result){
			// con.query('SELECT a.karma a_karma, a.profanity a_profanity, a.username a_username, b.profanity b_profanity, b.username b_username FROM( SELECT *,@kp:=@kp+1 kp FROM users, (SELECT @kp:=0) vars ORDER BY karma-profanity DESC LIMIT 10 ) a JOIN ( SELECT *,@p:=@p+1 p FROM users, (SELECT @p:=0) vars ORDER BY profanity DESC LIMIT 10 ) b ON b.p = a.kp;', function(error,result){
			// con.query('SELECT a.karma a_karma, a.bot a_bot, a.profanity a_profanity, a.username a_username, b.profanity b_profanity, b.username b_username FROM( SELECT *,@kp:=@kp+1 kp FROM users, (SELECT @kp:=0) vars WHERE bot = 0 ORDER BY karma-profanity DESC LIMIT 10 ) a JOIN ( SELECT *,@p:=@p+1 p FROM users, (SELECT @p:=0) vars ORDER BY profanity DESC LIMIT 10 ) b ON b.p = a.kp;', function(error,result){
			con.query('SELECT karma AS a_karma, profanity AS a_profanity, username AS a_username FROM users ORDER BY karma DESC LIMIT 10', function(error,result){
				function padNumber(n, width, z) {
				  z = z || '0';
				  n = n + '';
				  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
				}

				function pad(str, len, pad) {
				    if (typeof(len) == "undefined") { var len = 0; }
				    if (typeof(pad) == "undefined") { var pad = ' '; }
				    if (len + 1 >= str.length) {
			                var right = Math.ceil((padlen = len - str.length) / 2);
			                var left = padlen - right;
			                str = Array(left+1).join(pad) + str + Array(right+1).join(pad);
				    }
				    return str;
				}

				function maxLength(result, value) {
					if(value == 1){
						var max = 0;

						for (var i = 0; i < result.length; i++) {
							if (result[i].a_username.length > max) {max = result[i].a_username.length;}
						}
						return max;
					}
					// else{
					// 	var max = 0;
					// 	for (var i = 0; i < result.length; i++) {
					// 		if (result[i].b_username.length > max) {max = result[i].b_username.length;}
					// 	}
					// 	return max;
					// }
				}
				var max_a = maxLength(result, 1);
				// var max_b = maxLength(result, 2);

				var top10karma = "```"+
				"         Top 10 Karma Points                         \n"+
				"-----------------------------------\n"+
				" Numbers  - "+ pad('Username ', max_a, ' ') +" | KP  \n" +
				"-----------------------------------\n";

				for (var i = 0; i < result.length; i++) {
					var number = i + 1;
					top10karma = top10karma + "Number "+ padNumber(number, 2) +" - "+  pad(result[i].a_username, max_a, ' ') +" | "+ padNumber(result[i].a_karma, 2) +"\n";
				}

				var karmaTopList = "**Top 10 - Unity Developer Hub : ** \n" + top10karma + "```";

				functions.sendMessageWho(message, karmaTopList,() => {});

			});
		}
	},
	"pinfo": {
		desc: "Infomation how to become a publisher and command that the role can use",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 10,
		process: function(con, client, message, parsed, guild) {
			var pInfoMessage = "\n" +
			"**Publisher - BOT COMMANDS : ** ``these commands are not case-sensitive.``\n" +
			"``"+ settings.prefix +"pkg ID`` - To add your package to Publisher everyday Advertising , ID means the digits on your package link.\n" +
			"``"+ settings.prefix +"tst ID`` - a faster way to check the packages if happens that ``"+ settings.prefix +"pgk ID`` timeouts or it gives error reply. ``"+ settings.prefix +"tst``" +
			"has less checks to do and runs faster... Note that executing this command doesn't add the package on the database\n" +
			"\n" +
			"";
			functions.sendMessageWho(message, pInfoMessage,() => {});
		}
	},
	"pkg": {
		desc: "",
		usage: "[command packageID]",
		shouldDisplay: true, deleteCommand: false, cooldown: 0,
		process: function(con, client, message, parsed, guild, user) {
			let checkifRole;
			if(message.channel.type == "dm"){
				checkifRole = guild.members.get(message.author.id).roles.has(settings.publisherRoleID);
			}else{
				checkifRole = message.member.roles.has(settings.publisherRoleID);
			}

			if(message.channel.type === "text"){
				if(checkifRole == true){
					var indexPkgCommand = cooldownPKGcommand.indexOf(user.id);
					if(indexPkgCommand <= -1) {
						cooldownPKGcommand.push(user.id);
							if(message.channel.id == settings.botCommandsChannel.id || message.channel.id == settings.botDevelopmentChannel.id){
								if(parsed[1] == null){
									message.channel.sendMessage("You didn't mention any package in your command. Please try again.").then(message => message.delete(5*1000));
								}else{
									message.channel.sendMessage("Please wait. It will take few seconds to verify the package.").then(message => {
										exec("python /var/www/TNTDroid/droid-Discord/unity-verifyPackage.py " + parsed[1], (error, stdout, stderr) => {
											if (error) {
												functions.pythonError(error,() => {});
												functions.pythonError("Error Attept Executing forever restart",() => {});
												functions.pythonError(functions.dateTime(() => {}),() => {});
												return;
											}
											if(!error){
													stdout = stdout.substring(0, stdout.lastIndexOf("\n"));
													functions.pythonError(functions.dateTime(() => {}),() => {});
													functions.pythonError(stdout,() => {});

													if(stdout.toLowerCase().match(/-- Package is Verified/gi)){

														packageNumber(user, function(error, available, left){

															con.query('SELECT id FROM advertisment WHERE userid=?', user.id , function(error,result){
																if(result == '' || left > 0 ){
																	con.query('INSERT INTO advertisment SET verify=1, execute=0, away=0, packageID=?, userid=?, discriminator=?, username=?',[parsed[1], user.id, user.discriminator, user.username], function(error,result){
																		if(error){
																			console.log("Error adding advertisment into database - ",error);
																		}
																		if(!error){
																			message.edit("~~Please wait. It will take few seconds to verify the package.~~ \n" +
																						user + " Your Package has been added to the list.").then(message => {
																				var index = cooldownPKGcommand.indexOf(user.id);
																				if (index > -1) {
																				    cooldownPKGcommand.splice(index, 1);
																				}
																			});
																			functions.appendFile(" ---  Publisher User  " + user + " added new package to advertisment list. Package ID - " + parsed[1],() => {});
																			message.channel.guild.channels.get(settings.botAnnouncementChannel.id).sendMessage("Publisher User  " + user + " added new package to advertisment list. Package ID - " + parsed[1]);
																		}
																	});

																	con.query('UPDATE users SET packagesAvailable=?, packagesLeft=? WHERE userid=?',[available + 1, left - 1, user.id, user.username]);

																}else{
																	var userID = result[0].id;
																	con.query('UPDATE advertisment SET verify=1, execute=0, away=0, packageID=?, username=?, discriminator=?, userid=? WHERE id=?',[parsed[1], user.username, user.discriminator, user.id, userID], function(error,result){
																		if(error){
																			console.log("Error adding advertisment into database - ",error);
																		}
																		if(!error){
																			message.edit("~~Please wait. It will take few seconds to verify the package.~~ \n" +
																						user + " Your Package has been updated to the list.").then(message => {
																				var index = cooldownPKGcommand.indexOf(user.id);
																				if (index > -1) {
																				    cooldownPKGcommand.splice(index, 1);
																				}
																			});
																			functions.appendFile(" ---  Publisher User  " + user + " updated his package to advertisment list. Package ID - " + parsed[1],() => {});
																			message.channel.guild.channels.get(settings.botAnnouncementChannel.id).sendMessage("Publisher User  " + user + " updated his package to advertisment list. Package ID - " + parsed[1]);
																			var index = cooldownPKGcommand.indexOf(user.id);
																			if (index > -1) {
																			    cooldownPKGcommand.splice(index, 1);
																			}
																		}
																	});
																}
															});
														});

													}else{
														message.edit("~~Please wait. It will take few seconds to verify the package.~~ \n" +
																user + " Your Package can't be verified, Unity Asset Store can't be reached or there was a problem adding it to the list. Please try again.");
													}
												if(stderr){
													functions.pythonError("stderr - " + stderr,() => {});
												}
											}
										}
									);
									});
								}
							}else{
								// client.sendMessage(user, "You can only use this command in public chat #hub-request");
							}
					}else if(indexPkgCommand > -1) {
						message.channel.sendMessage("You must wait for the package to verify before trying again.").then(message => message.delete(5*1000));
					}

					function packageNumber(user, callback){
						// http://stackoverflow.com/questions/18361930/node-js-returning-result-from-mysql-query
						con.query('SELECT packagesAvailable, packagesLeft FROM users WHERE userid=?', user.id , function result(error, result){
					        if (error) {
					            callback(error,null);
					        } else {
					            callback(null,result[0].packagesAvailable,result[0].packagesLeft);
							}
						});
					}

				}else{
					message.channel.sendMessage("You are not a publisher, you can't add a package to the list.").then(message => message.delete(5*1000));
				}
			}else{
				message.channel.sendMessage("You can't use this command in private chat, try using it in #bot-commands.").then(message => message.delete(5*1000));
			}
		}
	},
	"tst": {
		desc: "",
		usage: "[command packageID]",
		shouldDisplay: true, deleteCommand: false, cooldown: 0,
		process: function(con, client, message, parsed, guild, user) {
			let checkifRole;
			if(message.channel.type == "dm"){
				checkifRole = guild.members.get(message.author.id).roles.has(settings.publisherRoleID);
			}else{
				checkifRole = message.member.roles.has(settings.publisherRoleID);
			}
			if(checkifRole == true){
				if(message.channel.id == settings.botCommandsChannel.id || message.channel.id == settings.botDevelopmentChannel.id){
					if(parsed[1] == null){
						message.author.sendMessage("You didn't mention any package in your command. Please try again.");
					}else{
						message.channel.sendMessage("Please wait. It will take few seconds to test your package.").then(message => {
							exec("python /var/www/TNTDroid/droid-Discord/unity-testPackage.py " + parsed[1], (error, stdout, stderr) => {
								if (error) {
									functions.pythonError(error,() => {});
									functions.pythonError("Error Attept Executing forever restart",() => {});
									functions.pythonError(functions.dateTime(() => {}),() => {});
									return;
								}
								if(!error){
										stdout = stdout.substring(0, stdout.lastIndexOf("\n"));
										functions.pythonError(functions.dateTime(() => {}),() => {});
										functions.pythonError(stdout,() => {});

										if(stdout.toLowerCase().match(/-- Package is Verified/gi)){

											message.edit("~~Please wait. It will take few seconds to Test your package.~~ \n" +
														user + " Your Package has been tested and the result is **OK**.");
											// functions.appendFile(" ---  Publisher User  " + user + " added new package to advertisment list. Package ID - " + parsed[1],() => {});
											// client.sendMessage(settings.botAnnouncementChannel.id, "Publisher User  " + user + " added new package to advertisment list. Package ID - " + parsed[1]);

										}else{
											message.edit("~~Please wait. It will take few seconds to Test your package.~~ \n" +
														user + " Your Package can't be verified, Unity Asset Store can't be reached or there was a problem.");
										}
									if(stderr){
										functions.pythonError("stderr - " + stderr,() => {});
									}
								}
							});
						});
					}
				}
			}else{
				message.author.sendMessage("You are not a publisher, you can't Test a package.");
			}
		}
	},
	"publisher": {
		desc: "",
		usage: "[command PublisherID]",
		shouldDisplay: true, deleteCommand: false, cooldown: 0,
		process: function(con, client, message, parsed, guild, user) {
			let checkifRole;
			if(message.channel.type == "dm"){
				checkifRole = guild.members.get(message.author.id).roles.has(settings.publisherRoleID);
			}else{
				checkifRole = message.member.roles.has(settings.publisherRoleID);
			}

			if(checkifRole == true){
				functions.sendMessageWho(message, "You already have the role of Publishers, you don't need to verify it anymore.",() => {});
			}else if(parsed[1] == 'verify'){
				message.channel.guild.channels.get(settings.botAnnouncementChannel.id).sendMessage("User  " + user + " sent a verification code. Code - " + parsed[2]);

				if(parsed[2] == null){
					functions.sendMessageWho(message, 'You need to have a verification key in order to verify the role. Try and check your email.',() => {});
				// }else if(parsed[1].length != 6 || parsed[1].match(/[^a-zA-Z0-9.]+/) || (parsed[1].length != 6 && parsed[1].match(/[^a-zA-Z0-9.]+/))){
				}else if(parsed[2].length != 6){
					functions.sendMessageWho(message, "This key is not valid.",() => {});
				}else{
					con.query('SELECT keycode FROM users WHERE userid=?', user.id, function(error, result){
						if(result[0].keycode == null){
							functions.sendMessageWho(message, "Key Is not Valid.",() => {});
						}else{
							var keycodeFromDatabase = result[0].keycode;
							var regexParsedVerification = new RegExp(parsed[2], 'gi' );

							if(keycodeFromDatabase.match(regexParsedVerification)){
								var role = guild.roles.find("name", "Publishers").id;
								message.member.addRole(role);
								functions.sendMessageWho(message, "You now have the ``Publishers`` role. ",() => {});
							}
						}

					});
				}
			}else{
				var indexPkgCommand = cooldownPublisherVerification.indexOf(user.id);
				if (indexPkgCommand > -1) {
					message.channel.sendMessage("You must wait for the package to verify before trying again.");
				}else if(functions.verifyParsed(parsed[1], 3, 6,() => {}) == false){
					message.channel.sendMessage("You need to insert a Publisher ID, Publisher Id is the number at the end of a Unity Asset Store Publisher Page.");
				}else if (indexPkgCommand <= -1) {
					cooldownPublisherVerification.push(user.id);
					con.query('SELECT keycode FROM users WHERE userid=?', user.id, function(error,result){
						if(error) return console.log(error);
						function emailVerification() {
							message.channel.sendMessage("Please wait. I'm verifying your Publisher Page.").then(message => {
								exec("python /var/www/TNTDroid/droid-Discord/unity-publisherCheck.py " + parsed[1], (error, stdout, stderr) => {
									if (error) {
										functions.pythonError(error,() => {});
										functions.pythonError("Error Attept Executing forever restart",() => {});
										functions.pythonError(functions.dateTime(() => {}),() => {});
										return;
									}
									if(!error){

											var emailArray = stdout.toString().split('\n');

											var index = cooldownPublisherVerification.indexOf(user.id);
											if (index > -1) {
											    cooldownPublisherVerification.splice(index, 1);
											}

											if(stdout.toLowerCase().match(/-- Email-/gi)){

											stdout = stdout.substring(0, stdout.lastIndexOf("\n"));
											functions.pythonError(functions.dateTime(() => {}),() => {});
											functions.pythonError(stdout,() => {});

												var emailArrayString = emailArray[0].trim().split(/(\s+)/);
												var emailPublisher = emailArrayString[emailArrayString.length-1];

												var authCode = srs({length: 6});

												var mailOptions = {
												    from: '"Unity Developer Hub" <alextnt89@gmail.com>',
												    to: emailPublisher,
												    subject: 'Verify Discord Publisher Username',

												    text: "This message was sent becasue you ( " + user.username +"#" + user.discriminator + " ) used `` "+ settings.prefix +"publisher XXXX `` (XXXX represents Publisher ID) command in Unity Developer Hub - Discord Chat - https://discord.gg/H6pBTEW \n" +
												    "To verify this email please reply in `` #bot-commands `` with "+ settings.prefix +"publisher verify command followed by auth code " + authCode + "\n" +
												    "		``"+ settings.prefix +"publisher verify " + authCode + "``\n"+
													"If you consider this email an abuse or that you didn't execute the command, reply in this email, and we will take measures against author. \n" +
													"\n" +
													"Thank you,\n" +
													"Unity Developer Hub Team",

													html: "This message was sent becasue you ( " + user.username +"#" + user.discriminator + " ) used <b>"+ settings.prefix +"publisher XXXX</b> (XXXX represents Publisher ID) command in Unity Developer Hub - Discord Chat - https://discord.gg/H6pBTEW <br>" +
												    "To verify this email please reply in <b>#bot-commands</b> with "+ settings.prefix +"publisher verify command followed by auth code " + authCode + "<br>" +
												    "&nbsp;&nbsp;&nbsp;&nbsp;<b>"+ settings.prefix +"publisher verify " + authCode + "</b><br>"+
													"If you consider this email an abuse or that you didn't execute the command, reply in this email, and we will take measures against author.<br>" +
													"<br>" +
													"Thank you,<br>" +
													"Unity Developer Hub Team"
												};

												// send mail with defined transport object
												transporter.sendMail(mailOptions, function(error, info){
												    if(error){
												        return console.log(error);
												    }
												    message.edit("~~Please wait. I'm verifying your Publisher Page.~~ \n" +
																user + " Email verification has been sent sent. Please check the email provided on page **Support E-mail**.");
													message.channel.guild.channels.get(settings.botAnnouncementChannel.id).sendMessage("User  " + user + " requested a verification for Publisher ID - " + parsed[1] + ", code generated : " + authCode);
												    console.log('Email verification has been sent sent. ' + info.response);

													con.query('SELECT keycode FROM users WHERE userid=?', user.id, function(error,result){

														if(result[0].keycode == null){
															var currentKey = "";
														}else{
															var currentKey = result[0].keycode;
														}
														var currentKeyUpdate = currentKey.concat(authCode + ", ");

														con.query("UPDATE users SET keycode=? WHERE userid=?",[currentKeyUpdate, user.id], function(error,result){
															if(error){
																console.log(error);
															}
														});
													});
												});
											}else{
												message.channel.guild.channels.get(settings.botAnnouncementChannel.id).sendMessage("User  " + user + " requested a verification for Publisher ID - " + parsed[1] + " - Verification code not generated. ");

												message.edit("~~Please wait. I'm verifying your Publisher Page.~~ \n" +
															user + " Your Package email can't be verified, either Unity Asset Store can't be reach right now or you don't have Support E-mail provided. \n" +
															"If the problem persists please contact a moderator.");
											}

										if(stderr){
											functions.pythonError("stderr - " + stderr,() => {});
										}
									}
								});
							});
						}
						if(parsed[1] == null){
							functions.sendMessageWho(message, "You need to provide a Publisher ID so that we can verify you are a Publisher.",() => {});
						}else{
							if(result[0].keycode == null){
								functions.sendMessageWho(message, "There's no key in register.",() => {});
								var currentVerificationLength = 0;
							}else{
								var currentVerificationLength = result[0].keycode.length;
							}

							if(currentVerificationLength <= 7){
								emailVerification();
							}else if(currentVerificationLength <= 15){
								emailVerification();
							}else if(currentVerificationLength <= 23){
								emailVerification();
								functions.sendMessageWho(message, "This is the last email Verification that's being sent. If you still have a problem contact a ModSquad member.",() => {});
							}else{
								functions.sendMessageWho(message, "You can no longer execute this command. If you still have a problem contact a ModSquad member.",() => {});
							}
						}
					});
				}
			}
		}
	},
	"coinflip": { 
		desc: "Flip a coin.",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 2, cooldown: 0,
		process: function(con, client, message, parsed, guild) {
			if (Math.floor(Math.random() * (2)) == 0)
				functions.sendMessageWho(message, "**" + message.author.username.replace(/@/g, '@\u200b') + "** flipped a coin and got **Heads**",() => {});
			else
				functions.sendMessageWho(message, "**" + message.author.username.replace(/@/g, '@\u200b') + "** flipped a coin and got **Tails**",() => {});
		}
	},
	"unityinfo": { 
		desc: "Usefull Info for new members in Unity3D.",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 2, cooldown: 0,
		process: function(con, client, message, parsed, guild) {
			functions.sendMessageWho(message, "A good place to start looking for information is on - <https://unity3d.com/learn/tutorials> \n " +
" \n" +		
"This first Project to start would be: \n" +
"<https://unity3d.com/learn/tutorials/projects/roll-ball-tutoria> \n" +
" \n" +
"If you get stuck search here: \n" +
"<https://docs.unity3d.com/ScriptReference/> \n" +
"or here: \n" +
"<https://docs.unity3d.com/Manual/index.html> \n" +
" \n" +
"If you can't understand something, ask in #scripting , #game-development or #helpdesk",() => {});
		}
	},
	"codetags": {
		desc: "Display formating in Discord Chat",
		usage: "[command]",
		shouldDisplay: true, deleteCommand: true, cooldown: 0,
		process: function(con, client, message, parsed, guild) {
			functions.sendMessageWho(message,  "\n" +
				'** Text Formating :** \n' +
				':black_small_square: `*italics*` => *italics* \n' +
			    ':black_small_square: `**bold**` => **bold**\n' +
			    ':black_small_square: `***bold italics***` => ***bold italics***  \n' +
			    ':black_small_square: `~~strikeout~~` => ~~strikeout~~ \n' +
			    ':black_small_square: `__underline__` => __underline__ \n' +
			    ':black_small_square: `__*underline italics*__` => __*underline italics*__ \n' +
			    ':black_small_square: `__**underline bold**__` => __**underline bold**__ \n' +
			    ':black_small_square: `__***underline bold italics***__` => __***underline bold italics***__ \n' +
			    '\n' +
				'** Code Formating :** \n' +
			    ':black_small_square: `` `single line code, one backtick` `` => `single line code, one backtick`\n' +
			    ':black_small_square: `` ```multi-line code block, three backtick``` `` :small_red_triangle_down:  ```multi-line code block \n three backtick```\n' +
			    '__For more information visit__ `https://goo.gl/W44VLw` \n' +
			    'Command will be removed after 5 minutes'
				,() => {}).then(message => {
					message.delete(300*1000).then(message => {
						message.edit("__ ##"+settings.prefix+"codetags## Exprired. __");
					});
				});
		}
	},
	"stats": { // command passed
		desc: "Provides some details about the bot and stats.",
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
• Uptime            : ${duration}
• Discord.js        : v${Discord.version}
#################################################
• Users             : ${guild.memberCount} 
• • Online          : ${guild.members.filter(u => u.presence.status == 'online' || u.presence.status == 'idle' || u.presence.status == 'dnd').size}, Idle : ${client.users.filter(u => u.presence.status == 'idle').size}, DND : ${client.users.filter(u => u.presence.status == 'dnd').size}
• • Offline         : ${guild.members.filter(u => u.presence.status == 'offline').size}
• Roles Number      : ${guild.roles.size}
• Server Region     : ${guild.region}
\`\`\``,() => {});
		}
	}
};


// exports.userCommands = userCommands;
module.exports = userCommands;