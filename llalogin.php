<?php
add_action ('wp_authenticate' , 'lla_custom_authenticate_country' );
function  lla_custom_authenticate_country($username) {
    if( !lla_counttest()){
        $email_headers = "From:LLA ERROR <morag@lifelinearts.co.uk> \r\nReply-To: non\r\nContent-type: text/html; charset=ISO-8859-1\r\nMIME-Version: 1.0";
        wp_mail('benjamin.cerigo@gmail.com', 'LLA Too any attempts', 'There are too many email attempts', $email_headers);
        //status_header( 404 );
        //include __DIR__ . '/404.php';
        die();
    }
    $allowed = array( 'nl', 'gb');
    $allowedIp = array( '192.168.33.1', '84.241.193.112');
    $monitor_array = array();
    $ip = lla_getClientIP( $monitor_array );
    if( $username != false ){
        lla_addcount( $username , $ip);
    }
    if( in_array($ip,$allowedIp )){
     //   error_log( print_r( $monitor_array , true ));
        return;
    }
    if (strlen($ip) !== 2) {
        // This means that the ip is a country code.
        // Well it should mean that.
        $url = "http://api.wipmania.com/" . $ip;
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        $received_content = curl_exec($ch);
        $monitor_array['urlReturn'] = $received_content;
        if ($received_content === false) {
            $mesage = 'The Curl of IP geo did not work: ';
            $a = array();
            $a['recived']=$received_content;
            $a['getinfo']=curl_getinfo( $ch );
            $a['error']=curl_error( $ch );
            $monitor_array['error'] =curl_error( $ch );
            $countryFound = 'xx';
        }
        if (strlen($received_content) === 2) {
            $countryFound = strtolower($received_content);
        } else {
            $countryFound = 'xx';
        }
    //    error_log( print_r( $monitor_array , true ));
        if (in_array( $countryFound,  $allowed) ) {
            // This means that it is not found so dont use dutch
            return;
        } 
    } 
    //error_log( print_r( $monitor_array , true ));
    //status_header( 404 );
    //include __DIR__ . '/404.php';
    die();
}
function lla_counttest(){
    global $wpdb;
    $result = $wpdb->get_results( "select count(id) from lla_logincount where added > date_sub(current_timestamp, interval 10 minute )" );
    if( !isset($result[0]) ){
        return false;
    }
    $c = $result[0];
    if( !isset($c->{'count(id)'}) || $c->{'count(id)'} > 5 ){
        return false;
    }
    return true;
}
function lla_addcount( $username , $ip){
    global $wpdb;
    $user = sanitize_user( $username, $strict = true );
    $ip = sanitize_text_field( $ip );
    $user_agent = sanitize_text_field( $_SERVER['HTTP_USER_AGENT'] );
    $referrer = sanitize_text_field( $_SERVER['HTTP_USER_AGENT']  );
    $data = array( 'username'=>$user, 'ip'=>$ip, 'referrer'=>$referrer, 'user_agent'=>$user_agent );
    $wpdb->insert( 'lla_logincount', $data);
}

function lla_getClientIP(&$debug_array = array()) {
    $debug_array['server'] = array();
    if (array_key_exists('HTTP_X_FORWARDED_FOR', $_SERVER)) {
        $debug_array['from'] = 'HTTP_X_FORWARDED_FOR';
        $debug_array['server']['HTTP_X_FORWARDED_FOR'] = $_SERVER['HTTP_X_FORWARDED_FOR'];
        $IParray = array_values(array_filter(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])));
        return end($IParray);
    } else if (array_key_exists('REMOTE_ADDR', $_SERVER)) {
        $debug_array['server']['REMOTE_ADDR'] = $_SERVER['REMOTE_ADDR'];
        $debug_array['from'] = 'REMOTE_ADDR';
        return $_SERVER["REMOTE_ADDR"];
    } else if (array_key_exists('HTTP_CLIENT_IP', $_SERVER)) {
        $debug_array['server']['HTTP_CLIENT_IP'] = $_SERVER['HTTP_CLIENT_IP'];
        $debug_array['from'] = 'HTTP_CLIENT_IP';
        return $_SERVER["HTTP_CLIENT_IP"];
    }
    return 'xx';
}

add_action('after_switch_theme', 'lla_theme_activation_function_countlogin');

function lla_theme_activation_function_countlogin(){
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();
    $sql = "DROP TABLE lla_logincount;
       CREATE TABLE lla_logincount(
      id mediumint(9) NOT NULL AUTO_INCREMENT,
      added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ip text NOT NULL,
      username text NOT NULL,
      referrer text NOT NULL,
      user_agent text NOT NULL,
      UNIQUE KEY id (id)
    ) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql );
}
add_action('wp_login', 'lla_login_notify', 10, 2);
function lla_login_notify( $user_login, $user ){
    $time = time();
    $email_content = "LOG IN OF USER<br /><br />"
                         . "ID: {$user->ID}<br />"
                         . "firstname: {$user->first_name}<br />"
                         . "lastname: {$user->last_name}<br />"
                         . "Time: $time<br />";
    $email_headers = "From:LLA ERROR <morag@lifelinearts.co.uk> \r\nReply-To: non\r\nContent-type: text/html; charset=ISO-8859-1\r\nMIME-Version: 1.0";
    error_log( 'LOGGED IN USER: '. $user->ID );
    if(!wp_mail('benjamin.cerigo@gmail.com', 'LLA Login', $email_headers, $email_headers)){
        //error_log( 'unsuccessful email');
    }
}
?>
