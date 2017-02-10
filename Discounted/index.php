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

$sql_rssDiscount = "SELECT * FROM rssDiscounted ORDER BY id DESC LIMIT 1";

// $result_rssDiscount = $mysqli->query($sql_rssDiscount);

$result_rssDiscount = $mysqli->query($sql_rssDiscount) or die($mysqli->error);

while ($row = $result_rssDiscount->fetch_assoc()) {
	$packageName = $row["packageName"];
	$publisherName = $row["publisherName"];

	$percentageDiscount = $row["percentageDiscount"];
	$discountPrice = $row["discountPrice"];
	$fullPrice = $row["fullPrice"];

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
		<div class="background"><img class="bg1" src="<?php print $mainImage ?>">
			<div style='background-image: url(24hourdeals-2016-12.png);' class='salesBadget'></div>
		</div>
		<div class="blocked full"><?php //echo $_SERVER['HTTP_USER_AGENT']; ?>

		<div class="overview-text-overlay">
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
					<div content="15" itemprop="ratingCount" class="count">(<span class="rating-count"></span><?php print $ratingFeedback ?>)</div></div><br>


					<div id="sale">
						<div class="percentage"><span class="value"><?php print $percentageDiscount ?></span><span class="pct">%</span><span class="off">OFF</span></div>
					</div>

					<span class="price">
						$<?php print $discountPrice ?>
					</span>
					<span class="original-price">$<?php print $fullPrice ?></span>
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

<!-- 							<div class="fulldescription vscroll">
				<strong>799 2D Fantasy Art Assets: Backgrounds, Items, Characters and Creatures - High Quality Art!!</strong><br>
				PNG Format 1000 pixel height (1280x1920 for backgrounds)<br>
				<br>
				You are making an RPG, a Card-game or a Roguelike?<br>
				Then, this 2D Fantasy asset Full Pack might just be what you need!<br>
				<br>
				Designed for a fantasy themed medieval-type of world, these assets will give life and personality to your game.<br>
				<br>
				<a class="externallink" target="_blank" href="https://www.assetstore.unity3d.com/en/#%21/publisher/8233">All packs in one!</a><br>
				<strong>Including:</strong><br>
				<br>
				- 77 Backgrounds<br>
				2D Background Pack Vol 1<br>
				<br>
				- 116 Items<br>
				2D Item Pack Vol 1<br>
				<br>
				- 240 Characters (4x60)<br>
				2D Character Pack Vol 1<br>
				2D Character Pack Vol 2<br>
				2D Character Pack Vol 3<br>
				2D Character Pack Vol 4<br>
				<br>
				- 366 Creatures (6x61)<br>
				2D Creature Pack Vol 1<br>
				2D Creature Pack Vol 2<br>
				2D Creature Pack Vol 3<br>
				2D Creature Pack Vol 4<br>
				2D Creature Pack Vol 5<br>
				2D Creature Pack Vol 6<br>
				<br>
				For more information feel free to contact us at <a class="externallink" target="_blank" href="mailto:info@wizcorp.jp">info@wizcorp.jp</a>.<br>
			</div> -->



			</div>
		</div>
	</div>
</div>


<?php 

}


?>