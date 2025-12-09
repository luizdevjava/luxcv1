export interface User {
  id: string;
  nome: string;
  email: string;
  criadoEm: Date;
}

export interface Anuncio {
  id: string;
  userId: string;
  titulo: string;
  descricao: string;
  valor: number;
  foto1?: string;
  foto2?: string;
  foto3?: string;
  criadoEm: Date;
  status: 'ativo' | 'inativo';
  user?: User;
}

export interface Admin {
  id: string;
  usuario: string;
  criadoEm: Date;
}

export interface CreateUserRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface CreateAnuncioRequest {
  titulo: string;
  descricao: string;
  valor: number;
  foto1?: File;
  foto2?: File;
  foto3?: File;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface AdminLoginRequest {
  usuario: string;
  senha: string;
}