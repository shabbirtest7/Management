const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding...');

  // Clear existing data
//   console.log('Cleaning up existing data...');
//   await prisma.activity.deleteMany({});
//   await prisma.project.deleteMany({});
//   await prisma.user.deleteMany({});
  
  console.log('Creating users...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);
  const johnPassword = await bcrypt.hash('john123', 10);
  const janePassword = await bcrypt.hash('jane123', 10);
  const mikePassword = await bcrypt.hash('mike123', 10);

  // Create Admin Users
  const admin1 = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      email: 'super.admin@example.com',
      name: 'Super Admin',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create Regular Users
  const john = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
      password: johnPassword,
      role: 'USER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const jane = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      password: janePassword,
      role: 'USER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const mike = await prisma.user.create({
    data: {
      email: 'mike.wilson@example.com',
      name: 'Mike Wilson',
      password: mikePassword,
      role: 'USER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const sarah = await prisma.user.create({
    data: {
      email: 'sarah.johnson@example.com',
      name: 'Sarah Johnson',
      password: userPassword,
      role: 'USER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`Created users`);

  // Create Projects
  console.log('Creating projects...');

  const currentDate = new Date();
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const twoMonthsLater = new Date();
  twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

  const projects = [
    // Completed Projects
    {
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern UI/UX design principles',
      status: 'COMPLETED',
      priority: 'HIGH',
      dueDate: lastMonth,
      createdById: admin1.id,
      assignedToId: john.id,
    },
    {
      name: 'Database Migration',
      description: 'Migrate legacy database to new PostgreSQL infrastructure',
      status: 'COMPLETED',
      priority: 'CRITICAL',
      dueDate: twoMonthsAgo,
      createdById: admin2.id,
      assignedToId: jane.id,
    },
    {
      name: 'Security Audit',
      description: 'Conduct comprehensive security audit of all systems',
      status: 'COMPLETED',
      priority: 'HIGH',
      dueDate: lastMonth,
      createdById: admin1.id,
      assignedToId: mike.id,
    },
    // Add more projects as needed...
  ];

  // Create projects
  for (const projectData of projects) {
    await prisma.project.create({
      data: projectData,
    });
  }

  console.log(`Projects created`);

  console.log('\n✅ Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });