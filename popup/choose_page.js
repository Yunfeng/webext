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

document.body.addEventListener("click", function(e) {
	console.log(e)
	console.log(e.target.id)
	if (e.target.id === 'btnTest') {
		popupPort.postMessage({to: 'content',
			action: "login",
			username: "username",
			password: "password",
			greeting: "Hi, content.js! I am popup.js."
		});
	}
  
});
