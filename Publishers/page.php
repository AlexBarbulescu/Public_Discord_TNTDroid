<!DOCTYPE html>
<link rel="stylesheet" type="text/css" href="minified.css">
<title>Latest Discounted</title>

<?php

function seconds_to_time($seconds) {
    $dtF = new DateTime("@0");
    $dtT = new DateTime("@$seconds");
    return $dtF->diff($dtT)->format('%ad %hh %im');
}

error_reporting(E_STRICT | E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

require_once '../../config.php';


$mysqli = new mysqli($server, $db_user, $db_password, $databaseDiscord);

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}	

// $sql_rssDiscount = "SELECT * FROM advertisment WHERE render = 0 ORDER BY id ASC LIMIT 1";
$sql_rssDiscount = "SELECT * FROM advertisment WHERE current = 1 ORDER BY id DESC LIMIT 1";

// $result_rssDiscount = $mysqli->query($sql_rssDiscount);

$result_rssDiscount = $mysqli->query($sql_rssDiscount) or die($mysqli->error);

while ($row = $result_rssDiscount->fetch_assoc()) {
	$packageName = $row["packageName"];
	$publisherName = $row["publisherName"];

	$username = $row["username"];
	$discriminator = $row["discriminator"];

	$price = $row["price"];

	$smallImage = $row["smallImage"];
	$mainImage = $row["mainImage"];

	$description = $row["description"];
	$categoryDetail = $row["categoryDetail"];

	$date = $row["date"];

	$packageLink = $row["packageLink"];
	$packageFullLink = $row["packageFullLink"];

	$ratingStars = $row["ratingStars"];
	$ratingFeedback = $row["ratingFeedback"];

?>


<div id="content-panels">

	<div id="contentoverview">
		<div class="background"><img class="bg1" src="<?php print $mainImage ?>"></div>

		<div class="blocked"><?php //echo $_SERVER['HTTP_USER_AGENT']; ?>

			<div class="username"><img src="discord.png"><br><a class="predevhub">User</a><?php print $username ?><a class="small"><?php print "#" . $discriminator ?></a><a class="devhub">in Chat</a></div>
				<h1 itemprop="name"><?php print $packageName ?></h1>
				<div class="details-container">
					<div class="details">
						<a class="livelink detaillink"><?php print $categoryDetail ?></a><br>
						<a class="livelink detaillink"><?php print $publisherName ?></a><br>

						<div class="rating inline">
						<span content="<?php echo $ratingStars?>">
						<?php 
							$x = 0; 
							while($x < $ratingStars) {
							    echo "<div class='selected'></div>";
							    $x++;
							} 
							if($ratingStars < 5){
								echo "<div></div>";
							}

						// str_repeat("<div class='selected'></div>", $ratingStars); 


						?></span>

						<?php

							if($ratingFeedback > 0 && $price > 0){
								echo "<div content='15' itemprop='ratingCount' class='count'>(<span class='rating-count'></span>" . $ratingFeedback .  ")</div>";
							}else{
								echo "<div content='15' itemprop='ratingCount' class='unrated'>Not enough ratings</div>";
							}

						?>
						</div><br>
						<span class="original-price">$<?php print $price ?></span>
						<br>

					</div>
					<div class="details linkbar"><div class="action-container green"><div class="progress-bar"></div><button href="" class="download">Buy now</button></div></div>





				</div>


	<!-- 							<div class="sharing">
					<a title="Open Unity" target="_blank" class="externallink open-in-unity"></a>
					<a href="http://u3d.as/8FD" title="Open 2D Fantasy Art Assets Full Pack in external browser" target="_blank" class="externallink link"></a>
					<a href="http://twitter.com/?status=2D%20Fantasy%20Art%20Assets%20Full%20Pack%20by%20Wizcorp%20Inc%20http%3A%2F%2Fu3d.as%2F8FD%20%23AssetStore" title="Share 2D Fantasy Art Assets Full Pack on Twitter" target="_blank" class="externallink twitter"></a>
					<a href="http://facebook.com/share.php?u=http%3A%2F%2Fu3d.as%2F8FD" title="Share 2D Fantasy Art Assets Full Pack on Facebook" target="_blank" class="externallink facebook"></a>
					<a href="http://plus.google.com/share?url=http%3A%2F%2Fu3d.as%2F8FD" title="Share 2D Fantasy Art Assets Full Pack on Google+" target="_blank" class="externallink googleplus"></a>
					<a class="report-violation" title="Report Violation"></a>
				</div> -->

	<!-- 							<div class="notes">
					<span class="min-unity-version">Requires Unity 4.3.4 or higher.</span><br>
				</div> -->





		</div>
	</div>
</div>


<?php 

}


?>