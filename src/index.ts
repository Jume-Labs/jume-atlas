import { Command } from 'commander';

import { initProject, packAtlas } from './atlas/index.js';

export function setupCommands(): void {
  const program = new Command();

  program.name('Jume Atlas').description('Jume Atlas tools').version('0.0.1');

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
}
