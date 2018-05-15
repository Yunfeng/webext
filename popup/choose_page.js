document.addEventListener("click", function(e) {
  if (!e.target.classList.contains("page-choice")) {
    return;
  }

  console.log(e)

  var chosenPage = "https://" + e.target.textContent;
  browser.tabs.create({
    url: chosenPage
  });

});


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

$(function() {
	$("#btnLogin").click(function() {
		const url = "http://yh.90sky.com/Flight/login";
		const params = {
			"username": "yhtest",
			"password": "123abc",
			"captchaValue": "123"
		}
		console.log(params);

		$.post(url, params, function(v) {
			console.log(v)
		})
	});
});