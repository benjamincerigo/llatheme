
<?php
require_once __DIR__ . "/classes/recaptcha/php/recaptchalib.php";
ini_set('display_errors', 'On');
error_reporting(E_ALL | E_STRICT);
/**
 * lifelinearts functions and definitions
 *
 * @package lifelinearts
 */

$prefix = 'lla';

add_theme_support( 'post-thumbnails' ); 

if(!function_exists('_log')){
  function _log( $message ) {
    if( WP_DEBUG === true ){
      if( is_array( $message ) || is_object( $message ) ){
        error_log( print_r( $message, true ) );
      } else {
        error_log( $message );
      }
    }
  }
}

//Script to add
add_action('wp_head', 'session_start');
//Addition of Scripts. 

include('inc/lla_add_scripts.inc');
/**
*Include Classes
*
*
*
*/
include('classes/lla_sections_object.php');
include('classes/lla_term_object.php');
include('classes/Model.php');


/* -------------------- File for the Contact form and mail. -------------- */

function lla_getReCaptcha(){
	// Register API keys at https://www.google.com/recaptcha/admin
	$secret = "6LdTMgMTAAAAAA2KVZjsYG-09SN9ER1IeGH-3AeB";
	// reCAPTCHA supported 40+ languages listed here: https://developers.google.com/recaptcha/docs/language
	$lang = "en";
	// The response from reCAPTCHA
	$resp = null;
	// The error code from reCAPTCHA, if any
	$error = null;
	$reCaptcha = new ReCaptcha($secret);
	return $reCapatch;
}
function lla_getSiteKey(){
	$sitekey = '6LdTMgMTAAAAAKSmTiiU9Q1xJ26U_PyfYFzzIIBH';
	return $sitekey;
}
include('lla_mail.php');
/*
*  Create Custom Post types:
*
* 	- lla_home_content - Home Content
* 	- lla_calender
*
*
*/

function create_custom_post_types() {


	//Add home Content Post Type. 
	register_post_type( 'lla_home_content', array(

		//Labels
		 'labels' => array(
			    'name'               => _x( 'Home Content', 'post type general name' ),
			    'singular_name'      => _x( 'Home Content', 'post type singular name' ),
			    'add_new'            => _x( 'Add New', 'book' ),
			    'add_new_item'       => __( 'Add New Home Content' ),
			    'edit_item'          => __( 'Edit Home Content' ),
			    'new_item'           => __( 'New Home Content' ),
			    'all_items'          => __( 'All Home Content' ),
			    'view_item'          => __( 'View Home Content' ),
			    'search_items'       => __( 'Search Home Content' ),
			    'not_found'          => __( 'No home content found' ),
			    'not_found_in_trash' => __( 'No home content found in the Trash' ), 
			    'parent_item_colon'  => '',
			    'menu_name'          => __('Home Content'),
			    ),
	    'description'   => 'Hold the data for the content that goes on the home page',
	    'public'        => true,
	    'menu_position' => 5,
	    'supports'      => array( 'title', 'editor', 'thumbnail'),
	    'has_archive'   => true,
	    'exclude_from_search' => false,
	    'taxonomies' => 'lla_sections',
	   
	 )
	);
	//End of Home Content restersiation


	//Add the calender post type
	register_post_type( 'lla_calender', array(

		//Labels
		 'labels' => array(
			    'name'               => _x( 'Calender', 'post type general name' ),
			    'singular_name'      => _x( 'Calender', 'post type singular name' ),
			    'add_new'            => _x( 'Add New', 'book' ),
			    'add_new_item'       => __( 'Add New Calender' ),
			    'edit_item'          => __( 'Edit Calender' ),
			    'new_item'           => __( 'New Calender' ),
			    'all_items'          => __( 'All Calender' ),
			    'view_item'          => __( 'View Calender' ),
			    'search_items'       => __( 'Search Calender' ),
			    'not_found'          => __( 'No Calender found' ),
			    'not_found_in_trash' => __( 'No Calender found in the Trash' ), 
			    'parent_item_colon'  => '',
			    'menu_name'          => __('Calender'),
			    ),
	    'description'   => 'Calender posts for the paender section',
	    'public'        => true,
	    'menu_position' => 5,
	    'supports'      => array( 'title', 'editor', 'thumbnail'),
	    'has_archive'   => true,
	    'exclude_from_search' => false,
	    'taxonomies' => 'lla_sections',
	   
	 )
	);
	//End of Calender post type

	//Add Contact Post Type. 
	register_post_type( 'lla_contact', array(

		//Labels
		 'labels' => array(
			    'name'               => _x( 'Contact', 'post type general name' ),
			    'singular_name'      => _x( 'Contact', 'post type singular name' ),
			    'add_new'            => _x( 'Add New', 'book' ),
			    'add_new_item'       => __( 'Add New Contact' ),
			    'edit_item'          => __( 'Edit Contact' ),
			    'new_item'           => __( 'New Contact' ),
			    'all_items'          => __( 'All Contact' ),
			    'view_item'          => __( 'View Contact' ),
			    'search_items'       => __( 'Search Contact' ),
			    'not_found'          => __( 'No Contact found' ),
			    'not_found_in_trash' => __( 'No Contact found in the Trash' ), 
			    'parent_item_colon'  => '',
			    'menu_name'          => __('Contact Info'),
			    ),
	    'description'   => 'Hold the data for the content that goes on the home page',
	    'public'        => true,
	    'menu_position' => 5,
	    'supports'      => array( 'title', 'editor'),
	    'has_archive'   => true,
	    'exclude_from_search' => false,
	    'taxonomies' => 'lla_sections',
	   
	 )
	);
	//End of Home Content restersiation

	


}

add_action( 'init', 'create_custom_post_types', 0);

//End of Custom Post Types init




/*
*  Create Custom taxonomies:
*
* - lla_sections - Home Setions
*
*
*/

function add_custom_taxonomies() {

	// Add new "Home Sections" taxonomy to Posts

	register_taxonomy('lla_sections', 
		array('lla_home_content', 'lla_calender'),
		array(

		    // Hierarchical taxonomy (like categories)
	    	'hierarchical' => true,
	    // This array of options controls the labels displayed in the WordPress Admin UI
	    'labels' => array(
	      'name' => _x( 'Sections', 'taxonomy general name' ),
	      'singular_name' => _x( 'Sections', 'taxonomy singular name' ),
	      'search_items' =>  __( 'Search Sections' ),
	      'all_items' => __( 'All Sections' ),
	      'parent_item' => __( 'Parent Section' ),
	      'parent_item_colon' => __( 'Parent Section:' ),
	      'edit_item' => __( 'Edit Sections' ),
	      'update_item' => __( 'Update Section' ),
	      'add_new_item' => __( 'Add New Section' ),
	      'new_item_name' => __( 'New Section Name' ),
	      'menu_name' => __( 'Sections' ),
	    ),
	    // Control the slugs used for this taxonomy
	    'rewrite' => array(
	      'slug' => 'sections', // This controls the base slug that will display before each term
	      'with_front' => false, // Don't display the category base before "/home_sections/"
	      'hierarchical' => true // This will allow URL's like "/home_sections/about"
	    ),
	  )
	);
}
add_action( 'init', 'add_custom_taxonomies');



/*
* Add Custom_flied to Taxinomy
*
*
*
*/
function lla_sections_taxonomy_custom_fields($tag) {  
   // Check for existing taxonomy meta for the term you're editing  
    $t_id = $tag->term_id; // Get the ID of the term you're editing  
    $term_meta = get_option( "taxonomy_term_$t_id" ); // Do the check  
?>  
  
<tr class="form-field">  
    <th scope="row" valign="top">  
        <label for="section_id"><?php _e('Order'); ?></label>  
    </th>  
    <td>  
        <input type="text" name="term_meta[section_id]" id="term_meta[section_id]" size="25" style="width:60%;" value="<?php echo $term_meta['section_id'] ? $term_meta['section_id'] : ''; ?>"><br />  
        <span class="description"><?php _e('The Sections\'s ID Used to Order the sections'); ?></span>  
    </td>  
</tr>  
  
<?php  
}  


    // A callback function to save our extra taxonomy field(s)  
 function save_taxonomy_custom_fields( $term_id ) {  
        if ( isset( $_POST['term_meta'] ) ) {  
            $t_id = $term_id;  
            $term_meta = get_option( "taxonomy_term_$t_id" );  
            $cat_keys = array_keys( $_POST['term_meta'] );  
                foreach ( $cat_keys as $key ){  
                if ( isset( $_POST['term_meta'][$key] ) ){  
                    $term_meta[$key] = $_POST['term_meta'][$key];  
                }  
            }  
            //save the option array  
            update_option( "taxonomy_term_$t_id", $term_meta );  
        }  
    }  

        // Add the fields to the "presenters" taxonomy, using our callback function  
    add_action( 'lla_sections_edit_form_fields', 'lla_sections_taxonomy_custom_fields', 10, 2 );
    // Save the changes made on the "presenters" taxonomy, using our callback function  
add_action( 'edited_lla_sections', 'save_taxonomy_custom_fields', 10, 2 ); 






/*
*
*
*
*  Add meata box to Custom post types
*
*
*
*/
include('inc/hc_custom_fields.inc');
include('inc/cal_custom_fields.inc');
include('inc/con_custom_fields.inc');


/* --------------- Extra function for sorting lla_sections ------- */

//sort array by the given order
function sort_terms_by_section_id($a, $b){
	$a_option = get_option("taxonomy_term_$a->term_id");
	$b_option = get_option("taxonomy_term_$b->term_id");
	if($a_option['section_id'] == $b_option['section_id']){return 0;}
	return ($a_option['section_id'] < $b_option['section_id']) ? -1 : 1;


}

/* ---------------------- CSS Rework ------------------------- */
$lla_css_args = array(
	'default-color' => 'beb4b0',
	'default-image' => '%1$s/img/BrownOp.jpg',
);
add_theme_support('custom-background', $lla_css_args );

