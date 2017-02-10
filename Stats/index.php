<!DOCTYPE HTML>
<html>
	<head>
		<title>Discord Stats</title>
		<script src="js/jquery.min.js"></script>
		<script src="js/highstock.js"></script>
		<script src="js/dark-unica.js"></script>

		<link href="../../style.css" rel="stylesheet" type="text/css">
<!-- 		<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Unica+One">  //https://google-webfonts-helper.herokuapp.com/fonts/unica-one?subsets=latin -->

		<style type="text/css">	
			body{
			    background-color : #36393e;
			}
			* {
			    background-repeat: no-repeat;
			    box-sizing: border-box;
			    margin: 0;
			    outline: 0 none;
			    padding: 0;
			    vertical-align: top;
			    -webkit-font-smoothing: subpixel-antialiased;
			 /*   -webkit-text-stroke:1px transparent;*/
			/*   -webkit-text-stroke:0.5px;*/
			    text-rendering: optimizeSpeed;
			    -moz-osx-font-smoothing: grayscale;
			}
			.gmt {
			    background-position: right center;
			    background-repeat: no-repeat;
			    background-size: cover;
			    left: 400px;
			    position: absolute !important;
			    top: 11px;
			    z-index: 1;
			}
		</style>

<?php

error_reporting(E_STRICT | E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);


require_once '/var/www/config.php';

$mysqli = new mysqli($server, $db_user, $db_password, $databaseDiscord); // mysql server user and password access

if ($mysqli->connect_error) {
	die("Connection failed: " . $conn->connect_error);
}	

?>






<script type="text/javascript">
$(function container_downloads() {

// http://stackoverflow.com/questions/28607183/highcharts-tickinterval-every-hour
// http://jsfiddle.net/qn6romsf/7/
	$('#container_downloads').highcharts('Chart',{
		title: {
		    text: ''
		},
		subtitle: {
		    text: ''
		},
		chart: {
			zoomType: 'x',
		     backgroundColor: '#36393e',
		     polar: true,
		     type: 'line'
		},
		xAxis: {
			type: 'datetime',
			range: 1 * 30 * 24 * 3600 * 1000,
			tickInterval:  3600 * 1000 ,
			dateTimeLabelFormats: {
			   // day: '%e. %b. %Y'
			   day: '%e. %b'
			},
            tickInterval: 3600 * 1000 ,
            minTickInterval: 3600 * 1000 
			//minRange: 7 * 24 * 3600000, // one days , 1 value day , 2 value hours , 3 - one hour
			// one days , 1 value day , 2 value hours , 3 - one hour
			//min : x.setMonth(x.getMonth()-1),
		   // max : Date.now()
		},
			
		yAxis: {
			title: {
				text: 'Status'
			},
			tickInterval: 1,
				 allowDecimals: false,
			
		},
		rangeSelector: {
			enabled: true,
		},
		navigator : {
			  xAxis: {
				labels: {
					style: {
						color: '#E0E0E3',
					}
				}
			},
			outlineColor: "#b2b1b6",
				enabled : true

		},
		plotOptions: {
			areaspline: {
				animation: false,
				pointRange: 3600 * 1000 / 10,
				 fillColor: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
					stops: [
						[0, Highcharts.getOptions().colors[1]],
						[1, Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0).get('rgba')]
					]
				},
				marker: {
					radius: 2
				},
				lineWidth: 1,
				states: {
					hover: {
						lineWidth: 1
					}
				},
				threshold: null
			},
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    lineWidth: 1,
                    lineColor: '#666666'
                }
            },
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }

		},

		series: [{
			type: 'spline',
			name: 'Total Members',
			animation: false,
			data: [
<?php 


// $sql_download = "SELECT date, name, SUM(quantity) FROM downloads GROUP BY DATE(`Date`)";
//$sql_download = "SELECT * FROM onlineChart";
$sql_download = "SELECT * , count(*) FROM onlineChart GROUP BY hour( date ) , day( date ) ORDER BY id ASC";


$result_download = $mysqli->query($sql_download);

while($row = $result_download->fetch_assoc()){
	$online =  $row["online"];     
	$offline =  $row["offline"];     
	$idle =  $row["idle"];   
	$total =  $row["total"];  

	$totalOnline = $online + $idle;

	$date_str = strtotime($row["date"]);
	$year = date('Y', $date_str);
	$month = date('n', $date_str) - 1;
	$day = date('j', $date_str);

	$hours = date('H', $date_str) - 3;
	$minutes = date('i', $date_str);
	$seconds = date('s', $date_str);

	//http://php.net/manual/en/function.date.php
	$ans_total = "[Date.UTC(" . sprintf('%s, %s, %s, %s',$year,$month,$day,$hours) . "), " .  $total . "],";

	echo $ans_total . "\r\n";
}


?>
			]
		},{
			type: 'spline',
			name: 'Total Online: Idle and Online',
			animation: false,
			fillColor : {
			  //linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
			  stops : [
				[0, Highcharts.getOptions().colors[0]],
				[1, 'rgba(0,0,0,0)']
			  ]
			},
			data: [
<?php 

$result_download = $mysqli->query($sql_download);


while($row = $result_download->fetch_assoc()){
	$online =  $row["online"];     
	$offline =  $row["offline"];     
	$idle =  $row["idle"];   
	$total =  $row["total"];  

	$totalOnline = $online + $idle;

	$date_str = strtotime($row["date"]);
	$year = date('Y', $date_str);
	$month = date('n', $date_str) - 1;
	$day = date('j', $date_str);

	$hours = date('H', $date_str) - 3;
	$minutes = date('i', $date_str);
	$seconds = date('s', $date_str);

	//http://php.net/manual/en/function.date.php
	$ans_total = "[Date.UTC(" . sprintf('%s, %s, %s, %s',$year,$month,$day,$hours) . "), " .  $totalOnline . "],";

	echo $ans_total . "\r\n";
}



?>
			]
		},{
			type: 'spline',
			name: 'Online',
			animation: false,
			fillColor : {
			  linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
			  stops : [
				[0, Highcharts.getOptions().colors[1]],
				[1, 'rgba(0,0,0,0)']
			  ]
			},
			data: [
<?php 

$result_download = $mysqli->query($sql_download);


while($row = $result_download->fetch_assoc()){
	$online =  $row["online"];     
	$offline =  $row["offline"];     
	$idle =  $row["idle"];   
	$total =  $row["total"];  

	$totalOnline = $online + $idle;

	$date_str = strtotime($row["date"]);
	$year = date('Y', $date_str);
	$month = date('n', $date_str) - 1;
	$day = date('j', $date_str);

	$hours = date('H', $date_str) - 3;
	$minutes = date('i', $date_str);
	$seconds = date('s', $date_str);

	//http://php.net/manual/en/function.date.php
	$ans_total = "[Date.UTC(" . sprintf('%s, %s, %s, %s',$year,$month,$day,$hours) . "), " .  $online . "],";

	echo $ans_total . "\r\n";
}

?>
	  ]},{
			type: 'spline',
			animation: false,
			name: 'Offline',
			fillColor : {
			  stops : [
				[0, Highcharts.getOptions().colors[1]],
				[1, 'rgba(0,0,0,0)']
			  ]
			},
			data: [
<?php 

$result_download = $mysqli->query($sql_download);


while($row = $result_download->fetch_assoc()){
	$online =  $row["online"];     
	$offline =  $row["offline"];     
	$idle =  $row["idle"];   
	$total =  $row["total"];  

	$totalOnline = $online + $idle;

	$date_str = strtotime($row["date"]);
	$year = date('Y', $date_str);
	$month = date('n', $date_str) - 1;
	$day = date('j', $date_str);

	$hours = date('H', $date_str) - 3;
	$minutes = date('i', $date_str);
	$seconds = date('s', $date_str);

	//http://php.net/manual/en/function.date.php
	$ans_total = "[Date.UTC(" . sprintf('%s, %s, %s, %s',$year,$month,$day,$hours) . "), " .  $offline . "],";

	echo $ans_total . "\r\n";
}


?>
	  ]},{
			type: 'spline',
			name: 'Idle',
			animation: false,
			fillColor : {
			  stops : [
				[0, Highcharts.getOptions().colors[1]],
				[1, 'rgba(0,0,0,0)']
			  ]
			},
			data: [
<?php 

$result_download = $mysqli->query($sql_download);


while($row = $result_download->fetch_assoc()){
	$online =  $row["online"];     
	$offline =  $row["offline"];     
	$idle =  $row["idle"];   
	$total =  $row["total"];  

	$totalOnline = $online + $idle;

	$date_str = strtotime($row["date"]);
	$year = date('Y', $date_str);
	$month = date('n', $date_str) - 1;
	$day = date('j', $date_str);

	$hours = date('H', $date_str) - 3;
	$minutes = date('i', $date_str);
	$seconds = date('s', $date_str);

	//http://php.net/manual/en/function.date.php
	$ans_total = "[Date.UTC(" . sprintf('%s, %s, %s, %s',$year,$month,$day,$hours) . "), " .  $idle . "],";

	echo $ans_total . "\r\n";
}


?>
	  ]},{
			type: 'spline',
			name: 'Messages',
			animation: false,
			fillColor : {
			  stops : [
				[0, Highcharts.getOptions().colors[1]],
				[1, 'rgba(0,0,0,0)']
			  ]
			},
			data: [
<?php 

$result_download = $mysqli->query($sql_download);


while($row = $result_download->fetch_assoc()){
	$online =  $row["online"];     
	$offline =  $row["offline"];     
	$idle =  $row["idle"];   
	$total =  $row["total"];  
	$messages =  $row["messages"];  

	$totalOnline = $online + $idle;

	$date_str = strtotime($row["date"]);
	$year = date('Y', $date_str);
	$month = date('n', $date_str) - 1;
	$day = date('j', $date_str);

	$hours = date('H', $date_str) - 2;
	$minutes = date('i', $date_str);
	$seconds = date('s', $date_str);

	//http://php.net/manual/en/function.date.php
	$ans_total = "[Date.UTC(" . sprintf('%s, %s, %s, %s',$year,$month,$day,$hours) . "), " .  $messages . "],";

	echo $ans_total . "\r\n";
}


?>
	  ]}
		
		]
	});
});
</script>
<div style="height:389px; width:865px;">
	<a class="gmt">Timezone - GMT+0</a>
	<div id="container_downloads" class="chart"></div>
</div>