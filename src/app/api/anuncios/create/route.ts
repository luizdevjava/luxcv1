import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { userId, titulo, descricao, valor, foto1, foto2, foto3 } = await request.json();

    if (!userId || !titulo || !descricao || !valor) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    const anuncio = await db.anuncio.create({
      data: {
        userId,
        titulo,
        descricao,
        valor: parseFloat(valor),
        foto1,
        foto2,
        foto3,
        status: 'inativo'
      }
    });

    return NextResponse.json(anuncio);
  } catch (error) {
    console.error('Erro ao criar anúncio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}