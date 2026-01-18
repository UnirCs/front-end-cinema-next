'use client';

// Client Component - Tarjeta de orden con codigo QR y i18n

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import clsx from 'clsx';

function formatDate(dateValue, lang = 'es') {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  const locales = { es: 'es-ES', en: 'en-US', fr: 'fr-FR' };
  return date.toLocaleDateString(locales[lang] || 'es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function formatTime(timeValue) {
  if (!timeValue) return '';
  if (typeof timeValue === 'string') {
    return timeValue.substring(0, 5);
  }
  return timeValue;
}

function generateQRContent(order) {
  const ticketInfo = order.tickets.length > 0 ? order.tickets[0] : {};
  return JSON.stringify({
    orderId: order.id,
    movie: ticketInfo.movieTitle,
    date: ticketInfo.showDate,
    time: ticketInfo.showTime,
    seats: order.tickets.map(t => t.seatLabel).join(', '),
    cinema: ticketInfo.cinemaName,
    total: order.totalAmount
  });
}

export default function OrderCard({ order, dict }) {
  const qrRef = useRef(null);
  const firstTicket = order.tickets[0];
  const seats = order.tickets.map(t => t.seatLabel).join(', ');

  const statusColors = {
    paid: 'text-green-400 border-green-500',
    pending: 'text-yellow-400 border-yellow-500',
    cancelled: 'text-red-400 border-red-500',
    refunded: 'text-blue-400 border-blue-500'
  };

  const downloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const link = document.createElement('a');
      link.download = `entrada-unir-cinema-orden-${order.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className={clsx(
      'bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
      'rounded-2xl shadow-lg border border-cinema-border',
      'overflow-hidden'
    )}>
      <div className="p-4 border-b border-cinema-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-cinema-text-muted text-sm">
            Orden #{order.id}
          </span>
          <span className={clsx(
            'text-xs font-bold px-2 py-1 rounded border',
            statusColors[order.status] || statusColors.pending
          )}>
            {order.status}
          </span>
        </div>

        <h3 className="text-cinema-gold font-bold text-lg">
          🎬 {firstTicket?.movieTitle || 'Movie'}
        </h3>

        <div className="mt-2 space-y-1 text-sm">
          <p className="text-cinema-text">
            📍 {firstTicket?.cinemaName || 'Cinema'}
          </p>
          <p className="text-cinema-text">
            📅 {formatDate(firstTicket?.showDate)} - {formatTime(firstTicket?.showTime)}
          </p>
          <p className="text-cinema-text">
            💺 {dict.profile.seats}: <span className="text-cinema-gold font-semibold">{seats}</span>
          </p>
          <p className="text-cinema-text">
            🎞️ Format: <span className="uppercase">{firstTicket?.format || 'standard'}</span>
          </p>
        </div>
      </div>

      <div className="p-4 flex flex-col items-center">
        <div ref={qrRef} className="bg-white p-3 rounded-lg mb-3">
          <QRCodeSVG
            value={generateQRContent(order)}
            size={128}
            level="M"
            includeMargin={false}
          />
        </div>

        <p className="text-cinema-gold font-bold text-xl mb-2">
          {dict.session.total}: {Number(order.totalAmount).toFixed(2)}€
        </p>

        <button
          onClick={downloadQR}
          className={clsx(
            'w-full p-2 rounded-lg font-semibold text-sm',
            'bg-cinema-dark-elevated border border-cinema-border',
            'text-cinema-text-muted hover:text-cinema-gold hover:border-cinema-gold',
            'transition-all duration-300'
          )}
        >
          {dict.profile.downloadQR}
        </button>
      </div>
    </div>
  );
}
