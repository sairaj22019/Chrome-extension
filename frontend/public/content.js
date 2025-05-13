chrome.runtime.onMessage.addListener((request,sender,sendResponse) => {
    if(request.action === "extractText"){
        const pageText = document.body.innerText;
        console.log(pageText);
        sendResponse({text: pageText});
    }
});
