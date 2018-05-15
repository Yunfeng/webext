let contentPort = browser.runtime.connect({name:"port-content"});
// console.log(myPort)
// contentPort.postMessage({greeting: "hello from content script"});

let flightNos;
let flightIndex = -1;
let step = 0;


const searchFare = function() {
  step = 2;
  const frameContent = $("#fm" ).contents();
  let strFilter = "[onclick*='checkConectInfoAndQueryTeamFareAction']";
  let ipt = frameContent.find("#form1 input").filter(strFilter).get(0);
  console.log(ipt);
  $(ipt).click();
};

contentPort.onMessage.addListener(function(m){
    // console.log("In content script, received message from background script: ");
  console.log(m);
  console.log(step);
  const frameContent = $("#fm" ).contents();

  if (m.action === "login") {
    console.log($("#j_username"))
    console.log($(".item-tip"))
    $(".item-tip").addClass("item-tip-on");
    $("#j_username").val("username");
    $("#j_password").val(m.password);
  } else if (m.action === "data" && step === 0) {
    step = 1;

    const frameContent = $("#fm" ).contents();

    const element = frameContent.find("#adtNum").get(0);
    $(element).val(20);

    const btnAdd = frameContent.find("a .add")
    $(btnAdd).click()

    
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
    if (url.indexOf('/team/teamSearchFlightAction_check.do') < 0) return;

    console.log("flightIndex: " + flightIndex);
    if (flightIndex === 0) {
      const strFilter = "[onclick*='MU5752']";
      const ipt = frameContent.find("#teamFlight____ input").filter(strFilter).get(0);
      console.log(ipt);
      $(ipt).click();

      $(flightNos.get(1)).click();
      flightIndex = 1;
    } else if (flightIndex === 1) {
      let strFilter = "[onclick*='MU5751']";
      let ipt = frameContent.find("#teamFlight____ input").filter(strFilter).get(0);
      // console.log(ipt);
      $(ipt).click();
      flightIndex = -1;
      // 第一步完成，下一步查找运价
      console.log(this);
      setTimeout("searchFare()", 1500);
      
    }
  }  
});
