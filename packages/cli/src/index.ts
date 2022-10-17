#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('yargonaut').style('blue').style('yellow', 'required').helpStyle('green').errorsStyle('red')

import { CreateProjectCommand } from './commands/CreateProjectCommand'
import { RunProjectCommand } from './commands/RunProjectCommand'
import yargs from 'yargs'
import { version } from '../package.json'

const cli = yargs
  .scriptName('pangu')
  .version(version)
  .usage('Usage: $0 <command> [options]')
  .example('$0 run --no-purge', 'Runs the project in current working directory')
  .alias('v', 'version')
  .alias('h', 'help')
  .command(new CreateProjectCommand())
  .command(new RunProjectCommand())
  .recommendCommands()
  .strict()

void (async () => {
  const args = (await cli.parse(process.argv.slice(2))) as { _: string[] }

  if (args._.length === 0) {
    yargs.showHelp()
  }
})()
