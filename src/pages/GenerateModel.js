// src/pages/NeuralNetworkPage.jsx
import React, { useState, useEffect } from "react";
import ModelViewer from '../components/ModelViewer';

const NeuralNetworkPage = () => {
  const [input, setInput] = useState("");
  const [modelUrl, setModelUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(true); // Для предотвращения обновления состояния после размонтирования

  // Переключатель dev-режима
  const dev = false;

  // Очистка blob-URL и таймеров при размонтировании
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      if (modelUrl && modelUrl.startsWith('blob:')) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [modelUrl]);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setModelUrl(null);

    if (dev) {
      try {
        // Имитация задержки в 20 секунд
        const timeoutId = setTimeout(() => {
          if (isMounted) {
            // Путь к готовой модели в папке public/examples
            const exampleModelUrl = '/examples/aiprintgen_krolik.glb'; // ← замените на нужное имя файла
            setModelUrl(exampleModelUrl);
          }
        }, 2000);

        // Очистка таймера при размонтировании
        return () => clearTimeout(timeoutId);
      } catch (err) {
        if (isMounted) {
          setError('Ошибка загрузки локальной модели');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    } else {
      // Оригинальная логика с API
      try {
        const response = await fetch("${API_CONFIG.BASE_URL}/generate_model", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify({ 
            prompt: input  // ← здесь был "input", теперь стал "prompt"
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Ошибка генерации модели");
        }

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Неизвестная ошибка");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setModelUrl(url);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative bg-dark min-h-screen flex flex-col">
      <header className="absolute top-6 left-6 text-primary text-4xl font-bold">
        Neuro3D
      </header>

      <div className="flex-grow flex justify-center items-center">
        <div className="w-full max-w-3xl bg-gray-800 text-light p-8 rounded-lg shadow-md relative">
          {isLoading ? (
            <div className="text-center text-xl animate-pulse">Генерация модели...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : modelUrl ? (
            <ModelViewer url={modelUrl} />
          ) : (
            <div className="text-center text-gray-400">Здесь появится ваша модель</div>
          )}
        </div>
      </div>

      <div className="p-4 bg-gray-900">
        <div className="flex justify-center items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Введите описание модели..."
            className="flex-grow max-w-2xl p-3 bg-gray-700 text-light rounded-l-lg focus:outline-none"
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="p-3 bg-primary text-light rounded-r-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? "Генерация..." : "Сгенерировать"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NeuralNetworkPage;