const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const GROK_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const getGrokApi = async (req, res, next) => {
 
  try {
     console.log('id a rhy hn '+req.body.check11)
    const response = await axios.post(
      GROK_API_URL,
      {
        model: 'llama3-70b-8192', // ✅ RECOMMENDED CURRENT MODEL
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: req.body.prompt }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.choices[0].message;
    // const aiResponse = req.body.check11;
    // console.log(aiResponse.content)
    // const getUser=user.find()
    // const User=new user(
    //   {

    //   }
    // )
    res.status(200).json(aiResponse);
  } catch (error) {
    console.error('Error in Grok API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch response from Grok AI' });
  }
};
// controllers/groqImage.js



const summarizeText = async (req, res) => {
    console.log(req.body.text)
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes any input text.'
          },
          {
            role: 'user',
            content: `Summarize the following:\n\n${req.body.text}`
          }
        ],
        temperature: 0.5
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json({ summary: response.data.choices[0].message.content });
  } catch (error) {
    console.error('Summarization Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Text summarization failed' });
  }
};
const generateCode = async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a skilled developer. Generate clean, well-formatted code based on the user\'s prompt.',
          },
          {
            role: 'user',
            content: `only code  no explanation and no example and no usage of this prompt ${prompt}`
          }
        ],
        temperature: 0.5,
        max_tokens: 1000
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const code = response.data.choices[0].message.content;
    res.status(200).json({ code });
  } catch (error) {
    console.error('Code Gen Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Code generation failed' });
  }
};


// const generateImage = async (req, res) => {
//   const prompt = req.body.prompt;

//   try {
//     const response = await axios.post(
//       "https://api.stability.ai/v2beta/stable-image/generate/core",
//       {
//         prompt: prompt,
//         output_format: "url",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const imageUrl = response.data.artifacts?.[0]?.url;

//     if (!imageUrl) {
//       throw new Error("No image URL returned by API");
//     }

//     res.status(200).json({ imageUrl });
//   } catch (error) {
//     console.error("Image generation error:", error.response?.data || error.message);
//     res.status(500).json({ error: "Image generation failed" });
//   }
// };

const FormData = require("form-data");
const user = require('../models/user');
;

const generateImage = async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("output_format", "jpeg"); // ✅ valid enum value

    const response = await axios.post(
      "https://api.stability.ai/v2beta/stable-image/generate/core",
      formData,
      {
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer", // 🖼️ important to handle binary data
      }
    );

    // Send back the image as base64 to client
    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    res.json({ image: `data:image/jpeg;base64,${base64Image}` });
  } catch (error) {
    console.log("Image generation error:", JSON.parse(error.response.data.toString('utf-8')));

    res.status(500).json({ error: "Image generation failed"+ error.response.data.toString('utf-8')});
  }
};





exports.generateImage=generateImage
exports.generateCode=generateCode
exports.summarizeText = summarizeText;


exports.getGrokApi = getGrokApi;

