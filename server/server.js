import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from Mio GPT'
  })
})

app.post('/', async (req, res) => {
  try {
    const messages = req.body.messages;
    const model = req.body.model

    const ChatCompletion = await openai.createChatCompletion({
      model: model,
      messages: messages,
    });

    console.log(ChatCompletion.data);
    console.log('message:', ChatCompletion.data.choices[0].message);

    res.status(200).send({
      ai: ChatCompletion.data.choices[0].message.content
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on port 5000'))

console.clear()