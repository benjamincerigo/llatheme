<?php

//if (isset( $_POST['nouce'] ) && wp_verify_nonce($_POST['nouce'], 'lla_angular' ) ){
require_once __DIR__ . '/classes/lla_term_object.php';
	$parent = isset($_POST['section']) ? $_POST['section']: 'gallery';	
	($parentTerm = get_term_by('name', $parent, 'lla_sections')) || ($parentTerm =get_term_by('slug', $parent, 'lla_sections'));
	$model = new lla_term_object($parentTerm);	
	http_reponse_code(200);
	$return = $model;
	die(json_encode($return));
/*} else {
	http_response_code(403);
	
		array_push($errors, array('name'=>'internal_prolem',
		 'message'=>	'Sorry, An error occured and your message could not be sent. Please try again.'));
	$return = array('error' => count($errors), 'errors' => $errors);
	die(json_encode($return));
}*
?>
