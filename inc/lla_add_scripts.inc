<?php

/*
* Include flie into function which will ad the need scripts
*
*
*
*
*/


function lla_add_java_scripts(){
	
    $template_url = get_template_directory_uri();


   
		
		
  	
  //jquery is automatically loaded as a dependency
  wp_enqueue_style('bootstrapcss', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css');
  wp_register_script('bootstrapjs', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js', array('jquery'));
  
	
  wp_register_script('angular_routejs', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-rc.4/angular-route.min.js', '1.3.0');
  wp_register_script('angular_resourcejs', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-rc.4/angular-resource.min.js', '1.3.0');
  wp_register_script('restangularjs', 'http://cdnjs.cloudflare.com/ajax/libs/restangular/1.3.1/restangular.min.js', '1.3.1');
  wp_register_script('angularjs', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-rc.4/angular.min.js', array('jquery'), '1.3.0');



  wp_register_script('lla_services',  $template_url . '/js/lla_services.js');
 // wp_register_script('lla_app', $template_url . 'js/lla_app.js');
  wp_enqueue_script('angularjs', $template_url . 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-rc.4/angular.min.js');
  wp_enqueue_script('lla_app', $template_url . '/js/lla_app.js', array('angularjs', 'angular_routejs', 'angular_resourcejs', 'restangularjs'));

 
  wp_enqueue_script('bootstrapjs');

    $localize = array(
         'ajaxurl' => admin_url( 'admin-ajax.php' ),
         'template' => $template_url,
         );

  wp_localize_script('lla_services', 'LLA', $localize);
}

add_action( 'wp_enqueue_scripts', 'lla_add_java_scripts' );
