'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Phone, MessageCircle, Star, Calendar, User, DollarSign, Image as ImageIcon } from 'lucide-react';

interface Anuncio {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  foto1?: string;
  foto2?: string;
  foto3?: string;
  status: string;
  criadoEm: string;
  user: {
    id: string;
    nome: string;
    email: string;
  };
}

export default function AnuncioDetalhe() {
  const params = useParams();
  const router = useRouter();
  const [anuncio, setAnuncio] = useState<Anuncio | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchAnuncio(params.id as string);
    }
  }, [params.id]);

  const fetchAnuncio = async (id: string) => {
    try {
      const response = await fetch(`/api/anuncios/list`);
      if (response.ok) {
        const anuncios = await response.json();
        const foundAnuncio = anuncios.find((a: Anuncio) => a.id === id);
        setAnuncio(foundAnuncio || null);
      }
    } catch (error) {
      console.error('Erro ao buscar anúncio:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatWhatsApp = (phone: string) => {
    return `https://wa.me/55${phone.replace(/\D/g, '')}`;
  };

  const images = [
    anuncio?.foto1,
    anuncio?.foto2,
    anuncio?.foto3
  ].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          <p className="mt-4 text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!anuncio) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Anúncio não encontrado</h1>
          <Button asChild className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black">
            <Link href="/">Voltar para Início</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-yellow-600/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.back()}
                className="text-gray-300 hover:text-yellow-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                {anuncio.titulo}
              </h1>
            </div>
            <Badge className="bg-green-600 text-white">
              Disponível
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Galeria de Fotos */}
          <div>
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  {images.length > 0 ? (
                    <img 
                      src={images[selectedImage]} 
                      alt={anuncio.titulo}
                      className="w-full h-96 object-cover"
                    />
                  ) : (
                    <div className="w-full h-96 bg-gray-700 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-500">Sem fotos disponíveis</p>
                      </div>
                    </div>
                  )}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            selectedImage === index ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Miniaturas */}
                {images.length > 1 && (
                  <div className="flex gap-2 p-4 border-t border-gray-700">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-1 h-20 rounded overflow-hidden border-2 transition-colors ${
                          selectedImage === index ? 'border-yellow-500' : 'border-gray-600'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Informações do Anúncio */}
          <div className="space-y-6">
            {/* Título e Valor */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-yellow-400 mb-2">{anuncio.titulo}</CardTitle>
                    <div className="flex items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{anuncio.user.nome}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(anuncio.criadoEm).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-yellow-500">
                      R$ {anuncio.valor.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">por hora</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Descrição */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-yellow-400">Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {anuncio.descricao}
                </p>
              </CardContent>
            </Card>

            {/* Avaliação */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="w-5 h-5 text-yellow-500 fill-current" 
                        />
                      ))}
                    </div>
                    <span className="text-yellow-500 font-semibold">5.0</span>
                    <span className="text-gray-400">(127 avaliações)</span>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    Verificado
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="space-y-3">
              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-6 text-lg"
              >
                <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                  <Phone className="w-5 h-5 mr-3" />
                  Agendar via WhatsApp
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-yellow-600/50 text-yellow-400 hover:bg-yellow-600/20 py-6 text-lg"
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                Enviar Mensagem
              </Button>
            </div>

            {/* Informações Adicionais */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-yellow-400">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Localização</span>
                  <span className="text-white">São Paulo - SP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Atende</span>
                  <span className="text-white">Homens, Mulheres, Casais</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Local</span>
                  <span className="text-white">A domicilio / Hotel</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Disponibilidade</span>
                  <span className="text-green-400">24/7</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}