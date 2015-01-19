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

<div  class='main' ui-view>
	<!-- Top Nav -->
	<div class='top_nav'>
		<div>
				<ul>
					<li>
						<a href='#home'>
							
								home
							
						</a>
					</li>
					<li>
						<a href='#about'>
							
								about
							
						</a>
					</li>
					<li>
						<a href='#calender'>
							
								calender
						
						</a>
					</li>
					<li>
						<a href='#contact'>
							
								contact
							
						</a>
					</li>
				</ul>
		</div>
	</div>

	<div class='section' ui-view='home'></div>
	<div class='section' ui-view='about'></div>
	<div class='section' ui-view='calender'></div>
	<div class='section' ui-view='contact'></div>
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


