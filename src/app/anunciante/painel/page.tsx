'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Crown, 
  LogOut,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  Star
} from 'lucide-react';

interface Anuncio {
  id: string;
  titulo: string;
  descricao: string;
  valor: number;
  foto1?: string;
  foto2?: string;
  foto3?: string;
  status: 'ativo' | 'inativo';
  criadoEm: string;
}

interface User {
  id: string;
  nome: string;
  email: string;
}

export default function AnunciantePainel() {
  const [user, setUser] = useState<User | null>(null);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/anunciante/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    fetchAnuncios(parsedUser.id);
  }, [router]);

  const fetchAnuncios = async (userId: string) => {
    try {
      const response = await fetch(`/api/anuncios/list?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAnuncios(data);
      }
    } catch (error) {
      setError('Erro ao carregar anúncios');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const toggleStatus = async (anuncioId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
      const response = await fetch('/api/anuncios/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: anuncioId, 
          status: newStatus 
        }),
      });

      if (response.ok) {
        setAnuncios(anuncios.map(anuncio => 
          anuncio.id === anuncioId 
            ? { ...anuncio, status: newStatus as 'ativo' | 'inativo' }
            : anuncio
        ));
      }
    } catch (error) {
      setError('Erro ao atualizar status');
    }
  };

  const deleteAnuncio = async (anuncioId: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) {
      return;
    }

    try {
      const response = await fetch(`/api/anuncios/delete?id=${anuncioId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAnuncios(anuncios.filter(anuncio => anuncio.id !== anuncioId));
      }
    } catch (error) {
      setError('Erro ao excluir anúncio');
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-yellow-600/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Crown className="w-8 h-8 text-yellow-500" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Lux Companions
                </h1>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-yellow-400">Painel do Anunciante</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Bem-vindo, {user?.nome}</span>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-gray-600 text-gray-300 hover:bg-red-600/20 hover:text-red-400 hover:border-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert className="bg-red-900/50 border-red-600 text-red-200 mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Anúncios</p>
                  <p className="text-3xl font-bold text-yellow-500">{anuncios.length}</p>
                </div>
                <Crown className="w-8 h-8 text-yellow-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Anúncios Ativos</p>
                  <p className="text-3xl font-bold text-green-500">
                    {anuncios.filter(a => a.status === 'ativo').length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-green-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Anúncios Inativos</p>
                  <p className="text-3xl font-bold text-orange-500">
                    {anuncios.filter(a => a.status === 'inativo').length}
                  </p>
                </div>
                <EyeOff className="w-8 h-8 text-orange-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header da Lista */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-yellow-400">Meus Anúncios</h2>
          <Button 
            asChild
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
          >
            <Link href="/anunciante/criar-anuncio">
              <Plus className="w-4 h-4 mr-2" />
              Criar Novo Anúncio
            </Link>
          </Button>
        </div>

        {/* Lista de Anúncios */}
        {anuncios.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-12 pb-12 text-center">
              <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Nenhum anúncio encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Comece agora mesmo criando seu primeiro anúncio
              </p>
              <Button 
                asChild
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
              >
                <Link href="/anunciante/criar-anuncio">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Anúncio
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {anuncios.map((anuncio) => (
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
                      <ImageIcon className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className={anuncio.status === 'ativo' ? 'bg-green-600' : 'bg-orange-600'}>
                      {anuncio.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-yellow-400 line-clamp-1">
                    {anuncio.titulo}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <DollarSign className="w-4 h-4" />
                    <span>R$ {anuncio.valor.toFixed(2)}/h</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {anuncio.descricao}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(anuncio.criadoEm).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleStatus(anuncio.id, anuncio.status)}
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-yellow-600/20 hover:text-yellow-400 hover:border-yellow-600"
                    >
                      {anuncio.status === 'ativo' ? (
                        <><EyeOff className="w-3 h-3 mr-1" /> Desativar</>
                      ) : (
                        <><Eye className="w-3 h-3 mr-1" /> Ativar</>
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteAnuncio(anuncio.id)}
                      className="border-red-600/50 text-red-400 hover:bg-red-600/20 hover:text-red-300"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}