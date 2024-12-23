<?php
function get_img_shabbat() {
	global $post;
	$current_id   = $post->ID;
	$url          = '';
	$audio        = '';
	$textblock = '';
	$switch_image = get_post_meta( $current_id, 'enable-shabbat-image', true );
	$switch_audio = get_post_meta( $current_id, 'enable-shabbat-audio', true );
	$big_image_holiday = jet_engine()->listings->data->get_option('shabbat-options::sidebar-image-holiday');
	$is_holiday = jet_engine()->listings->data->get_option('shabbat-options::is-it-holiday');
	// $parasha = jet_engine()->listings->data->get_option('shabbat-options::parasha-name');
	$not_shabbat  = is_not_shabbat();
	if ( (str_contains( $not_shabbat, 'false' ) || $is_holiday == 'true') && $switch_image == 'true' ) {
		$url = get_post_meta( $current_id, 'shabbat-image', true );
		// $textblock = do_shortcode("[display_shabbat_times]");
		$textblock = '<div class="shabbat_times_container"><b>זמני השבת</b><br>כניסת שבת: <b class="start_shabbat"></b><br>יציאת שבת: <b class="end_shabbat"></b><br><hr style="border: 1px solid #e2a860; margin:10px 0;">פרשת: <b class="parashat_name"></b></div>';

	}
	if ( (str_contains( $not_shabbat, 'false' ) && $switch_audio == 'true') || $is_holiday == 'true') {
		$audio = '';
	} else {
		$audio = get_post_meta( $current_id, 'audio-file', true );
	}
	if ( $url == '' ) //if shabbat-image is not set or not shabbat now, use the regular thumbnail
	{
		$url = wp_get_attachment_url( get_post_thumbnail_id( $current_id ), 'thumbnail' );
	}
	if ($is_holiday == 'true' && $big_image_holiday) {
	  //check if we have holiday and big image
	  $url = $big_image_holiday;
	}

	echo '<div style="text-align: center;">' . $textblock . '<img style="max-width: none;width: 100%;object-fit: cover;border-radius: 8px;text-align: center;" src="' . $url . '"></div>'; //<audio autoplay loop src="' . $audio . '"></audio>
}

add_shortcode( "get_img_shabbat", "get_img_shabbat" );
