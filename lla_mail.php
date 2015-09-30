<?php
if ( ! defined( 'ABSPATH' ) ) exit;
/*
*
*
* lla_mail.php process the contact form in Home
*
*	
*/

function lla_mail_recaptcha(){
	$errors = array();
	if (isset( $_POST['nouce'] ) && wp_verify_nonce($_POST['nouce'], 'lla_angular' ) ){
		$name = strip_tags(trim($_POST["lla_contact_name"]));
		$name = str_replace(array("\r","\n", "%0A", "%4O"),array(" "," ", " ", " "),$name);
		$email = filter_var(trim($_POST["lla_contact_email"]), FILTER_SANITIZE_EMAIL);
		$message = wp_kses_data(trim($_POST["lla_contact_message"]));
		$toCap = lla_doReCaptcha();
		$privatekey = lla_getReCaptcha();
		if ( $toCap &&  isset($_POST["g-recaptcha-response"]) && isset($_POST["g-recaptcha-response"]['challenge']) && isset($_POST["g-recaptcha-response"]['response']) ) {
			$recap = $_POST["g-recaptcha-response"];

			$resp = recaptcha_check_answer ($privatekey,
                                        $_SERVER["REMOTE_ADDR"],
                                        $recap["challenge"],
                                        $recap["response"]);
		}
        if ($toCap && (!isset( $resp ) || !$resp->is_valid)) {
			$e = (isset($resp)) ? $resp->error : 'not exist';
			array_push($errors, array('name'=>'captcha_error',
			'message'=> 'You did not give the right value for the Captcha', 'rep'=> $e)); 
		}
		if (strlen($name) < 3) {
			// name too short, add error
			array_push($errors, array('name'=>'name_error',
			 'message'=>	'Sorry your name is not ok.'));
		}
		if (strlen($email) == 0) {
			// no email address given
			array_push($errors, array('name'=>'email_error',
			 'message'=>	'You have not given a vaild email'));
		} else if ( !filter_var($email, FILTER_VALIDATE_EMAIL) or !preg_match('/^(?:[\w\d]+\.?)+@(?:(?:[\w\d]\-?)+\.)+\w{2,4}$/i', $email)) {
			// invalid email format
			array_push($errors, array('name'=>'email_error',
			 'message'=>	'You have not given a vaild email'));
		}
		if (strlen($message) < 20) {
			// message length too short
			array_push($errors, array('name'=>'message_error',
			 'message'=>	'Your message is a bit short, it must be longer than 20 characters'));
		}
		if (sizeof($errors) == 0) {
			// No errors write
			// Set the recipient email address.
			$recipient = get_option('admin_email');
			// Set the email subject.
			$subject = "$name contacted lifeline Arts!";
			// Build the email content.  
			$time       = date('r');
			$email_content = "A message was submitted from the contact form.  The following information was provided.<br /><br />"
									 . "Email: $email<br />"
									 . "Message:<br />"
									 . "<pre>$message</pre>"
									 . "<br /><br />IP Address: {$_SERVER['REMOTE_ADDR']}<br />"
									 . "Time: $time<br />"
									 . "Browser: {$_SERVER['HTTP_USER_AGENT']}<br />";
			// Build the email headers.
			$email_headers = "From: $name <$email> \r\nReply-To: {$email}\r\nContent-type: text/html; charset=ISO-8859-1\r\nMIME-Version: 1.0";
			// Send the email.
			if (wp_mail($recipient, $subject, $email_content, $email_headers)) {
				// Set a 200 (okay) response code.
				http_response_code(200);
				$return = array('error' => 0, 'message' => 'Your Message was sent. Thankyou, we will reply shortly.');
				die(json_encode($return));
			} else {
				// Set a 500 (internal server error) response code.
				http_response_code(500);
				array_push($errors, array('name'=>'internal_prolem',
			 'message'=>	'Sorry, An error occured and your message could not be sent. Please try again.'));
				$return = array('error' => count($errors), 'errors' => $errors);
				die(json_encode($return));
			}
		} else {
				//Errors found
				//Bad$return request
			 http_response_code(400);
			$return = array('error' => count($errors), 'errors' => $errors);
				die(json_encode($return));
		}
	} else {
		http_response_code(403);
		
			array_push($errors, array('name'=>'internal_prolem',
			 'message'=>	'Sorry, An error occured and your message could not be sent. Please try again.'));
		$return = array('error' => count($errors), 'errors' => $errors);
		die(json_encode($return));
	}
}


add_action( 'wp_ajax_lla_simple_mail', 'lla_mail_recaptcha' );
add_action( 'wp_ajax_nopriv_lla_simple_mail', 'lla_mail_recaptcha' );

function lla_get_gallery(){
	if (isset( $_POST['nouce'] ) && wp_verify_nonce($_POST['nouce'], 'lla_angular' ) ){
		require_once __DIR__ . '/classes/lla_term_object.php';
		$parent = isset($_POST['section']) ? $_POST['section']: 'gallery';	
		($parentTerm = get_term_by('name', sanitize_text_field( $parent ), 'lla_sections')) || ($parentTerm =get_term_by('slug', sanitize_text_field( $parent ), 'lla_sections'));
		$model = new \lifelinearts\lla_term_object($parentTerm, true);	
		http_response_code(200);
		$return = $model;
		die(json_encode($return));
	} else {
		http_response_code(403);
		
			array_push($errors, array('name'=>'internal_prolem',
			 'message'=>	'Sorry, An error occured and your message could not be sent. Please try again.'));
		$return = array('error' => count($errors), 'errors' => $errors);
		die(json_encode($return));
	}

}	
add_action( 'wp_ajax_lla_get_gallery', 'lla_get_gallery' );
add_action( 'wp_ajax_nopriv_lla_get_gallery', 'lla_get_gallery' );
?>
