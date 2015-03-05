<?php 

/*_hccustom_field is include in the functions file
*
*It set up the custom fields for the home content, lla_home_content, post types. 
*
*           Currently Added

*       - Home Position // top or bottom of the line 
*       -
*
*
*/

$hc_meta = array(
    'id' => 'lla_meta_box',
    'title' => 'Custom meta box',
    'page' => 'lla_home_content',
    'context' => 'normal',
    'priority' => 'high',
    'fields' => array(
				array(
					'name' => 'Part Slug',
					'desc' => 'THe URL slug that you want to use for this part',
					'id' => $prefix . '_part_slug',
					'type' =>  'text'
				),
				array(
					'name' => 'In Section Order',
					'desc' => '0 will be first in the section',
					'id' => $prefix . '_post_order',
					'type' => 'number'	
				)
    )
);

add_action('admin_menu', 'lla_hc_box');

// Add meta box
function lla_hc_box() {
    global $hc_meta;

    add_meta_box($hc_meta['id'], $hc_meta['title'], 'lla_hc_add_box', $hc_meta['page'], $hc_meta['context'], $hc_meta['priority']);
}

// Callback function to show fields in meta box
function lla_hc_add_box() {
    global $hc_meta, $post;

    // Use nonce for verification
    echo '<input type="hidden" name="lla_meta_box_nonce" value="', wp_create_nonce(basename(__FILE__)), '" />';

    echo '<table class="form-table">';

    foreach ($hc_meta['fields'] as $field) {
        // get current post meta data
        $meta = get_post_meta($post->ID, $field['id'], true);

        echo '<tr>',
                '<th style="width:20%"><label for="', $field['id'], '">', $field['name'], '</label></th>',
                '<td>';
        
        switch ($field['type']) {
        	//select
				case 'select':   
                echo '<select name="', $field['id'], '" id="', $field['id'], '">';
                foreach ($field['options'] as $option) {
                    echo '<option ', $meta == $option ? ' selected="selected"' : '', '>', $option, '</option>';
                }
						break;
					//text
				case 'text':
								echo '<input type="text" name="'.$field['id'].'" id="'.$field['id'].'" value="'.$meta.'" size="30" />
								<br /><span class="description">'.$field['desc'].'</span>';
						break;
				case 'number':
								echo '<input type="number" name="'.$field['id'].'" id="'.$field['id'].'" value="'.$meta.'" size="30" />
								<br /><span class="description">'.$field['desc'].'</span>';
						break;
				}
        echo     '</td><td>',
            '</td></tr>';
    }
    echo '</table>';
}


add_action('save_post', 'lla_hc_save_data');

// Save data from meta box
function lla_hc_save_data($post_id) {
    global $hc_meta;

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

    foreach ($hc_meta['fields'] as $field) {
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
