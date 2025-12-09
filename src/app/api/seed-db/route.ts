import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST() {
  try {
    console.log('Executando seed no banco PostgreSQL...');
    
    // Criar administrador
    const adminPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await db.admin.upsert({
      where: { usuario: 'admin' },
      update: {},
      create: {
        usuario: 'admin',
        senha: adminPassword,
      },
    });

    // Criar usuários
    const userPassword = await bcrypt.hash('senha123', 10);

    const user1 = await db.user.upsert({
      where: { email: 'usuario1@exemplo.com' },
      update: {},
      create: {
        nome: 'Maria Silva',
        email: 'usuario1@exemplo.com',
        senha: userPassword,
      },
    });

    const user2 = await db.user.upsert({
      where: { email: 'usuario2@exemplo.com' },
      update: {},
      create: {
        nome: 'Ana Santos',
        email: 'usuario2@exemplo.com',
        senha: userPassword,
      },
    });

    // Criar anúncios
    await db.anuncio.createMany({
      data: [
        {
          userId: user1.id,
          titulo: 'Companhia sofisticada para jantares',
          descricao: 'Sou uma acompanhante de luxo, com 25 anos, formada em letras e apaixonada por boa conversa.',
          valor: 500.00,
          status: 'ativo',
          foto1: 'https://via.placeholder.com/400x600/FFD700/000000?text=Foto+1',
        },
        {
          userId: user1.id,
          titulo: 'Massagista relaxante e terapêutica',
          descricao: 'Profissional especializada em massagens relaxantes e terapêuticas.',
          valor: 300.00,
          status: 'ativo',
          foto1: 'https://via.placeholder.com/400x600/FFD700/000000?text=Massage',
        },
        {
          userId: user2.id,
          titulo: 'Garota de programa universitária',
          descricao: 'Estudante de direito, 22 anos, inteligente e educada.',
          valor: 800.00,
          status: 'inativo',
          foto1: 'https://via.placeholder.com/400x600/FFD700/000000?text=Universitária',
        }
      ],
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Seed executado com sucesso!',
      data: { admin, user1, user2 }
    });
  } catch (error) {
    console.error('Erro no seed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}