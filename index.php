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


$section = new lla\lla_sections_object('home_page');
print_r($model = lla\Model::getInstance());

?>




<script>
/*angular.module('llaApp.services', ['ngRoute'])
.factory("model", function() {
	model = [];
    return model;
})
.factory("page", function(model) {
	model
    return model;
})*/

<?php get_footer(); ?>


