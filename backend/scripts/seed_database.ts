import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import axios, { AxiosError } from 'axios';

const prisma = new PrismaClient();

const WORD_LIST_URL =
  'https://raw.githubusercontent.com/meetDeveloper/freeDictionaryAPI/refs/heads/master/meta/wordList/english.txt';
const DOWNLOAD_DIR = path.resolve(__dirname, '../downloads');
const WORD_LIST_PATH = path.join(DOWNLOAD_DIR, 'wordList.txt');

async function downloadWordList(): Promise<void> {
  try {
    const response = await axios.get(WORD_LIST_URL);
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
    fs.writeFileSync(WORD_LIST_PATH, response.data, 'utf-8');
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(`Failed to download word list: ${error.message}`);
    }
    throw error;
  }
}

async function main(): Promise<void> {
  await downloadWordList();

  const fileContent = fs.readFileSync(WORD_LIST_PATH, 'utf-8');
  const words = fileContent
    .split('\n')
    .map((w) => w.trim())
    .filter(Boolean);

  await prisma.word.createMany({
    data: words.map((word) => ({ WORD: word })),
    skipDuplicates: true,
  });
}

void main()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect().catch((e) => {
      console.error(e);
    });
  });
