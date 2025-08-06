import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Car, 
  Train, 
  Bus, 
  Clock, 
  Navigation,
  ExternalLink,
  Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

const LocationSection = () => {
  const address = "Av. Paulista, 1048, 18º andar - Bela Vista, São Paulo - SP, 01310-100";
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(address)}`;

  const transportOptions = [
    {
      icon: Train,
      title: "Metrô",
      description: "Estação Brigadeiro (Linha Verde)",
      details: "5 minutos a pé do consultório",
      color: "text-green-600"
    },
    {
      icon: Bus,
      title: "Ônibus",
      description: "Diversas linhas na Av. Paulista",
      details: "Paradas próximas ao edifício",
      color: "text-blue-600"
    },
    {
      icon: Car,
      title: "Carro",
      description: "Estacionamento no edifício",
      details: "Valet disponível mediante taxa",
      color: "text-purple-600"
    }
  ];

  const businessHours = [
    { day: "Segunda a Sexta", hours: "08:00 - 18:00" },
    { day: "Sábado", hours: "08:00 - 12:00" },
    { day: "Domingo", hours: "Fechado" }
  ];

  return (
    <section id="localizacao" className="py-20 bg-muted/30">
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
            Como Chegar
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Localização privilegiada na Av. Paulista, com fácil acesso por transporte público e particular
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Mapa e endereço */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="card-shadow border-0 overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  Endereço do Consultório
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium text-foreground mb-2">
                    Dr. Rodrigo Sguario - Cardiologista
                  </p>
                  <p className="text-muted-foreground">
                    {address}
                  </p>
                </div>

                {/* Mapa incorporado */}
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1962738!2d-46.6520442!3d-23.5631131!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201048%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1spt!2sbr!4v1642000000000!5m2!1spt!2sbr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização do Consultório Dr. Rodrigo Sguario"
                  ></iframe>
                </div>

                {/* Botões de navegação */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 justify-center gap-2"
                    onClick={() => window.open(googleMapsUrl, '_blank')}
                  >
                    <Navigation className="w-4 h-4" />
                    Abrir no Google Maps
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 justify-center gap-2"
                    onClick={() => window.open(wazeUrl, '_blank')}
                  >
                    <Car className="w-4 h-4" />
                    Abrir no Waze
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Informações de transporte e horários */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Opções de transporte */}
            <Card className="card-shadow border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Bus className="w-6 h-6 text-primary" />
                  Opções de Transporte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transportOptions.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg"
                    >
                      <div className={`p-2 rounded-lg bg-background ${option.color}`}>
                        <option.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">
                          {option.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          {option.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {option.details}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Horários de funcionamento */}
            <Card className="card-shadow border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-primary" />
                  Horários de Atendimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {businessHours.map((schedule, index) => (
                    <div 
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-border last:border-0"
                    >
                      <span className="font-medium text-foreground">
                        {schedule.day}
                      </span>
                      <span className="text-muted-foreground">
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    <strong>Importante:</strong> Atendimento mediante agendamento prévio
                  </p>
                  <Button 
                    className="w-full medical-gradient text-white"
                    onClick={() => window.open('https://wa.me/5511933821515', '_blank')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Agendar Consulta
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Informações adicionais */}
            <Card className="card-shadow border-0">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <h4 className="font-semibold text-foreground">
                    Dúvidas sobre localização?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Entre em contato conosco para orientações detalhadas
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open('tel:+5511933821515', '_blank')}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      (11) 3382-1515
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open('https://wa.me/5511933821515', '_blank')}
                    >
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;

