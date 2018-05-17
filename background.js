const WEBAPP = 'http://tms-2.90sky.com/Flight';

let portFromCS, portFromPopup;

function connected(p) {
  if (p.name === 'port-popup') {
    portFromPopup = p;
    portFromPopup.postMessage({greeting: "hi, I am background script!"});
    portFromPopup.onMessage.addListener(function(m) {
      // console.log("In background script, received message from content script")
      console.log("to:" + m.to)
      if (m.to === "content") {
        // console.log("portFromCS.postMessage(m)")
        portFromCS.postMessage(m)
      } else {
        // console.log(m);
      }
    });
  } else if (p.name === 'port-content') {
    portFromCS = p;
    portFromCS.postMessage({greeting: "hi, I am background script!"});
    portFromCS.onMessage.addListener(function(m) {
      if (m.to === "content") {
        portFromCS.postMessage(m)
      } else if (m.to === "server" && m.action === 'done') {
        autoFillFormDone(m.id);
      } else {
        console.log(m);
      }
    });    
  }

}

browser.runtime.onConnect.addListener(connected);

function logUrlBeforeRequest(requestDetails) {
  console.log("Loading: " + requestDetails.url);
  // console.log(requestDetails);
}

browser.webRequest.onBeforeRequest.addListener(
  logUrlBeforeRequest,
  {urls: ["*://travel.ceair.com/team/*"]}
);

browser.webRequest.onCompleted.addListener(
  logUrlCompleted,             // function
  {urls: ["*://travel.ceair.com/team/*"]}
)

function logUrlCompleted(requestDetails) {
  console.log("Completed: " + requestDetails.url);
  // console.log(requestDetails);
  portFromCS.postMessage({'action': 'request_done',
   requestDetails});
}

function autoFillFormDone(id) {
  //通知后台该订单自动填表完毕
  const url = WEBAPP + "/charterFlight/" + id + "/status/applying/webext";
  $.post(url, function(v) {
    console.log(v)
  })    
}

// function openPage() {
//   browser.tabs.create({
//     url: "http://bijia.buk.cn"
//   });
// }

// browser.browserAction.onClicked.addListener(openPage);