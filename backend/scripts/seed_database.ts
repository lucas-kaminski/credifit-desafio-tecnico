import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const prisma = new PrismaClient();

const WORD_LIST_URL =
  'https://raw.githubusercontent.com/meetDeveloper/freeDictionaryAPI/refs/heads/master/meta/wordList/english.txt';
const DOWNLOAD_DIR = path.resolve(__dirname, '../downloads');
const WORD_LIST_PATH = path.join(DOWNLOAD_DIR, 'wordList.txt');

async function downloadWordList() {
  return new Promise<void>((resolve, reject) => {
    https
      .get(WORD_LIST_URL, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Failed to get '${WORD_LIST_URL}' (${response.statusCode})`,
            ),
          );
          return;
        }

        let data = '';
        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
          fs.writeFileSync(WORD_LIST_PATH, data, 'utf-8');
          resolve();
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function main() {
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma
      .$disconnect()
      .then(() => {})
      .catch((e) => {
        console.error(e);
      });
  });
