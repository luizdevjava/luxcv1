'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  FileText, 
  Clock, 
  TrendingUp,
  LogOut,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  Crown,
  Shield
} from 'lucide-react';

interface DashboardStats {
  totalUsuarios: number;
  totalAnuncios: number;
  anunciosPendentes: number;
  anunciosRecentes: Array<{
    id: string;
    titulo: string;
    status: string;
    user: {
      nome: string;
    };
    criadoEm: string;
  }>;
}

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
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
    fetchDashboard();
  }, [router]);

  const fetchDashboard = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      setError('Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.push('/');
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
              <Link href="/" className="flex items-center gap-2">
                <Crown className="w-8 h-8 text-yellow-500" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  Lux Companions
                </h1>
              </Link>
              <span className="text-gray-400">|</span>
              <span className="text-red-400">Painel Administrativo</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Bem-vindo, {admin?.usuario}</span>
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Usuários</p>
                  <p className="text-3xl font-bold text-blue-500">{stats?.totalUsuarios || 0}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Anúncios</p>
                  <p className="text-3xl font-bold text-green-500">{stats?.totalAnuncios || 0}</p>
                </div>
                <FileText className="w-8 h-8 text-green-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Anúncios Pendentes</p>
                  <p className="text-3xl font-bold text-orange-500">{stats?.anunciosPendentes || 0}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Taxa de Crescimento</p>
                  <p className="text-3xl font-bold text-purple-500">+24%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            asChild
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold"
          >
            <Link href="/admin/anuncios">
              <FileText className="w-4 h-4 mr-2" />
              Gerenciar Anúncios
            </Link>
          </Button>

          <Button 
            asChild
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold"
          >
            <Link href="/admin/usuarios">
              <Users className="w-4 h-4 mr-2" />
              Gerenciar Usuários
            </Link>
          </Button>

          <Button 
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>

          <Button 
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Shield className="w-4 h-4 mr-2" />
            Segurança
          </Button>
        </div>

        {/* Anúncios Recentes */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-red-400 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Anúncios Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.anunciosRecentes && stats.anunciosRecentes.length > 0 ? (
              <div className="space-y-4">
                {stats.anunciosRecentes.map((anuncio) => (
                  <div key={anuncio.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="flex-1">
                      <h4 className="text-yellow-400 font-semibold">{anuncio.titulo}</h4>
                      <p className="text-gray-400 text-sm">Por: {anuncio.user.nome}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(anuncio.criadoEm).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={anuncio.status === 'ativo' ? 'bg-green-600' : 'bg-orange-600'}>
                        {anuncio.status === 'ativo' ? (
                          <><CheckCircle className="w-3 h-3 mr-1" /> Ativo</>
                        ) : (
                          <><Clock className="w-3 h-3 mr-1" /> Pendente</>
                        )}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Nenhum anúncio recente encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Atividade do Sistema */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-red-400">Log de Atividades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Novo usuário cadastrado há 2 minutos</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Anúncio aprovado há 5 minutos</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Novo anúncio aguardando aprovação há 10 minutos</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Usuário banido há 15 minutos</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg text-red-400">Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Banco de Dados</span>
                  <Badge className="bg-green-600">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">API</span>
                  <Badge className="bg-green-600">Funcionando</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Upload de Imagens</span>
                  <Badge className="bg-green-600">Ativo</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Cache</span>
                  <Badge className="bg-green-600">Limpo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}