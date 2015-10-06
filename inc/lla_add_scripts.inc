<?php
if ( ! defined( 'ABSPATH' ) ) exit;

/*
* Include flie into function which will ad the need scripts
*
*
*
*
 */


function lla_add_java_scripts(){
	
    $template_url = get_template_directory_uri();

	$components = $template_url . '/bower_components';
   
		
		
  	
  //jquery is automatically loaded as a dependency
  wp_enqueue_style('bootstrapcss', $components . '/bootstrap/dist/css/bootstrap.min.css');
  wp_enqueue_script('bootstrapjs', $components . '/bootstrap/dist/js/bootstrap.min.js', array('jquery'));
  
	
 /*
  *	For pruduction
  *
  * wp_register_script('underscorejs', '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min.js');
	wp_enqueue_script('angularjs', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-rc.4/angular.js', array('jquery'), '1.3.0', false);
	wp_enqueue_script('angular_routejs', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-rc.4/angular-route.min.js', array('angularjs'), '1.3.0', false);
	wp_enqueue_script('angular_resourcejs', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-rc.4/angular-resource.min.js',array('angularjs'), '1.3.0', false);
	wp_enqueue_script('restangularjs', 'http://cdnjs.cloudflare.com/ajax/libs/restangular/1.3.1/restangular.min.js', array('angularjs', 'underscorejs'),'1.3.1', false);
  */
	wp_deregister_script('jquery');
	wp_register_script('jquery', $components.'/jquery/dist/jquery.js');
	wp_enqueue_script('jquery');
	wp_enqueue_script('underscorejs', $components.'/underscore/underscore.js', array('jquery'));
	wp_enqueue_script('angularjs', $components.'/angular/angular.js', array('jquery') );
	wp_enqueue_script('nicescroll', $components.'/nicescroll/jquery.nicescroll.js', array('jquery') );
	wp_enqueue_script('angular_routejs', $components.'/angular-route/angular-route.js', array('angularjs'), null );
	wp_enqueue_script('angular-sanitize', $components.'/angular-sanitize/angular-sanitize.js', array('angularjs'), null );
	wp_enqueue_script('angular-ui-routejs', $components.'/angular-ui-router/release/angular-ui-router.js', array('angularjs'), null );
	wp_enqueue_script('angular_resourcejs', $components.'/angular-resource/angular-resource.js',array('angularjs'), null);
	wp_enqueue_script('angular_recaptcha', $components. '/angular-re-captcha/angular-re-captcha.js',array('angularjs'), null);
	wp_enqueue_script('restangularjs', $components .'/restangular/dist/restangular.js', array('angularjs', 'underscorejs'),null);
	wp_enqueue_script('waypoints', $components .'/waypoints/lib/jquery.waypoints.min.js', array('jquery'),null);
	wp_enqueue_style('lla_style', $template_url . '/lla_style.css', array(), null);
	wp_enqueue_style('aminmations', $template_url . '/css/animate.css/animate.css', array(), null);

    wp_enqueue_script('lla_app', $template_url .'/js/build/LifelineArts.min.js', array('jquery', 'angularjs'), '0.1.1', true);

/* 	Not currently Needed
 *  wp_enqueue_script('lla_services',  $template_url . '/js/lla_services.js');
 *
 * wp_enqueue_script('lla_app', $template_url . '/js/lla_app.js' );
 *
 */

 
 	 wp_enqueue_script('bootstrapjs');

    $localize = array(
         'ajaxurl' => admin_url( 'admin-ajax.php' ),
         'template' => $template_url,
         );

  wp_localize_script('lla_services', 'LLA', $localize);
}

add_action( 'wp_enqueue_scripts', 'lla_add_java_scripts' );

?>
