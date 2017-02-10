<!DOCTYPE html>
<html lang="en">
<head>

    <title></title>

    <style>
	@font-face {
	    font-family: 'Raleway Light';
	    font-style: normal;
	    font-weight: 400;
	    src: local("Raleway Light"),url('fonts/raleway.light.woff2') format('woff2'), url('fonts/Raleway-Light.woff') format('woff'), url('fonts/raleway.light.ttf') format('truetype');
	}
    body {
	    background-color: #fff;
	    background-repeat: no-repeat;
	    margin: 0;
	    outline: 0 none;
	    padding: 0;
	    vertical-align: top;
	    font-family: 'Raleway Light';
    }
    .block{
		width: 200px;
		height: 76px;
		background-image: url("images/background01.png");
		background-color: #45718b;
  		position: relative;
    }
    .block-transparent{
		width: 148px;
		height: 72px;
		background-color: #f6f6f6;	
		filter: alpha(opacity=80);
		-moz-opacity: 0.8;
		opacity: 0.8;
		margin-left: 50px;
		margin-top: 2px;
		margin-bottom: 2px;
		position: absolute;
	    top: 0;
    }
    .table{
    	width: 100%;
    	height: 100%;
		position: absolute;
	    top: 2px;
	    left: 0;
    }
    .profile{
    	width: 30%;
    	height: 100%;
    	/*top: 50%;*/
		position: relative;
    }
    .info{
		position: absolute;
		text-align: center;
		width: 100px;
		top: 25%; left: 50%;
		/*transform: translate(-10%,-50%);*/
    }
    .profile-image{
    	width: 48px;
    	height: 48px;
    	z-index: 3;
	    left: 18px;
		-webkit-box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.25);
		-moz-box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.25);
		box-shadow: 0px 0px 4px 0px rgba(0,0,0,0.25);
    }
	.double-border {
		background: #fdfdfd;
		border: 1px solid #bebfc0;
		padding: 1px;
		position: relative;
		margin: 0 auto;
	}
	.after-box {
		display:inline-block;
		margin-right: 5px;
	}
	.level {
		text-transform: capitalize;
		float: left;
		text-align: center;
		color: #5c5c5c;
		line-height: 1;
	}
	.level span {
		display: block;
	}
	.text-lvl{
		color: #5c5c5c;
		font-family: 'Arial', sans-serif;
		font-size: 14px;
		font-weight: 600;
	}
	.text-value{
		font-family: 'Arial', sans-serif;
		font-weight: 900;
		font-size: 24px;
	}
	.normalText{
		font-family: 'Arial', sans-serif;
	}
    </style>

<!-- example link levelup.php?id=200160671084707841 -->
</head>
<body >

<div class="block">

	<div class="block-transparent"></div>
	<table class="table">
		<tr>
<?php

// echo $_SERVER['HTTP_USER_AGENT'] . "\n\n";
// $browser = get_browser(null, true);
// print_r($browser);

error_reporting(E_STRICT | E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

require_once 'config.php';

$mysqli = new mysqli($server, $db_user, $db_password, $databaseDiscord); // mysql server user and password access

if ($mysqli->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}	


$id = $_GET['id'];

if($id == null){
	$id = '200160671084707841';
}

$sql_user= "SELECT * FROM users Where `userid` = '".$id."'";

$result_user = $mysqli->query($sql_user);

while($row = $result_user->fetch_assoc()){
    $username =$row["username"];
    $discriminator = $row["discriminator"];
    $avatarURL = $row["avatarURL"];
    $rank = $row["rank"];
    $karma = $row["karma"];
    $profanity = $row["profanity"];
    $exp = $row["exp"];
    $level = $row["level"];

    if($avatarURL == null){
    	$randomNumber = mt_rand(01, 15);
    	$randomNumber = sprintf('%02d', $randomNumber);
    	$avatarURL = 'images/noavatar'.$randomNumber.'.png';
    }

	echo "<td class='profile'><img src='".$avatarURL."' class='profile-image double-border'></td>";
	echo "<td class='info'><div class='after-box level'><span class='text-lvl'>LEVEL UP!</span><span class='text-value'>LVL ".$level."</span></div></td>";

	// $explow = 0;
	// for($L=0;$L<101;$L++) {
	// 	$constant = 69;
	// 	$formula = $constant + ((2*$L)*$constant+$L);
	// 	// $formula = round($formula / 4) * 4; // even numbers

	// 	$exphigh = $explow + $formula;
	// 	$difference = $exphigh - $explow;
	// 	$xpdifference = $exp - $explow;

	// 	$barpercent = round($xpdifference / ($formula / 100));

	// 	if($exp >= $explow && $exp <= $exphigh){
	// 		echo "<td class='profile'><img src='".$avatarURL."' class='profile-image double-border'></td>";
	// 		echo "<td class='info'><div class='after-box level'><span class='text-lvl'>LEVEL UP!</span><span class='text-value'>LVL ".$L."</span></div></td>";
	// 	}
	// 	$explow = $exphigh;
	// }



}
?>
		</tr>
	</table> 
</div>

</body>

</html>
