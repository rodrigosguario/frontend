import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [contactData, setContactData] = useState({
    title: "Entre em Contato",
    description: "Agende sua consulta e cuide da sua saúde cardíaca com quem entende do assunto.",
    phone: "(11) 99999-9999",
    email: "contato@drrodrigosguario.com.br",
    address: "São Paulo, SP",
    hours: "Segunda a Sexta: 8h às 18h\nSábado: 8h às 12h",
    emergency: "Atendimento de emergência 24h",
    form_fields: [
      { name: "name", label: "Nome Completo", type: "text", required: true },
      { name: "email", label: "E-mail", type: "email", required: true },
      { name: "phone", label: "Telefone", type: "tel", required: true },
      { name: "message", label: "Mensagem", type: "textarea", required: true }
    ]
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadContactContent();
  }, []);

  const loadContactContent = async () => {
    try {
      // Tentar carregar do backend primeiro
      const response = await fetch('/api/content/contact');
      
      if (response.ok) {
        const data = await response.json();
        if (data.content_data) {
          setContactData(data.content_data);
        }
      } else {
        // Se falhar, tentar API alternativa
        const altResponse = await fetch('/api/site/content');
        if (altResponse.ok) {
          const altData = await altResponse.json();
          if (altData.contact) {
            setContactData(altData.contact);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo do Contact:', error);
      // Manter dados padrão se houver erro
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simular envio do formulário
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Em produção, aqui seria feita a chamada real para a API
      console.log('Dados do formulário:', formData);
      
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Reset após 5 segundos
      setTimeout(() => setSubmitted(false), 5000);
      
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatWhatsAppLink = (phone, message = '') => {
    const cleanPhone = phone.replace(/\D/g, '');
    const defaultMessage = encodeURIComponent(message || 'Olá! Gostaria de agendar uma consulta.');
    return `https://wa.me/55${cleanPhone}?text=${defaultMessage}`;
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-4 mx-auto max-w-md"></div>
            <div className="h-4 bg-gray-300 rounded mb-8 mx-auto max-w-2xl"></div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {contactData.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {contactData.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Informações de Contato</h3>
            
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Telefone</h4>
                  <p className="text-gray-600 mb-2">{contactData.phone}</p>
                  <a
                    href={formatWhatsAppLink(contactData.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">E-mail</h4>
                  <a
                    href={`mailto:${contactData.email}`}
                    className="text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {contactData.email}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Localização</h4>
                  <p className="text-gray-600">{contactData.address}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">Horários</h4>
                  <div className="text-gray-600">
                    {contactData.hours.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                  {contactData.emergency && (
                    <p className="text-red-600 font-medium mt-2">{contactData.emergency}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-red-800 mb-2">Emergência Cardíaca</h4>
              <p className="text-red-700 mb-4">
                Em caso de emergência cardíaca, procure imediatamente o pronto-socorro mais próximo ou ligue para o SAMU.
              </p>
              <div className="flex space-x-4">
                <a
                  href="tel:192"
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  SAMU 192
                </a>
                <a
                  href={`tel:${contactData.phone.replace(/\D/g, '')}`}
                  className="inline-flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Dr. Rodrigo
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Envie uma Mensagem</h3>
            
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-green-800 mb-2">Mensagem Enviada!</h4>
                <p className="text-green-700">
                  Obrigado pelo contato. Retornaremos em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {contactData.form_fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'textarea' ? (
                      <textarea
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        required={field.required}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder={`Digite ${field.label.toLowerCase()}`}
                      />
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        required={field.required}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder={`Digite ${field.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
