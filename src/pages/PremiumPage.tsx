import React, { useState } from 'react';
import { Crown, Zap, Play, Check, Star, Users, MessageCircle, BarChart3 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import AdModal from '../components/AdModal';
import PaymentModal from '../components/PaymentModal';

const PremiumPage: React.FC = () => {
  const { user, isPremium, watchAd, updateUserSettings } = useTasks();
  const [showSubscription, setShowSubscription] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (!user) return null;

  const premium = isPremium();

  const features = [
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Partagez vos tâches avec votre équipe',
      premium: true,
    },
    {
      icon: MessageCircle,
      title: 'Messagerie',
      description: 'Communiquez directement avec vos collaborateurs',
      premium: true,
    },
    {
      icon: BarChart3,
      title: 'Historique des interactions',
      description: 'Suivez toutes vos collaborations',
      premium: true,
    },
    {
      icon: Star,
      title: 'Fonctionnalités avancées',
      description: 'Accès à toutes les fonctionnalités premium',
      premium: true,
    },
  ];

  const handleSubscribe = () => {
    setShowSubscription(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    // Traitement après paiement réussi
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    
    updateUserSettings({
      subscriptionEndDate: endDate.toISOString(),
      premiumWinStreak: user.premiumWinStreak + 1,
      premiumTokens: user.premiumTokens + 30, // Bonus de jetons pour l'abonnement
    });
  };

  const handleWatchAd = () => {
    setShowAdModal(true);
  };

  const handleAdComplete = () => {
    watchAd();
    setShowAdModal(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl">
            <Crown size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>Cosmo Premium</h1>
        </div>
        <p className="text-xl" style={{ color: 'rgb(var(--color-text-secondary))' }}>
          Débloquez tout le potentiel de votre productivité
        </p>
      </div>

      {/* Statut actuel */}
      <div className="card p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'rgb(var(--color-text-primary))' }}>
              {premium ? '✨ Vous êtes Premium !' : '🔒 Version Gratuite'}
            </h2>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span style={{ color: 'rgb(var(--color-text-secondary))' }}>Jetons Premium:</span>
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-yellow-500" />
                  <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">{user.premiumTokens}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span style={{ color: 'rgb(var(--color-text-secondary))' }}>Win Streak:</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔥</span>
                  <span className="font-bold text-2xl text-orange-600">{user.premiumWinStreak}</span>
                  <span style={{ color: 'rgb(var(--color-text-muted))' }}>jours</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            {premium ? (
              <div className="text-lg px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold shadow-lg">
                ✨ PREMIUM ACTIF
              </div>
            ) : (
              <button
                onClick={() => setShowSubscription(true)}
                className="btn-primary text-lg px-8 py-4"
              >
                <Crown size={24} />
                <span>Passer Premium</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gagner des jetons */}
      <div className="card p-6 mb-8">
        <h3 className="text-xl font-bold mb-4" style={{ color: 'rgb(var(--color-text-primary))' }}>🎯 Gagner des jetons Premium</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-700">
            <div className="flex items-center gap-3 mb-4">
              <Play size={24} className="text-green-600 dark:text-green-400" />
              <h4 className="font-bold text-green-800 dark:text-green-200">Regarder une publicité</h4>
            </div>
            <p className="text-green-700 dark:text-green-300 mb-4">
              Regardez une courte vidéo publicitaire pour gagner 1 jeton Premium instantanément.
            </p>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">+1</div>
              <div className="text-sm text-green-600 dark:text-green-400">jeton Premium</div>
            </div>
            <button
              onClick={handleWatchAd}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Play size={20} />
              <span>Regarder pub (+1 jeton)</span>
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3 mb-4">
              <Crown size={24} className="text-blue-600 dark:text-blue-400" />
              <h4 className="font-bold text-blue-800 dark:text-blue-200">Abonnement mensuel</h4>
            </div>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Souscrivez à l'abonnement Premium pour 30 jours de statut Premium garanti.
            </p>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">3,50€</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">par mois</div>
            </div>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Crown size={20} />
              <span>S'abonner maintenant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fonctionnalités Premium */}
      <div className="card p-6 mb-8">
        <h3 className="text-xl font-bold mb-6" style={{ color: 'rgb(var(--color-text-primary))' }}>🚀 Fonctionnalités Premium</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`p-6 rounded-2xl border-2 transition-colors ${
                premium 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
              style={{
                backgroundColor: premium 
                  ? undefined 
                  : 'rgb(var(--color-hover))'
              }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className={`p-3 rounded-xl transition-colors ${
                  premium ? 'bg-green-100 dark:bg-green-800' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <feature.icon size={24} className={
                    premium ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                  } />
                </div>
                <div>
                  <h4 className="font-bold" style={{ color: 'rgb(var(--color-text-primary))' }}>{feature.title}</h4>
                  {premium && <Check size={20} className="text-green-500" />}
                </div>
              </div>
              <p style={{ color: 'rgb(var(--color-text-secondary))' }}>{feature.description}</p>
              {!premium && (
                <div className="mt-3 text-sm text-orange-600 dark:text-orange-400 font-bold">
                  🔒 Premium requis
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Comment ça marche */}
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-6" style={{ color: 'rgb(var(--color-text-primary))' }}>❓ Comment ça marche</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
              <span className="text-2xl">1️⃣</span>
            </div>
            <h4 className="font-bold mb-2" style={{ color: 'rgb(var(--color-text-primary))' }}>Gagnez des jetons</h4>
            <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
              Regardez des pubs ou souscrivez à l'abonnement pour obtenir des jetons Premium
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
              <span className="text-2xl">2️⃣</span>
            </div>
            <h4 className="font-bold mb-2" style={{ color: 'rgb(var(--color-text-primary))' }}>Consommation automatique</h4>
            <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
              1 jeton est consommé automatiquement chaque jour pour maintenir votre statut Premium
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
              <span className="text-2xl">3️⃣</span>
            </div>
            <h4 className="font-bold mb-2" style={{ color: 'rgb(var(--color-text-primary))' }}>Profitez des avantages</h4>
            <p className="text-sm" style={{ color: 'rgb(var(--color-text-secondary))' }}>
              Accédez à toutes les fonctionnalités Premium tant que vous avez des jetons
            </p>
          </div>
        </div>
      </div>

      {/* Modal d'abonnement */}
      {showSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="rounded-xl shadow-2xl w-full max-w-md p-8 transition-colors" style={{ backgroundColor: 'rgb(var(--color-surface))' }}>
            <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'rgb(var(--color-text-primary))' }}>
              Abonnement Premium
            </h2>
            
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">3,50€</div>
              <div style={{ color: 'rgb(var(--color-text-secondary))' }}>par mois</div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Check size={20} className="text-green-500" />
                <span style={{ color: 'rgb(var(--color-text-primary))' }}>30 jours de Premium garanti</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={20} className="text-green-500" />
                <span style={{ color: 'rgb(var(--color-text-primary))' }}>Toutes les fonctionnalités débloquées</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={20} className="text-green-500" />
                <span style={{ color: 'rgb(var(--color-text-primary))' }}>Pas de publicités</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={20} className="text-green-500" />
                <span style={{ color: 'rgb(var(--color-text-primary))' }}>Support prioritaire</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubscription(false)}
                className="flex-1 btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleSubscribe}
                className="flex-1 btn-primary"
              >
                S'abonner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de publicité */}
      <AdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onAdComplete={handleAdComplete}
      />

      {/* Modal de paiement */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default PremiumPage;

