import TOML from '@ltd/j-toml';
import { Command } from 'commander';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import Path from 'path';
import { fileURLToPath } from 'url';

import { Atlas } from './atlas.js';
import { AtlasConfig } from './config.js';
import { saveAtlasImage, saveJsonData } from './save.js';

const DIR_NAME = Path.dirname(fileURLToPath(import.meta.url));

export function initProject(): void {
  const templatePath = Path.join(DIR_NAME, '../template/template.toml');
  const destination = Path.join(process.cwd(), 'atlas.toml');

  copyFileSync(templatePath, destination);
  process.stdout.write('Created atlas.toml config file.\n');
}

export function packAtlas(userPath: string): void {
  let configPath = 'atlas.toml';
  // Get the .toml file if specified.
  if (userPath) {
    configPath = userPath;
  }

  if (!configPath.endsWith('.toml')) {
    process.stdout.write('No .toml path config provided.\n');
    return;
  }

  const fullPath = Path.join(process.cwd(), configPath);
  const dir = Path.dirname(fullPath);
  if (!existsSync(fullPath)) {
    process.stdout.write(`${fullPath} does not exist.\n`);
    return;
  }

  // Set the working directory to the folder of the .toml file to make it easier to get relative paths for the images.
  process.chdir(dir);

  // Load the atlas.toml config data.
  const tomlString = readFileSync(fullPath).toString();
  const atlasConfig: AtlasConfig = TOML.parse(tomlString) as unknown as AtlasConfig;

  // Create the atlases for each config in the file.
  for (const config of atlasConfig.atlas) {
    if (config.extrude) {
      config.extrude = Number(config.extrude);
    }
    if (config.maxWidth) {
      config.maxWidth = Number(config.maxWidth);
    }
    if (config.maxHeight) {
      config.maxHeight = Number(config.maxHeight);
    }

    const atlas = new Atlas(config);

    if (!atlas.pack()) {
      process.stdout.write(`Unable to pack atlas ${config.name}.\n`);
      continue;
    }

    // Create the save folder if it does not exist.
    const saveFolder = Path.join(process.cwd(), config.saveFolder);
    if (!existsSync(saveFolder)) {
      mkdirSync(saveFolder, { recursive: true });
    }

    saveAtlasImage(config.name, saveFolder, atlas);

    if (!config.noData) {
      saveJsonData(config.name, saveFolder, atlas);
    }
  }
}

const program = new Command();
program.name('Jume Atlas').description('Jume Atlas tools').version('1.0.0');

interface PackOptions {
  project: string;
}

program
  .command('init')
  .description('Create an atlas.json file from the template.')
  .action(() => {
    initProject();
  });

program
  .command('pack')
  .description('Pack images into a sprite atlas.')
  .option('-p, --project <string>')
  .action((options: PackOptions) => {
    packAtlas(options.project);
  });

program.parse();
