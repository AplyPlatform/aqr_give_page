let curPage = {"0" : 0, "1": 1, "2": 1, "3": 1, "4": 1, "5": 1, "6": 1};
let curButtonIndex = 0;
function initGivePage() {  
  getPageData();

  AAPI_setContactForm("give_page");

  $(".joinButton").click(function() {
    AAPI_GA_EVENT("join_button_click", "join_button", "click");
    $("#registerDialog").modal('show');
  });

  for (const [key, value] of Object.entries(curPage)) {
    $(".nextButton" + key).click(function() {
      AAPI_GA_EVENT("more_button_click", key, "click");
      getPageData(key);
    });
  }
}

function aqrWidgetLoaded() {
  $("#widgetLoader").hide();
}

function setPageContent(data) {

  let kindCounts = {};
  data.forEach(function(item) {    
    let token = item["extra_bitly_fromqr"].split("/")[4];
    let targetList = "#list_" + item["kind_no"];
    let descText = AAPI_isSet(item["content"]) ? item["content"] : "";

    let imageIcon = "./assets/img/logo-red.png";
    if (item["icon_image_path"] != "") imageIcon = item["icon_image_path"];

    $(targetList).append(
            `<li>              
              <div class="media align-items-center pt-2 pb-2">                
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

    kindCounts[item["kind_no"]] = kindCounts[item["kind_no"]] + 1 || 1;
    $("#curButtonIndex_" + curButtonIndex).click(function() {
      $("#widgetLoader").show();

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
        },
        aqrWidgetLoaded
      );
  
      $("#aqrDialog").modal('show');
    });

    curButtonIndex++;
  });

  for (const [key, value] of Object.entries(kindCounts)) {
    if (value >= 10) {
      $(".nextButton" + key).show();      
    }
    else {
      $(".nextButton" + key).hide();
    }
  }
}

function getPageData(key = 0) {
  let fd = new FormData();
  if (key == 0) {
    fd.append("action", "data");
    fd.append("page", 0);
  }
  else {
    fd.append("action", "next");
    fd.append("kind_no", key);
    fd.append("page", curPage[key]);
  }
  
  dataRequest(fd, function(data) {    
    if(data.result == "success") {

      curPage[key] += 1;
      setPageContent(data.data);
    }
    else {

    }
  },
  function(error) {
    console.log("error");
  });

}

function dataRequest(fed, success_callback, error_callback) {
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