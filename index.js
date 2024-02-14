const express = require('express');
const { OpenAI } = require("openai");
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Importing and setting up the OpenAI API client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/handler', async (req, res) => {
    try {
        const { transcription } = req.body;
        const transcriptionString = String(transcription);

        const prompt = `
            Your Role: An expert at analyzing, dissecting and extracting important discussion points, questions and KPIs from a provided RAW transcription
            
            The Method:
            
            Your task is to analyze the provided content or real-time transcription of a call between a customer representative and a client. This call could be in any business context. Your task is to carefully sift through the dialogue to identify and extract all instances where the client poses questions, expresses doubts, or makes specific requests.
            
            For each point you identify, present it as a bullet point, but frame it in the third person perspective. Begin each bullet point with a leading phrase that categorizes the nature of the client's contribution, such as 'The customer wants to know:', 'The customer is unsure about:', or 'The customer requests:'. Ensure that each bullet point succinctly encapsulates the essence of the client's query or concern, maintaining clarity and conciseness.
            
            Your response should exclusively consist of the extracted points, neatly organized under the appropriate introductory sentence. Do not include any additional analysis or commentary beyond this structured format.

            The Transcription is given here: ${transcriptionString}
        `;

        const messages = [
            { role: 'system', content: prompt },
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages,
            temperature:  0.4,
            max_tokens:  400,
        });

        res.send(response.choices[0].text);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

const port = process.env.PORT ||  3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});