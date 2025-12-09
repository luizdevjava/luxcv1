'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Eye,
  EyeOff,
  Calendar,
  User,
  DollarSign,
  Crown,
  Image as ImageIcon
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
  user: {
    id: string;
    nome: string;
    email: string;
  };
}

export default function AdminAnuncios() {
  const [admin, setAdmin] = useState<any>(null);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      router.push('/admin/login');
      return;
    }
    
    const parsedAdmin = JSON.parse(adminData);
    setAdmin(parsedAdmin);
    fetchAnuncios();
  }, [router]);

  const fetchAnuncios = async () => {
    try {
      const response = await fetch('/api/admin/anuncios');
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

  const toggleStatus = async (anuncioId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ativo' ? 'inativo' : 'ativo';
      const response = await fetch('/api/admin/anuncios', {
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
      } else {
        setError('Erro ao atualizar status');
      }
    } catch (error) {
      setError('Erro de conexão ao atualizar status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <p className="mt-4 text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-red-600/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.back()}
                className="text-gray-300 hover:text-red-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-xl font-bold text-red-400">Gerenciar Anúncios</h1>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              <span className="text-gray-300">Lux Companions</span>
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

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Anúncios</p>
                  <p className="text-3xl font-bold text-blue-500">{anuncios.length}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500/50" />
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
                <CheckCircle className="w-8 h-8 text-green-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Anúncios Pendentes</p>
                  <p className="text-3xl font-bold text-orange-500">
                    {anuncios.filter(a => a.status === 'inativo').length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-orange-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex gap-4 mb-6">
          <Button 
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => fetchAnuncios()}
          >
            <FileText className="w-4 h-4 mr-2" />
            Todos ({anuncios.length})
          </Button>
          <Button 
            variant="outline"
            className="border-green-600/50 text-green-400 hover:bg-green-600/20"
            onClick={() => setAnuncios(anuncios.filter(a => a.status === 'ativo'))}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Ativos ({anuncios.filter(a => a.status === 'ativo').length})
          </Button>
          <Button 
            variant="outline"
            className="border-orange-600/50 text-orange-400 hover:bg-orange-600/20"
            onClick={() => setAnuncios(anuncios.filter(a => a.status === 'inativo'))}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Pendentes ({anuncios.filter(a => a.status === 'inativo').length})
          </Button>
        </div>

        {/* Lista de Anúncios */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-red-400 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Todos os Anúncios
            </CardTitle>
          </CardHeader>
          <CardContent>
            {anuncios.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Nenhum anúncio encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {anuncios.map((anuncio) => (
                  <div key={anuncio.id} className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-red-600/50 transition-all duration-300">
                    <div className="grid md:grid-cols-4 gap-4">
                      {/* Foto */}
                      <div className="md:col-span-1">
                        {anuncio.foto1 ? (
                          <img 
                            src={anuncio.foto1} 
                            alt={anuncio.titulo}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-700 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-gray-600" />
                          </div>
                        )}
                      </div>

                      {/* Informações */}
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-yellow-400 font-semibold text-lg">{anuncio.titulo}</h4>
                          <Badge className={anuncio.status === 'ativo' ? 'bg-green-600' : 'bg-orange-600'}>
                            {anuncio.status === 'ativo' ? (
                              <><CheckCircle className="w-3 h-3 mr-1" /> Ativo</>
                            ) : (
                              <><XCircle className="w-3 h-3 mr-1" /> Pendente</>
                            )}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                          {anuncio.descricao}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{anuncio.user.nome}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span>R$ {anuncio.valor.toFixed(2)}/h</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(anuncio.criadoEm).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="md:col-span-1">
                        <div className="space-y-2">
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => toggleStatus(anuncio.id, anuncio.status)}
                          >
                            {anuncio.status === 'ativo' ? (
                              <><EyeOff className="w-3 h-3 mr-2" /> Desativar</>
                            ) : (
                              <><Eye className="w-3 h-3 mr-2" /> Aprovar</>
                            )}
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-gray-600 text-gray-300 hover:bg-gray-600"
                            onClick={() => window.open(`/anuncio/${anuncio.id}`, '_blank')}
                          >
                            Ver Anúncio
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações */}
        <div className="mt-8 bg-gray-800/50 rounded-lg p-4 border border-gray-600">
          <h4 className="text-red-400 font-semibold mb-2">Políticas de Moderação:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Apenas aprove anúncios que seguem as diretrizes da plataforma</li>
            <li>• Verifique se as fotos são apropriadas e autênticas</li>
            <li>• Anúncios com conteúdo inadequado devem ser desativados</li>
            <li>• Mantenha um ambiente seguro para todos os usuários</li>
          </ul>
        </div>
      </main>
    </div>
  );
}