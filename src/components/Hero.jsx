import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Award, Users, Clock, Calendar, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const achievements = [
    {
      icon: Heart,
      title: "Referência em Transplante",
      description: "Liderança e experiência em transplantes cardíacos"
    },
    {
      icon: Award,
      title: "Tecnologia Avançada", 
      description: "Equipamentos de última geração para diagnósticos precisos"
    },
    {
      icon: Users,
      title: "Atendimento Humanizado",
      description: "Cuidado focado no paciente, com empatia e atenção"
    }
  ];

  const stats = [
    { number: "500+", label: "Pacientes Atendidos" },
    { number: "15+", label: "Anos de Experiência" },
    { number: "5.0", label: "Avaliação Média", icon: Star },
    { number: "24h", label: "Suporte Emergencial" }
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo principal */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
              >
                <Heart className="w-4 h-4" fill="currentColor" />
                Especialista em Transplante Cardíaco
              </motion.div>

              <motion.h1 
                className="text-4xl lg:text-6xl font-bold text-foreground leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Dr. Rodrigo Sguario
                <span className="block text-3xl lg:text-4xl text-primary mt-2">
                  Cardiologista em São Paulo
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Especialista em <strong>Transplante Cardíaco</strong> e <strong>Insuficiência Cardíaca Avançada</strong>. 
                Formado pelo Instituto do Coração (InCor – HCFMUSP). Acredito em um cuidado próximo e humano. 
                Estarei à disposição para guiá-lo nessa jornada com responsabilidade e dedicação.
              </motion.p>
            </div>

            {/* Botões de ação */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button 
                size="lg"
                onClick={() => scrollToSection('#contact')}
                className="medical-gradient text-white hover:opacity-90 transition-all duration-300 ease-in-out group"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agendar Consulta
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('#services')}
                className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 ease-in-out"
              >
                Nossos Serviços
              </Button>
            </motion.div>

            {/* Estatísticas */}
            <motion.div 
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl lg:text-3xl font-bold text-primary">
                    {stat.number}
                    {stat.icon && <stat.icon className="w-6 h-6" fill="currentColor" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Cards de destaque */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="card-shadow hover-lift border-0 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <achievement.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {achievement.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Badge de avaliação */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 text-center"
            >
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500" fill="currentColor" />
                ))}
              </div>
              <p className="text-sm font-medium text-gray-800">
                5/5 em mais de 60 avaliações de pacientes
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Indicador de scroll */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse-medical"></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

