import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { telegram_id } = await req.json();

    if (!telegram_id) {
      return NextResponse.json(
        { error: 'No telegram_id' },
        { status: 400 }
      );
    }

    const token = process.env.CRYPTO_PAY_TOKEN;

    if (!token) {
      return NextResponse.json(
        { error: 'No CRYPTO_PAY_TOKEN' },
        { status: 500 }
      );
    }

    const invoiceRes = await fetch(
      'https://pay.crypt.bot/api/createInvoice',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Crypto-Pay-API-Token': token,
        },
        body: JSON.stringify({
          asset: 'USDT',
          amount: 5,
          description: 'Horary answer access',
          hidden_message: `User ID: ${telegram_id}`,
          paid_btn_name: 'openBot',
          paid_btn_url: 'https://t.me/YOUR_BOT_USERNAME',
        }),
      }
    );

    const invoiceData = await invoiceRes.json();

    if (!invoiceData.ok) {
      return NextResponse.json(
        { error: invoiceData },
        { status: 500 }
      );
    }

    return NextResponse.json({
      pay_url: invoiceData.result.pay_url,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
