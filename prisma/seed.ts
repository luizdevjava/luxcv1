import { db } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar administrador padrão
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await db.admin.upsert({
    where: { usuario: 'admin' },
    update: {},
    create: {
      usuario: 'admin',
      senha: adminPassword,
    },
  });

  console.log('Administrador criado:', admin);

  // Criar usuários de exemplo
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

  console.log('Usuários criados:', { user1, user2 });

  // Criar anúncios de exemplo
  const anuncio1 = await db.anuncio.create({
    data: {
      userId: user1.id,
      titulo: 'Companhia sofisticada para jantares',
      descricao: 'Sou uma acompanhante de luxo, com 25 anos, formada em letras e apaixonada por boa conversa. Perfeita para jantares executivos, eventos sociais e viagens de negócios. Disponível para acompanhamento em hotéis 5 estrelas e residências particulares.',
      valor: 500.00,
      status: 'ativo',
      foto1: 'https://via.placeholder.com/400x600/FFD700/000000?text=Foto+1',
      foto2: 'https://via.placeholder.com/400x600/FFD700/000000?text=Foto+2',
    },
  });

  const anuncio2 = await db.anuncio.create({
    data: {
      userId: user1.id,
      titulo: 'Massagista relaxante e terapêutica',
      descricao: 'Profissional especializada em massagens relaxantes e terapêuticas. Técnicas variadas incluindo sueca, pedras quentes e aromaterapia. Ambiente climatizado, toalhas macias e óleos especiais. Sinta o verdadeiro relaxamento corporal e mental.',
      valor: 300.00,
      status: 'ativo',
      foto1: 'https://via.placeholder.com/400x600/FFD700/000000?text=Massage',
    },
  });

  const anuncio3 = await db.anuncio.create({
    data: {
      userId: user2.id,
      titulo: 'Garota de programa universitária',
      descricao: 'Estudante de direito, 22 anos, inteligente e educada. Perfeita para eventos corporativos e encontros refinados. Falo inglês fluentemente e tenho conhecimento em cultura geral. Disponível para viagens e acompanhamento de longa duração.',
      valor: 800.00,
      status: 'inativo',
      foto1: 'https://via.placeholder.com/400x600/FFD700/000000?text=Universitária',
      foto2: 'https://via.placeholder.com/400x600/FFD700/000000?text=Estudo',
      foto3: 'https://via.placeholder.com/400x600/FFD700/000000?text=Elegante',
    },
  });

  console.log('Anúncios criados:', { anuncio1, anuncio2, anuncio3 });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });