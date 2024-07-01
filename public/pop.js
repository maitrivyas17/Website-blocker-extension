document.addEventListener('DOMContentLoaded', function() {
    const blockButton = document.getElementById('blockButton');
    const blockInput = document.getElementById('blockInput');
    const blockedSitesList = document.getElementById('blockedSitesList');
    const toggleBlocking = document.getElementById('toggleBlocking');
  
    // Load blocked sites and blocking status from storage
    chrome.storage.local.get(['blockedSites', 'isBlockingEnabled'], function(result) {
      const blockedSites = result.blockedSites || [];
      renderBlockedSites(blockedSites);
      toggleBlocking.checked = result.isBlockingEnabled ?? true; // Default to true
    });
  
    // Handle enabling/disabling blocking
    toggleBlocking.addEventListener('change', function() {
      const isEnabled = toggleBlocking.checked;
      chrome.storage.local.set({ isBlockingEnabled: isEnabled }, function() {
        console.log('Blocking is now', isEnabled ? 'enabled' : 'disabled');
      });
    });
  
    // Handle blocking new site
    blockButton.addEventListener('click', function() {
      const website = blockInput.value.trim();
      if (website) {
        chrome.storage.local.get(['blockedSites'], function(result) {
          const blockedSites = result.blockedSites || [];
          blockedSites.push(website);
          chrome.storage.local.set({ blockedSites: blockedSites }, function() {
            renderBlockedSites(blockedSites);
            blockInput.value = ''; // Clear input after blocking
          });
        });
      }
    });
  
    // Function to render blocked sites list
    function renderBlockedSites(sites) {
      blockedSitesList.innerHTML = '';
      sites.forEach(site => {
        const li = document.createElement('li');
        li.textContent = site;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', function() {
          // Remove site from blockedSites
          const index = sites.indexOf(site);
          if (index !== -1) {
            sites.splice(index, 1);
            chrome.storage.local.set({ blockedSites: sites }, function() {
              renderBlockedSites(sites); // Update list after removal
            });
          }
        });
        li.appendChild(removeButton);
        blockedSitesList.appendChild(li);
      });
    }
  });
  