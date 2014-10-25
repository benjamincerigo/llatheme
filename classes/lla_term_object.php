<?php
/*
* This is the class which creates a lla_term_object
*
*The object is given a name,or slug, of lla_section. 
* Holds the name, id and slug of the term.  


Tese function produce the correct html for the section and content of the section


Function:
Public
	- __construct($term)
			sets propty from given term object

	- section_top()
		write html for the conten


Private
	- lla_get_contents()
		make correct call from the slug of the section
	


	- get_home()
			give the correct contents for each part of the home

	- get_about()
		gives the correct post from the lla_content
	- get_calender()
		give the corret post for the callender from the date
	- get_contact()
		give the correct parts of the contact section


Proptey:
	-t_name
		 name of given taxonomy
	- t_id 
		 id of given taxonomy
	- t_slug 
		slug of given taxonomy

	- s_top_link
		useds as the link in the naviagation bar  
	- s_top_id
		used as the section id in the top section
	- s_top_td
		class of the sections <td> tab



	
	
*
*/
class lla_term_object
{	
	public static $section_count = 0;


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

	private function lla_get_contents($top_bottom){



		switch ($this->t_slug) {
			case 'home':
				$this->get_home($top_bottom);
				break;
			case 'about':
				$this->get_about($top_bottom);
				break;

			case 'calender':
				$this->get_calender($top_bottom);
				break;

			case 'contact':
				$this->get_contact($top_bottom);
			
			default:
				# code...
				break;
		}

	}

/////////---------------------------------------------- Get the Content ----------------//
//-----------------Get home------------------//
	private function get_home($top_bottom){
		

		if($top_bottom == 'Top'){

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
			$this_wp_query = new WP_Query( $args );


			echo "<td class='title'><h1>$title</h1>"
				. "<h3>$description</h3></td></tr>"
				. "<tr><td><ul id='quotes'>";
			//echo $this_wp_query->post_count;
			while ( $this_wp_query->have_posts() ) : $this_wp_query->the_post();
			global $post;
			$quotes = explode("\n", $post->post_content);

			if(is_array($quotes)){
				
				foreach($quotes as $quote){
					if($quote != ""){
					echo "<li class='quote'>$quote</li>";
				}
				}
			}


			endwhile;

			echo "</ul><!-- ./quotes --></td>";
		}
		elseif($top_bottom == "Bottom"){

			echo "<td id='sense_nav'><h2>Sense</h2>"
				. "<ul class='hidden'>";
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


		foreach($terms as $term)
		{
			$link = get_term_link($term, 'lla_sections');
			echo "<li><a href='$link'> $term->name</a></li>";
		}
		echo "</ul></td>";




		}
			

	}


//-----------------Get about------------------//
	private function get_about($top_bottom){

		$args = array( 'post_type' => 'any',
							'meta_value'=> $top_bottom,
							'tax_query' => 
							array(
								array(
				
			
									'taxonomy' => 'lla_sections',
									'field' => 'slug',
									'terms' => $this->t_slug
									),
								),
							
			);
			$this_wp_query = new WP_Query( $args );
			
			//echo $this_wp_query->post_count;
			
			while ($this_wp_query->have_posts() ) : $this_wp_query->the_post();

				echo '<td>';
				the_title();
				echo '<div class="entry-content">';
				the_content();
				echo '</div>';
				echo '</td>';

			endwhile;

	}

//-----------------Get Calender------------------//
	private function get_calender($top_bottom){

		

		// Set limit for the top or bottom
		if($top_bottom == 'Top') {
			$limit = 1;
			$offset_query = 0;
		}
		elseif ($top_bottom == 'Bottom')
		{
			$limit = 3;
			$offset_query = 1;
		}


		global $wpdb;
		//Make the query for the ordered lla_calender post types
		$cal_content = $wpdb->get_results( $wpdb->prepare(  "SELECT 
									post_title, 
									post_content,
									event_date.meta_value AS date_value, 
									start_time.meta_value AS start_time_value,
									end_time.meta_value AS end_time_value, 
									address.meta_value AS address_value
									FROM wp_posts 
									LEFT JOIN wp_postmeta event_date ON wp_posts.ID = event_date.post_id AND event_date.meta_key = 'lla_date'
									LEFT JOIN wp_postmeta start_time ON wp_posts.ID = start_time.post_id AND start_time.meta_key = 'lla_start_time'
									LEFT JOIN wp_postmeta end_time ON wp_posts.ID = end_time.post_id AND end_time.meta_key = 'lla_end_time'
									LEFT JOIN wp_postmeta address ON wp_posts.ID = address.post_id AND address.meta_key = 'lla_address'
									WHERE wp_posts.post_type = 'lla_calender'
									AND wp_posts.post_status = 'publish'
									ORDER BY date_value
									LIMIT %d , %d;
							",
							$offset_query,
							$limit
							)

							);
			
			
			//echo count($cal_content);

			//If top and the limit is one
			if($limit ==1) {

				//Title
				echo "<td><h3>". $cal_content[0]->post_title ."</h3>";
				//List of start time and address
				echo '<table><tr><td><ul>';
				echo <<<_END
				
				<li>
				<h4>Start: {$cal_content[0]->date_value} {$cal_content[0]->start_time_value} </h4>
				</li>
				<li>
				<h4>End: {$cal_content[0]->end_time_value} </h4>
				</li>
				<li>
				<h4>Where: {$cal_content[0]->address_value} </h4>
				</li>
				</ul>
_END;
				echo "</td>";
				echo '<td>';
				echo $cal_content[0]->post_content;
				echo '</td></tr></table>';



			}
			else
			{//Is the bottom
			

			
			for($i = 0;$i < $limit; $i++)

			{//Table cell for each calender post
				echo '<td>';
				
				echo '<h4>'.$cal_content[$i]->post_title. '</h4>';
				
				
				echo '<p>'. $cal_content[$i]->date_value.  '</p>';
				echo '</td>';
				

			}
		}

			

	}
	
//-----------------Get contact------------------//
	private function get_contact($top_bottom){
		global $wpdb;
		$arrayToFind = array('Email', 'Telephone', 'Post');
		
		// Set limit for the top or bottom
		if($top_bottom == 'Top') {
			//If top get the contact info from the lla_contact
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
			
			echo '<td><ul>';
			//echo count($content);
			foreach($arrayToFind as $name){
				echo '<li>';
				
				if($name == 'Email') {


				$email_string = $content[0]->Email;
				
				$email_split = explode("@", $email_string);
				
					
				echo '<h4>Email: </h4>';
				echo '<h4>'. $email_split[0].'</h4>';
				echo '<h4>&#64;</h4>';
				echo '<h4>'. $email_split[1] .'</h4>';

				
				}
				else
				{
					echo '<h4>';
					echo $name . ': ';
					echo $content[0]->$name;
					echo '</h4>';

				}
				echo '</li>';

			}
			echo "</ul></td>";








			

		}
		elseif ($top_bottom == 'Bottom')
		{

			echo "<td>";

			
			lla_create_contact_form();
		
			echo "</td>";

		}

		



	}
		







}