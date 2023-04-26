#!/usr/bin/env node
// const { program } = require('commander')
// program.option('--first').option('-s, --separator <char>')
// program.parse()
// const options = program.opts()
// // 分割参数的个数
// const limit = options.first ? 1 : undefined
// console.log(program.args)
// console.log(program.args[0].split(options.separator, limit))

const pkg = require('../package.json')
const { Command, Option, InvalidArgumentError, Argument } = require('commander')
const program = new Command()
program
  .name('imooc-build')
  .description('CLI to build javascript project')
  .version(pkg.version, '-v, --version', 'optput your version')

program
  .option('-d, --debug', 'output extra debugging')
  .hook('preAction', (thisCommand, actionCommand) => {
    console.log('===============全局 preAction hook:start===============')
    console.log(thisCommand === actionCommand)
    console.log(thisCommand === program)
    console.log(actionCommand.args, actionCommand.opts())
    console.log('===============全局 preAction hook:end===============')
  })
  .hook('postAction', (thisCommand, actionCommand) => {
    console.log('===============全局 postAction hook:start===============')
    console.log(thisCommand === actionCommand)
    console.log(thisCommand === program)
    console.log(actionCommand.args, actionCommand.opts())
    console.log('===============全局 postAction hook:end===============')
  })

program
  .command('split')
  .description('Split string to array')
  .argument('<string>', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator char', ',')
  .option('-e --extra', 'extra for something')
  .option('-a --add [string]', 'add something')
  .action((args, options, cmd) => {
    console.log(111, cmd.optsWithGlobals())
    const limit = options.first ? 1 : undefined
    console.log(args.split(options.separator, limit))
  })
//   '-c, --cheese <type>',

//   'pizza must have cheese',
// program.requiredOption(
//   'default-cheese',
// )
function getDefaultColor() {
  return 'green'
}
program
  .option('-n, --number <numbers...>', 'specify numbers')
  .option('-l, --letter [letters...]', 'specify letters')
1
program
  .command('test')
  // .addOption(new Option('-m, --secret [char]', 'secret something').hideHelp())
  // .addOption(
  //   new Option('-t, --timeout <delay>', 'timeout in seconds').default(
  //     60,
  //     'one minute',
  //   ),
  // )
  // .addOption(
  //   new Option('-f, --choose <size>', 'drink size').choices([
  //     'small',
  //     'medium',
  //     'large',
  //   ]),
  // )
  // .addOption(new Option('-p, --port <number>', 'port number').env('PORT'))
  // .addOption(new Option('-j, --jtest <number>', 'just a test').env('TEST'))
  // .addOption(
  //   new Option('--donate [amount]', 'optional donation in dollars')
  //     .preset('20')
  //     .argParser(parseFloat),
  // )
  // .addOption(new Option('--color [color]', 'colors').preset(getDefaultColor()))
  // .addOption(
  //   new Option('--disable-server', 'disables the server').conflicts([
  //     'port',
  //     'jtest',
  //   ]),
  // )
  .addOption(
    new Option('--free-drink', 'small drink included free ').implies({
      drink: 'small',
    }),
  )
  .action((options, cmd) => {
    console.log(cmd.optsWithGlobals())
  })

function myParseInt(value) {
  const intValue = parseInt(value)
  if (isNaN(intValue)) {
    throw new InvalidArgumentError('it is not a int number')
  }
  return intValue
}

function increaseVerbosity(dummyValue, previous) {
  dummyValue = +dummyValue || 0
  return previous + 1 + dummyValue
}
function collect(value, previous) {
  return previous.concat([value])
}

program
  .command('custom')
  .option('-f --float <number>', 'float number', parseFloat)
  .option('-i --int <number>', 'int number', myParseInt)
  .option('-c, --collect <value>', 'repeatable value', collect, [])
  .option(
    '--verbose <number>',
    'verbosity that can be increased',
    increaseVerbosity,
    0,
  )
  .action((options, cmd) => {
    console.log(cmd.optsWithGlobals())
  })

// program
//   .command('login <username> [pasword]', { hidden: true, isDefault: true })
//   .option('-f --force', 'just a stand by here')
//   .action((username, password, options, cmd) => {
//     console.log(username, password, options, cmd.optsWithGlobals())
//   })

// program
//   .command('login', { hidden: true, isDefault: true })
//   // .argument('<usernam>', 'it is our username')
//   // .argument('[password]', 'your password', 'default password')
//   // .arguments('<username> [password]')
//   // .argument('<dir...>', 'dir list')
//   .addArgument(
//     new Argument('username', 'this is your username')
//       .argRequired()
//       .choices(['root', 'guest']),
//   )
//   .addArgument(
//     new Argument('[password]', 'this is your password').argParser(parseFloat),
//   )
//   .addArgument(
//     new Argument('dir...', 'this is a dir list')
//       .argOptional()
//       .default(['dir1', 'dir2'], 'this is a default dir'),
//   )
//   .option('-f --force', 'just a stand by here')
//   .action((username, password, dir, options, cmd) => {
//     console.log(username, password, dir, options, cmd.optsWithGlobals())
//   })

program
  .command('login', { hidden: true, isDefault: true })
  // .argument('<usernam>', 'it is our username')
  // .argument('[password]', 'your password', 'default password')
  // .arguments('<username> [password]')
  // .argument('<dir...>', 'dir list')
  .addArgument(
    new Argument('username', 'this is your username')
      .argRequired()
      .choices(['root', 'guest']),
  )
  .addArgument(
    new Argument('[password]', 'this is your password').argParser(parseFloat),
  )
  .option('-f --force', 'just a stand by here')
  .hook('preAction', (thisCommand, actionCommand) => {
    // 这里是前置钩子回调
    // 因为 .command  后面还可以再写 command 所以这里提供了两个参数
    // 在使用一个 command  时他们是相等的
    console.log('-------前置hook-------')
    console.log(thisCommand.args, thisCommand.opts())
    console.log('----------------------------')
  })
  .hook('postAction', (thisCommand, actionCommand) => {
    // 这里是后置钩子回调
    console.log('-------后置hook-------')
    console.log(thisCommand.args, thisCommand.opts())
  })
  .action(function (username, password, options, cmd) {
    console.log(this.args[0], this.args[1], this.opts())
  })

program.parse()
