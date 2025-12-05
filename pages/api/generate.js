import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error parsing form' });

    const prompt = fields.prompt;
    const imagePath = files.image.filepath;

    try {
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));
      formData.append('prompt', prompt);

      const response = await fetch('https://api.groq.com/v1/video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: formData,
      });

      const result = await response.json();
      res.status(200).json({ videoUrl: result.video_url });
    } catch (error) {
      res.status(500).json({ error: 'Error generating video' });
    }
  });
}
