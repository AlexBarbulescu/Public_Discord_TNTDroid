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
/*	@font-face {
	    font-family: 'Raleway Heavy';
	    font-style: normal;
	    font-weight: 400;
	    src: local("Raleway Heavy"),url('raleway.heavy.woff2') format('woff2'), url('fonts/Raleway-Heavy.woff') format('woff'), url('fonts/raleway.heavy.ttf') format('truetype');
	}*/
/*	@font-face {
	    font-family: 'Raleway Bold';
	    font-style: normal;
	    font-weight: 400;
	    src: local("Raleway Bold"), url('fonts/raleway.bold.woff2') format('woff2'), url('fonts/Raleway-Bold.woff') format('woff'), url('fonts/raleway.bold.ttf') format('truetype');
	}*/
	@font-face {
	    font-family: 'Raleway Regular';
	    font-style: normal;
	    font-weight: 400;
	    src: local("Raleway Regular"), url('fonts/raleway.regular.ttf') format('truetype');
	}
	@font-face {
	    font-family: 'Raleway SemiBold';
	    font-style: normal;
	    font-weight: 400;
	    src: local("Raleway SemiBold"), url('fonts/raleway.semibold.ttf') format('truetype');
	}
	@font-face {
	    font-family: 'OpenSans Regular';
	    font-style: normal;
	    font-weight: 400;
	    src: local("OpenSans Regular"), url('fonts/OpenSans-Regular.ttf') format('truetype');
	}
    body {
	    /*background-color: #000;*/
	    background-color: #fff;
	    background-repeat: no-repeat;
	    /*box-sizing: border-box;*/
	    margin: 0;
	    outline: 0 none;
	    padding: 0;
	    vertical-align: top;
	    font-family: 'Raleway Light';
    }
    .block{
/*		width: 370px;
		height: 110px;*/
		width: 400px;
		height: 113px;
		background-image: url("images/background01.png");
		background-color: #45718b;
  		position: relative;
    }
    .block-transparent{
		width: 308px;
		height: 101px;
		background-color: #f6f6f6;	
		filter: alpha(opacity=80);
		-moz-opacity: 0.8;
		opacity: 0.8;
		margin-left: 86px;
		margin-top: 6px;
		position: absolute;
	    top: 0;
	    left: 0;
		/*top: 50%; left: 50%;*/
		/*transform: translate(-50%,-50%);*/
/*		top: 50%; right: 0;
		transform: translate(0, -50%);*/
    }
    .table{
    	width: 100%;
    	height: 100%;
		position: absolute;
	    top: 0;
	    left: 0;
    }
    .table-second{
    	padding-left: 25px;
    	padding-top: 10px;
    	width: 100%;
    	height: 100%;
	    display: inline-block;

    }
    .table-third{
		width: 140px;
		line-height: 10px;
		color: #5c5c5c;
		font-size: 12px;
		font-family: 'Raleway SemiBold';
		/*position: absolute;*/
		/*text-align: center;*/
/*		margin-left: 5px;
		margin-top: 0px;*/

    }
    .profile{
    	width: 30%;
    	height: 100%;
    	top: 13px;
		position: absolute;
    }
    .info{
    	width: 70%;
    	height: 100%;
		/*background-color: #c5c5c6;	*/
    }
    .profile-image{
    	width: 80px;
    	height: 80px;
    	z-index: 3;
		/*transform: translate(50px);*/
	    left: 45px;
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
/*	.double-border:before {
		border: 1px solid #efefef;
		content: "";
		display: block;
		position: absolute;

	}*/
	.username{
		font-family: 'Raleway SemiBold';
		color: #5c5c5c;
		text-align: center;
		font-weight: 800;
		/*font-family: 'Arial', sans-serif;*/
		
	}
	.meter { 
		height: 14px;
		width: 220px;
		position: relative;
		background: #edeeef;
		border: 1px solid #b7b8ba;
	    overflow: hidden;
	    text-align: center;
	}

	.bar {
		height: 12px;
		background: #fcfcfd;
		margin: 1px;
		/*background-color: #9fe344;	*/
		background-color: #c6c6c7;	
		position: absolute;
		overflow: hidden;
	    top: 0;
	    left: 0;
	}
	.bar-text {
		/*height: 14px;*/
		width: 200px;
		font-family: 'OpenSans Regular';
		/*font-family: 'Tahoma';*/
		font-size: 8px;
		color: #5c5c5c;
	    z-index: 1;
		font-weight: 600;
		position: relative;
		vertical-align: middle;
		top: 1px;
		/*line-height: 13px;*/

	}

	.verticalLine {
		height: 45px;
		border-left: solid #969696;
		float: left;
		margin-left: 4px;
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
		font-size: 16px;
		font-weight: 800;
	}
	.text-value{
		font-family: 'Arial', sans-serif;
		font-weight: 900;
		font-size: 32px;
	}
	.normalText{
		font-family: 'Arial', sans-serif;
	}
    </style>

<!-- http://stackoverflow.com/questions/12785372/send-id-through-the-link-with-php-and-mysql -->
<!-- http://stackoverflow.com/questions/6954874/php-game-formula-to-calculate-a-level-based-on-exp -->
<!-- http://fontawesome.io/examples/ -->

<!-- example link profile.php?id=200160671084707841 -->
</head>
<body >

<div class="block">

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

	$explow = 0;
	for($L=0;$L<101;$L++) {
		$constant = 69;
		$formula = $constant + ((2*$L)*$constant+$L);
		// $formula = round($formula / 4) * 4; // even numbers

		$exphigh = $explow + $formula;
		$difference = $exphigh - $explow;
		$xpdifference = $exp - $explow;

		$barpercent = round($xpdifference / ($formula / 100));

		// if($exp >= $explow && $exp <= $exphigh){
		// 	echo '<br />';
		// 	echo 'Your Level - '.$exp.' - Experience Difference - '.$xpdifference.'<br />';
		// 	echo 'Level '.$L.': xp needed 0 - '.$formula.' --- Total Exp - from '.$explow.' to '.$exphigh.' - difference '.$difference.'<br />';
		// 	echo '<br />';
		// }else{
		// 	echo 'Level '.$L.': xp needed 0 - '.$formula.' --- Total Exp - from '.$explow.' to '.$exphigh.' - difference '.$difference.'<br />';
		// }


		if($exp >= $explow && $exp <= $exphigh){


?>

	<div class="block-transparent"></div>
	<table class="table">
		<tr>
			<td class="profile"> <?php echo "<img src='".$avatarURL."' class='profile-image double-border'>"; ?> </td>
			<td class="info">

			<table class="table-second">

				<tr>
					<?php echo "<td class='username'>".$username."#".$discriminator."</td>"; ?> 
					
				</tr>
				<tr>
					<td>
						<div class="meter">
							<div class="bar-text">EXP: <?php echo $xpdifference; ?> / <?php echo $formula; ?></div>
							<div class="bar" style="width: <?php echo $barpercent; ?>%"></div>
						</div>
					</td>
				</tr>

				<tr>
					<td>
						<div class="after-box level"><span class="text-lvl">LEVEL</span><span class="text-value"><?php echo $L; ?></span></div>
						<div class="after-box"><div class="verticalLine">&nbsp;</div></div>
						<div class="after-box">
							<table class="table-third">
								<tr>
									<td>
										Total XP
									</td>
									<td>
										<?php echo $exp; ?>
									</td>
								</tr>
								<tr>
									<td>
										Server Rank
									</td>
									<td>
										# <?php echo $rank; ?>
									</td>
								</tr>
								<tr>
									<td>
										Karma Points
									</td>
									<td>
										<?php echo $karma; ?>
									</td>
								</tr>
							</table>

						</div>
					</td>
	
				</tr>
			</table>
			</td>
		</tr>
	</table> 
</div>

<?php
		}
		$explow = $exphigh;
	}


						// Total XP - <?php echo $exp; <br>
						// 	Server Rank   - # <?php echo $rank;  <br>
						// 	Karma Points - <?php echo $karma; 


echo "<div class='normalText'>";

	echo '<br />';
	$explow = 0;
	// $expGive = 289;
	// $level = 1;
	for($L=0;$L<101;$L++) {
		$constant = 69;
		$formula = $constant + ((2*$L)*$constant+$L);
		// $formula = round($formula / 4) * 4; // even numbers

		$exphigh = $explow + $formula;
		$difference = $exphigh - $explow;
		$xpdifference = $exp - $explow;

		$barpercent = round($xpdifference / ($formula / 100));
		$barpercentNotRound = round($xpdifference / ($formula / 100), 3);


		// if($expGive >= $explow && $expGive <= $exphigh && $L > $level){
		// 	echo 'Execute command here. <br />';
		// }

		if($exp >= $explow && $exp <= $exphigh){
			echo '<br />';
			echo 'Your Level - '.$exp.' - Experience Difference - '.$xpdifference.' - Bar '.$barpercent.'% - '.$barpercentNotRound.'% <br />';
			echo 'Level '.$L.': xp needed 0 - '.$formula.' --- Total Exp - from '.$explow.' to '.$exphigh.' - difference '.$difference.'<br />';
			echo '<br />';
		}else{
			echo 'Level '.$L.': xp needed 0 - '.$formula.' --- Total Exp - from '.$explow.' to '.$exphigh.' - difference '.$difference.'<br />';
		}




		$explow = $exphigh;
	}

echo '</div>';


}
?>

</body>

</html>
