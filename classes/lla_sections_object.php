<?php
namespace lifelinearts;
class lla_sections_object 
{
	public static $current_term_id;
	public $array_of_sections = array();
	public $page;
	//Construct
	function __construct($parent){
		($parentTerm = get_term_by('name', $parent, 'lla_sections')) || ($parentTerm =get_term_by('slug', $parent, 'lla_sections'));
		//Test if parent Term Excists. 
		if($parentTerm)
		{
			//Found parent Term
			//echo "found Term ". $parentTerm->term_id . "</br>";
			$this->page = $parentTerm;
			$this->parentTerm = $parentTerm->term_id;
			self::$current_term_id = $parentTerm->term_id;
			$this->find_order_array_of_sections();
		}
		else 
		{
			//Found parent Term
			echo "found not given lla_sections Term";
		}
		$this->page->lla_nouce = wp_create_nonce( 'lla_nouce' );
		$this->page->wp_json_nouce = wp_create_nonce( 'wp_json' );
		$this->page->blog_info = get_bloginfo('template_directory');
		$this->page->blog_title = get_bloginfo('name');
	}
	//Private Function to order array in the db
	private function find_order_array_of_sections(){
	//Find the Array of sections with in the parent
		$taxonomies = 'lla_sections';
		$tax_args = array(
    	'orderby'       => 'name', 
    	'order'         => 'ASC',
	    'hide_empty'    => false, 
	    'exclude'       => array(), 
	    'exclude_tree'  => array(), 
	    'include'       => array(),
	    'number'        => '', 
	    'fields'        => 'all', 
	    'slug'          => '', 
	    'parent'         => '',
	    'hierarchical'  => true, 
	    'child_of'      => $this->parentTerm, 
	    'get'           => '', 
	    'name__like'    => '',
	    'pad_counts'    => false, 
	    'offset'        => '', 
	    'search'        => '', 
	    'cache_domain'  => 'core'
		); 
		$terms = get_terms( $taxonomies, $tax_args );
		usort($terms, 'sort_terms_by_section_id');
		//Make array of Sections
		 if ( !empty( $terms ) && !is_wp_error( $terms ) ){
		     foreach ( $terms as $term ) {
		     	$lla_term_object = new lla_term_object($term);
		     	$this->array_of_sections[$lla_term_object->t_name] = $lla_term_object;
		     }
	 	}
	 	$this->page->content = $this->array_of_sections;
	 	$model = Model::getInstance();
	 	$model->set($this->page);
	}
}
?>
