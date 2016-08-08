chrome.browserAction.onClicked.addListener(function(){
	var newURL = "chrome://newtab/";
	chrome.tabs.create({ url: newURL });
});
