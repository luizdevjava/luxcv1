'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Image as ImageIcon,
  Crown,
  Sparkles,
  DollarSign,
  FileText
} from 'lucide-react';

export default function CriarAnuncio() {
  const [user, setUser] = useState<any>(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [fotos, setFotos] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/anunciante/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.slice(0, 3 - fotos.length);
    
    if (fotos.length + validFiles.length > 3) {
      setError('Máximo de 3 fotos permitidas');
      return;
    }

    setFotos([...fotos, ...validFiles]);
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const uploadFotos = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of files) {
      // Simulação de upload - na prática, faria upload para um serviço
      // Por ora, vamos usar URLs temporárias
      const tempUrl = URL.createObjectURL(file);
      urls.push(tempUrl);
    }
    
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!titulo || !descricao || !valor) {
      setError('Todos os campos obrigatórios devem ser preenchidos');
      setLoading(false);
      return;
    }

    const valorNum = parseFloat(valor);
    if (isNaN(valorNum) || valorNum <= 0) {
      setError('Valor deve ser um número positivo');
      setLoading(false);
      return;
    }

    try {
      const fotoUrls = await uploadFotos(fotos);
      
      const response = await fetch('/api/anuncios/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          titulo,
          descricao,
          valor: valorNum,
          foto1: fotoUrls[0] || undefined,
          foto2: fotoUrls[1] || undefined,
          foto3: fotoUrls[2] || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/anunciante/painel');
        }, 2000);
      } else {
        setError(data.error || 'Erro ao criar anúncio');
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center p-4">
        <Card className="bg-gray-800 border-gray-700 shadow-xl max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Anúncio Criado!</h2>
            <p className="text-gray-300 mb-4">
              Seu anúncio foi criado com sucesso e está aguardando aprovação.
            </p>
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </CardContent>
        </Card>
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
              <h1 className="text-xl font-bold text-yellow-400">Criar Anúncio</h1>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              <span className="text-gray-300">Lux Companions</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <Alert className="bg-red-900/50 border-red-600 text-red-200 mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-yellow-400 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              Novo Anúncio
            </CardTitle>
            <p className="text-gray-400">
              Preencha as informações para criar seu anúncio
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-gray-300 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Título do Anúncio *
                </Label>
                <Input
                  id="titulo"
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Ex: Companhia sofisticada para momentos especiais"
                  required
                  maxLength={100}
                />
                <p className="text-xs text-gray-500">
                  {titulo.length}/100 caracteres
                </p>
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-gray-300 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Descrição Completa *
                </Label>
                <Textarea
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-32"
                  placeholder="Descreva-se detalhadamente, suas características, o que oferece, etc..."
                  required
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500">
                  {descricao.length}/1000 caracteres
                </p>
              </div>

              {/* Valor */}
              <div className="space-y-2">
                <Label htmlFor="valor" className="text-gray-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Valor por Hora *
                </Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Ex: 300.00"
                  required
                />
                <p className="text-xs text-gray-500">
                  Digite apenas números (ex: 300 para R$ 300,00)
                </p>
              </div>

              {/* Fotos */}
              <div className="space-y-4">
                <Label className="text-gray-300 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Fotos (até 3)
                </Label>
                
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-yellow-600/50 transition-colors">
                  <input
                    type="file"
                    id="fotos"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={fotos.length >= 3}
                  />
                  <label 
                    htmlFor="fotos" 
                    className={`cursor-pointer ${fotos.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">
                      {fotos.length >= 3 ? 'Máximo de fotos atingido' : 'Clique para adicionar fotos'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {fotos.length >= 3 ? '3/3 fotos' : `${fotos.length}/3 fotos`}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Formatos: JPG, PNG, WebP (máx 5MB cada)
                    </p>
                  </label>
                </div>

                {/* Preview das Fotos */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeFoto(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          Foto {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Informações Importantes */}
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <h4 className="text-yellow-400 font-semibold mb-2">Informações Importantes:</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Seu anúncio será revisado antes de ser publicado</li>
                  <li>• Fotos adequadas aumentam suas chances de aprovação</li>
                  <li>• Anúncios com informações completos têm mais visibilidade</li>
                  <li>• Você poderá editar ou remover seu anúncio a qualquer momento</li>
                </ul>
              </div>

              {/* Botões */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Criando...
                    </div>
                  ) : (
                    'Criar Anúncio'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}