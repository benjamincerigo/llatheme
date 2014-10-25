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
function lla_quo_admin_init() {
if(is_admin()) {
   wp_enqueue_script('lla_admin_js', get_template_directory_uri().'/js/lla_admin_js.js');
}
}

add_action( 'admin_init', 'lla_quo_admin_init' );

$quo_meta = array(
    'id' => 'lla_quo_meta_box',
    'title' => 'Quotes Custom Feilds',
    'page' => 'lla_quotes',
    'context' => 'normal',
    'priority' => 'high',
    'fields' => array(
        array(
            'name' => 'Custom Quotes',
            'desc'  => 'But quotes and the order you want them shown',
            'id'    => 'lla_repeatable',
            'type'  => 'repeatable'
        ),

        

        
        
    )
);

add_action('admin_menu', 'lla_quo_box');

// Add meta box
function lla_quo_box() {
    global $quo_meta;

    add_meta_box($quo_meta['id'], $quo_meta['title'], 'lla_quo_add_box', $quo_meta['page'], $quo_meta['context'], $quo_meta['priority']);
}



// Callback function to show fields in meta box
function lla_quo_add_box() {
    global $quo_meta, $post;

     
    // Use nonce for verification
    echo '<input type="hidden" name="lla_meta_box_nonce" value="', wp_create_nonce(basename(__FILE__)), '" />';

    echo '<table class="form-table">';

    foreach ($quo_meta['fields'] as $field) {
        // get current post meta data
           $type = isset( $field['type'] ) ? $field['type'] : null;
                $label = isset( $field['label'] ) ? $field['label'] : null;
            $desc = isset( $field['desc'] ) ? '<span class="description">' . $field['desc'] . '</span>' : null;
            $place = isset( $field['place'] ) ? $field['place'] : null;
            $size = isset( $field['size'] ) ? $field['size'] : null;
            $post_type = isset( $field['post_type'] ) ? $field['post_type'] : null;
            $options = isset( $field['options'] ) ? $field['options'] : null;
            $settings = isset( $field['settings'] ) ? $field['settings'] : null;
            $repeatable_fields = isset( $field['repeatable_fields'] ) ? $field['repeatable_fields'] : null;
            $meta = get_post_meta($post->ID, $field['id'], true);

        echo '<tr>','<th style="width:20%"><label for="', $field['id'], '">', $field['name'], '</label></th>',
                '<td>';

        switch ($field['type']) {
            // date
            case 'date':
                echo '<input type="text" class="datepicker" name="'.$field['id'].'" id="'.$field['id'].'" value="'.$meta .'" size="30" />
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
            //repeatable
            case 'repeatable':
                    echo '<table id="' . esc_attr( $id ) . '-repeatable" class="meta_box_repeatable" cellspacing="0">
                    <thead>
                    <tr>
                    <th><span class="sort_label"></span></th>
                    <th>Fields</th>
                    <th><a class="meta_box_repeatable_add" href="#"></a></th>
                    </tr>
                    </thead>
                    <tbody>';
                    $i = 0;
                    // create an empty array
                    if ( $meta == '' || $meta == array() ) {
                    $keys = wp_list_pluck( $repeatable_fields, 'id' );
                    $meta = array ( array_fill_keys( $keys, null ) );
                    }
                    $meta = array_values( $meta );
                    foreach( $meta as $row ) {
                    echo '<tr>
                    <td><span class="sort hndle"></span></td><td>';
                    foreach ( $repeatable_fields as $repeatable_field ) {
                    if ( ! array_key_exists( $repeatable_field['id'], $meta[$i] ) )
                    $meta[$i][$repeatable_field['id']] = null;
                    echo '<label>' . $repeatable_field['label'] . '</label><p>';
                    echo custom_meta_box_field( $repeatable_field, $meta[$i][$repeatable_field['id']], array( $id, $i ) );
                    echo '</p>';
                    } // end each field
                    echo '</td><td><a class="meta_box_repeatable_remove" href="#"></a></td></tr>';
                    $i++;
                    } // end each row
                    echo '</tbody>';
                    echo '
                    <tfoot>
                    <tr>
                    <th><span class="sort_label"></span></th>
                    <th>Fields</th>
                    <th><a class="meta_box_repeatable_add" href="#"></a></th>
                    </tr>
                    </tfoot>';
                    echo '</table>
                    ' . $desc;
                    break;
        }
               
        echo     '</td><td>',
            '</td></tr>';
    }

    echo '</table>';
}


add_action('save_post', 'lla_quo_save_data');

// Save data from meta box
function lla_quo_save_data($post_id) {
    global $quo_meta;

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

    foreach ($quo_meta['fields'] as $field) {
       
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