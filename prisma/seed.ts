import { PrismaClient } from './generated-client';
import { resourcesData } from '../data/resources';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create an admin
  await prisma.admin.upsert({
    where: { email: 'admin@bosc.library' },
    update: {},
    create: {
      email: 'admin@bosc.library',
      password: 'adminpassword', // In a real app, hash this!
      name: 'BOSC Administrator',
    },
  });

  // Seed resources
  for (const resource of resourcesData) {
    await prisma.resource.upsert({
      where: { id: resource.id },
      update: {
        title: resource.title,
        description: resource.description,
        category: resource.category,
        language: resource.language,
        link: resource.link,
      },
      create: {
        id: resource.id,
        title: resource.title,
        description: resource.description,
        category: resource.category,
        language: resource.language,
        link: resource.link,
      },
    });
  }

  // Create some sample members
  const members = [
    { name: 'John Doe', email: 'john@example.com', role: 'student' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'teacher' },
  ];

  for (const member of members) {
    await prisma.member.upsert({
      where: { email: member.email },
      update: {},
      create: member,
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
