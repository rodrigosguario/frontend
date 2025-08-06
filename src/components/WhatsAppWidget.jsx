import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WhatsAppWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    phone_number: '5511933821515',
    welcome_message: 'Olá! Gostaria de agendar uma consulta com Dr. Rodrigo Sguario.',
    widget_enabled: true,
    widget_position: 'bottom-right',
    widget_color: '#25D366'
  });

  useEffect(() => {
    // Carregar configuração do WhatsApp
    fetch('/api/settings/whatsapp')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setConfig(data);
        }
      })
      .catch(err => console.log('Usando configuração padrão do WhatsApp'));
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(config.welcome_message);
    const url = `https://wa.me/${config.phone_number}?text=${message}`;
    window.open(url, '_blank');
  };

  if (!config.widget_enabled) {
    return null;
  }

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6'
  };

  return (
    <div className={`fixed ${positionClasses[config.widget_position]} z-50`}>
      {/* Widget Principal */}
      <div className="relative">
        {/* Balão de mensagem */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 mb-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-in-up">
            <div 
              className="p-4 text-white"
              style={{ backgroundColor: config.widget_color }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Dr. Rodrigo Sguario</h4>
                    <p className="text-sm opacity-90">Cardiologista</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <p className="text-gray-700 text-sm">
                  {config.welcome_message}
                </p>
              </div>
              
              <button
                onClick={handleWhatsAppClick}
                className="w-full py-3 px-4 text-white rounded-lg font-medium transition-colors"
                style={{ backgroundColor: config.widget_color }}
              >
                Iniciar Conversa
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                Resposta rápida garantida
              </p>
            </div>
          </div>
        )}

        {/* Botão Principal */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full text-white shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center relative"
          style={{ backgroundColor: config.widget_color }}
        >
          {/* Animação de pulso */}
          <div 
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ backgroundColor: config.widget_color }}
          ></div>
          
          {isOpen ? (
            <X className="w-6 h-6 relative z-10" />
          ) : (
            <MessageCircle className="w-6 h-6 relative z-10" />
          )}
          
          {/* Indicador de mensagem */}
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">1</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default WhatsAppWidget;

