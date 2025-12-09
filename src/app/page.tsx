'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Phone, MessageCircle, Crown, Sparkles } from 'lucide-react';

interface Anuncio {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  foto1?: string;
  foto2?: string;
  foto3?: string;
  status: string;
  user: {
    nome: string;
  };
}

export default function Home() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const tagsFake = [
    'Loira', 'Morena', 'Ruiva', 'Mulata', 'Asiática', 'Brasileira',
    'Gata', 'Gostosa', 'Delicinha', 'Tesuda', 'Safada', 'Garota de Programa'
  ];

  useEffect(() => {
    fetchAnuncios();
  }, []);

  const fetchAnuncios = async () => {
    try {
      const response = await fetch('/api/anuncios/list');
      if (response.ok) {
        const data = await response.json();
        setAnuncios(data);
      }
    } catch (error) {
      console.error('Erro ao buscar anúncios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/anuncios/list?search=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setAnuncios(data);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
    }
  };

  const premiumAnuncios = anuncios.slice(0, 2);
  const regularAnuncios = anuncios.slice(2);

  const formatWhatsApp = (phone: string) => {
    return `https://wa.me/55${phone.replace(/\D/g, '')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-yellow-600/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-8 h-8 text-yellow-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Lux Companions
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="hover:text-yellow-500 transition-colors">Início</Link>
              <Link href="/anuncios" className="hover:text-yellow-500 transition-colors">Anúncios</Link>
              <Link href="/anunciante/login" className="hover:text-yellow-500 transition-colors">Área do Anunciante</Link>
              <Link href="/admin/login" className="hover:text-yellow-500 transition-colors">Admin</Link>
            </nav>
            <Button asChild className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold">
              <Link href="/anunciante/cadastro">Quero Anunciar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Acompanhantes de Luxo
            </h2>
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-gray-300 text-lg mb-8">
            As mais belas e sofisticadas companhias para momentos inesquecíveis
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Buscar por título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                onClick={handleSearch}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tags Cloud */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {tagsFake.map((tag, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20 cursor-pointer transition-colors"
                onClick={() => {
                  setSearchTerm(tag);
                  handleSearch();
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </section>

        {/* Premium Anuncios */}
        {premiumAnuncios.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Crown className="w-6 h-6 text-yellow-500" />
              <h3 className="text-2xl font-bold text-yellow-500">Destaques Premium</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {premiumAnuncios.map((anuncio) => (
                <Card key={anuncio.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border-yellow-600/30 overflow-hidden hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/20">
                  <div className="relative">
                    {anuncio.foto1 ? (
                      <img 
                        src={anuncio.foto1} 
                        alt={anuncio.titulo}
                        className="w-full h-64 object-cover"
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                        <div className="text-gray-500">Sem foto</div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-yellow-400">{anuncio.titulo}</CardTitle>
                    <p className="text-gray-300 text-sm">Por {anuncio.user.nome}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 mb-4 line-clamp-2">{anuncio.descricao}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-yellow-500">
                        R$ {anuncio.valor.toFixed(2)}/h
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-yellow-500">4.9</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        asChild 
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        <Link href={`/anuncio/${anuncio.id}`}>
                          <Phone className="w-4 h-4 mr-2" />
                          WhatsApp
                        </Link>
                      </Button>
                      <Button 
                        asChild 
                        variant="outline"
                        className="border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20"
                      >
                        <Link href={`/anuncio/${anuncio.id}`}>
                          Ver Perfil
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Regular Anuncios */}
        {regularAnuncios.length > 0 && (
          <section>
            <h3 className="text-2xl font-bold mb-6 text-yellow-400">Mais Anúncios</h3>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                <p className="mt-2 text-gray-400">Carregando anúncios...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {regularAnuncios.map((anuncio) => (
                  <Card key={anuncio.id} className="bg-gray-800 border-gray-700 overflow-hidden hover:border-yellow-600/50 transition-all duration-300">
                    <div className="relative">
                      {anuncio.foto1 ? (
                        <img 
                          src={anuncio.foto1} 
                          alt={anuncio.titulo}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                          <div className="text-gray-500">Sem foto</div>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-yellow-400">{anuncio.titulo}</CardTitle>
                      <p className="text-gray-400 text-sm">Por {anuncio.user.nome}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{anuncio.descricao}</p>
                      <div className="text-xl font-bold text-yellow-500 mb-3">
                        R$ {anuncio.valor.toFixed(2)}/h
                      </div>
                      <Button 
                        asChild 
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        <Link href={`/anuncio/${anuncio.id}`}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contato
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}

        {anuncios.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">Nenhum anúncio encontrado no momento.</div>
            <p className="text-gray-600 mt-2">Volte em breve para novas companhias!</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-yellow-600/30 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Lux Companions. Todos os direitos reservados.</p>
            <p className="text-sm mt-2">Maior de 18 anos | Conteúdo adulto</p>
          </div>
        </div>
      </footer>
    </div>
  );
}