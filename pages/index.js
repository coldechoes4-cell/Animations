import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file || !prompt) return alert('Upload an image and enter a prompt');
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('prompt', prompt);

    const res = await fetch('/api/generate', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setVideoUrl(data.videoUrl);
    setLoading(false);
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Image + Text to Cinematic Video</h1>
      <input type="file" onChange={e => setFile(e.target.files[0])} /><br/><br/>
      <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Enter a cinematic prompt" style={{ width: '300px' }}/><br/><br/>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Video'}
      </button>
      <div style={{ marginTop: '20px' }}>
        {videoUrl && <video src={videoUrl} controls width="600" />}
      </div>
    </div>
  );
}
