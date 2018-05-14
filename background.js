let portFromCS, portFromPopup;

console.log('portFromCS:' + portFromCS)
console.log('portFromPopup:' + portFromPopup)


function connected(p) {
  console.log(p)
  if (p.name === 'port-popup') {
    portFromPopup = p;
    portFromPopup.postMessage({greeting: "hi, I am background script!"});
    portFromPopup.onMessage.addListener(function(m) {
      // console.log("In background script, received message from content script")
      console.log("to:" + m.to)
      if (m.to === "content") {
        console.log("portFromCS.postMessage(m)")
        portFromCS.postMessage(m)
      } else {
        console.log(m);
      }
    });
  } else if (p.name === 'port-content') {
    portFromCS = p;
    portFromCS.postMessage({greeting: "hi, I am background script!"});
    portFromCS.onMessage.addListener(function(m) {
      // console.log("In background script, received message from content script")
      console.log("to:" + m.to)
      if (m.to === "content") {
        portFromCS.postMessage(m)
      } else {
        console.log(m);
      }
    });    
  }

}

browser.runtime.onConnect.addListener(connected);

// console.log(browser)
browser.tabs.onActivated.addListener(function() {
  portFromCS.postMessage({greeting: "Tab is activated!"});
});

function logURL(requestDetails) {
  // console.log("Loading: " + requestDetails.url);
}

browser.webRequest.onBeforeRequest.addListener(
  logURL,
  {urls: ["<all_urls>"]}
);

function openPage() {
  browser.tabs.create({
    url: "http://bijia.buk.cn"
  });
}

browser.browserAction.onClicked.addListener(openPage);