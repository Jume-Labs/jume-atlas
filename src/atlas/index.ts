import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import Path from 'path';
import { fileURLToPath } from 'url';

import { Atlas } from './atlas.js';
import { AtlasConfig } from './config.js';
import { saveAtlasImage, saveJsonData } from './save.js';

const __dirname = Path.dirname(fileURLToPath(import.meta.url));

export function initProject(): void {
  const templatePath = Path.join(__dirname, '../templates/atlas/template.json');
  const destination = Path.join(process.cwd(), 'atlas.json');

  copyFileSync(templatePath, destination);
  process.stdout.write('Created atlas.json config file.\n');
}

export function packAtlas(userPath: string): void {
  let configPath = 'atlas.json';
  // Get the .json file if specified.
  if (userPath) {
    configPath = userPath;
  }

  if (!configPath.endsWith('.json')) {
    process.stdout.write('No .json path config provided.\n');
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

  // Load the atlas.json config data.
  const jsonString = readFileSync(fullPath).toString();
  const atlasConfig: AtlasConfig = JSON.parse(jsonString) as unknown as AtlasConfig;

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
