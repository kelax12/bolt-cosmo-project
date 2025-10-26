import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  BarChart3, 
  Calendar, 
  Target, 
  Zap, 
  Star,
  Play,
  ChevronRight,
  Globe,
  Shield,
  Smartphone,
  Layers,
  TrendingUp,
  Clock,
  Brain,
  Sparkles,
  Award,
  MessageCircle,
  Eye,
  Rocket,
  Infinity,
  Database,
  Workflow
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import LoginModal from '../components/LoginModal';
import ThemeToggle from './components/ThemeToggle';

const LandingPage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [userCount, setUserCount] = useState(12847);

  // Animation du compteur d'utilisateurs
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Rotation automatique des témoignages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginClick = () => {
    setLoginMode('login');
    setShowLoginModal(true);
  };

  const handleRegisterClick = () => {
    setLoginMode('register');
    setShowLoginModal(true);
  };

  const features = [
    {
      icon: CheckCircle,
      title: 'Gestion de tâches intelligente',
      subtitle: 'Centralisez, priorisez, accomplissez',
      description: 'Organisez vos tâches avec une intelligence artificielle qui apprend de vos habitudes et optimise votre productivité.',
      benefits: [
        'Catégorisation intelligente par couleurs',
        'Deadlines avec rappels adaptatifs',
        'Suivi de progression en temps réel',
        'Organisation de vos tâches avancée',
        'Collaboration en équipe simplifiée'
      ],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Calendar,
      title: 'Agenda intégré nouvelle génération',
      subtitle: 'Planifiez avec une précision chirurgicale',
      description: 'Un calendrier qui s\'adapte à votre rythme avec synchronisation multi-plateformes et suggestions intelligentes.',
      benefits: [
        'Vue unifiée tâches + événements',
        'Organisation intelligente',
        'Placez vos tâches directement dans l\'agenda',
        'Synchronisation multi-appareils instantanée',
        'Organisation intelligente des événements'
      ],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'OKR & Objectifs stratégiques',
      subtitle: 'Transformez vos ambitions en résultats',
      description: 'Définissez et suivez vos objectifs avec la méthodologie OKR utilisée par Google, Intel et les plus grandes entreprises.',
      benefits: [
        'Framework OKR professionnel',
        'Suivi de progression visuel',
        'Alignement équipe-objectifs',
        'Métriques de performance avancées',
        'Ayez une vue d\'ensemble sur votre progression'
      ],
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Habitudes & Automatisation',
      subtitle: 'Construisez votre succès quotidien',
      description: 'Développez des habitudes durables avec un système de gamification et d\'automatisation avancé.',
      benefits: [
        'Tracking d\'habitudes intelligent',
        'Gamification et récompenses',
        'Ayez une vue avancée sur vos habitudes',
        'Analyse de productivité intégrée',
        'Streaks et défis personnalisés'
      ],
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager chez Meta',
      company: 'Meta',
      content: 'Cosmo a révolutionné notre façon de gérer les projets. L\'IA prédictive nous fait gagner 40% de temps sur la planification.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CEO & Founder',
      company: 'TechStart Inc.',
      content: 'Impossible de revenir en arrière après Cosmo. L\'intégration OKR nous a permis d\'aligner toute l\'équipe sur nos objectifs stratégiques.',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Directrice R&D',
      company: 'BioTech Labs',
      content: 'La gestion des habitudes de Cosmo m\'a aidée à maintenir un équilibre parfait entre recherche intensive et bien-être personnel.',
      rating: 5,
      avatar: '👩‍🔬'
    },
    {
      name: 'Alex Thompson',
      role: 'Lead Developer',
      company: 'Microsoft',
      content: 'L\'automatisation intelligente de Cosmo s\'adapte parfaitement à nos sprints agiles. Un game-changer pour notre productivité.',
      rating: 5,
      avatar: '👨‍💼'
    }
  ];

  const useCases = [
    {
      profile: 'Étudiants',
      icon: '🎓',
      title: 'Excellence académique',
      description: 'Gérez vos cours, devoirs et révisions avec une planification intelligente qui s\'adapte à votre rythme d\'apprentissage.',
      features: ['Planning de révisions optimisé', 'Suivi des notes et objectifs', 'Vision globale + réduction du stress']
    },
    {
      profile: 'Professionnels',
      icon: '💼',
      title: 'Performance maximale',
      description: 'Boostez votre carrière avec des outils de productivité qui transforment votre façon de travailler et d\'atteindre vos objectifs.',
      features: ['Gestion de projets avancée', 'OKR et développement personnel', 'Système de priorisation intelligent']
    },
    {
      profile: 'Équipes',
      icon: '👥',
      title: 'Collaboration fluide',
      description: 'Synchronisez votre équipe avec des outils collaboratifs qui alignent tous les membres sur les mêmes objectifs stratégiques.',
      features: ['Partage de tâches intelligent', 'Communication intégrée', 'Tableaux de bord équipe']
    },
    {
      profile: 'Entrepreneurs',
      icon: '🚀',
      title: 'Croissance accélérée',
      description: 'Pilotez votre startup avec des métriques précises et des automatisations qui vous font gagner un temps précieux.',
      features: ['Organisation multi-projets avancée', 'Délégation et suivi des tâches', 'Planification stratégique intégrée']
    }
  ];

  const advancedFeatures = [
    {
      icon: Brain,
      title: 'Organisation intelligente',
      description: 'Système de catégorisation et de priorisation avancé qui vous aide à structurer vos tâches et projets efficacement'
    },
    {
      icon: Workflow,
      title: 'Adaptable à tous vos besoins',
      description: 'Que ce soit pour gérer vos projets personnels, organiser vos études, suivre vos objectifs professionnels ou planifier vos loisirs, Cosmo s\'adapte à votre style de vie'
    },
    {
      icon: Database,
      title: 'Synchronisation multi-appareils',
      description: 'Accédez à vos données depuis n\'importe quel appareil avec une synchronisation en temps réel et hors ligne'
    },
    {
      icon: Layers,
      title: 'Vues personnalisables',
      description: 'Liste, Kanban, Calendrier, Gantt, Timeline - adaptez l\'interface à votre style de travail unique'
    },
    {
      icon: Shield,
      title: 'Sauvegarde automatique',
      description: 'Vos données sont automatiquement sauvegardées et protégées contre toute perte accidentelle'
    },
    {
      icon: Infinity,
      title: 'Collaboration simplifiée',
      description: 'Partagez vos projets et collaborez facilement avec votre équipe grâce aux fonctionnalités de partage intégrées'
    }
  ];

  const stats = [
    { number: userCount.toLocaleString(), label: 'Utilisateurs actifs', icon: Users },
    { number: '99.9%', label: 'Uptime garanti', icon: Shield },
    { number: '150+', label: 'Pays utilisateurs', icon: Globe },
    { number: '4.9/5', label: 'Note moyenne', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Header ultra moderne */}
      <header className="relative z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo avec effet néon */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Target size={24} className="text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-lg opacity-30 animate-pulse"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Cosmo
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center justify-between w-80 lg:w-96 xl:w-[28rem]">
              <a href="#features" className="text-slate-300 hover:text-white font-medium transition-all duration-200 hover:scale-105 transform text-sm lg:text-base whitespace-nowrap">
                Fonctionnalités
              </a>
              <a href="#solutions" className="text-slate-300 hover:text-white font-medium transition-all duration-200 hover:scale-105 transform text-sm lg:text-base whitespace-nowrap">
                Solutions
              </a>
              <a href="#testimonials" className="text-slate-300 hover:text-white font-medium transition-all duration-200 hover:scale-105 transform text-sm lg:text-base whitespace-nowrap">
                Témoignages
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3 lg:gap-4">
              {/* Menu mobile */}
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
              
              {/* Boutons d'authentification */}
              <button
                onClick={handleLoginClick}
                className="hidden sm:block text-slate-300 hover:text-white font-medium transition-colors text-sm lg:text-base whitespace-nowrap"
              >
                Se connecter
              </button>
              <button
                onClick={handleRegisterClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2.5 lg:px-6 lg:py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transform text-sm lg:text-base whitespace-nowrap"
              >
                <span className="lg:hidden">Commencer</span>
                <span className="hidden lg:inline">Commencer gratuitement</span>
              </button>
            </div>
          </div>
          
          {/* Menu mobile déroulant */}
          <div className={`md:hidden mt-4 pt-4 border-t border-white/10 transition-all duration-300 ${showMobileMenu ? 'block' : 'hidden'}`}>
            <nav className="flex flex-col space-y-3">
              <a href="#features" className="text-slate-300 hover:text-white font-medium transition-colors py-2">
                Fonctionnalités
              </a>
              <a href="#solutions" className="text-slate-300 hover:text-white font-medium transition-colors py-2">
                Solutions
              </a>
              <a href="#testimonials" className="text-slate-300 hover:text-white font-medium transition-colors py-2">
                Témoignages
              </a>
              <button
                onClick={handleLoginClick}
                className="text-slate-300 hover:text-white font-medium transition-colors py-2 text-left"
              >
                Se connecter
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section Ultra Technologique */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Effets de fond animés */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge de nouveauté */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-blue-500/30 rounded-full px-4 py-2 mb-8">
              <Sparkles size={16} className="text-blue-400" />
              <span className="text-sm font-medium text-blue-200">Nouveau : Organisation intelligente intégrée</span>
              <ChevronRight size={14} className="text-blue-400" />
            </div>

            {/* Titre principal avec effet gradient */}
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Une seule application
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                pour tout organiser
              </span>
            </h1>

            {/* Sous-titre */}
            <p className="text-xl lg:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Révolutionnez votre productivité avec une organisation intelligente. Gérez vos tâches, agenda, objectifs et habitudes 
              dans un écosystème unifié qui s'adapte à votre rythme.
            </p>

            {/* CTA Principal */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={handleRegisterClick}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transform flex items-center justify-center gap-3"
              >
                <Rocket size={24} />
                Commencer gratuitement
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Preuve sociale */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {['👨‍💼', '👩‍💻', '👨‍🎓', '👩‍🔬'].map((avatar, i) => (
                    <div key={i} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm border-2 border-slate-800">
                      {avatar}
                    </div>
                  ))}
                </div>
                <span className="font-medium">
                  Déjà adopté par <span className="text-blue-400 font-bold">{userCount.toLocaleString()}+</span> utilisateurs
                </span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 font-medium">4.9/5 sur toutes les plateformes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques impressionnantes */}
      <section className="py-16 bg-black/20 backdrop-blur-xl border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon size={24} className="text-blue-400" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections de bénéfices avec design ultra moderne */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Fonctionnalités qui changent
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                la donne
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Découvrez comment Cosmo révolutionne chaque aspect de votre productivité avec des technologies de pointe
            </p>
          </div>

          <div className="space-y-32">
            {features.map((feature, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-16`}>
                <div className="flex-1 space-y-6 lg:space-y-8 px-4 lg:px-0">
                  <div className="space-y-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl shadow-lg`}>
                      <feature.icon size={24} className="text-white sm:w-8 sm:h-8" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">{feature.title}</h3>
                    <p className={`text-lg sm:text-xl font-semibold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                      {feature.subtitle}
                    </p>
                    <p className="text-base sm:text-lg text-slate-300 leading-relaxed">{feature.description}</p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <CheckCircle size={12} className="text-white sm:w-3.5 sm:h-3.5" />
                        </div>
                        <span className="text-sm sm:text-base text-slate-300 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <button className={`group bg-gradient-to-r ${feature.gradient} hover:shadow-lg hover:shadow-blue-500/25 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 transform flex items-center justify-center gap-2 w-full sm:w-auto`}>
                    En savoir plus
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform sm:w-4.5 sm:h-4.5" />
                  </button>
                </div>

                <div className="flex-1 w-full px-4 lg:px-0">
                  <div className="relative">
                    <div className={`w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br ${feature.gradient} rounded-2xl sm:rounded-3xl shadow-2xl flex items-center justify-center`}>
                      <feature.icon size={80} className="text-white/20 sm:w-24 sm:h-24 lg:w-30 lg:h-30" />
                      <div className="absolute inset-0 bg-black/20 rounded-2xl sm:rounded-3xl flex items-center justify-center">
                        <div className="text-center">
                          <feature.icon size={60} className="text-white mx-auto mb-3 sm:w-16 sm:h-16 lg:w-20 lg:h-20 sm:mb-4" />
                          <div className="text-white font-bold text-lg sm:text-xl px-4">{feature.title}</div>
                        </div>
                      </div>
                    </div>
                    <div className={`absolute -inset-2 sm:-inset-4 bg-gradient-to-r ${feature.gradient} rounded-2xl sm:rounded-3xl blur-xl sm:blur-2xl opacity-20 animate-pulse`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cas d'usage */}
      <section id="solutions" className="py-24 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Solutions pour chaque profil
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Que vous soyez étudiant, professionnel, entrepreneur ou que vous dirigiez une équipe, 
              Cosmo s'adapte parfaitement à vos besoins spécifiques
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 transform">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">{useCase.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{useCase.profile}</h3>
                    <p className="text-blue-400 font-semibold">{useCase.title}</p>
                  </div>
                </div>
                <p className="text-slate-300 mb-6 leading-relaxed">{useCase.description}</p>
                <div className="space-y-3">
                  {useCase.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                      <span className="text-slate-300 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages rotatifs */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Ils transforment leur productivité
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Découvrez comment les leaders de l'industrie utilisent Cosmo pour atteindre leurs objectifs les plus ambitieux
            </p>
          </div>

          <div className="relative">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={24} className="text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-2xl lg:text-3xl font-medium text-white mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-4">
                <div className="text-4xl">{testimonials[currentTestimonial].avatar}</div>
                <div className="text-left">
                  <div className="text-xl font-bold text-white">{testimonials[currentTestimonial].name}</div>
                  <div className="text-blue-400 font-semibold">{testimonials[currentTestimonial].role}</div>
                  <div className="text-slate-400">{testimonials[currentTestimonial].company}</div>
                </div>
              </div>
            </div>

            {/* Indicateurs de témoignages */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-blue-500 w-8' 
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités avancées */}
      <section className="py-24 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Technologies de pointe
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Propulsé par l'IA et conçu pour l'entreprise moderne, Cosmo intègre les dernières innovations technologiques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <div key={index} className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105 transform">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-12">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Prêt à révolutionner
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                votre productivité ?
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Rejoignez des milliers de professionnels qui ont déjà transformé leur façon de travailler avec Cosmo
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={handleRegisterClick}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transform flex items-center justify-center gap-3"
              >
                <Rocket size={24} />
                Commencer maintenant
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer moderne */}
      <footer className="bg-black/40 backdrop-blur-xl border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Target size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Cosmo</span>
              </div>
              <p className="text-slate-400">
                La plateforme de productivité nouvelle génération qui transforme votre façon de travailler.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Produit</h3>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Fonctionnalités</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Intégrations</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">API</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Sécurité</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Centre d'aide</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Contact</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Statut</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Communauté</a>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Entreprise</h3>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">À propos</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Carrières</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Presse</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors">Partenaires</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 text-sm mb-4 md:mb-0">
              © 2025 Cosmo. Tous droits réservés. Conçu avec ❤️ pour la productivité.
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">Conditions</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal de connexion */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          mode={loginMode}
          onSwitchMode={(mode) => setLoginMode(mode)}
        />
      )}
    </div>
  );
};

export default LandingPage;
