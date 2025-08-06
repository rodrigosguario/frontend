import React, { useState, useEffect } from 'react';
import { Heart, Activity, Shield, Stethoscope, Clock, Users, CheckCircle } from 'lucide-react';

const Services = () => {
  const [whatsappConfig, setWhatsappConfig] = useState(null);

  useEffect(() => {
    // Carregar configuração do WhatsApp
    fetch('/api/settings/whatsapp')
      .then(res => res.json())
      .then(data => setWhatsappConfig(data))
      .catch(err => console.log('Usando configuração padrão do WhatsApp'));
  }, []);

  const handleWhatsAppClick = (serviceType) => {
    if (!whatsappConfig) {
      // Fallback para configuração padrão
      const phone = '5511933821515';
      const messages = {
        transplant: 'Olá! Gostaria de agendar uma consulta sobre Transplante Cardíaco com Dr. Rodrigo Sguario.',
        heart_failure: 'Olá! Gostaria de agendar uma consulta sobre Insuficiência Cardíaca com Dr. Rodrigo Sguario.',
        preventive: 'Olá! Gostaria de agendar uma consulta de Cardiologia Preventiva com Dr. Rodrigo Sguario.',
        echo: 'Olá! Gostaria de agendar um Ecocardiograma com Dr. Rodrigo Sguario.'
      };
      
      const message = encodeURIComponent(messages[serviceType] || messages.transplant);
      const url = `https://wa.me/${phone}?text=${message}`;
      window.open(url, '_blank');
      return;
    }

    // Usar configuração do banco de dados
    fetch('/api/whatsapp-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ service_type: serviceType })
    })
    .then(res => res.json())
    .then(data => {
      if (data.url) {
        window.open(data.url, '_blank');
      }
    })
    .catch(err => {
      console.error('Erro ao gerar URL do WhatsApp:', err);
      // Fallback
      const phone = '5511933821515';
      const message = encodeURIComponent('Olá! Gostaria de agendar uma consulta com Dr. Rodrigo Sguario.');
      window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    });
  };

  const services = [
    {
      id: 'transplant',
      icon: Heart,
      title: 'Transplante Cardíaco',
      badge: 'Especialidade Principal',
      description: 'Avaliação completa para transplante cardíaco, acompanhamento pré e pós-operatório com equipe multidisciplinar especializada.',
      duration: '60-90 min',
      features: [
        'Avaliação pré-transplante',
        'Acompanhamento pós-transplante',
        'Manejo de rejeição',
        'Cuidados a longo prazo'
      ]
    },
    {
      id: 'heart_failure',
      icon: Activity,
      title: 'Insuficiência Cardíaca Avançada',
      description: 'Tratamento especializado para insuficiência cardíaca em estágios avançados, incluindo terapias inovadoras e dispositivos.',
      duration: '45-60 min',
      features: [
        'Otimização medicamentosa',
        'Terapia de ressincronização',
        'Dispositivos de assistência',
        'Monitoramento remoto'
      ]
    },
    {
      id: 'preventive',
      icon: Shield,
      title: 'Cardiologia Preventiva',
      description: 'Prevenção e diagnóstico precoce de doenças cardiovasculares através de avaliação de risco e estratégias personalizadas.',
      duration: '30-45 min',
      features: [
        'Avaliação de risco cardiovascular',
        'Check-up cardiológico',
        'Orientação nutricional',
        'Programa de exercícios'
      ]
    },
    {
      id: 'echo',
      icon: Stethoscope,
      title: 'Ecocardiografia',
      description: 'Exame de imagem não invasivo para avaliação detalhada da estrutura e função cardíaca com tecnologia de última geração.',
      duration: '30-45 min',
      features: [
        'Ecocardiograma transtorácico',
        'Doppler colorido',
        'Strain miocárdico',
        'Avaliação valvar'
      ]
    }
  ];

  const additionalServices = [
    'MAPA (Monitorização Ambulatorial da Pressão Arterial)',
    'Consulta de segunda opinião',
    'Acompanhamento pós-cirúrgico'
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Atendimento Seguro',
      description: 'Protocolos rigorosos de segurança e higiene em todas as consultas'
    },
    {
      icon: Clock,
      title: 'Pontualidade',
      description: 'Respeitamos seu tempo com horários organizados e consultas pontuais'
    },
    {
      icon: Users,
      title: 'Cuidado Humanizado',
      description: 'Atendimento personalizado com foco no bem-estar do paciente'
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Nossos Serviços
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cuidado especializado em cardiologia com foco em transplante cardíaco e insuficiência cardíaca avançada
          </p>
        </div>

        {/* Serviços Principais */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className="bg-card rounded-2xl p-8 card-shadow hover-lift border border-border"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-semibold text-foreground">
                        {service.title}
                      </h3>
                      {service.badge && (
                        <span className="px-3 py-1 bg-accent text-accent-foreground text-sm font-medium rounded-full">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">O que inclui:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Consulta: {service.duration}</span>
                  </div>
                  <button
                    onClick={() => handleWhatsAppClick(service.id)}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Agendar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Serviços Complementares */}
        <div className="bg-muted/50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">
            Serviços Complementares
          </h3>
          <p className="text-center text-muted-foreground mb-8">
            Exames e acompanhamentos para um cuidado completo
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 text-center card-shadow"
              >
                <h4 className="font-semibold text-foreground mb-2">{service}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Benefícios */}
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex p-4 bg-primary/10 rounded-2xl mb-4">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  {benefit.title}
                </h4>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;

