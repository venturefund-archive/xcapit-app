import { execSync } from 'child_process';
import chalk from 'chalk';

const badNames = [
  'variables.env.ts',
  'variables.env',
  '.env',
  'docker-compose.yml',
  'environment.ts',
  'environment.prod.ts',
];

const gitCommand = `git diff --staged --name-only`;
const files = execSync(gitCommand).toString().split('\n').filter(Boolean);
const badFiles = files.filter((file) => badNames.some((bn) => file.endsWith(bn)));
if (badFiles.length) {
  console.log(chalk.red.bold(`You are trying to commit a file with environment variables: ${badFiles}`));
  process.exit(1);
} else {
  process.exit(0);
}
