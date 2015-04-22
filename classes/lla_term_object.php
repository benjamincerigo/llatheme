<?php
namespace lifelinearts;
class lla_content {
	private $from_custom = array(
		'lla_part_slug',
		'lla_post_order',
	);
	private $from_wp_object = array(
		'post_content',
		'post_title',
		'post_date',
		'post_name',
		'post_type',
		'ID'
	);
	public function fromWP($wp){
		for($i=0;$i<count($this->from_wp_object);$i++){
			$key = $this->from_wp_object[$i];
			$this->$key = $wp->$key;
		}
	}
	public function fromCus($a){
		for($i=0;$i<count($this->from_custom);$i++){
			$key = $this->from_custom[$i];
			if($key ==='lla_post_order'){
				$this->$key = (int)  $a[$key][0];
			}else{
				$this->$key = $a[$key][0];
			}
		}
	}
}
class lla_term_object
{	
	public static $section_count = 0;
	public $content = array();
	function __construct($term){
		//Taxonomy data
		$this->t_name = $term->name;
		$this->t_id = $term->term_id;
		$this->t_slug = $term->slug;
		//sections name and id
		$this->s_top_id =$term->slug . "_top";
		$this->s_top_td = $term->slug . "_td";
		$this->s_top_link = '#'. $term->slug . "_top";

		$this->s_bot_id = $term->slug . "_bottom";
		$this->lla_get_contents('top');
	}
//-----------------------------------------Section Make --------------------------//
	public function section_make($top_bottom){
		$count = lla_term_object::$section_count;
		$count += 1;
		lla_term_object::$section_count = $count;
		//Open Sections
		echo '<!-- Section ' . $count . ' '. $top_bottom .'-->';
		echo '<td class="section ' . $this->s_top_td  . '"> ';
		switch($top_bottom){
			case 'Top':
					echo '<table id="' . $this->s_top_id . '">';
				break;
			case 'Bottom':
					echo '<table id="' . $this->s_bot_id . '">';
					break;
			default:
				echo '<table>';
				break;
			}
		echo '<tr>';
		//get contents
		/*if($top_bottom != 'Bottom' && $this->t_name != 'Home')
		{
			echo "<td class='title'>$this->t_name</td>";
			echo '</tr><tr>';
		}*/
		$this->lla_get_contents($top_bottom);
		//close section
		echo '</tr></table></td>';
	}
//-------------------Find correct Privat funciton -------------//
	private function lla_get_contents(){
		switch ($this->t_slug) {
			case 'home':
				$this->get_home();
				break;
			case 'about':
				$this->get_about();
				break;
			case 'calender':
				$this->get_calender();
				break;
			case 'contact':
				$this->get_contact();
			case 'gallery':
				$this->get_gallery();
			
			default:
				# code...
				break;
		}
	}
/////////---------------------------------------------- Get the Content ----------------//
//-----------------Get home------------------//
	private function get_home(){
		$title = get_bloginfo( 'title');
		$description = get_bloginfo('description');
		$args = array( 'post_type' => 'lla_home_content',
							'post_title'=> 'Quotes',
							'tax_query' => 
							array(
								array(
									'taxonomy' => 'lla_sections',
									'field' => 'slug',
									'terms' => $this->t_slug
									),
								),
							
			);
			$this_wp_query = new \WP_Query( $args );
			while ( $this_wp_query->have_posts() ) : $this_wp_query->the_post();
				global $post;
				$quotes = explode("\n", $post->post_content);
				if(is_array($quotes)){
					$this->content['quotes'] = array();
					foreach($quotes as $quote){
						if($quote != ""){
						array_push($this->content['quotes'], $quote);
					}
					}
				}
			endwhile;
		$taxonomies = 'lla_sections';
		$exclude = lla_sections_object::$current_term_id ? lla_sections_object::$current_term_id : array() ;
		$tax_args = array(
    	'orderby'       => 'none', 
    	'order'         => 'ASC',
	    'hide_empty'    => false, 
	    'exclude'       => array(), 
	    'exclude_tree'  => $exclude, 
	    'include'       => array(),
	    'number'        => '', 
	    'fields'        => 'all', 
	    'slug'          => '', 
	    'parent'         => '',
	    'hierarchical'  => true, 
	    'child_of'      => '', 
	    'get'           => '', 
	    'name__like'    => '',
	    'pad_counts'    => false, 
	    'offset'        => '', 
	    'search'        => '', 
	    'cache_domain'  => 'core'
		); 
		$terms = get_terms( $taxonomies, $tax_args );
		usort($terms, 'sort_terms_by_section_id');
		$this->content['sense_nav'] = array();
		foreach($terms as $term)
		{
			array_push($this->content['sense_nav'], $term);
		}
	}
//-----------------Get about------------------//
	private function get_about(){
		$args = array( 'post_type' => 'any',
							'meta_key' => 'lla_post_order',
							'orderby' => 'meta_value_num',
							'order' => 'ASC',
							'tax_query' => 
							array(
								array(
									'taxonomy' => 'lla_sections',
									'field' => 'slug',
									'terms' => $this->t_slug
									),
								)
			);
			$this_wp_query = new \WP_Query( $args );
			//echo $this_wp_query->post_count;
			$this->content['posts'] = array();
			while ($this_wp_query->have_posts() ) : $this_wp_query->the_post();
			//$array = array('main' => $this_wp_query->post, 'custom' => get_post_custom($this_wp_query->post->ID));
			$la = new lla_content();
			$la->fromWP($this_wp_query->post);
			$la->fromCus(get_post_custom( $this_wp_query->post->ID ));
			$this->content['posts'][$la->lla_part_slug] = $la;
			if( has_post_thumbnail() ){
				$url = wp_get_attachment_url( get_post_thumbnail_id($this_wp_query->post->ID) );
				$la->thumbnailset = true;
				$la->thumbnail = $url;
			}
			//var_dump('<br/>');
			endwhile;
	}
//-----------------Get Calender------------------//
	private function get_calender(){
			$limit = 4;
			$offset_query = 1;
		global $wpdb;
		//Make the query for the ordered lla_calender post types
		$cal_content = $wpdb->get_results( $wpdb->prepare(  "SELECT 
					ID,
					post_title, 
					post_content,
					event_date.meta_value AS date_value, 
					start_time.meta_value AS start_time_value,
					end_time.meta_value AS end_time_value, 
					address.meta_value AS address_value,
					event_desc.meta_value AS event_desc_value,
					lla_part_slug.meta_value AS lla_part_slug
					FROM wp_posts 
					LEFT JOIN wp_postmeta event_date ON wp_posts.ID = event_date.post_id AND event_date.meta_key = 'lla_date'
					LEFT JOIN wp_postmeta start_time ON wp_posts.ID = start_time.post_id AND start_time.meta_key = 'lla_start_time'
					LEFT JOIN wp_postmeta end_time ON wp_posts.ID = end_time.post_id AND end_time.meta_key = 'lla_end_time'
					LEFT JOIN wp_postmeta address ON wp_posts.ID = address.post_id AND address.meta_key = 'lla_address'
					LEFT JOIN wp_postmeta event_desc ON wp_posts.ID = event_desc.post_id AND event_desc.meta_key = 'lla_event_desc' 
					LEFT JOIN wp_postmeta lla_part_slug  ON wp_posts.ID = lla_part_slug.post_id AND lla_part_slug.meta_key = 'lla_part_slug'
					WHERE wp_posts.post_type = 'lla_calender'
					AND wp_posts.post_status = 'publish'
					ORDER BY date_value
					LIMIT %d , %d;
			",
			$offset_query,
			$limit
			)
		);
		$this->content['events'] = array();
		$size = sizeof($cal_content);
		if($size > 1){
			for($i = 0; $i < $size; $i++ ){
				$slug = $cal_content[$i]->lla_part_slug;
				if( $slug === '' || $slug === null){
					$slug = $cal_content[$i]->date_value;
					$cal_content[$i]->lla_part_slug = $slug;
				}
				$this->content['events'][$slug] = $cal_content[$i];
				$id = $cal_content[$i]->ID;
				if( has_post_thumbnail($id) ){
					$url = wp_get_attachment_url( get_post_thumbnail_id( $id ) );
					$cal_content[$i]->thumbnailset = true;
					$cal_content[$i]->thumbnail = $url;
				}
			}
		}
	}
//-----------------Get contact------------------//
	private function get_contact(){
		global $wpdb;
		$arrayToFind = array('Email', 'Telephone', 'Post');
		$content = $wpdb->get_results(  "SELECT 
									post_content,
									email_val.meta_value AS Email, 
									tel_val.meta_value AS Telephone,
									add_val.meta_value AS Post
									FROM wp_posts 
									LEFT JOIN wp_postmeta email_val ON wp_posts.ID = email_val.post_id AND email_val.meta_key = 'lla_contact_email'
									LEFT JOIN wp_postmeta tel_val ON wp_posts.ID = tel_val.post_id AND tel_val.meta_key = 'lla_contact_tel'
									LEFT JOIN wp_postmeta add_val ON wp_posts.ID = add_val.post_id AND add_val.meta_key = 'lla_contact_address'
									WHERE wp_posts.post_type = 'lla_contact'
									AND wp_posts.post_status = 'publish'
									LIMIT 1;
							"
							);
		$this->content['contact'] = array();
		foreach($content as $item){
			array_push($this->content['contact'], $item);
		}
	}
	private function get_gallery(){
		$args = array( 'post_type' => 'lla_home_content',
							'meta_key' => 'lla_post_order',
							'orderby' => 'meta_value_num',
							'order' => 'ASC',
							'tax_query' => 
							array(
								array(
									'taxonomy' => 'lla_sections',
									'field' => 'slug',
									'terms' => $this->t_slug
									),
								)
			);
			$this_wp_query = new \WP_Query( $args );
			$this->content['posts'] = array();
			while ($this_wp_query->have_posts() ) : $this_wp_query->the_post();
				$array = array('main' => $this_wp_query->post, 'custom' => get_post_custom($this_wp_query->post->ID));
				$la = new lla_content();
				$la->fromWP($this_wp_query->post);
				$la->fromCus(get_post_custom( $this_wp_query->post->ID ));
				$this->content['posts'][$la->lla_part_slug] = $la;
			if( has_post_thumbnail() ){
				$url = wp_get_attachment_url( get_post_thumbnail_id($this_wp_query->post->ID) );
				$la->thumbnailset = true;
				$la->thumbnail = $url;
			}
			endwhile;
	}

}
