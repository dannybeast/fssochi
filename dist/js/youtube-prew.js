function youTube($link, $get, $default){
	if(!$default) $default = $link;
	
	if($link.indexOf('youtu') === false)
	    return $default;

	regexp = /http:\/\/youtu.be\/(.*)/;

	var $res = regexp.exec($link);

	if ($res == null) {
	    regexp = /https:\/\/youtu.be\/(.*)/;

	    var $res = regexp.exec($link);
	}

	if($res == null) {
	    regexp = /https*:\/\/www.youtube.com\/watch\?v=([^&]*)/;

	    $res = regexp.exec($link);
	}

	if(!$res[1]) {
	    regexp = /https*:\/\/www.youtube.com\/v\/([^?]*)/;

		$res = regexp.exec($link);
	}

	if(!$res[1]) return $default;
	
	$v = $res[1];
	$src = 'http://www.youtube.com/embed/'+$v+'?feature=player_detailpage&wmode=transparent';
	$img_src = 'http://img.youtube.com/vi/'+$v+'/0.jpg';
	$img_src_mini = 'http://img.youtube.com/vi/'+$v+'/1.jpg';
	$result = new Array($v, $src, $img_src, $img_src_mini);
	if( $result[$get] != null)
		return $result[$get];
	
	return $default;
}