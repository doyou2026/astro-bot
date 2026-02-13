'use client';

import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [showResult, setShowResult] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 pt-16">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">
          Оракул | Хорар
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Ответ звезд на любой вопрос
        </p>
      </div>

      {/* Card */}
      <div className="
        w-full max-w-md
        bg-white/10
        backdrop-blur-xl
        rounded-3xl
        p-6
        shadow-2xl
        border border-white/20
        transition-all
        duration-300
      ">

        {!showResult ? (
          <>
            {/* Select */}
            <label className="block text-sm text-gray-300 mb-2">
              Сфера
            </label>

            <div className="relative mb-5">
              <select
                className="
                  w-full
                  appearance-none
                  bg-white/10
                  border border-white/20
                  rounded-xl
                  px-4 py-3
                  text-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-400
                  transition
                "
              >
                <option>💖 Отношения</option>
                <option>💰 Деньги</option>
                <option>🔮 Будущее</option>
              </select>
            </div>

            {/* Textarea */}
            <label className="block text-sm text-gray-300 mb-2">
              Вопрос
            </label>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Например: Помиримся ли мы?"
              className="
                w-full
                h-24
                bg-white/10
                border border-white/20
                rounded-xl
                px-4 py-3
                text-white
                placeholder-gray-400
                focus:outline-none
                focus:ring-2
                focus:ring-blue-400
                transition
              "
            />

            {/* Button */}
            <button
              disabled={!question}
              onClick={() => setShowResult(true)}
              className="
                w-full
                mt-6
                py-3
                rounded-xl
                bg-white
                text-black
                font-medium
                hover:scale-[1.02]
                active:scale-[0.98]
                transition
                disabled:opacity-40
              "
            >
              Спросить звезды ✨
            </button>
          </>
        ) : (
          <div className="text-center animate-fadeIn">
            <h2 className="text-2xl font-semibold mb-4">
              Карта построена
            </h2>
            <p className="text-gray-300 mb-6">
              Ответ скрыт звездами
            </p>

            <button
              className="
                px-6 py-3
                rounded-full
                bg-white
                text-black
                font-medium
                hover:scale-105
                active:scale-95
                transition
              "
            >
              Открыть за $5
            </button>

            <button
              onClick={() => setShowResult(false)}
              className="block mx-auto mt-6 text-gray-400 text-sm hover:text-white transition"
            >
              ← Назад
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
