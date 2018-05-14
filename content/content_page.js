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
  } else {
  	// console.log($("#fm #adtNum"));
  	const element = $("#fm" ).contents().find("#adtNum").get(0);
  	console.log(element);
  	$(element).val(20);

  	const frameContent = $("#fm" ).contents();
  	// console.log(frameContent)

	const btnAdd = frameContent.find("a .add")
  	console.log(btnAdd);
  	$(btnAdd).click()

  	const inputs = frameContent.find("input").filter("[name='team.depCd']");
  	console.log(inputs.length)
  	$(inputs.get(0)).val("TSN");
  	$(inputs.get(1)).val("KMG");

  	// const depCodes = $(inputs).find("[name='team.depCode']")
  	// console.log(depCodes)

  	// console.log(document.querySelector("#adtNum"))
  }
});

// document.body.addEventListener("click", function() {
//   contentPort.postMessage({greeting: "they clicked the page!"});
// });
