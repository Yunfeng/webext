// console.log('I\'m in background.')

// function logTabs(tabs) {
//   console.log(tabs);
// }

// browser.tabs.query({currentWindow: true}, logTabs);


var portFromCS;

function connected(p) {
  portFromCS = p;
  portFromCS.postMessage({greeting: "hi there content script!"});
  portFromCS.onMessage.addListener(function(m) {
    console.log("In background script, received message from content script")
    console.log(m.greeting);
  });
}

browser.runtime.onConnect.addListener(connected);

// console.log(browser)
browser.tabs.onActivated.addListener(function() {
  portFromCS.postMessage({greeting: "they clicked the button!"});
});