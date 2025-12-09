import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      message: 'API funcionando!',
      timestamp: new Date().toISOString(),
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlPrefix: process.env.DATABASE_URL?.split('@')[0]?.split('//')[1]?.split(':')[0] || 'unknown'
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}