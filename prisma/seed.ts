import { PrismaClient } from './generated-client';
import { resourcesData } from '../data/resources';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('adminpassword', 10);

  // Create an admin
  await prisma.admin.upsert({
    where: { email: 'admin@bosc.library' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'admin@bosc.library',
      password: hashedPassword,
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
      create: {
        ...member,
        password: await bcrypt.hash('memberpassword', 10),
      },
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
