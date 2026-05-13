const apiKey = 'AIzaSyBMnnFhFFYL_CuAwd-XkIXpfKtRAUJB82E';
const query = 'hello';

async function test() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: query }]
                }],
                generationConfig: {
                    maxOutputTokens: 150,
                    temperature: 0.7
                }
            })
        });

        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Test error:', error);
    }
}

test();
