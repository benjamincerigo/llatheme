<?php

/*
*
*
* lla_mail.php process the contact form in Home
*
*	
*/

function lla_submit_mail_request(){


    if (isset( $_POST['lla_contact_nonce'] ) && wp_verify_nonce($_POST['lla_contact_nonce'], 'lla_contact_html' ) ){
        

        // Get the form fields and remove whitespace.
        $name = strip_tags(trim($_POST["lla_contact_name"]));
		$name = str_replace(array("\r","\n", "%0A", "%4O"),array(" "," ", " ", " "),$name);
        $email = filter_var(trim($_POST["lla_contact_email"]), FILTER_SANITIZE_EMAIL);
        $message = wp_kses_data(trim($_POST["lla_contact_message"]));
        $captcha = $_POST['lla_contact_captcha'];


        $errors = array();  // initialize empty error array

    
  
      if (strlen($name) < 3) {
        // name too short, add error
        $errors['name_error'] = 'Name is invaild';
      }

      if (strlen($email) == 0) {
        // no email address given
        $errors['email_error'] = 'Email address is required';
      } else if ( !filter_var($email, FILTER_VALIDATE_EMAIL) or !preg_match('/^(?:[\w\d]+\.?)+@(?:(?:[\w\d]\-?)+\.)+\w{2,4}$/i', $email)) {
        // invalid email format
        $errors['email_error'] = 'Email address entered is invalid';
      }

      if (strlen($message) < 20) {
        // message length too short
        $errors['message_error'] = 'Your message must be longer than 20 characters';
      }

    // Only try to validate the captcha if the form has no errors
    // This is especially important for ajax calls
    if (sizeof($errors) == 0) {
      require_once dirname(__FILE__) . '/securimage/securimage.php';
      $securimage = new Securimage();

      if ($securimage->check($captcha) == false) {
        //Wrong code Error added
        $errors['captcha_error'] = 'Incorrect validate code entered';
      }
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
                     . "Name: $name<br />"
                     . "Email: $email<br />"
                     . "Message:<br />"
                     . "<pre>$message</pre>"
                     . "<br /><br />IP Address: {$_SERVER['REMOTE_ADDR']}<br />"
                     . "Time: $time<br />"
                     . "Browser: {$_SERVER['HTTP_USER_AGENT']}<br />";
        // Build the email headers.
        $email_headers = "From: $name <$email> \r\nReply-To: {$email}\r\nContent-type: text/html; charset=ISO-8859-1\r\nMIME-Version: 1.0";

        // Send the email.
        if (mail($recipient, $subject, $email_content, $email_headers)) {
            // Set a 200 (okay) response code.
            http_response_code(200);
            $return = array('error' => 0, 'message' => 'Your Message was sent. Thankyou, we will reply shortly.');
            die(json_encode($return));
        } else {
            // Set a 500 (internal server error) response code.
            http_response_code(500);
            $errmsg = 'Sorry there was a problem with sending your message. Please try again.';
            $return = array('error' => 1, 'message' => $errmsg);
            die(json_encode($return));
        }
    } else {

            //Errors found
            $errmsg = '';
            foreach($errors as $key => $error) {
                // set up error messages to display with each field
                $errmsg .= " - {$error}\n";
            }
            //Bad$return request
             http_response_code(400);
            $return = array('error' => 1, 'message' => $errmsg);
            die(json_encode($return));
        }
    }
    else
    {
        // Not a POST request, set a 403 (forbidden) response code.
        http_response_code(403);
        $errmsg = 'Sorry, An error occured and your message could not be sent. Please try again.';
        $return = array('error' => 1, 'message' => $errmsg);
        die(json_encode($return));
    }
    

}

// Add the function to the action hooks of the ajax action lla_simple_contact_form
add_action( 'wp_ajax_lla_simple_contact_form', 'lla_submit_mail_request' );
add_action( 'wp_ajax_nopriv_lla_simple_contact_form', 'lla_submit_mail_request' );

function lla_mail_recaptcha(){
	if (isset( $_POST['nouce'] ) && wp_verify_nonce($_POST['nouce'], 'lla_angular' ) ){
		$errors = array();
		$name = strip_tags(trim($_POST["lla_contact_name"]));
		$name = str_replace(array("\r","\n", "%0A", "%4O"),array(" "," ", " ", " "),$name);
		$email = filter_var(trim($_POST["lla_contact_email"]), FILTER_SANITIZE_EMAIL);
		$message = wp_kses_data(trim($_POST["lla_contact_message"]));
		$toCap = lla_doReCaptcha();
		$reCaptcha = lla_getReCaptcha();
		if ( $toCap &&  $_POST["g-recaptcha-response"]) {
			$resp = $reCaptcha->verifyResponse(
        $_SERVER["REMOTE_ADDR"],
					$_POST["g-recaptcha-response"]
			);
		}
		if($toCap && !$resp->success){
			$r = array('error' => 2, 'message'=> 'You did not give you right value you the Captcha'); 
			die(json_encode($r));
		}
		if (strlen($name) < 3) {
			// name too short, add error
			$errors['name_error'] = 'Name is invaild';
		}
		if (strlen($email) == 0) {
			// no email address given
			$errors['email_error'] = 'Email address is required';
		} else if ( !filter_var($email, FILTER_VALIDATE_EMAIL) or !preg_match('/^(?:[\w\d]+\.?)+@(?:(?:[\w\d]\-?)+\.)+\w{2,4}$/i', $email)) {
			// invalid email format
			$errors['email_error'] = 'Email address entered is invalid';
		}
		if (strlen($message) < 20) {
			// message length too short
			$errors['message_error'] = 'Your message must be longer than 20 characters';
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
			if (mail($recipient, $subject, $email_content, $email_headers)) {
				// Set a 200 (okay) response code.
				http_response_code(200);
				$return = array('error' => 0, 'message' => 'Your Message was sent. Thankyou, we will reply shortly.');
				die(json_encode($return));
			} else {
				// Set a 500 (internal server error) response code.
				http_response_code(500);
				$errmsg = 'Sorry there was a problem with sending your message. Please try again.';
				$return = array('error' => 1, 'message' => $errmsg);
				die(json_encode($return));
			}
		} else {
				//Errors found
				$errmsg = '';
				foreach($errors as $key => $error) {
						// set up error messages to display with each field
						$errmsg .= " - {$error} ";
				}
				//Bad$return request
				 http_response_code(400);
				$return = array('error' => 1, 'message' => $errmsg);
				die(json_encode($return));
		}
	} else {
		http_response_code(403);
		$errmsg = 'Sorry, An error occured and your message could not be sent. Please try again.';
		$return = array('error' => 1, 'message' => $errmsg);
		die($return);
	}
}


add_action( 'wp_ajax_lla_simple_mail', 'lla_mail_recaptcha' );
add_action( 'wp_ajax_nopriv_lla_simple_mail', 'lla_mail_recaptcha' );

?>
