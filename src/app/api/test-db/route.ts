import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    console.log('Testando conexão com banco...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    
    // Testar conexão simples
    await db.$queryRaw`SELECT 1`;
    
    // Testar se admin existe
    const adminCount = await db.admin.count();
    console.log('Admin count:', adminCount);
    
    // Testar se usuários existem
    const userCount = await db.user.count();
    console.log('User count:', userCount);
    
    return NextResponse.json({
      success: true,
      message: 'Banco conectado com sucesso!',
      adminCount,
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro no banco:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}