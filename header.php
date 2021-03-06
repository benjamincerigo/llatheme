<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/**
 * The Header for lla theme.
 *
 * Displays all of the <head> section and everything up till <div id="main_containter">
 *
 * @package lifelinearts
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> ng-app='llaapp'>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, user-scalable=no">
<title><?php wp_title( '|', true, 'right' ); ?></title>
<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="icon" href="/wp-content/themes/lla/img/Lifelinearts.ico" type="image/x-icon"/>
<link rel="shortcut icon" href="/wp-content/themes/lla/img/Lifelinearts.ico" type="image/x-icon"/>

<!--Bootstrap css Must be first
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
<!--Custom Css -->
<link href='https://fonts.googleapis.com/css?family=Muli:400,300' rel='stylesheet' type='text/css'>
<link rel="stylesheet" href="<?php echo get_stylesheet_uri(); ?>" type="text/css" media="screen" />
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />








<?php wp_head(); ?>
</head>
<body scrollable='x' <?php body_class( 'homewidth' ); ?>>
	<div  id="container">
