// Define the saveSettings function
const saveSettings = () => {
    var apiKey = document.getElementById('api-key').value;
    var instructions = document.getElementById('instructions').value;
    console.log('Saving settings: apiKey=' + apiKey + ', instructions=' + instructions);

    chrome.storage.sync.set({ apiKey: apiKey, instructions: instructions }, function () {
        if (chrome.runtime.lastError) {
            console.error('Error setting the items: ' + chrome.runtime.lastError.message);
        } else {
            console.log('Settings saved!');
            alert('Settings saved!');
        }
    });
};

document.addEventListener('DOMContentLoaded', function () {
    // Load saved settings
    chrome.storage.sync.get(['apiKey', 'instructions'], function (items) {
        document.getElementById('api-key').value = items.apiKey || '';
        document.getElementById('instructions').value = items.instructions || '';
    });

    // Add event listener to the Save button
    document.getElementById('save-btn').addEventListener('click', saveSettings);
});
