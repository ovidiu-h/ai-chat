import express from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Configuration, OpenAIApi } from 'openai';
import linkifyHtml from 'linkify-html';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Config OpenAI
const openai = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    }),
);

// Config server
const port = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

app.post('/ask', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            best_of: 1,
            top_p: 1,
            max_tokens: 2048,
        });

        res.status(200).json({ answer: linkifyHtml(response.data.choices[0].text.replace(/^(\n\n)/, ''), { target: { url: '_blank' } }) });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong. Please try again later.' });
    }
});

app.listen(port);
