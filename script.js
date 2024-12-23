jQuery( document ).ready( function( $ ) {
// Refresh tv screen
let postId = $("#current-post-data").data("post_id");
let currentModified = $("#current-post-data").data("current_modified");
    setInterval(function() {
        $.ajax({
            url: customAjax.ajaxurl,
            type: 'POST',
            data: {
                action: 'check_post_update',
                post_id: postId,
            },
            success: function(response) {
                var lastModified = response.data.last_modified;
                console.log(lastModified+" "+currentModified);
                if (lastModified > currentModified) {
                    location.reload();
                }
            }
        });
    }, 5000); // Check every 5 seconds, adjust as needed

  $('body').on("click", "button.refresh_screen", function(e){
    var post_id = $('.assigned_building input').val();
    var nonce = $('.nonce_refresh').html();
      jQuery.ajax({
      type: "post",
      dataType: "json",
      url: "/wp-admin/admin-ajax.php",
      data: {
          action:'force_refresh_update_page_version',
          nonce: nonce,
          post_id: post_id
      },
      success: function(msg){
      }
     });
  });
  // Changing candle date on document is ready
  jQuery( document ).ready(function(){
    // jQuery('.start_shabbat').html('18:56');
    // jQuery('.end_shabbat').html('19:53');
  // Changing candle date on document is ready
  var city_id = jQuery("#city-id-data .elementor-heading-title").text();
  if (!city_id) city_id = 295530;
  let candles_time;
  let stop_candles_time;
  fetch(`https://www.hebcal.com/shabbat?cfg=json&geonameid=${city_id}&M=on`)
  .then(response => response.json())
  .then(data => {
  function getAllIndexes(arr, val) {
      var indexes = [], i;
      for(i = 0; i < arr.length; i++)
          if (arr[i].category === val)
              indexes.push(i);
      return indexes;
  }
  var index_candles = data.items.findIndex(p => p.category == 'candles');
  var index_stop_candles = data.items.findIndex(p => p.category == 'havdalah');
  var all_holidays = getAllIndexes(data.items, 'holiday');
  var candles = data.items[index_candles].date;
  var stop_candles = data.items[index_stop_candles].date;
  var candles_date = new Date(candles);
  var candles_hour = candles_date.getHours();
  var candles_min = candles_date.getMinutes();
  candles_time = candles_hour + ':' + String(candles_min).padStart(2, '0');
  var stop_candles_date = new Date(stop_candles);
  var stop_candles_hour = stop_candles_date.getHours();
  var stop_candles_min = stop_candles_date.getMinutes();
  stop_candles_time = stop_candles_hour + ':' + String(stop_candles_min).padStart(2, '0');
  var holiday_name;
  //set candle time
  if (all_holidays.length > 0) {
    $.each(all_holidays, function(index, value) {
      var holiday = data.items[value].date;
      var holiday_date = new Date(holiday);
      var now = new Date;
      if(holiday_date.setHours(0,0,0,0) == now.setHours(0,0,0,0)) {
        holiday_name = data.items[value].hebrew;
      }
    });
  }
  console.log(' start candles ', candles_time, ' stop candles ', stop_candles_time);
  jQuery('.start_shabbat').html(candles_time);
  jQuery('.end_shabbat').html(stop_candles_time);

  //Set holiday name if exists
  var index_parashat = data.items.findIndex(p => p.category == 'parashat');
  var parashat_text;
  if(index_parashat >= 0) parashat_text = data.items[index_parashat].hebrew;
  if(parashat_text)  {
    parashat_text = parashat_text.replace('פרשת ', '');
    jQuery('.parashat_name').html(parashat_text);
  }else if (holiday_name) {
    jQuery('.parashat_name').html(holiday_name);
  }
  });

  setInterval(function() {
    var start_shabbat = jQuery('.start_shabbat');
    if (start_shabbat.length == 0 && candles_time) {
      start_shabbat = candles_time;
      if (start_shabbat.indexOf(":") >= 0 ) {
      var before_shabbat = jQuery('#current-post-data').attr('before-shabbat');
      var now = new Date();
      var cutoff = new Date();
      var hours_minutes = start_shabbat.split(':');
      var shabbat_hours = hours_minutes[0];
      var shabbat_minutes = hours_minutes[1];

      before_shabbat = parseInt(before_shabbat)*60*1000;
      cutoff.setHours(shabbat_hours, shabbat_minutes, 0, 0); /* Param Order: Hours, Minutes, Seconds, Milliseconds */
          if (now.getTime() <= cutoff.getTime() - before_shabbat  && now.getDay() == 5) {
              // console.log("reload");
              location.reload(); //reload page
          }
      }
    }
  }, 60000);

  setInterval(function() {
    var end_shabbat = jQuery('.end_shabbat');
    if(end_shabbat.length > 0 && stop_candles_time){
        end_shabbat = stop_candles_time;
        if (end_shabbat.indexOf(":") >= 0) {
        var after_shabbat = jQuery('#current-post-data').attr('after-shabbat');
        var now = new Date();
        var cutoff = new Date();
        var hours_minutes = end_shabbat.split(':');
        var shabbat_hours = hours_minutes[0];
        var shabbat_minutes = hours_minutes[1];

        after_shabbat = parseInt(after_shabbat)*60*1000;
        cutoff.setHours(shabbat_hours, shabbat_minutes, 0, 0); /* Param Order: Hours, Minutes, Seconds, Milliseconds */

        if (now.getTime() >= cutoff.getTime() + after_shabbat  && now.getDay() == 6) {
            location.reload(); //reload page
        }
      }
    }
  }, 60000);
  });
});
