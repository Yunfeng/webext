let contentPort = browser.runtime.connect({name:"port-content"});
// console.log(myPort)
// contentPort.postMessage({greeting: "hello from content script"});

contentPort.onMessage.addListener(function(m) {
  // console.log("In content script, received message from background script: ");
  console.log(m);
  if (m.action === "login") {
  	console.log($("#j_username"))
  	console.log($(".item-tip"))
  	$(".item-tip").addClass("item-tip-on");
  	$("#j_username").val("username");
  	$("#j_password").val(m.password);
  }
});

// document.body.addEventListener("click", function() {
//   contentPort.postMessage({greeting: "they clicked the page!"});
// });
