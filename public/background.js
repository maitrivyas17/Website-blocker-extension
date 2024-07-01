chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  chrome.storage.local.get(['blockedSites', 'isBlockingEnabled'], (result) => {
    const blockedSites = result.blockedSites || [];
    const isBlockingEnabled = result.isBlockingEnabled ?? true;

    if (isBlockingEnabled) {
      const url = new URL(details.url);
      if (blockedSites.includes(url.hostname)) {
        chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("blocked.html") });
      }
    }
  });
}, { url: [{ schemes: ['http', 'https'] }] });
