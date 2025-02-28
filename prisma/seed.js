const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Insertar carreras
  await prisma.career.createMany({
    data: [
      {
        name: 'Agronomía mención Producción Animal',
        description: null,
        isActive: true,
      },
      {
        name: 'Agronomía mención Producción Vegetal',
        description: null,
        isActive: true,
      },
      {
        name: 'Medicina "Dr. José Francisco Torrealba"',
        description: null,
        isActive: true,
      },
      { name: 'Enfermería', description: null, isActive: true },
      { name: 'Radiodiagnóstico', description: null, isActive: true },
      { name: 'Medicina veterinaria', description: null, isActive: true },
      { name: 'Odontología', description: null, isActive: true },
      { name: 'Educación Integral', description: null, isActive: true },
      {
        name: 'Educación Mención Computación',
        description: null,
        isActive: true,
      },
      { name: 'Administración Comercial', description: null, isActive: true },
      { name: 'Contaduría Pública', description: null, isActive: true },
      { name: 'Economía', description: null, isActive: true },
      { name: 'Comunicación Social', description: null, isActive: true },
      { name: 'Derecho', description: null, isActive: true },
      { name: 'Ingeniería Informática', description: null, isActive: true },
      { name: 'Ingeniería Electrónica', description: null, isActive: true },
      { name: 'Ingeniería Civil', description: null, isActive: true },
      {
        name: 'Ingeniería en Hidrocarburos mención Gas',
        description: null,
        isActive: true,
      },
      {
        name: 'Ingeniería en Hidrocarburos mención Petróleo',
        description: null,
        isActive: true,
      },
      { name: 'Ingeniería Industrial', description: null, isActive: true },
      { name: 'Historia', description: null, isActive: true },
      {
        name: 'Comedor Universitario',
        description: null,
        isActive: true,
      },
    ],
  });

  console.log('✅ Seeding completo.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
