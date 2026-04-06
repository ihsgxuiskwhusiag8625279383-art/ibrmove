'use client';

import { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const processImage = async () => {
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image_file', image);

    try {
      const response = await fetch('/api/remove', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Processing failed');

      const blob = await response.blob();
      setResult(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
      alert('抠图失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">AI 极速抠图</h1>
      <div className="flex flex-col gap-4 items-center">
        <input type="file" onChange={handleUpload} accept="image/*" />
        <button
          onClick={processImage}
          disabled={!image || loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? '抠图中...' : '立即处理'}
        </button>
      </div>

      {result && (
        <div className="mt-10">
          <h2 className="text-xl mb-4">处理结果：</h2>
          <img src={result} alt="Result" className="border shadow-lg rounded-lg max-w-md" />
          <a
            href={result}
            download="removed-bg.png"
            className="block mt-4 text-blue-600 underline"
          >
            下载 PNG
          </a>
        </div>
      )}
    </main>
  );
}
