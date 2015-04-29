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
$sense = new lla\lla_sections_object('sense', false);

?>

<div  class='main animated fadeIn' ui-view ></div>
<div class='line animated fadeIn'>
	<img src='<?php echo get_template_directory_uri() . "/img/LLA_LineFull4000_2.jpg"; ?>'
</div>
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
	r: '<?php echo lla_getSiteKey(); ?>',
	b: '<?php echo  get_bloginfo('name'); ?>',
	s: <?php echo  json_encode($sense->page); ?>,
	$get: function(){
		return {
			'template_dir': this.t,
			'ajax': this.a,
			'nouce': this.n,
			'recaptchakey': this.r,
			'blog_title': this.b,
			'sense': this.s,
		}
	}
});
lla.model = angular.module('llaapp.inlineservices')._invokeQueue[0][2][1].$get();
console.log(lla.model);
</script>
<?php get_footer(); ?>


