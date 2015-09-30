<?php
namespace lifelinearts;
if ( ! defined( 'ABSPATH' ) ) exit;

class Model
{
	private static $instance;

	private function __construct(){

	}

	public static function getInstance(){
		$ret = '';
		if(isset(self::$instance)){
			$ret = self::$instance;
		}else{
			self::$instance = new Model();
			$ret = self::$instance;
			
		}
		return $ret;
	}

	public function add($array){
		foreach ($array as $index => $values) {
          if (is_array($values) && empty($values)) {
            	$this->{$index} = new stdClass();
          	} else if (is_array($values)) {
               $this->{$index} = $this->add($values);
           	} else {
               $this->{$index} = $values;
           }
         }

	}

	public function set( $class){

		self::$instance = $class;
	}

	
}

?>
