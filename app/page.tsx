'use client';

import { useState, useEffect } from 'react';

// Типы для TypeScript
interface TelegramWebApp {
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
    };
  };
  openLink: (url: string) => void;
  ready: () => void;
  expand: () => void;
}

export default function Home() {
  const [userId, setUserId] = useState<number | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('love');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [prediction, setPrediction] = useState('');

  useEffect(() => {
    // Инициализация Telegram
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const tg = (window as any).Telegram.WebApp as TelegramWebApp;
      tg.ready();
      try {
        tg.expand();
      } catch (e) {
        console.log('Expand error', e);
      }

      const id = tg.initDataUnsafe?.user?.id || 123456; 
      setUserId(id);
      checkPayment(id);
    } else {
      // Для теста в браузере
      setUserId(123456);
      checkPayment(123456);
    }
  }, []);

  const checkPayment = async (id: number) => {
    try {
      const res = await fetch(`/api/check-access?id=${id}`);
      const data = await res.json();
      setIsPaid(data.is_paid);
    } catch (e) {
      console.error('Ошибка проверки:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = () => {
    if (!question.trim()) return;
    setIsCalculating(true);
    
    // Имитация магии
    setTimeout(() => {
      const answers = [
        "Луна в свободном уходе. Ответ пока скрыт, но склоняется к 'Да'.",
        "Венера в трине с Марсом. Однозначное ДА, но нужно проявить инициативу.",
        "Сатурн блокирует 7 дом. Сейчас не время, подождите 3 дня.",
        "Ретроградный Меркурий путает карты. Информация ложная.",
        "Аспект соединения указывает на успех, если вы будете действовать быстро.",
        "Юпитер дарит удачу в этом вопросе. Всё сложится лучше, чем вы думаете."
      ];
      const randomIdx = (question.length + new Date().getHours()) % answers.length;
      setPrediction(answers[randomIdx]);
      setIsCalculating(false);
      setShowResult(true);
    }, 2000);
  };

  const handleBuy = async () => {
    if (!userId) return;
    
    try {
      const res = await fetch('/api/create-invoice', {
        method: 'POST',
        body: JSON.stringify({ telegram_id: userId }),
      });
      const data = await res.json();
      
      if (data.pay_url) {
        if ((window as any).Telegram?.WebApp) {
          (window as any).Telegram.WebApp.openLink(data.pay_url);
        } else {
          window.location.href = data.pay_url;
        }
      }
    } catch (e) {
      alert('Ошибка создания счета. Попробуйте позже.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center text-white">
        <div className="animate-spin text-4xl">🔮</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-4 font-sans flex flex-col items-center">
      
      <header className="text-center mb-6 pt-4 w-full">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-sm">
          ASTRO HORARY
        </h1>
        <p className="text-xs text-purple-300 opacity-80 mt-1">Ответ звезд на любой вопрос</p>
      </header>

      <main className="w-full max-w-md flex-1 flex flex-col">
        {!showResult ? (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-5 shadow-2xl border border-white/10 flex-1 flex flex-col justify-center">
            <div className="mb-4">
              <label className="block text-[10px] uppercase tracking-wider text-purple-300 mb-2 font-semibold">Сфера</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#151525] border border-purple-500/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="love">💖 Отношения</option>
                <option value="money">💰 Деньги</option>
                <option value="destiny">🔮 Будущее</option>
              </select>
            </div>

            <div className="mb-6 flex-1">
              <label className="block text-[10px] uppercase tracking-wider text-purple-300 mb-2 font-semibold">Вопрос</label>
              <textarea 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Например: Помиримся ли мы?"
                className="w-full h-32 bg-[#151525] border border-purple-500/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-purple-500 resize-none transition-colors"
              />
            </div>

            <button 
              onClick={handleAsk}
              disabled={!question || isCalculating}
              className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg transform active:scale-95 transition-all ${
                isCalculating 
                  ? 'bg-purple-900/50 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-500/30'
              }`}
            >
              {isCalculating ? 'Связь с космосом...' : 'СПРОСИТЬ ЗВЕЗДЫ ✨'}
            </button>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-5 shadow-2xl border border-white/10 text-center relative overflow-hidden flex-1 flex flex-col">
            <button 
              onClick={() => setShowResult(false)}
              className="absolute top-4 left-4 text-purple-300 text-xs hover:text-white transition-colors flex items-center gap-1"
            >
              ← Назад
            </button>

            <div className="mt-8 mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 mb-3 animate-pulse">
                <span className="text-2xl">🌌</span>
              </div>
              <h2 className="text-lg font-semibold text-white">Карта построена</h2>
              <p className="text-[10px] text-gray-400">{new Date().toLocaleTimeString()}</p>
            </div>

            <div className="relative bg-black/40 rounded-xl p-6 border border-purple-500/20 flex-1 flex flex-col justify-center">
              {isPaid ? (
                <div>
                  <h3 className="text-green-400 font-bold text-lg mb-3 tracking-wide">ДОСТУП РАЗРЕШЕН</h3>
                  <p className="text-base leading-relaxed text-gray-100 font-medium">
                    {prediction}
                  </p>
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">Астро-данные</p>
                    <p className="text-xs text-gray-400 mt-1">Асцендент: Весы • Луна: Козерог</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                   <div className="filter blur-sm select-none text-gray-500 text-sm leading-relaxed pointer-events-none">
                      Луна входит в знак Козерога, что означает неизбежное сближение ваших судеб. Ответ однозначно положительный, но есть нюанс...
                      <br/><br/>
                      Важный аспект Сатурна указывает на то, что вам стоит подождать три дня перед решительным шагом.
                   </div>
                   
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl z-10">
                     <p className="text-white font-bold mb-4 text-sm">Ответ скрыт звездами</p>
                     <button 
                        onClick={handleBuy}
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-extrabold py-3 px-8 rounded-full shadow-lg shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all text-sm"
                     >
                       Открыть за $5
                     </button>
                     <p className="text-[10px] text-gray-500 mt-3 opacity-70">Вечный доступ • Оплата CryptoBot</p>
                   </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}