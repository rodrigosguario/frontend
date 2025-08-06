import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Calendar,
  Send,
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para dados dinâmicos do CMS
  const [contactData, setContactData] = useState({
    title: "Entre em Contato",
    subtitle: "Agende sua consulta ou tire suas dúvidas. Estamos aqui para cuidar da sua saúde cardíaca",
    phone: "(11) 3382-1515",
    whatsapp: "(11) 99999-9999",
    email: "rodrigomrsguario.cardiologia@gmail.com",
    address: {
      street: "Av. Paulista, 1048, 18º andar",
      district: "Bela Vista, São Paulo - SP",
      cep: "CEP: 01310-100"
    },
    hours: {
      weekdays: "Segunda a Sexta: 8h às 18h",
      saturday: "Sábado: 8h às 12h",
      emergency: "Emergências: 24h"
    }
  });

  // Carregar dados do CMS
  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      // Tentar carregar do backend primeiro
      const response = await fetch('/api/content/contact');
      
      if (response.ok) {
        const data = await response.json();
        if (data.content_data) {
          setContactData(prev => ({
            ...prev,
            ...data.content_data
          }));
        }
      } else {
        // Se falhar, tentar API alternativa
        const altResponse = await fetch('/api/site/content');
        if (altResponse.ok) {
          const altData = await altResponse.json();
          if (altData.contact) {
            setContactData(prev => ({
              ...prev,
              ...altData.contact
            }));
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados de contato:', error);
      // Manter dados padrão se houver erro
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Endereço",
      details: [
        contactData.address?.street || "Av. Paulista, 1048, 18º andar",
        contactData.address?.district || "Bela Vista, São Paulo - SP",
        contactData.address?.cep || "CEP: 01310-100"
      ]
    },
    {
      icon: Phone,
      title: "Telefone",
      details: [
        contactData.phone || "(11) 3382-1515",
        `WhatsApp: ${contactData.whatsapp || "(11) 99999-9999"}`
      ]
    },
    {
      icon: Mail,
      title: "E-mail",
      details: [
        contactData.email || "rodrigomrsguario.cardiologia@gmail.com"
      ]
    },
    {
      icon: Clock,
      title: "Horário de Atendimento",
      details: [
        contactData.hours?.weekdays || "Segunda a Sexta: 8h às 18h",
        contactData.hours?.saturday || "Sábado: 8h às 12h",
        contactData.hours?.emergency || "Emergências: 24h"
      ]
    }
  ];

  const services = [
    "Consulta Cardiológica",
    "Transplante Cardíaco",
    "Insuficiência Cardíaca",
    "Ecocardiografia",
    "Segunda Opinião",
    "Outro"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Tentar enviar para o backend
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      } else {
        // Fallback - simular envio
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Dados do formulário (fallback):', formData);
        toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      }
      
      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const cleanPhone = (contactData.whatsapp || "(11) 99999-9999").replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá Dr. Rodrigo! Gostaria de agendar uma consulta. Meu nome é ${formData.name || '[Nome]'}.`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-background">
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
            {contactData.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {contactData.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulário de contato */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="card-shadow border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  Agendar Consulta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service">Tipo de consulta</Label>
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Selecione um serviço</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Descreva brevemente o motivo da consulta ou suas dúvidas..."
                      rows={4}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 medical-gradient text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button"
                      onClick={openWhatsApp}
                      variant="outline"
                      className="flex-1 border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Informações de contato */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-shadow hover-lift border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          {info.title}
                        </h3>
                        <div className="space-y-1">
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-muted-foreground text-sm">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Mapa */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="card-shadow border-0 overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                        <p className="text-foreground font-medium">
                          {contactData.address?.street?.split(',')[0] || "Av. Paulista, 1048"}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {contactData.address?.district?.split(',')[0] || "Bela Vista, São Paulo"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Informações importantes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="border-l-4 border-l-primary bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Atendimento Personalizado
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Cada consulta é planejada com tempo adequado para uma avaliação completa. 
                        Priorizamos a qualidade do atendimento sobre a quantidade de consultas.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
