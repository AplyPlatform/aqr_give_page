let curPage = 0;
let curButtonIndex = 0;
function initGivePage() {  
  getPageData();  
}

function setPageContent(data) {

  data.forEach(function(item) {    
    let token = item["extra_bitly_fromqr"].split("/")[4];
    let targetList = "#list_" + item["kind_no"];
    let descText = AAPI_isSet(item["content"]) ? item["content"] : "";

    let imageIcon = "./assets/img/logo-red.png";
    if (item["icon_image_path"] != "") imageIcon = item["icon_image_path"];

    $(targetList).append(
            `<li>              
              <div class="media align-items-center">                
                <img class="avatar user-rounded" src="` + imageIcon + `" alt="">
                <div class="media-body ml-2">
                  <div class="row">
                    <div class="col-sm-8">
                      <span class="d-block mb-0 text-black">` + item["extra_com_name"] + `</span>
                      <span class="d-block mb-0 text-gray"><small>`+ descText +`</small></span>
                    </div>
                    <div class="col-sm-4 mt-1 text-right text-sm-right align-middle">
                      <button class="btn btn-sm btn-outline-green" id="curButtonIndex_`+curButtonIndex+`" aqr-data-token="` + token + `">후원하기</button>
                    </div>
                  </div>
                </div>
              </div>
            </li>`
    );

    $("#curButtonIndex_" + curButtonIndex).click(function() {      
      let token = $(this).attr('aqr-data-token');
      $("#aqr-widget-area").empty();
  
      AAPI_GA_EVENT("give_button_click", curButtonIndex, token);

      new AQRWidget().renderAQRWidget(
      {
          token : token,
          layer_id : "aqr-widget-area", // target layer id
          profile : true, // Show or Not profile image and account name
          libbutton : true, // Show or Not SNS Link Buttons
          bgcolor : "#ffffff", // hex only
          textcolor : "#555555", // hex only
          button_text : "후원하기",
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

const AAPI_GA_EVENT = (event_name, event_target_name, event_label) => {
	if (typeof gtag !== 'undefined') {
		gtag(
			'event', event_name, {
			'event_category': event_target_name,
			'event_label': event_label
		}
		);
	}
};

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