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

<div  class='main' ui-view ng-controller='MainController'>
	<!-- Top Nav -->
	<div id='topnav' ui-view='topnav'></div>
	<div id='home'class='section' ui-view='home'></div>
	<div id='about' class='section' ui-view='about' ></div>
	<div id='calender'class='section' ui-view='calender'></div>
	<div id='contact'class='section' ui-view='contact'></div>
	<ui-view/>
	<pre>
	<!-- Here's some values to keep an eye on in the sample in order to understand $state and $stateParams -->
	$state = {{$state.current.name}}
	$stateParams = {{$stateParams}}
	$state full url = {{ $state.$current.url.source }}
	Something = {{$ur}};
	<!-- $state.$current is not a public api, we are using it to
	display the full url for learning purposes-->
	</pre>

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
	
	
 
})
.service('lla_wp', function(){
	var t = '<?php echo get_template_directory_uri(); ?>',
		a = '<?php echo admin_url( 'admin-ajax.php' ); ?>',
		n = '<?php echo wp_create_nonce( 'lla_angular' ); ?>';



	return {
		'template_dir':t,
		'ajax': a,
		'nouce': n

	};
});
/*
lla.model = angular.module('llaapp.services')._invokeQueue[0][2][1](); //This is how to find it in the current factory
console.log(lla.model);*/



</script>

<?php get_footer(); ?>


