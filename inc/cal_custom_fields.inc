<?php 
/*
*
*cal_custom_field is include in the functions file
*
*It set up the custom fields for the calender, lla_calender, post types. 
*
*           Currently Added

*       - Event Date,  ($prefix_date) - This uses the jquery ui to have a date picker.  
*       - Start Time, ($prefix_start_time) - Small text box
*       - End Time, ($prefix_end_time) - small Text box
*       - Addres, ($prefic_address) - Large Box
*/
function lla_admin_init() {
if(is_admin()) {
    wp_enqueue_script('jquery-ui-datepicker');
    wp_enqueue_style('jquery-ui-custom', get_template_directory_uri().'/css/jquery-ui.min.css');
    
}
}

add_action( 'admin_init', 'lla_admin_init' );

$cal_meta = array(
    'id' => 'lla_cal_meta_box',
    'title' => 'Calender Custom Fields',
    'page' => 'lla_calender',
    'context' => 'normal',
    'priority' => 'high',
    'fields' => array(
        array(
            'name' => 'Event Date',
            'desc' => 'Date of the event',
            'id' => $prefix . '_date',
            'type' => 'date',
        ),
        array(
            'name' => 'Start Time',
            'desc' => 'Should be in 24hour format hh:mm',
            'id' => $prefix . '_start_time',
            'type' => 'text',
        ),
        array(
            'name' => 'End Time',
            'desc' => 'Should be in 24 hour format hh:mm',
            'id' => $prefix . '_end_time',
            'type' => 'text',
        ),
        array(
            'name' => 'Where',
            'desc' => 'Adress of the event',
            'id' => $prefix . '_address',
            'type' => 'textarea',
        ),
        array(
            'name' => 'Part Slug',
            'desc' => 'Slug of the event',
            'id' => $prefix . '_part_slug',
            'type' => 'text',
		),
        array(
            'name' => 'Short Description',
            'desc' => 'Shot descibtion that will be shown',
            'id' => $prefix . '_event_desc',
            'type' => 'textarea',
        ),
    )
);

add_action('admin_menu', 'lla_cal_box');

// Add meta box
function lla_cal_box() {
    global $cal_meta;

    add_meta_box($cal_meta['id'], $cal_meta['title'], 'lla_cal_add_box', $cal_meta['page'], $cal_meta['context'], $cal_meta['priority']);
}



// Callback function to show fields in meta box
function lla_cal_add_box() {
    global $cal_meta, $post;

    // Use nonce for verification
    echo '<input type="hidden" name="lla_meta_box_nonce" value="', wp_create_nonce(basename(__FILE__)), '" />';

    echo '<table class="form-table">';

    foreach ($cal_meta['fields'] as $field) {
        // get current post meta data
        $meta = get_post_meta($post->ID, $field['id'], true);

        echo '<tr>',
                '<th style="width:20%"><label for="', $field['id'], '">', $field['name'], '</label></th>',
                '<td>';

        switch ($field['type']) {
            // date
            case 'date':
                echo '<input type="text" class="datepicker" name="'.$field['id'].'" id="'.$field['id'].'" value="'.$meta.'" size="30" />
                        <br /><span class="description">'.$field['desc'].'</span>';
            break;
            //text
            case 'text':
                    echo '<input type="text" name="'.$field['id'].'" id="'.$field['id'].'" value="'.$meta.'" size="30" />
                    <br /><span class="description">'.$field['desc'].'</span>';
                break;

            // textarea
            case 'textarea':
                echo '<textarea name="'.$field['id'].'" id="'.$field['id'].'" cols="60" rows="4">'.$meta.'</textarea>
                    <br /><span class="description">'.$field['desc'].'</span>';
            break;
        }
               
        echo     '</td><td>',
            '</td></tr>';
    }

    echo '</table>';
}


add_action('save_post', 'lla_cal_save_data');

// Save data from meta box
function lla_cal_save_data($post_id) {
    global $cal_meta;

    // verify nonce
    if (!wp_verify_nonce($_POST['lla_meta_box_nonce'], basename(__FILE__))) {
        return $post_id;
    }

    // check autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return $post_id;
    }

    // check permissions
    if ('page' == $_POST['post_type']) {
        if (!current_user_can('edit_page', $post_id)) {
            return $post_id;
        }
    } elseif (!current_user_can('edit_post', $post_id)) {
        return $post_id;
    }

    foreach ($cal_meta['fields'] as $field) {
       
               $old = get_post_meta($post_id, $field['id'], true);
            $new = sanitize_text_field($_POST[$field['id']]);
     

            if ($new && $new != $old) {
                update_post_meta($post_id, $field['id'], $new);
            } elseif ('' == $new && $old) {
                delete_post_meta($post_id, $field['id'], $old);
            }

    
    }
}

//Add the custom sprtics to the admin head
add_action('admin_head','add_custom_scripts');
function add_custom_scripts() {
    global $cal_meta, $post;
     
    $output = '<script type="text/javascript">
                jQuery(function() {jQuery(".datepicker").datepicker({ dateFormat: "yy-mm-dd" });';
                 
    foreach ($cal_meta['fields'] as $field) { // loop through the fields looking for certain types
        if($field['type'] == 'date')
            $output .= 'jQuery(".datepicker").datepicker({ dateFormat: "yy-mm-dd" });';
    }
     
    $output .= '});
        </script>';
         
    echo $output;
}
?>
