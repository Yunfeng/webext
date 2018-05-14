// document.body.style.border = "5px solid red";
// $.get('http://yh.90sky.com', function(v) {
// 	console.log(v)	
// })


// $("input").val("aa")

// document.title='test: 12345'

// console.log(browser.extension.getURL(""));
// console.log($("form input"))

let myPort = browser.runtime.connect({name:"port-from-cs"});
// console.log(myPort)
myPort.postMessage({greeting: "hello from content script"});

myPort.onMessage.addListener(function(m) {
  // console.log("In content script, received message from background script: ");
  console.log(m);
});

document.body.addEventListener("click", function() {
  myPort.postMessage({greeting: "they clicked the page!"});
});
