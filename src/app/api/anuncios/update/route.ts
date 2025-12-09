import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(request: NextRequest) {
  try {
    const { id, titulo, descricao, valor, foto1, foto2, foto3, status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID do anúncio é obrigatório' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    
    if (titulo !== undefined) updateData.titulo = titulo;
    if (descricao !== undefined) updateData.descricao = descricao;
    if (valor !== undefined) updateData.valor = parseFloat(valor);
    if (foto1 !== undefined) updateData.foto1 = foto1;
    if (foto2 !== undefined) updateData.foto2 = foto2;
    if (foto3 !== undefined) updateData.foto3 = foto3;
    if (status !== undefined) updateData.status = status;

    const anuncio = await db.anuncio.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            nome: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(anuncio);
  } catch (error) {
    console.error('Erro ao atualizar anúncio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}