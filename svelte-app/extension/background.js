
//Store and delete port object on connection and disconnection to Devtool page
const connections = {};

//use runtime.OnConnect method to listen for a connection event and retrieve port object aka messages passed from different components of the extension
chrome.runtime.onConnect.addListener((port) => {
    const extensionListener = (message, sender, sendResponse) => {
        if(message.name === 'init') {
            //provide tabID of the Devtool page here
            //store the message in object; set connection = {tabId:port}}
            connections[message.tabId] = port
        }
    }

//add listener to DevTool page and store port on connection object
port.onMessage.addListener(extensionListener);

//remove listener to DevTool page on disconnect and remove port on connection object
port.onDisconnect.addListener((port) => {
    port.onMessage.removeListener(extensionListener);

    const tabs = Object.keys(connections);
    for (let i = 0; i < tabs.length; i += 1) {
      if (connections[tabs[i]] === port) {
        delete connections[tabs[i]];
        break;
      }
    }
  });
});

//passing information from content script to the DevTool page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    if (sender.tab) {
        const tabId = sender.tab.id;
        if (tabId in connections) {
          connections[tabId].postMessage(request);
        } else {
          return 'Tab not found in connection list';
        }
      } else {
        return 'sender.tab not defined';
      }
      return true;
    })



















//   original code
// //page will be opened when extension is installed
// chrome.runtime.onInstalled.addListener((reason) => {
//     if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
//       chrome.tabs.create({
//         url: '<our/dev/tool/panel/here>.html'
//       });
//     }
//   });
//     // sender --- holds tab information
//     // sendResponse --- used only if sending info to background script
//   function handleContentResponse(request, sender, sendResponse) {
 
//   //script will be executed in tab with the associated ID
//     // chrome.tabs.executeScript(
//     //   request.tabId, 
//     //   {
//     //     code: request.script
//     //   });
    
//   }
  
//   /**
//   Listen for messages from our devtools panel.
//   */
//   chrome.runtime.onMessage.addListener(handleContentResponse); 