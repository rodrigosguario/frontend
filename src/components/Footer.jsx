import React from 'react';
import { Heart, MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Início', href: '#home' },
    { name: 'Sobre', href: '#about' },
    { name: 'Serviços', href: '#services' },
    { name: 'Blog', href: '#blog' },
    { name: 'Avaliações', href: '#reviews' },
    { name: 'Contato', href: '#contact' }
  ];

  const services = [
    'Transplante Cardíaco',
    'Insuficiência Cardíaca',
    'Cardiologia Preventiva',
    'Ecocardiografia',
    'Segunda Opinião',
    'Emergências 24h'
  ];

  const professionalLinks = [
    { name: 'CRM-SP', href: '#', external: true },
    { name: 'Sociedade Brasileira de Cardiologia', href: '#', external: true },
    { name: 'InCor - USP', href: '#', external: true },
    { name: 'UNICAMP', href: '#', external: true }
  ];

  const scrollToSection = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Conteúdo principal do footer */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Informações principais */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-foreground" fill="currentColor" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Dr. Rodrigo Sguario</h3>
                <p className="text-background/80 text-sm">Cardiologista</p>
              </div>
            </div>
            
            <p className="text-background/80 leading-relaxed text-sm">
              Especialista em Transplante Cardíaco e Insuficiência Cardíaca Avançada. 
              Formado pelo Instituto do Coração (InCor-USP). Cuidado humanizado e 
              baseado na melhor evidência científica.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-background/60" />
                <span className="text-background/80">
                  Av. Paulista, 1048, 18º andar - São Paulo
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-background/60" />
                <span className="text-background/80">(11) 3382-1515</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-background/60" />
                <span className="text-background/80">
                  rodrigomrsguario.cardiologia@gmail.com
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-background/60" />
                <span className="text-background/80">
                  Seg-Sex: 8h-18h | Sáb: 8h-12h
                </span>
              </div>
            </div>
          </div>

          {/* Links rápidos */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Navegação</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-background/80 hover:text-background transition-all duration-300 ease-in-out text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Serviços */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Nossos Serviços</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-background/80 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Links profissionais */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Credenciais</h4>
            <ul className="space-y-3">
              {professionalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : "_self"}
                    rel={link.external ? "noopener noreferrer" : ""}
                    className="text-background/80 hover:text-background transition-all duration-300 ease-in-out text-sm flex items-center gap-2"
                  >
                    {link.name}
                    {link.external && <ExternalLink className="w-3 h-3" />}
                  </a>
                </li>
              ))}
            </ul>

            {/* Horário de emergência */}
            <div className="bg-background/10 rounded-lg p-4 mt-6">
              <h5 className="font-semibold text-sm mb-2">Emergências Cardíacas</h5>
              <p className="text-background/80 text-xs leading-relaxed">
                Em caso de emergência cardíaca, procure imediatamente o pronto-socorro 
                mais próximo ou ligue para o SAMU: 192
              </p>
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-background/20"></div>

        {/* Copyright e informações legais */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-background/80 text-sm">
              © {currentYear} Dr. Rodrigo Sguario. Todos os direitos reservados.
            </p>
            <p className="text-background/60 text-xs mt-1">
              CRM-SP: 123456 | RQE: 12345
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-background/60">
            <span>Desenvolvido com ❤️ para cuidar de corações</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-background transition-all duration-300 ease-in-out">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-background transition-all duration-300 ease-in-out">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

