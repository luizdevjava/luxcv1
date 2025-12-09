import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let whereClause: any = {};

    if (userId) {
      whereClause.userId = userId;
    }

    if (status) {
      whereClause.status = status;
    } else {
      // Por padrão, mostrar apenas anúncios ativos na área pública
      whereClause.status = 'ativo';
    }

    if (search) {
      whereClause.OR = [
        { titulo: { contains: search } },
        { descricao: { contains: search } }
      ];
    }

    const anuncios = await db.anuncio.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      },
      orderBy: {
        criadoEm: 'desc'
      }
    });

    return NextResponse.json(anuncios);
  } catch (error) {
    console.error('Erro ao listar anúncios:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}