let contentPort = browser.runtime.connect({name:"port-content"});
// console.log(myPort)
// contentPort.postMessage({greeting: "hello from content script"});

let flightNos;
let flightIndex = -1;
let step = 0;


function searchFare() {
	console.log("searchFare");
  step = 2;
  const frameContent = $("#fm" ).contents();
  let strFilter = "[onclick*='checkConectInfoAndQueryTeamFareAction']";
  let ipt = frameContent.find("#form1 input").filter(strFilter).get(0);
  console.log(ipt);
  $(ipt).click();
};

function reset() {
	flightIndex = -1;
	step = 0;
	flightNos = null;	
};

contentPort.onMessage.addListener(function(m){
  console.log(m);
  const frameContent = $("#fm" ).contents();

  if (m.action === 'reset') {
  	reset();
  } else if (m.action === "login") {
    console.log($("#j_username"))
    console.log($(".item-tip"))
    $(".item-tip").addClass("item-tip-on");
    $("#j_username").val("username");
    $("#j_password").val(m.password);
  } else if (m.action === "data" && step === 0) {
    step = 1;

    const element = frameContent.find("#adtNum").get(0);
    $(element).val(20);

    const curCodes = frameContent.find("input").filter("[name='team.depCd']");
    if (curCodes.length === 1) {
    	const btnAdd = frameContent.find("a .add")
    	$(btnAdd).click()
    }

   
    const depCodes = frameContent.find("input").filter("[name='team.depCd']");
    $(depCodes.get(0)).val("TSN");
    $(depCodes.get(1)).val("KMG");

    const arrCodes = frameContent.find("input").filter("[name='team.arrCd']");
    $(arrCodes.get(0)).val("KMG");
    $(arrCodes.get(1)).val("TSN");

    const depDates = frameContent.find("input").filter("[name='team.depDt']");
    $(depDates.get(0)).val("2018-06-06");
    $(depDates.get(1)).val("2018-06-11");

    flightNos = frameContent.find("input").filter("[name='team.flightNo']");
    $(flightNos.get(0)).click();
    flightIndex = 0;
  } else if (m.action === "request_done") {
    const url = m.requestDetails.url;
    console.log(url);
    if (url.indexOf('/team/teamSearchFlightAction_check.do') >= 0) {
    	// 查询航班完成
	    console.log("flightIndex: " + flightIndex);
	    if (flightIndex === 0) {
	      const strFilter = "[onclick*='MU5752']";
	      const ipt = frameContent.find("#teamFlight____ input").filter(strFilter).get(0);
	      // console.log(ipt);
	      $(ipt).click();
	    } else if (flightIndex === 1) {
	      let strFilter = "[onclick*='MU5751']";
	      let ipt = frameContent.find("#teamFlight____ input").filter(strFilter).get(0);
	      // console.log(ipt);
	      $(ipt).click();
	    }    	
    } else if (url.indexOf('/team/teamSearchFlightAction_edit.do') >= 0) {
    	// 选择航班完成
    	if (flightIndex === 0) {
      		$(flightNos.get(1)).click();
	      	flightIndex = 1;
    	} else if (flightIndex === 1) {
	      flightIndex = -1;
	      searchFare();
    	}
    } else if (url.indexOf('/team/teamSearchFlightAction_fare.do') >= 0) {
    	// 运价查询完成
    	console.log("fare done, fill rest info.");
    	let ipt = frameContent.find("#teamName");
    	$(ipt).val("团队名");

    	ipt = frameContent.find("#contact");
    	$(ipt).val("联系人");

    	ipt = frameContent.find("#contactMobile");
    	$(ipt).val("13988880000");
    }

  }  
});
