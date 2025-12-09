import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do anúncio é obrigatório' },
        { status: 400 }
      );
    }

    await db.anuncio.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Anúncio excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir anúncio:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}