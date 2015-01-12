<?php
use lifelinearts as lla;
/**
 * The main template file.
 * This the first verions of the lla Theme
 * 
 *
 *
 *
 *
 *
 * @package lla
 */

get_header(); 


$model = new lla\lla_sections_object('home_page');


?>

<div ui-view>
	<div ui-view='home'></div>
	<div ui-view='about'></div>
	<div ui-view='calender'></div>
	<div ui-view='contact'></div>
</div>


<script>
var lla ={};

angular.module('llaapp.services', ['ngRoute'])
.provider("InitialModel",  {

	 $get: function() {
		 	return{

		 		'InitialModel': <?php echo json_encode($modelSingleton =  lla\Model::getInstance() );?>
		 	}
			
			
		}
	
	
 
});

/*
lla.model = angular.module('llaapp.services')._invokeQueue[0][2][1](); //This is how to find it in the current factory
console.log(lla.model);*/



</script>

<?php get_footer(); ?>


