<?php
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


$section = new lla_sections_object('home_page');
print_r($section->array_of_sections);

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


