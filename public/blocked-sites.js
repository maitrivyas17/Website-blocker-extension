document.addEventListener('DOMContentLoaded', function() {
    const blockedSitesList = document.getElementById('blockedSitesList');
  
    // Load blocked sites from storage and display them
    chrome.storage.local.get(['blockedSites'], function(result) {
      const blockedSites = result.blockedSites || [];
      renderBlockedSites(blockedSites);
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
  