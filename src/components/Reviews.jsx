import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Maria Silva",
      rating: 5,
      date: "Janeiro 2025",
      text: "Dr. Rodrigo é um profissional excepcional. Sua dedicação e conhecimento técnico me deram total confiança durante todo o processo de avaliação para transplante. Recomendo sem hesitação.",
      source: "Google",
      verified: true
    },
    {
      id: 2,
      name: "João Santos",
      rating: 5,
      date: "Dezembro 2024",
      text: "Excelente cardiologista! Muito atencioso, explica tudo com clareza e demonstra real preocupação com o bem-estar do paciente. Consultório bem localizado e atendimento pontual.",
      source: "Doctoralia",
      verified: true
    },
    {
      id: 3,
      name: "Ana Costa",
      rating: 5,
      date: "Novembro 2024",
      text: "Profissional de altíssimo nível. Me senti muito segura durante todo o acompanhamento da minha insuficiência cardíaca. Dr. Rodrigo é humano, competente e sempre disponível.",
      source: "Google",
      verified: true
    },
    {
      id: 4,
      name: "Carlos Oliveira",
      rating: 5,
      date: "Outubro 2024",
      text: "Depois de passar por vários cardiologistas, finalmente encontrei um médico que realmente se importa. Dr. Rodrigo salvou minha vida com seu diagnóstico preciso e tratamento adequado.",
      source: "Doctoralia",
      verified: true
    },
    {
      id: 5,
      name: "Lucia Ferreira",
      rating: 5,
      date: "Setembro 2024",
      text: "Atendimento excepcional! Dr. Rodrigo tem uma forma única de tranquilizar o paciente e explicar os procedimentos. Sua experiência no InCor faz toda a diferença.",
      source: "Google",
      verified: true
    },
    {
      id: 6,
      name: "Roberto Lima",
      rating: 5,
      date: "Agosto 2024",
      text: "Médico extremamente competente e humano. Acompanhou meu pai durante todo o processo de transplante cardíaco. Gratidão eterna por sua dedicação e profissionalismo.",
      source: "Doctoralia",
      verified: true
    }
  ];

  const stats = [
    { number: "5.0", label: "Avaliação Média", icon: Star },
    { number: "60+", label: "Avaliações Positivas" },
    { number: "98%", label: "Pacientes Satisfeitos" },
    { number: "100%", label: "Recomendariam" }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'Google':
        return 'bg-blue-100 text-blue-800';
      case 'Doctoralia':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="reviews" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header da seção */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Avaliações dos Pacientes
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            O que nossos pacientes dizem sobre o atendimento e cuidado recebido
          </p>
        </motion.div>

        {/* Estatísticas */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-primary mb-2">
                {stat.number}
                {stat.icon && <stat.icon className="w-6 h-6" fill="currentColor" />}
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Grid de avaliações */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full card-shadow hover-lift border-0 bg-card">
                <CardContent className="p-6 space-y-4">
                  {/* Header da avaliação */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">
                          {review.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground text-sm">
                          {review.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {review.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getSourceColor(review.source)}>
                        {review.source}
                      </Badge>
                      {review.verified && (
                        <Badge variant="outline" className="text-xs">
                          Verificado
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Estrelas */}
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                  </div>

                  {/* Texto da avaliação */}
                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-6 h-6 text-primary/20" />
                    <p className="text-muted-foreground text-sm leading-relaxed pl-4">
                      {review.text}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Links para plataformas de avaliação */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl p-8 card-shadow text-center"
        >
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Compartilhe sua experiência
          </h3>
          <p className="text-muted-foreground mb-6">
            Sua opinião é muito importante para nós e ajuda outros pacientes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.google.com/search?q=dr+rodrigo+sguario+cardiologista"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out"
            >
              Avaliar no Google
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://www.doctoralia.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out"
            >
              Avaliar no Doctoralia
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;

