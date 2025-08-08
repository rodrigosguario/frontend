import React, { useState, useEffect } from 'react';
import { Heart, Award, Users, Star, Phone, Calendar } from 'lucide-react';
import { siteContentAPI } from '../config/api';

const Hero = () => {
  const [heroData, setHeroData] = useState({
    title: "Dr. Rodrigo Sguario",
    subtitle: "Cardiologista Especialista em Transplante Cardíaco",
    description: "Especialista em cardiologia com foco em transplante cardíaco e insuficiência cardíaca avançada.",
    cta_text: "Agendar Consulta",
    cta_link: "#contact",
    achievements: [
      {
        icon: "Heart",
        title: "Referência em Transplante",
        description: "Liderança e experiência em transplantes cardíacos"
      },
      {
        icon: "Award", 
        title: "Tecnologia Avançada",
        description: "Equipamentos de última geração para diagnósticos precisos"
      },
      {
        icon: "Users",
        title: "Atendimento Humanizado", 
        description: "Cuidado focado no paciente, com empatia e atenção"
      }
    ],
    stats: [
      { number: "500+", label: "Pacientes Atendidos" },
      { number: "15+", label: "Anos de Experiência" },
      { number: "5.0", label: "Avaliação Média", icon: "Star" },
      { number: "24h", label: "Suporte Emergencial" }
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHeroContent();
  }, []);

  const loadHeroContent = async () => {
    try {
      setLoading(true);
      
      // Carregar todo o conteúdo e extrair a seção hero
      const allContentResponse = await siteContentAPI.getAllContent();
      
      if (allContentResponse.success && allContentResponse.data && allContentResponse.data.hero) {
        setHeroData(allContentResponse.data.hero);
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo do Hero:', error);
      // Manter dados padrão se houver erro
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      Heart: Heart,
      Award: Award,
      Users: Users,
      Star: Star,
      Phone: Phone,
      Calendar: Calendar
    };
    return icons[iconName] || Heart;
  };

  if (loading) {
    return (
      <section className="gradient-hero text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded mb-4 mx-auto max-w-md"></div>
            <div className="h-6 bg-white/20 rounded mb-6 mx-auto max-w-lg"></div>
            <div className="h-4 bg-white/20 rounded mb-8 mx-auto max-w-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="gradient-hero text-white py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 border border-white rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 border border-white rounded-full"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {heroData.title}
            </h1>
            
            <h2 className="text-xl md:text-2xl text-white/80 mb-6 font-light">
              {heroData.subtitle}
            </h2>
            
            <p className="text-lg text-white/70 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {heroData.description}
            </p>

            {/* CTA Button */}
            <div className="mb-12">
              <a
                href={heroData.cta_link || "#contact"}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent to-accent/90 text-accent-foreground font-semibold rounded-full hover:from-accent/90 hover:to-accent/80 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover-shadow"
              >
                <Calendar className="mr-2 h-5 w-5" />
                {heroData.cta_text}
              </a>
            </div>

            {/* Stats */}
            {heroData.stats && heroData.stats.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {heroData.stats.map((stat, index) => {
                  const IconComponent = stat.icon ? getIcon(stat.icon) : null;
                  return (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        {IconComponent && <IconComponent className="h-5 w-5 text-accent mr-1" />}
                        <span className="text-2xl md:text-3xl font-bold text-accent">
                          {stat.number}
                        </span>
                      </div>
                      <p className="text-sm text-white/70">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="space-y-6">
            {heroData.achievements && heroData.achievements.map((achievement, index) => {
              const IconComponent = getIcon(achievement.icon);
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                        <IconComponent className="h-6 w-6 text-accent-foreground" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{achievement.title}</h3>
                      <p className="text-white/70 text-sm leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-background">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
