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

<div ui-view></div>


<script>
var lla ={};

angular.module('llaapp.services', ['ngRoute'])
.factory("InitalModel", function() {
	var InitiaModel =  <?php echo json_encode($modelSingleton =  lla\Model::getInstance() );?>;
    return InitiaModel;
});

lla.model = angular.module('llaapp.services')._invokeQueue[0][2][1](); //This is how to find it in the current factory
console.log(lla.model);



</script>

<?php get_footer(); ?>


