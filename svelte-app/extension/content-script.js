//send a message to bkgrnd when the user clicks the content window?

// chrome.runtime.sendMessage('');

// function handleResponse(message) {
//     console.log(`Message from the background script:  ${message.response}`);
//   }
  
//   function handleError(error) {
//     console.log(`Error: ${error}`);
//   }
  
//   //sendMessage function sends message value to background script
//   function notifyBackgroundPage(e) {
//     var sending = browser.runtime.sendMessage({
//       greeting: "Greeting from the content script"
//     });
//     sending.then(handleResponse, handleError);
//   }
  
//   window.addEventListener("click", notifyBackgroundPage);

// sender --- holds tab information

//{ // adds logo to page via content script
//   const img = document.createElement('img');
//   img.src = chrome.runtime.getURL('logo.png');
//   document.body.append(img);
// }// 

function handleContentResponse(request, sender, sendResponse) {
 
    //script will be executed in tab with the associated ID
      chrome.tabs.executeScript(
        request.tabId, 
        {
          code: request.script
        });
      //testing functionality
      
      console.log('from handle content response')
      
    }
    
    /**
    Listen for messages from our devtools panel.
    */
    chrome.runtime.onMessage.addListener(handleContentResponse); 