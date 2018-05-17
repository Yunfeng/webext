let contentPort = browser.runtime.connect({name:"port-content"});
// console.log(myPort)
// contentPort.postMessage({greeting: "hello from content script"});

let flightNos;
let flightIndex = -1;
let step = 0;
let teamData = null;

// const content = {
  // 'id': v.id,
//       'count': v.totalSeats,
//       'linkMan': v.linkMan,
//       'mobile': v.contactMobile,
//       'teamName': v.name,
//       'flights': []
//     }

//     for (const flt0 of v.details) {
//       const flt2 = flt0.flight
//       const flt = {
//           'flightNo': flt2.flightNo,
//           'ddate': flt2.departureDate,
//           'dport': flt2.departureAirport,
//           'aport': flt2.arrivalAirport
//       }
//       content.flights.push(flt);
//     }


function searchFare() {
  step = 2;
  const frameContent = $("#fm" ).contents();
  let strFilter = "[onclick*='checkConectInfoAndQueryTeamFareAction(0)']";
  let ipt = frameContent.find("#form1 input").filter(strFilter).get(0);
  console.log("searchFare");
  console.log(ipt);
  $(ipt).click();
};

function reset() {
	flightIndex = -1;
	step = 0;
	flightNos = null;	
  teamData = null;
};

contentPort.onMessage.addListener(function(m){
  console.log(m);
  const frameContent = $("#fm" ).contents();

  if (m.action === 'reset') {
  	reset();
  } else if (m.action === "login") {
    // console.log($("#j_username"))
    // console.log($(".item-tip"))
    $(".item-tip").addClass("item-tip-on");
    $("#j_username").val("username");
    $("#j_password").val(m.password);
  } else if (m.action === "data" && step === 0) {
    teamData = m.content;
    console.log(teamData);
    step = 1;

    const element = frameContent.find("#adtNum").get(0);
    $(element).val(teamData.count);

    const curCodes = frameContent.find("input").filter("[name='team.depCd']");
    if (curCodes.length === 1) {
    	const btnAdd = frameContent.find("a .add")
    	$(btnAdd).click()
    }

    flightIndex = 0;

    fillFlightData();   
  } else if (m.action === "request_done") {
    const url = m.requestDetails.url;
    console.log("done: " + url);
    if (url.indexOf('/team/teamSearchFlightAction_check.do') >= 0) {
    	// 查询航班完成
	    if (flightIndex === 0) {
        const flightNo = teamData.flights[flightIndex].flightNo;
	      const strFilter = "[onclick*='" + flightNo + "']";
	      const ipt = frameContent.find("#teamFlight____ input").filter(strFilter).get(0);
	      $(ipt).click();
	    } else if (flightIndex === 1) {
        const flightNo = teamData.flights[flightIndex].flightNo;
        const strFilter = "[onclick*='" + flightNo + "']";
	      let ipt = frameContent.find("#teamFlight____ input").filter(strFilter).get(0);
	      $(ipt).click();
	    }    	
    } else if (url.indexOf('/team/teamSearchFlightAction_edit.do') >= 0) {
    	// 选择航班完成
    	if (flightIndex === 0) {
	      	flightIndex = 1;
          fillFlightData();
    	} else if (flightIndex === 1) {
	      flightIndex = -1;
	      searchFare();
    	}
    } else if (url.indexOf('/team/teamSearchFlightAction_fare.do') >= 0) {
    	// 运价查询完成
    	console.log("fare done, fill rest info.");
    	let ipt = frameContent.find("#teamName");
    	$(ipt).val(teamData.teamName);
      // console.log(ipt);

    	ipt = frameContent.find("#contact");
    	$(ipt).val(teamData.linkMan);
      // console.log(ipt);

    	ipt = frameContent.find("#contactMobile");
    	$(ipt).val(teamData.mobile);

      // console.log(ipt);
      // console.log(ipt.length);

      // 发送信息完成
      if (ipt.length > 0) {
        const params = {
          'id': teamData.id,
          'to': 'server',
          'action': 'done'
        }
        contentPort.postMessage(params);
      } else {
        console.log("failed?");
      }
    }

  }  
});

function fillFlightData() {
  if (flightIndex < 0) return;

  const frameContent = $("#fm" ).contents();

  const curCodes = frameContent.find("input").filter("[name='team.depCd']");
    if (curCodes.length < (flightIndex+1)) {
      const btnAdd = frameContent.find("a .add")
      $(btnAdd).click()
    }

    const depCodes = frameContent.find("input").filter("[name='team.depCd']");
    $(depCodes.get(flightIndex)).val(teamData.flights[flightIndex].dport);

    const arrCodes = frameContent.find("input").filter("[name='team.arrCd']");
    $(arrCodes.get(flightIndex)).val(teamData.flights[flightIndex].aport);

    const depDates = frameContent.find("input").filter("[name='team.depDt']");
    $(depDates.get(flightIndex)).val(teamData.flights[flightIndex].ddate);

    flightNos = frameContent.find("input").filter("[name='team.flightNo']");
    $(flightNos.get(flightIndex)).click();
}
