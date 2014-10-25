<?php
/**
 * The lla_sections pag
 * This page creates and process the $section_parent var which contains the name of the parent variable. 
 * 
 *
 *
 *
 *
 *
 * @package lla
 */

$cur_section_object = new lla_section_object();

$cur_section_object->make_nav();

foreach($cur_section_object->array_sections as $section) {


	$cur_section_object->open_section($section);
	$cur_section_object->echo_top_content($section);

	$cur_section_object->echo_bottom_content($section);

	$cur_section_object->close_section($section);
}
$cur_section_object->footer_nav();



