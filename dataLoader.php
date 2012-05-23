<?php
ini_set("display_errors","1");
ERROR_REPORTING(E_ERROR);
session_start();
$user = $_GET['lender'];
//$data = json_decode(file_get_contents("http://api.kivaws.org/v1/lenders/".$user.".json"), true);
$loandata = json_decode(file_get_contents("http://api.kivaws.org/v1/lenders/".$user."/loans.json"), true);
$id = session_id();
mkdir('images/'.$id, 0777);
$imgs = array();
for($i=0; $i< count($loandata["loans"][$i]); $i++){
$pid = $loandata["loans"][$i]['image']['id'];
	if($pid != null){
		$loanpic = file_get_contents("http://kiva.org/img/w300/".$pid.".jpg");
		file_put_contents('images/'.$id.'/'.$pid.'.jpg', $loanpic);
		$imgs[] = 'images/'.$id.'/'.$pid.'.jpg';
	}
}
print_r(json_encode($imgs));
?>
