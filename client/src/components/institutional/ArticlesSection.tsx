import { Calendar, Clock, ArrowRight, BookOpen, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArticlesSection() {
  const articles = [
    {
      id: 1,
      title: "Como Estruturar o Orçamento Familiar para 2025",
      excerpt: "Estratégias práticas para organizar as finanças da família e estabelecer metas realistas de poupança e investimento.",
      category: "Planejamento",
      readTime: "8 min",
      publishDate: "15 Jan 2025",
      image: "/api/placeholder/400/250",
      featured: true
    },
    {
      id: 2,
      title: "Diversificação de Investimentos: Guia Completo",
      excerpt: "Entenda como distribuir seus investimentos de forma inteligente para reduzir riscos e maximizar retornos.",
      category: "Investimentos",
      readTime: "12 min",
      publishDate: "10 Jan 2025",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 3,
      title: "Planejamento Sucessório: Por Onde Começar",
      excerpt: "Dicas essenciais para proteger o patrimônio familiar e garantir a tranquilidade das próximas gerações.",
      category: "Sucessão",
      readTime: "10 min",
      publishDate: "05 Jan 2025",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 4,
      title: "Educação Financeira para Crianças e Adolescentes",
      excerpt: "Como ensinar conceitos financeiros básicos para os filhos de forma didática e prática.",
      category: "Educação",
      readTime: "6 min",
      publishDate: "01 Jan 2025",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 5,
      title: "Impostos e Investimentos: Otimizando sua Tributação",
      excerpt: "Estratégias legais para reduzir a carga tributária sobre seus investimentos e aumentar a rentabilidade líquida.",
      category: "Tributação",
      readTime: "15 min",
      publishDate: "28 Dez 2024",
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 6,
      title: "Fundos Imobiliários vs. Imóveis Físicos: Qual Escolher?",
      excerpt: "Análise comparativa detalhada entre investimento direto em imóveis e fundos imobiliários (FIIs).",
      category: "Imóveis",
      readTime: "11 min",
      publishDate: "20 Dez 2024",
      image: "/api/placeholder/400/250",
      featured: false
    }
  ];

  const categories = [
    { name: "Todos", icon: BookOpen, count: articles.length },
    { name: "Planejamento", icon: TrendingUp, count: articles.filter(a => a.category === "Planejamento").length },
    { name: "Investimentos", icon: TrendingUp, count: articles.filter(a => a.category === "Investimentos").length },
    { name: "Educação", icon: Users, count: articles.filter(a => a.category === "Educação").length }
  ];

  const featuredArticle = articles.find(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  return (
    <section id="articles" className="section-padding bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              <span className="text-business-600">Artigos</span> e Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conteúdo especializado para ajudar você a tomar decisões financeiras mais inteligentes 
              e construir um patrimônio sólido para sua família.
            </p>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="reveal delay-300">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="border-business-200 text-gray-700 hover:bg-business-50 hover:border-business-300 px-4 py-2 rounded-lg transition-colors"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.name}
                  <span className="ml-2 bg-business-100 text-business-600 px-2 py-1 rounded-full text-xs">
                    {category.count}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="reveal delay-600 mb-16">
            <div className="bg-gradient-to-r from-business-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-white/20 text-xs font-semibold px-3 py-1 rounded-full">
                      ARTIGO EM DESTAQUE
                    </span>
                    <span className="bg-white/20 text-xs font-semibold px-3 py-1 rounded-full">
                      {featuredArticle.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {featuredArticle.title}
                  </h3>
                  
                  <p className="text-blue-100 mb-6 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  
                  <div className="flex items-center space-x-6 mb-6 text-blue-100">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{featuredArticle.publishDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{featuredArticle.readTime} de leitura</span>
                    </div>
                  </div>
                  
                  <Button className="bg-white text-business-600 hover:bg-gray-100 font-semibold">
                    Ler Artigo Completo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="lg:order-last">
                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="w-full h-48 bg-white/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-white/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="reveal">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.slice(0, 6).map((article, index) => (
              <div 
                key={article.id}
                className={`reveal delay-${(index % 3) * 200} bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-business-200 overflow-hidden group cursor-pointer`}
              >
                {/* Article Image */}
                <div className="relative h-48 bg-gradient-to-br from-business-100 to-blue-100 overflow-hidden">
                  <div className="absolute inset-0 bg-business-200/30 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-business-600/60" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-business-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                
                {/* Article Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-business-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{article.publishDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    
                    <ArrowRight className="h-4 w-4 text-business-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="reveal mt-16">
          <div className="text-center">
            <Button
              size="lg"
              className="bg-business-600 hover:bg-business-700 text-white px-8 py-4 rounded-lg transition-colors"
            >
              Ver Todos os Artigos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="reveal mt-16">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Receba Conteúdo Exclusivo
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Inscreva-se em nossa newsletter e receba semanalmente artigos, dicas e insights 
              sobre planejamento financeiro familiar diretamente em seu e-mail.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-business-500 focus:border-business-500 transition-colors"
              />
              <Button className="bg-business-600 hover:bg-business-700 text-white px-6 py-3 rounded-lg transition-colors">
                Inscrever-se
              </Button>
            </div>
            
            <p className="text-xs text-gray-500 mt-4">
              Sem spam. Cancele a qualquer momento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}