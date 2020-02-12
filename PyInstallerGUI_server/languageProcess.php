<?php
	$language = $_GET["lang"];
	$file_path = "language_server/" . $language . ".lang";
	if(file_exists($file_path)){
		$str = file_get_contents($file_path);	//將整個檔案內容讀入到一個字串中
		echo $str;
	}
?>
