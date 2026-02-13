'use client';

import { useState, useEffect } from 'react';

interface TelegramWebApp {
  initDataUnsafe?: {
    user?: {
      id: number;
      first_name?: string;
    };
  };
  openLink: (url: string) => void;
  ready: () => void;
  expand: () => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export default function Home() {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('love');
  const [showResult, setShowResult] = useState(false);
  const [prediction, setPrediction] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  /* ============================= */
  /* Telegram Init */
  /* ============================= */

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const id = tg.initDataUnsafe?.user?.id ?? null;
      setUserId(id);
      console.log("Telegram user:", id);
    } else {
      console.log("Not in Telegram WebApp");
    }
  }, []);

  /* ============================= */
  /* Ask */
  /* ============================= */

  const handleAsk = () => {
    if (!question.trim()) return;

    setIsCalculating(true);

    setTimeout(() => {
      const answers = [
        "Да. Но действуйте мягко.",
        "Сейчас не время. Подождите немного.",
        "Ответ положительный, если проявите инициативу.",
        "Нужно ещё время для прояснения.",
      ];

      setPrediction(
        answers[Math.floor(Math.random() * answers.length)]
      );
      setIsCalculating(false);
      setShowResult(true);
    }, 1500);
  };

  /* ============================= */
  /* BUY HANDLER */
  /* ============================= */

  const handleBuy = async () => {
    console.log("BUY CLICKED");

    try {
      const res = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegram_id: userId }),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errText = await res.text();
        console.error("API ERROR:", errText);
        alert("Ошибка создания счета");
        return;
      }

      const data = await res.json();
      console.log("Invoice data:", data);

      if (data.pay_url) {
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.openLink(data.pay_url);
        } else {
          window.location.href = data.pay_url;
        }
      } else {
        alert("Не получена ссылка оплаты");
      }

    } catch (err) {
      console.error("BUY ERROR:", err);
      alert("Ошибка создания счета. Попробуйте позже.");
    }
  };

  /* ============================= */
  /* UI */
  /* ============================= */

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">
            Оракул | Хорар
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Ответ звёзд на ваш вопрос
          </p>
        </div>

        {!showResult ? (
          <div className="bg-white rounded-3xl p-6 shadow-xl">

            <label className="block text-sm text-gray-500 mb-2">
              Сфера
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mb-6 bg-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="love">💖 Отношения</option>
              <option value="money">💰 Деньги</option>
              <option value="future">🔮 Будущее</option>
            </select>

            <label className="block text-sm text-gray-500 mb-2">
              Вопрос
            </label>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Например: Помиримся ли мы?"
              className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              onClick={handleAsk}
              disabled={!question || isCalculating}
              className="w-full mt-6 bg-black text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition"
            >
              {isCalculating ? 'Анализируем...' : 'Спросить звёзды'}
            </button>

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-xl">

            <button
              onClick={() => setShowResult(false)}
              className="text-sm text-gray-500 mb-6 hover:opacity-70"
            >
              ← Назад
            </button>

            <h2 className="text-xl font-semibold mb-4">
              Карта построена
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              {prediction}
            </p>

            <button
              onClick={handleBuy}
              className="w-full bg-black text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition"
            >
              Открыть полный разбор — $5
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
