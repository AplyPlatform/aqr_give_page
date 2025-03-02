let curPage = 0;
let curButtonIndex = 0;
function initGivePage() {  
  getPageData();  
}

function setPageContent(data) {
  data.forEach(function(item) {
    let imageIcon = "https://aqr.aplx.link/assets/img/logo-aqr1.png";
    
    if (item["icon_image_path"] != "") imageIcon = item["icon_image_path"];

    let token = item["extra_bitly_fromqr"].split("/")[4];
    $("#giving-list").append(
            `<li class="list-unstyled pt-4">
              <div class="media align-items-center">
                <img class="avatar user-rounded" src="` + imageIcon + `" alt="">
                <div class="media-body ml-2">
                  <span class="d-block mb-0 text-black">` + item["extra_com_name"] + `</span>
                </div>
                <div class="media-body ml-2">
                  <button class="btn btn-sm btn-outline-green" id="curButtonIndex_`+curButtonIndex+`" aqr-data-token="` + token + `">기부하기</button>
                </div>
              </div>
            </li>`
    );

    $("#curButtonIndex_" + curButtonIndex).click(function() {
      let token = $(this).attr('aqr-data-token');
      $("#aqr-widget-area").empty();
  
      new AQRWidget().renderAQRWidget(
      {
          token : token, // uniq token
          layer_id : "aqr-widget-area", // target layer id
          profile : true, // Show or Not profile image and account name
          libbutton : true, // Show or Not SNS Link Buttons
          bgcolor : "#ffffff", // hex only
          textcolor : "#333333", // hex only
          button_text : "기부하기",
          open : false
        }
      );
  
      $("#aqrDialog").modal('show');
    });

    curButtonIndex++;
  });
}

function getPageData() {
  let fd = new FormData();	
	fd.append("action", "data");
  fd.append("page", curPage);
  AAPI_ajaxRequest(fd, function(data) {    
    if(data.result == "success") {
      curPage += 1;
      setPageContent(data.data);
    }
    else {

    }
  },
  function(error) {
    console.log("error");
  });

}


function AAPI_isSet(value) {
	if (value == "" || value == null || value == "undefined" || value == undefined) return false;

	return true;
}

function AAPI_ajaxRequest(fed, success_callback, error_callback) {
	$.ajax({
		type: "POST",
		url: 'https://aq.gy/api/content/give.php',
		dataType: "json",
		data: fed,
		enctype: 'multipart/form-data', // 필수
		processData: false,
		contentType: false,
		cache: false,
		success: function (data) {
			success_callback(data);
		},
		error: function (jqXHR, text, error) {
			error_callback(error);
		}
	});
}

(function ($) {
  "use strict";

  initGivePage();  

})(jQuery);