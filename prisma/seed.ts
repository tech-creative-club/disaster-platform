import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const csvPath = path.join(__dirname, 'shelter-ishikawa.csv');
  try {
    const csvData = fs.readFileSync(csvPath, 'utf-8');

    const rows = csvData.split('\n');
    for (const row of rows) {
      const columns = row.split(',');
      const name = columns[3].trim();
      const location = columns[4].trim();

      await prisma.shelter.create({
        data: {
          name: name,
          location: location,
          capacity: 0,
        },
      });
    }

    console.log('Prisma seeds created successfully');
  } catch (error) {
    console.error('Error creating Prisma seeds:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
