'use client';

// Client Component - Selección de asientos con i18n

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const SeatSelectionClient = ({ movie, time, screeningId, screeningPrice = 12, lang, dict }) => {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [paymentData, setPaymentData] = useState({
    cardName: 'Usuario Demo',
    cardNumber: '4111 1111 1111 1111',
    cardExpiry: '12/28',
    cardCvv: '123'
  });

  const generateSeats = () => {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    for (let row of rows) {
      for (let num = 1; num <= 10; num++) {
        const seatId = `${row}${num}`;
        const isOccupied = Math.random() < 0.3;
        seats.push({
          id: seatId,
          row: row,
          number: num,
          isOccupied: isOccupied,
          isSelected: false
        });
      }
    }
    return seats;
  };

  const [seats] = useState(generateSeats());

  const toggleSeat = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (seat && !seat.isOccupied) {
      if (selectedSeats.includes(seatId)) {
        setSelectedSeats(selectedSeats.filter(id => id !== seatId));
      } else {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const getSeatClasses = (seat) => {
    const isSelected = selectedSeats.includes(seat.id);

    return clsx(
      'aspect-square rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300 border-2',
      {
        'bg-cinema-red/70 text-white border-cinema-red-dark cursor-not-allowed': seat.isOccupied,
        'bg-cinema-gold text-cinema-dark border-cinema-gold shadow-lg shadow-cinema-gold/50 cursor-pointer': !seat.isOccupied && isSelected,
        'bg-green-600 text-white border-green-600 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-green-500/50': !seat.isOccupied && !isSelected,
      }
    );
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError(null);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          screeningId,
          seats: selectedSeats,
          paymentData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error procesando el pago');
      }

      setPaymentSuccess(true);

      setTimeout(() => {
        router.push(`/${lang}/profile`);
      }, 2000);

    } catch (error) {
      setPaymentError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const totalPrice = selectedSeats.length * screeningPrice;

  return (
    <>
      <div className="bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated p-6 md:p-10 lg:p-12 rounded-2xl shadow-lg shadow-black/50 border border-cinema-border max-w-4xl mx-auto my-8">
        <button
          onClick={() => router.back()}
          className="mb-6 bg-gradient-to-r from-cinema-gold to-cinema-gold-dark text-cinema-dark px-5 py-2 rounded-lg font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-gold/50 transition-all duration-300"
        >
          {dict.movie.back}
        </button>

        <h1 className="text-cinema-gold text-2xl md:text-3xl font-bold mb-2">🎟️ {dict.session.title}</h1>
        <h2 className="text-cinema-text text-lg md:text-xl mb-8">{movie.title} - {decodeURIComponent(time)}</h2>

        {/* Pantalla */}
        <div className="mb-10">
          <div className="w-full bg-gradient-to-b from-cinema-dark-elevated to-cinema-dark py-4 rounded-lg border-2 border-cinema-border text-cinema-gold font-bold text-center shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            🎬 {dict.session.screen} 🎬
          </div>
        </div>

        {/* Grid de asientos */}
        <div className="grid grid-cols-10 gap-2 md:gap-3 lg:gap-4 max-w-3xl mx-auto mb-10">
          {seats.map((seat) => (
            <div
              key={seat.id}
              className={getSeatClasses(seat)}
              onClick={() => toggleSeat(seat.id)}
            >
              {seat.id}
            </div>
          ))}
        </div>

        {/* Leyenda */}
        <div className="flex justify-center gap-8 flex-wrap mb-10 py-4">
          <div className="flex items-center gap-2 text-cinema-text-muted text-sm">
            <span className="w-5 h-5 rounded bg-green-600"></span>
            {dict.session.available}
          </div>
          <div className="flex items-center gap-2 text-cinema-text-muted text-sm">
            <span className="w-5 h-5 rounded bg-cinema-gold"></span>
            {dict.session.selected}
          </div>
          <div className="flex items-center gap-2 text-cinema-text-muted text-sm">
            <span className="w-5 h-5 rounded bg-cinema-red/70"></span>
            {dict.session.occupied}
          </div>
        </div>

        {/* Resumen */}
        {selectedSeats.length > 0 && (
          <div className="text-center p-6 bg-cinema-dark-elevated rounded-xl border border-cinema-gold shadow-lg shadow-cinema-gold/20">
            <h3 className="text-cinema-gold font-bold text-lg mb-2">
              {dict.session.selectedSeats}: {selectedSeats.join(', ')}
            </h3>
            <p className="text-cinema-text-muted text-lg mb-4">
              {dict.session.total}: {selectedSeats.length} × {screeningPrice}€ = <strong className="text-cinema-gold text-xl">{totalPrice.toFixed(2)}€</strong>
            </p>
            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={!screeningId}
              className={clsx(
                "bg-gradient-to-r from-cinema-red to-cinema-red-dark text-white px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300",
                screeningId
                  ? "hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cinema-red/50 hover:brightness-110"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              🎟️ {dict.session.confirmReservation}
            </button>
            {!screeningId && (
              <p className="text-red-400 text-sm mt-2">
                {dict.session.selectSeats}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Modal de Pago */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className={clsx(
            "w-full max-w-md",
            "bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated",
            "rounded-2xl shadow-2xl border border-cinema-border",
            "p-6 md:p-8"
          )}>
            {paymentSuccess ? (
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-cinema-gold text-2xl font-bold mb-4">
                  {dict.session.success}
                </h2>
                <p className="text-cinema-text text-sm">
                  {dict.session.redirecting}
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-cinema-gold text-xl font-bold">
                    {dict.session.paymentTitle}
                  </h2>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="text-cinema-text-muted hover:text-cinema-text text-2xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="bg-cinema-dark-elevated p-4 rounded-lg border border-cinema-border mb-6">
                    <p className="text-cinema-text-muted text-sm">{dict.session.selectedSeats}</p>
                    <p className="text-cinema-gold font-semibold">{selectedSeats.join(', ')}</p>
                    <p className="text-cinema-text-muted text-sm mt-2">{dict.session.total}</p>
                    <p className="text-cinema-gold text-xl font-bold">{totalPrice.toFixed(2)}€</p>
                  </div>

                  <div>
                    <label className="block text-cinema-text-muted text-sm mb-1">
                      {dict.session.cardName}
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={paymentData.cardName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 rounded-lg bg-cinema-dark-elevated border border-cinema-border text-cinema-text focus:border-cinema-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-cinema-text-muted text-sm mb-1">
                      {dict.session.cardNumber}
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handleInputChange}
                      required
                      maxLength={19}
                      className="w-full p-3 rounded-lg bg-cinema-dark-elevated border border-cinema-border text-cinema-text focus:border-cinema-gold focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-cinema-text-muted text-sm mb-1">
                        {dict.session.expiry}
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={paymentData.cardExpiry}
                        onChange={handleInputChange}
                        required
                        maxLength={5}
                        className="w-full p-3 rounded-lg bg-cinema-dark-elevated border border-cinema-border text-cinema-text focus:border-cinema-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-cinema-text-muted text-sm mb-1">
                        {dict.session.cvv}
                      </label>
                      <input
                        type="text"
                        name="cardCvv"
                        value={paymentData.cardCvv}
                        onChange={handleInputChange}
                        required
                        maxLength={3}
                        className="w-full p-3 rounded-lg bg-cinema-dark-elevated border border-cinema-border text-cinema-text focus:border-cinema-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  {paymentError && (
                    <div className="p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-400 text-sm">
                      {paymentError}
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      disabled={isProcessing}
                      className="flex-1 p-3 rounded-lg font-bold bg-cinema-dark-elevated border border-cinema-border text-cinema-text-muted hover:text-cinema-text transition-all duration-300"
                    >
                      {dict.session.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className={clsx(
                        "flex-1 p-3 rounded-lg font-bold",
                        "bg-gradient-to-r from-cinema-gold to-cinema-gold-dark text-cinema-dark",
                        "hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-gold/50",
                        "transition-all duration-300",
                        isProcessing && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isProcessing ? dict.session.processing : `${dict.session.pay} ${totalPrice.toFixed(2)}€`}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SeatSelectionClient;
