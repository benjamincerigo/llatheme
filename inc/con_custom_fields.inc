<?php 
/*
*
*con_custom_field is include in the functions file
*
*It set up the custom fields for the Contacts, lla_contact, post types. 
*
*           Currently Added

*       - Email - ($prefic_contact_email) - Email address to be contact 
*       - Telephont - ($prefix_contact_tel) - Tele phone to be contacted on
*       - Address - ($predix_contact_address) - addres to be contact on
*       
*/

$con_meta = array(
    'id' => 'lla_con_meta_box',
    'title' => 'Calender Custom Fields',
    'page' => 'lla_contact',
    'context' => 'normal',
    'priority' => 'high',
    'fields' => array(
        array(
            'name' => 'Email',
            'desc' => 'Email Addres you wanted to me contacted on',
            'id' => $prefix . '_contact_email',
            'type' => 'text',
        ),
        array(
            'name' => 'Telephone',
            'desc' => 'Telephone to be contacted on',
            'id' => $prefix . '_contact_tel',
            'type' => 'text',
        ),
        array(
            'name' => 'Address',
            'desc' => 'Address to be contacted on',
            'id' => $prefix . '_contact_address',
            'type' => 'textarea',
        ),
        array(
            'name' => 'Part Slug',
            'desc' => 'Slug of the event',
            'id' => $prefix . '_part_slug',
            'type' => 'text',
        ),

        
        
    )
);

add_action('admin_menu', 'lla_con_box');

// Add meta box
function lla_con_box() {
    global $con_meta;

    add_meta_box($con_meta['id'], $con_meta['title'], 'lla_con_add_box', $con_meta['page'], $con_meta['context'], $con_meta['priority']);
}



// Callback function to show fields in meta box
function lla_con_add_box() {
    global $con_meta, $post;

    // Use nonce for verification
    echo '<input type="hidden" name="lla_con_meta_box_nonce" value="', wp_create_nonce(basename(__FILE__)), '" />';

    echo '<table class="form-table">';

    foreach ($con_meta['fields'] as $field) {
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


add_action('save_post', 'lla_con_save_data');

// Save data from meta box
function lla_con_save_data($post_id) {
    global $con_meta;

    // verify nonce
    if (!isset($_POST['lla_con_meta_box_nonce']) ||  !wp_verify_nonce($_POST['lla_con_meta_box_nonce'], basename(__FILE__))) {
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

    foreach ($con_meta['fields'] as $field) {
       
               $old = get_post_meta($post_id, $field['id'], true);
            $new = sanitize_text_field($_POST[$field['id']]);
     

            if ($new && $new != $old) {
                update_post_meta($post_id, $field['id'], $new);
            } elseif ('' == $new && $old) {
                delete_post_meta($post_id, $field['id'], $old);
            }

    
    }
}


?>
