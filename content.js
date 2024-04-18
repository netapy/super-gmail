// Fonction pour envoyer une requête à l'API OpenRouter
async function sendRequestToOpenRouter(prompt, apiKey) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// Fonction pour insérer un bouton dans la fenêtre de rédaction de Gmail
function insertButton(apiKey) {
    const composeWindow = document.querySelector('div[role="textbox"]');
    if (composeWindow && !document.querySelector('.generate-button')) {
        const button = document.createElement('button');
        button.textContent = 'AI Response';
        button.classList.add('generate-button');
        button.style.position = 'absolute';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.backgroundColor = '#1a73e8';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '10px 20px';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';
        button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        button.addEventListener('click', function() {
            generateResponse(apiKey);
        });
        document.body.appendChild(button);
    }
}



// Fonction pour générer une réponse IA
async function generateResponse(apiKey) {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 10000;">
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border-radius: 5px;">
                <h2>Enter instructions for the AI model:</h2>
                <textarea id="instructions-input" rows="4" cols="50"></textarea>
                <br>
                <button id="instructions-submit">Submit</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#instructions-submit').addEventListener('click', async function() {
        const instructions = modal.querySelector('#instructions-input').value;
        document.body.removeChild(modal);

        const emailBody = document.querySelector('div[role="textbox"]').innerText;
        const prompt = `${instructions}\n\nVoici le contenu d'un email :\n${emailBody}\n\nGénère une réponse appropriée à cet email.`;

        // Show loading animation
        const loadingElement = document.createElement('div');
        loadingElement.innerHTML = '<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(0, 0, 0, 0.8); color: white; padding: 20px; border-radius: 5px; z-index: 10000;">Generating response...</div>';
        document.body.appendChild(loadingElement);

        const response = await sendRequestToOpenRouter(prompt, apiKey);
        document.querySelector('div[role="textbox"]').innerText = response;

        // Remove loading animation
        document.body.removeChild(loadingElement);
    });
}


// Observateur de mutation pour détecter l'ouverture de la fenêtre de rédaction
chrome.storage.sync.get(['apiKey'], function(items) {
    const observer = new MutationObserver(function (mutations) {
        if (!document.querySelector('.generate-button')) {
            insertButton(items.apiKey);
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
