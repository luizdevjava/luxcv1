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
  ArrowLeft, 
  Trash2, 
  Eye,
  Shield,
  Calendar,
  FileText,
  Crown
} from 'lucide-react';

interface User {
  id: string;
  nome: string;
  email: string;
  criadoEm: string;
  _count: {
    anuncios: number;
  };
}

export default function AdminUsuarios() {
  const [admin, setAdmin] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
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
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${userName}" e todos os seus anúncios?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        setError('Erro ao excluir usuário');
      }
    } catch (error) {
      setError('Erro de conexão ao excluir usuário');
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
              <h1 className="text-xl font-bold text-red-400">Gerenciar Usuários</h1>
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
                  <p className="text-gray-400 text-sm">Total de Usuários</p>
                  <p className="text-3xl font-bold text-blue-500">{users.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Usuários Ativos</p>
                  <p className="text-3xl font-bold text-green-500">
                    {users.filter(u => u._count.anuncios > 0).length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-green-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Anúncios</p>
                  <p className="text-3xl font-bold text-yellow-500">
                    {users.reduce((total, user) => total + user._count.anuncios, 0)}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-yellow-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Usuários */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-red-400 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Todos os Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Nenhum usuário encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-red-600/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-yellow-400 font-semibold">{user.nome}</h4>
                        <Badge className="bg-blue-600">
                          ID: {user.id.slice(0, 8)}...
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm mb-1">{user.email}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(user.criadoEm).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          <span>{user._count.anuncios} anúncio(s)</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={user._count.anuncios > 0 ? 'bg-green-600' : 'bg-gray-600'}>
                        {user._count.anuncios > 0 ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-red-600/50 text-red-400 hover:bg-red-600/20"
                        onClick={() => deleteUser(user.id, user.nome)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações */}
        <div className="mt-8 bg-gray-800/50 rounded-lg p-4 border border-gray-600">
          <h4 className="text-red-400 font-semibold mb-2">Informações Importantes:</h4>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Excluir um usuário removerá permanentemente todos os seus anúncios</li>
            <li>• Usuários com 0 anúncios são considerados inativos</li>
            <li>• Esta ação não pode ser desfeita</li>
            <li>• Considere entrar em contato antes de banir usuários</li>
          </ul>
        </div>
      </main>
    </div>
  );
}