const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY,
})

const completion = openai.chat.completions.create({
  model: process.env.OPENAI_MODEL,
  store: true,
  messages: [
    {"role": "user", "content": "write a haiku about ai"},
  ],
});

completion.then((result) => console.log(result.choices[0].message));