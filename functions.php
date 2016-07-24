<?php
define('ROOT', dirname(__FILE__).DIRECTORY_SEPARATOR );
define('ASSETS', ROOT.'assets'.DIRECTORY_SEPARATOR );


function get_templates($templates){
	$path = ASSETS.DIRECTORY_SEPARATOR.'templates/';
	if(is_array($templates)){
		foreach ($templates as $template ) {
			require_once ($path.$template.'.php');
		}
	}else{
		require_once ($path.$templates.'.php');
	}
}
