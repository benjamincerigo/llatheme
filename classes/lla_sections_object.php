<?php
/*
* This is the class which creates a lla_sections_object
*
*The object is given a name,or slug, of lla_section. 
* it then finds and orders the children by there given order value. 
* clo


///////
functions:

public
	- __construct
		Processes and find the parent term

	- make_nav
		Outputs the naviation bar

	- make_top
		Gives begging of the wrapper table and call section_make('Top') on each lla_term_object

	- make_line
		give the html for the 3rd row of the wrapper table. And finds the img in imf folder of the theme. 

	- make_bottom
		calls sections_make('Bottom') for each lla_term_object and finish the wrapper table.




private
	- find_order_array_of_sections
		finds cildren taxonomies and orders them. Then produces ann array of lla_term_object in the propoty 
		array_of_sections

//////
Propotey:
	- parentTerm
		id of parent term

	- array_of_sections
		array containing a lla_term_object for each child taxonomy


*
*/
class lla_sections_object 
{

	public static $current_term_id;
	public $array_of_sections = array();



	//Construct
	
	function __construct($parent){
		
	

		($parentTerm = get_term_by('name', $parent, 'lla_sections')) || ($parentTerm =get_term_by('slug', $parent, 'lla_sections'));
	
		
		//Test if parent Term Excists. 
		if($parentTerm)
		{

			//Found parent Term
			//echo "found Term ". $parentTerm->term_id . "</br>";
			$this->parentTerm = $parentTerm->term_id;

			self::$current_term_id = $parentTerm->term_id;

			$this->find_order_array_of_sections();

		}
		else 
		{
			//Found parent Term
			echo "found not given lla_sections Term";

		}
		
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

		     	$this->array_of_sections[] = $lla_term_object;
		     	
		     }
		     
	 	}

	 	
	}

	public function make_nav(){
		echo '<div id="top_nav"><div id="top_nav_rel"><ul>';
		
		$array = $this->array_of_sections;
		

		foreach ( $array as $i ) {

			echo "<li><a  href='." . $i->s_top_link . "'>" . $i->t_name . "</a></li>";


		}
		echo "</ul></div></div><!-- ./top_nav -->";

	}


	public function make_top(){

		echo '<table id="wrapper_table">';
		echo '<tr id="top_row">';
		echo '<td>';
		echo '<table class="sec_table"> 	<!-- Top Table -->';
		echo '<tr>';


		$array = $this->array_of_sections;
		lla_term_object::$section_count = 0;

		

		foreach ( $array as $i ) {

			$i->section_make('Top');

		}

		echo '</tr></table></td></tr>';


	}


	public function make_line(){
		$image_string = get_bloginfo('template_directory') . "/img/LLA_LineFull4000.jpg";
	
		echo '<tr id="line_row">';
		for($i=0;$i<1;$i++){


		echo <<<_END
		<td >
					<div>
				<!-- row with the line in -->
_END;
		echo '<img src="' . $image_string .'"/>';
		echo '</div> </td>';
		}
		echo '</tr>';



		


	}

	public function make_bottom(){

		echo '<tr id="bottom_row">';
		echo '<td >';
		echo '<table class="sec_table"> 	<!-- Top Table -->';
		echo '<tr>';


		$array = $this->array_of_sections;
		lla_term_object::$section_count = 0;

		

		foreach ( $array as $i ) {

			$i->section_make('Bottom');

		}

		echo '</tr></table></td></tr></table>';


	}


	













}
?>