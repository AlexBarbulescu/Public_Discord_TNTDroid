<?php


$db_user = "";
$db_password = "";
$databaseDiscord = "";
$server = "";

$receiver_mail = "alex_tnt89@yahoo.com";


$connectionDiscord = mysqli_connect($server, $db_user, $db_password, $databaseDiscord);

if (mysqli_connect_errno()){
	echo "<br>** Error in database table <b>".mysql_error()."</b><br>";

	$page = $_SERVER['PHP_SELF'];
	$sec = "10";
	header("Refresh: $sec; url=$page");
}

mysqli_close($connectionDiscord);

?>