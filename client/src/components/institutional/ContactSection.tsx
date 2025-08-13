import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleLoginClick = () => {
    window.location.href = '/api/login';
  };

  return (
    <section id="contact" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <div className="reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Entre em <span className="text-business-600">Contato</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pronto para transformar o planejamento financeiro da sua família? 
              Entre em contato conosco e descubra como podemos ajudar.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="reveal delay-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Fale Conosco
            </h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-business-100 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-business-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-600">contato@ciklus.com.br</p>
                  <p className="text-gray-600">suporte@ciklus.com.br</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-business-100 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-business-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Telefone</h4>
                  <p className="text-gray-600">+55 (11) 9999-9999</p>
                  <p className="text-gray-600">WhatsApp disponível</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-business-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-business-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Endereço</h4>
                  <p className="text-gray-600">São Paulo, SP</p>
                  <p className="text-gray-600">Atendimento 100% online</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-business-100 p-3 rounded-lg">
                  <Clock className="h-6 w-6 text-business-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Horário de Atendimento</h4>
                  <p className="text-gray-600">Segunda a Sexta: 9h às 18h</p>
                  <p className="text-gray-600">Plataforma 24/7 disponível</p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-business-600 to-blue-600 rounded-xl p-6 text-white">
              <h4 className="text-xl font-bold mb-3">Agende uma Apresentação</h4>
              <p className="text-blue-100 mb-4">
                Converse com nossos especialistas e descubra como podemos transformar o planejamento financeiro da sua família.
              </p>
              <div className="space-y-3">
                <Button
                  type="button"
                  className="w-full bg-white text-business-600 hover:bg-gray-100 font-semibold"
                >
                  📅 Agendar Reunião Online
                </Button>
                <Button
                  type="button"
                  onClick={handleLoginClick}
                  variant="outline"
                  className="w-full border-white text-white hover:bg-white hover:text-business-600"
                >
                  Acessar Plataforma
                </Button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="reveal delay-600">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Envie uma Mensagem
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-business-500 focus:border-business-500 transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-business-500 focus:border-business-500 transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone (opcional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-business-500 focus:border-business-500 transition-colors"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    autoComplete="off"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-business-500 focus:border-business-500 transition-colors resize-none"
                    placeholder="Como podemos ajudar você e sua família?"
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-business-600 hover:bg-business-700 text-white py-3 rounded-lg transition-colors font-semibold"
                >
                  Enviar Mensagem
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="reveal">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Perguntas Frequentes
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Como funciona a plataforma?</h4>
                  <p className="text-gray-600 text-sm">
                    Nossa plataforma replica metodologias comprovadas de planejamento financeiro em uma interface moderna e intuitiva, permitindo que você gerencie todas as finanças da família em um só lugar.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">É seguro colocar meus dados?</h4>
                  <p className="text-gray-600 text-sm">
                    Utilizamos criptografia de nível bancário e seguimos as melhores práticas de segurança. Seus dados são protegidos com a mesma tecnologia usada por grandes instituições financeiras.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Preciso ter conhecimento financeiro?</h4>
                  <p className="text-gray-600 text-sm">
                    Não! Nossa plataforma foi desenvolvida para ser simples e intuitiva. Oferecemos guias, tutoriais e suporte especializado para ajudá-lo em cada passo.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Posso testar antes de assinar?</h4>
                  <p className="text-gray-600 text-sm">
                    Sim! Oferecemos um período de teste gratuito para que você possa explorar todas as funcionalidades e ver como a plataforma pode transformar suas finanças.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}