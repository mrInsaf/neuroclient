// src/pages/Models.jsx
import React, { useState, useEffect } from "react";
import ModelViewer from "../components/ModelViewer";
import API_CONFIG from "../config";

const Models = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/models`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Преобразуем объект в массив моделей
        const modelList = Object.values(data).map(model => ({
          id: model.id,
          name: model.name,
          likes: model.likes,
          url: `${API_CONFIG.BASE_URL}/models/${model.id}/download`
        }));
        
        setModels(modelList);
      } catch (err) {
        setError(err.message);
        console.error("Ошибка загрузки моделей:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const likeModel = async (id) => {
    try {
      // Отправляем POST-запрос на бэкенд
      const response = await fetch(`${API_CONFIG.BASE_URL}/models/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      // Проверяем успешность запроса
      if (!response.ok) {
        throw new Error("Ошибка сервера при постановке лайка");
      }

      // Получаем обновленное количество лайков от сервера
      const result = await response.json();

      // Обновляем локальное состояние с новым количеством лайков
      setModels((prevModels) =>
        prevModels.map((model) =>
          model.id === id ? { ...model, likes: result.likes } : model
        )
      );
    } catch (error) {
      console.error("Ошибка при постановке лайка:", error);
      alert("Не удалось поставить лайк. Проверьте соединение.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-6">
        <strong className="font-bold">Ошибка: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="bg-dark min-h-screen p-6 text-light">
      <h1 className="text-primary text-3xl md:text-4xl font-bold mb-8">Модели</h1>

      {models.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-400">Пока нет загруженных моделей</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <li
              key={model.id}
              className="bg-gray-800 p-4 rounded-lg shadow-md transition-transform hover:scale-105"
            >
              <div className="aspect-square w-full relative mb-4">
                <ModelViewer url={model.url} />
              </div>
              
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{model.name}</h3>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm">{model.likes} лайков</span>
                  <button
                    onClick={() => likeModel(model.id)}
                    className="bg-primary hover:bg-purple-700 text-white p-2 rounded-full transition-colors"
                    aria-label="Поставить лайк"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Models;