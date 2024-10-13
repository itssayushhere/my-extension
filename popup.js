document.getElementById('save-button').addEventListener('click', function() {
    const link = document.getElementById('link-input').value;
    if (link) {
      chrome.storage.sync.set({ savedLink: link }, function() {
        alert('Link saved!');
      });
    }
});


document.getElementById('current-tab-button').addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const tab = tabs[0]; // Get the first tab from the array
        alert(tab.url);
    });
});
