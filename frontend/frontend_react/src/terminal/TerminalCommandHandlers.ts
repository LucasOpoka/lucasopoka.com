import { Terminal } from '@xterm/xterm'
import { typeToTerminal } from './TerminalTyping'
import type { TypingOptions } from './TerminalTyping'
import { CURL_OUTPUT, PONG_ASCII_ART } from './AsciiArt'

/**
 * Typing options for command input (character by character)
 */
const COMMAND_TYPING_OPTIONS: TypingOptions = {
  delay: 30,
  lineByLine: false,
}

/**
 * Typing options for command results (line by line)
 */
const RESULT_TYPING_OPTIONS: TypingOptions = {
  delay: 100,
  lineByLine: true,
}

/**
 * Wrapper for typing commands with prompt and currentLineAtom updates
 * Types character by character with command-specific options
 */
export async function typeCommand(
  instance: Terminal,
  command: string,
  setCurrentLine: (line: string) => void,
  setCursorPosition: (position: number) => void,
  options?: TypingOptions
): Promise<void> {
  const PROMPT = '$ '
  const fullCommand = PROMPT + command
  
  // Update current line atom as we type
  await typeToTerminal(
    instance,
    fullCommand,
    { ...COMMAND_TYPING_OPTIONS, ...options },
    undefined,
    setCurrentLine,
    setCursorPosition
  )
}

/**
 * Wrapper for typing command results
 * Types line by line without updating currentLineAtom or adding prompt
 */
export async function typeResult(
  instance: Terminal,
  result: string,
  options?: TypingOptions
): Promise<void> {
  instance.write('\r\n') // Start on new line
  await typeToTerminal(
    instance,
    result,
    { ...RESULT_TYPING_OPTIONS, ...options }
  )
  instance.write('\r\n') // End with new line
}

/**
 * Command handler functions that handle all command logic including typing behavior
 */

export interface CommandHandlerParams {
  instance: Terminal
  args?: string[]
  setPongOverlayVisible?: (visible: boolean) => void
  setCurrentLine?: (line: string) => void
  setCursorPosition?: (position: number) => void
}

/**
 * Handles the hello command
 */
export async function handleHello({ instance }: CommandHandlerParams): Promise<void> {
  await typeResult(instance, 'Hello World!')
}

/**
 * Handles the help command
 */
export async function handleHelp({ instance }: CommandHandlerParams): Promise<void> {
  await typeResult(instance, 'Available commands: hello, help, clear, echo, whoami, pwd, pong, curl, exit')
}

/**
 * Handles the echo command
 */
export async function handleEcho({ instance, args = [] }: CommandHandlerParams): Promise<void> {
  const output = args.join(' ')
  await typeResult(instance, output)
}

/**
 * Handles the whoami command
 */
export async function handleWhoami({ instance }: CommandHandlerParams): Promise<void> {
  await typeResult(instance, 'lucas')
}

/**
 * Handles the pwd command
 */
export async function handlePwd({ instance }: CommandHandlerParams): Promise<void> {
  await typeResult(instance, '/home/lucas')
}

/**
 * Handles the pong command
 */
export async function handlePong({ instance, setPongOverlayVisible }: CommandHandlerParams): Promise<void> {
  if (setPongOverlayVisible) {
    setPongOverlayVisible(true)
  }
  await typeResult(instance, 'pong')
}

/**
 * Handles the curl command
 */
export async function handleCurl({ instance, args = [] }: CommandHandlerParams): Promise<void> {
  if (args[0] === 'lucasopoka.com') {
    await typeResult(instance, CURL_OUTPUT)
  } else if (args[0] === 'lucasopoka.com/pong') {
    const pongOutput = `🎮 Welcome to the Pong Terminal! 🎮
This terminal is special - it has a built-in Pong game!
Type 'pong' to start playing, or 'help' to see other available commands.

Ready to play? Type 'pong' and let's bounce some balls!

${PONG_ASCII_ART}

`
    
    await typeResult(instance, pongOutput)
  } else if (args[0] === 'lucasopoka.com/contact') {
    const contactOutput = `📧 Contact Terminal 📧
This is where you can reach out to me!

Feel free to explore the terminal and try out different commands.
Type 'help' to see what's available!`
    
    await typeResult(instance, contactOutput)
  } else {
    await typeResult(instance, 'curl: command not found')
  }
}

/**
 * Handles the exit command
 */
export async function handleExit({ instance }: CommandHandlerParams): Promise<void> {
  await typeResult(instance, 'Goodbye!')
}

/**
 * Handles unknown commands
 */
export async function handleUnknownCommand({ instance, args = [] }: CommandHandlerParams): Promise<void> {
  const cmd = args[0] || 'unknown'
  await typeResult(instance, `Command not found: ${cmd}. Type 'help' for available commands.`)
}

/**
 * Command handler mapping
 */
export const commandHandlers: Record<string, (params: CommandHandlerParams) => Promise<void>> = {
  'hello': handleHello,
  'help': handleHelp,
  'echo': handleEcho,
  'whoami': handleWhoami,
  'pwd': handlePwd,
  'pong': handlePong,
  'curl': handleCurl,
  'exit': handleExit,
}

/**
 * Gets the appropriate command handler for a given command
 * Returns the handler for the command or the unknown command handler if not found
 */
export function getCommandHandler(cmd: string): (params: CommandHandlerParams) => Promise<void> {
  return commandHandlers[cmd] || handleUnknownCommand
}
