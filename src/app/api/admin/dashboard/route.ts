import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const totalUsuarios = await db.user.count();
    const totalAnuncios = await db.anuncio.count();
    const anunciosPendentes = await db.anuncio.count({
      where: { status: 'inativo' }
    });

    const anunciosRecentes = await db.anuncio.findMany({
      take: 5,
      orderBy: { criadoEm: 'desc' },
      include: {
        user: {
          select: {
            nome: true
          }
        }
      }
    });

    return NextResponse.json({
      totalUsuarios,
      totalAnuncios,
      anunciosPendentes,
      anunciosRecentes
    });
  } catch (error) {
    console.error('Erro no dashboard:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}