export const executeCommand = (command: string, availableCommands: Record<string, (args: string[]) => string>): string => {
  console.log(`Executing command: "${command}"`)
  
  if (!command.trim()) return ''
  
  const parts = command.trim().split(/\s+/)
  const cmd = parts[0].toLowerCase()
  const args = parts.slice(1)
  
  let result: string
  if (availableCommands[cmd]) {
    result = availableCommands[cmd](args)
  } else {
    result = `Command not found: ${cmd}. Type 'help' for available commands.`
  }
  
  return result
}
