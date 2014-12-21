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




<script>
var lla ={};

lla.model = <?php echo json_encode($modelSingleton =  lla\Model::getInstance() );?>;
console.log(lla.model);



</script>

<?php get_footer(); ?>


