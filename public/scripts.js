(() => {
    const content = document.querySelector('.content');
    const screen = content.querySelector('.screen');
    const form = document.querySelector('form');
    const input = form.querySelector('input');

    const postData = async (url = '', data = {}) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        return response.json();
    };

    const askAI = async (prompt) => {
        if (!prompt) return;
        input.value = '';

        try {
            createReply(prompt, 'user');
            const aiReply = createReply('.', 'ai');

            const loader = setInterval(() => {
                aiReply.innerHTML += '.';
                if (aiReply.textContent.length === 4) {
                    aiReply.innerHTML = '.';
                }
            }, 500);

            const response = await postData('/ask', { prompt });

            clearInterval(loader);
            aiReply.innerHTML = response.answer;
            content.scrollTop = content.scrollHeight;
        } catch (error) {}
    };

    const createReply = (text = '', className = 'ai') => {
        const reply = document.createElement('div');
        const message = document.createElement('div');

        reply.classList.add(className);
        message.classList.add('message');
        message.innerHTML = text;

        reply.appendChild(message);
        screen.appendChild(reply);

        content.scrollTop = content.scrollHeight;
        return message;
    };

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();

        askAI(input.value);
    });
})();
