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

<div  class='main' ui-view ></div>
<script>
var lla ={};
angular.module('llaapp.inlineservices', ['ngRoute'])
.provider("InitialModel",  {
	 $get: function() {
		 	return{
		 		'InitialModel': <?php echo json_encode($modelSingleton =  lla\Model::getInstance() );?>
		 	}
		}
})
.provider('lla_wp', {
	t: '<?php echo get_template_directory_uri(); ?>',
	a: '<?php echo admin_url( 'admin-ajax.php' ); ?>',
	n: '<?php echo wp_create_nonce( 'lla_angular' ); ?>',
	$get: function(){
		return {
			'template_dir': this.t,
			'ajax': this.a,
			'nouce': this.n
		}
	}
});
lla.model = angular.module('llaapp.inlineservices')._invokeQueue[0][2][1].$get();
console.log(lla.model);
</script>
<?php get_footer(); ?>


