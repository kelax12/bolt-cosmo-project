import React, { useState } from 'react';
import { CreditCard, X, Lock, Check, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateCard = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!cardData.number || cardData.number.replace(/\s/g, '').length < 16) {
      newErrors.number = 'Numéro de carte invalide';
    }
    
    if (!cardData.expiry || !/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      newErrors.expiry = 'Format MM/AA requis';
    }
    
    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = 'CVV invalide';
    }
    
    if (!cardData.name.trim()) {
      newErrors.name = 'Nom requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'number') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }
    
    setCardData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card' && !validateCard()) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simulation du traitement du paiement
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
      onClose();
      
      // Reset form
      setCardData({ number: '', expiry: '', cvv: '', name: '' });
      setErrors({});
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md max-h-[95vh] overflow-y-auto overflow-hidden transition-colors">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
              <h2 className="text-lg sm:text-xl font-bold">Paiement Sécurisé</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              disabled={isProcessing}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold">3,50€</div>
            <div className="text-sm sm:text-base text-blue-100">Abonnement mensuel</div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Méthodes de paiement */}
          <div className="mb-6">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-3">Méthode de paiement</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                }`}
              >
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 text-slate-700 dark:text-slate-300" />
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Carte bancaire</div>
              </button>
              
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  paymentMethod === 'paypal'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                }`}
              >
                <div className="text-2xl mb-2">💳</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">PayPal</div>
              </button>
            </div>
          </div>

          {/* Formulaire de carte */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Numéro de carte
                </label>
                <input
                  type="text"
                  value={cardData.number}
                  onChange={(e) => handleCardInputChange('number', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full p-2 sm:p-3 border-2 rounded-xl text-sm sm:text-base ${
                    errors.number ? 'border-red-300' : 'border-gray-200'
                  } dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors`}
                  maxLength={19}
                />
                {errors.number && (
                  <div className="flex items-center gap-2 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.number}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Expiration
                  </label>
                  <input
                    type="text"
                    value={cardData.expiry}
                    onChange={(e) => handleCardInputChange('expiry', e.target.value)}
                    placeholder="MM/AA"
                    className={`w-full p-2 sm:p-3 border-2 rounded-xl text-sm sm:text-base ${
                      errors.expiry ? 'border-red-300' : 'border-gray-200'
                    } dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors`}
                    maxLength={5}
                  />
                  {errors.expiry && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      {errors.expiry}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                    placeholder="123"
                    className={`w-full p-2 sm:p-3 border-2 rounded-xl text-sm sm:text-base ${
                      errors.cvv ? 'border-red-300' : 'border-gray-200'
                    } dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors`}
                    maxLength={4}
                  />
                  {errors.cvv && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-xs">
                      <AlertCircle className="w-3 h-3" />
                      {errors.cvv}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Nom sur la carte
                </label>
                <input
                  type="text"
                  value={cardData.name}
                  onChange={(e) => handleCardInputChange('name', e.target.value)}
                  placeholder="Jean Dupont"
                  className={`w-full p-2 sm:p-3 border-2 rounded-xl text-sm sm:text-base ${
                    errors.name ? 'border-red-300' : 'border-gray-200'
                  } dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-blue-500 focus:outline-none transition-colors`}
                />
                {errors.name && (
                  <div className="flex items-center gap-2 mt-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PayPal */}
          {paymentMethod === 'paypal' && (
            <div className="mb-6 p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl transition-colors">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">💳</div>
                <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">PayPal</div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Vous serez redirigé vers PayPal pour finaliser votre paiement de manière sécurisée.
              </p>
            </div>
          )}

          {/* Sécurité */}
          <div className="mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div className="text-sm sm:text-base font-bold text-green-800 dark:text-green-200">Paiement 100% sécurisé</div>
            </div>
            <div className="space-y-1 text-sm text-green-700 dark:text-green-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Chiffrement SSL 256-bit</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Aucune donnée stockée</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Annulation possible à tout moment</span>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-6 py-2 sm:py-3 rounded-lg transition-all font-medium text-sm sm:text-base"
              disabled={isProcessing}
            >
              Annuler
            </button>
            <button
              onClick={handlePayment}
              className="flex-1 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-6 py-2 sm:py-3 rounded-lg transition-all font-medium text-sm sm:text-base"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Traitement...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  <span>Payer 3,50€</span>
                </div>
              )}
            </button>
          </div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-700 text-center text-sm text-slate-600 dark:text-slate-300 transition-colors">
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
