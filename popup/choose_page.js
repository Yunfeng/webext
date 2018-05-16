let username;

// document.addEventListener("click", function(e) {
//   if (!e.target.classList.contains("page-choice")) {
//     return;
//   }

//   console.log(e)

//   var chosenPage = "https://" + e.target.textContent;
//   browser.tabs.create({
//     url: chosenPage
//   });

// });


let popupPort = browser.runtime.connect({name:"port-popup"});
// console.log(myPort)
// popupPort.postMessage({greeting: "hello from popup script"});

popupPort.onMessage.addListener(function(m) {
  // console.log("In content script, received message from background script: ");
  console.log(m);
});

// document.body.addEventListener("click", function(e) {
// 	console.log(e)
// 	console.log(e.target.id)
// 	if (e.target.id === 'btnLogin') {
// 		popupPort.postMessage({to: 'content',
// 			action: "login",
// 			username: "username",
// 			password: "password",
// 			greeting: "Hi, content.js! I am popup.js."
// 		});
// 	} else if (e.target.id === 'btnData') {
// 		popupPort.postMessage({to: 'content',
// 			action: "reset"
// 		});
// 		popupPort.postMessage({to: 'content',
// 			action: "data",
// 			// username: "username",
// 			// /password: "password",
// 			greeting: "auto fill form"
// 		});
// 	}
// });

const WEBAPP = 'http://tms-2.90sky.com/Flight';

$(function() {
	checkLoginStatus();

	$("#btnLogin").click(login);
  $("#btnData").click(autoFillForm);
	$("#captchaImage").click(refreshCapchaImage);
});

function showErrMsg(msg) {
	$("#errmsg").text(msg);
}

function refreshCapchaImage() {
	const url = WEBAPP + '/captcha.do?' + Math.floor(Math.random() * 100);
	console.log(url);
 	$('#captchaImage').attr('src', url);
}

function checkLoginStatus() {
  showErrMsg("状态检测中");

	const url = WEBAPP + "/checkLoginStatus";
	$.post(url, function(v) {
    showErrMsg('');
    console.log(v);
		if (v.status === 'OK') {
  		username = v.desc;
			$("#divWork").show();
			$("#divLogin").hide();
      $("#currentUsername").text(username);
      refreshData();
		} else {
      $("#divWork").hide();
      $("#divLogin").show();
      refreshCapchaImage();
      // $("#errmsg").text("请先登入");
    }
	})
}

function login() {
  const url = WEBAPP + "/ajaxLogin.do";
  const params = {
    "username": $("#username").val(),
    "password": $("#password").val(),
    "captchaValue": $("#captchaCode").val()
  }
  console.log(params);

  $.post(url, params, function(v) {
    console.log(v)
    // alert(v);
    if (v.status !== 'OK') {
      // $("#errmsg").text(v.errMsg);
      showErrMsg(v.errMsg);
    }
  })  
}

function refreshData() {
  const params = {
    'sc.carrier': 'MU',
    'sc.pageNo': 1,
    'sc.pageSize': 10,
    'sc.status': 0
  }
  const url = WEBAPP + '/charterFlight/list'
  $.post(url, params, function(v) {
    console.log(v.dataList);
    // console.log(v.dataList.length);

    $("#teamNameSelect").empty();

    $.each(v.dataList, function(index, info) {
      // console.log(index);
      // console.log(info);
      const option = $("<option>").val(info.id).text(info.name);
      // console.log(option);
      $("#teamNameSelect").append(option);
    })
  })
}

function autoFillForm() {
  // 开发自动填写表单
  // showErrMsg();
  // console.log();
  const url = WEBAPP + '/charterFlight/detail/' + $("#teamNameSelect").val();
  $.post(url, function(v) {
    console.log(v);
    popupPort.postMessage({to: 'content',
      action: "reset"
    });

    const content = {
      'count': v.totalSeats,
      'linkMan': v.linkMan,
      'mobile': v.contactMobile,
      'teamName': v.name,
      'flights': []
    }

    for (const flt0 of v.details) {
      const flt2 = flt0.flight
      const flt = {
          'flightNo': flt2.flightNo,
          'ddate': flt2.departureDate,
          'dport': flt2.departureAirport,
          'aport': flt2.arrivalAirport
      }
      content.flights.push(flt);
    }

    console.log(content);

    popupPort.postMessage({to: 'content',
      action: "data",
      content,
      greeting: "auto fill form"
    });


  })  
}