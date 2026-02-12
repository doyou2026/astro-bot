'use client';

import { useState, useEffect } from 'react';

/* ============================= */
/* Типы */
/* ============================= */

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

interface CheckAccessResponse {
  is_paid: boolean;
}

interface CreateInvoiceResponse {
  pay_url?: string;
}

/* ============================= */
/* Component */
/* ============================= */

export default function Home() {
  const [userId, setUserId] = useState<number | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('love');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [prediction, setPrediction] = useState('');

  /* ============================= */
  /* Init Telegram */
  /* ============================= */

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;

        tg.ready();

        try {
          tg.expand();
        } catch (e) {
          console.log('Expand error', e);
        }

        const id = tg.initDataUnsafe?.user?.id ?? 123456;
        setUserId(id);
        await checkPayment(id);
      } else {
        // Dev режим
        const devId = 123456;
        setUserId(devId);
        await checkPayment(devId);
      }
    };

    init();
  }, []);

  /* ============================= */
  /* Проверка оплаты */
  /* ============================= */

  const checkPayment = async (id: number) => {
    try {
      const res = await fetch(`/api/check-access?id=${id}`);

      if (!res.ok) {
        throw new Error('Ошибка запроса check-access');
      }

      const data: CheckAccessResponse = await res.json();
      setIsPaid(data.is_paid);
    } catch (e) {
      console.error('Ошибка проверки:', e);
    } finally {
      setLoading(false);
    }
  };

  /* ============================= */
  /* Генерация ответа */
  /* ============================= */

  const handleAsk = () => {
    if (!question.trim()) return;

    setIsCalculating(true);

    setTimeout(() => {
      const answers = [
        "Луна в свободном уходе. Ответ пока скрыт, но склоняется к 'Да'.",
        "Венера в трине с Марсом. Однозначное ДА, но нужно проявить инициативу.",
        "Сатурн блокирует 7 дом. Сейчас не время, подождите 3 дня.",
        "Ретроградный Меркурий путает карты. Информация ложная.",
        "Аспект соединения указывает на успех, если вы будете действовать быстро.",
        "Юпитер дарит удачу в этом вопросе. Всё сложится лучше, чем вы думаете."
      ];

      const randomIdx =
        (question.length + new Date().getHours()) % answers.length;

      setPrediction(answers[randomIdx]);
      setIsCalculating(false);
      setShowResult(true);
    }, 2000);
  };

  /* ============================= */
  /* Покупка */
  /* ============================= */

  const handleBuy = async () => {
    if (!userId) return;

    try {
      const res = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegram_id: userId }),
      });

      if (!res.ok) {
        throw new Error('Ошибка создания счета');
      }

      const data: CreateInvoiceResponse = await res.json();

      if (data.pay_url) {
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.openLink(data.pay_url);
        } else {
          window.location.href = data.pay_url;
        }
      }
    } catch (e) {
      console.error(e);
      alert('Ошибка создания счета. Попробуйте позже.');
    }
  };

  /* ============================= */
  /* Loading */
  /* ============================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center text-white">
        <div className="animate-spin text-4xl">🔮</div>
      </div>
    );
  }

  /* ============================= */
  /* UI */
  /* ============================= */

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-4 font-sans flex flex-col items-center">
      <header className="text-center mb-6 pt-4 w-full">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-sm">
          ASTRO HORARY
        </h1>
        <p className="text-xs text-purple-300 opacity-80 mt-1">
          Ответ звезд на любой вопрос
        </p>
      </header>

      {/* Остальной JSX можешь оставить без изменений */}
    </div>
  );
}
