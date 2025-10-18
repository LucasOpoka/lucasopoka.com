/**
 * ASCII art and terminal output text constants
 */

// ANSI Escape Sequence Constants (all 8 characters for consistency)
const RSET = '\x1b[0m'      // Reset all formatting
const BLUE = '\x1b[34m'     // Blue color
const PINK = '\x1b[38;5;201m' // Pink color  
const ORNG = '\x1b[38;5;214m' // Orange color
const YLLW = '\x1b[38;5;226m' // Yellow color
const CYAN = '\x1b[38;5;87m'  // Cyan color
const GRAY = '\x1b[38;5;241m' // Gray color
const REDD = '\x1b[38;5;211m'  // Red color
const GREN = '\x1b[38;5;120m' // Green color
const ITAL = '\x1b[3m'       // Italic text

export const CURL_OUTPUT = `
  ${BLUE}     ___${RSET}${PINK}/\\/\\/\\/\\${BLUE}____${RSET}${PINK}/\\/\\/\\/\\/\\${BLUE}____${RSET}${PINK}/\\/\\${BLUE}_______${RSET}      ${CYAN}I like having fun with programming${RSET}
  ${BLUE}    _${RSET}${ORNG}/\\/\\${BLUE}____${RSET}${ORNG}/\\/\\${BLUE}__${RSET}${ORNG}/\\/\\${BLUE}____${RSET}${ORNG}/\\/\\${BLUE}__${RSET}${ORNG}/\\/\\${BLUE}_______${RSET}       ${CYAN}so I deicded to make my website accessible${RSET}
  ${BLUE}   _${RSET}${YLLW}/\\/\\${BLUE}____${RSET}${YLLW}/\\/\\${BLUE}__${RSET}${YLLW}/\\/\\/\\/\\/\\${BLUE}____${RSET}${YLLW}/\\/\\${BLUE}_______${RSET}        ${CYAN}both through browsers and terminals!${RSET}
  ${BLUE}  _${RSET}${YLLW}/\\/\\${BLUE}____${RSET}${YLLW}/\\/\\${BLUE}__${RSET}${YLLW}/\\/\\${BLUE}__________${RSET}${YLLW}/\\/\\${BLUE}_______${RSET}         ${CYAN}Check it out either with the on-site terminal${RSET}
  ${BLUE} ___${RSET}${YLLW}/\\/\\/\\/\\${BLUE}____${RSET}${YLLW}/\\/\\${BLUE}__________${RSET}${YLLW}/\\/\\/\\/\\/\\${BLUE}_${RSET}          ${CYAN}or with your native one using Curl${RSET}
${RSET}
  ${GRAY}┌─${RSET}${CYAN}About${RSET}${GRAY}────────────────────────────────────────┐${RSET} ${GRAY}┌─${RSET}${CYAN}Navigation${RSET}${GRAY}───┬────────────────────────────────┐${RSET}
  ${GRAY}│${RSET}                                              ${GRAY}│${RSET} ${GRAY}│${RSET}              ${GRAY}│${RSET}                                ${GRAY}│${RSET}
  ${GRAY}│${RSET} ${CYAN}Hey there! I'm Lucas, a${RSET}                      ${GRAY}│${RSET} ${GRAY}│${RSET} ${REDD}home${RSET}         ${GRAY}│${RSET} ${ITAL}${REDD}Navigate to home page${RSET}          ${GRAY}│${RSET}
  ${GRAY}│${RSET} ${CYAN}developer who loves creating${RSET}                 ${GRAY}│${RSET} ${GRAY}│${RSET} ${REDD}pong${RSET}         ${GRAY}│${RSET} ${ITAL}${REDD}Play the classic Pong game${RSET}     ${GRAY}│${RSET}
  ${GRAY}│${RSET} ${CYAN}innovative web experiences. This terminal${RSET}    ${GRAY}│${RSET} ${GRAY}│${RSET} ${REDD}contact${RSET}      ${GRAY}│${RSET} ${ITAL}${REDD}Get in touch with me${RSET}           ${GRAY}│${RSET}
  ${GRAY}│${RSET} ${CYAN}is your gateway to explore my portfolio!${RSET}     ${GRAY}│${RSET} ${GRAY}│${RSET} ${REDD}help${RSET}         ${GRAY}│${RSET} ${ITAL}${REDD}Show available commands${RSET}        ${GRAY}│${RSET}
  ${GRAY}│${RSET}                                              ${GRAY}│${RSET} ${GRAY}│${RSET} ${REDD}clear${RSET}        ${GRAY}│${RSET} ${ITAL}${REDD}Clear the terminal screen${RSET}      ${GRAY}│${RSET}
  ${GRAY}└──────────────────────────────────────────────┘${RSET} ${GRAY}└──────────────┴────────────────────────────────┘${RSET}
                                                    
    ${RSET}${CYAN}Quick Commands${RSET}
   ${RSET}                          ${RSET}
   ${RSET} ${GREN}$ home${RSET}${CYAN}                    ${RSET} ${CYAN}${ITAL}Navigate to the home page${RSET}
   ${RSET} ${GREN}$ pong${RSET}${CYAN}                    ${RSET} ${CYAN}${ITAL}Play the interactive Pong game${RSET}
   ${RSET} ${GREN}$ contact${RSET}${CYAN}                 ${RSET} ${CYAN}${ITAL}View contact information${RSET}
   ${RSET} ${GREN}$ help${RSET}${CYAN}                    ${RSET} ${CYAN}${ITAL}Show all available commands${RSET}
${RSET}`

export const PONG_ASCII_ART = `${BLUE}     ___${RSET}${PINK}/\\/\\/\\/\\${BLUE}____${RSET}${PINK}/\\/\\/\\/\\/\\${BLUE}____${RSET}${PINK}/\\/\\${BLUE}_______${RSET}
${BLUE}    _${RSET}${ORNG}/\\/\\${BLUE}____${RSET}${ORNG}/\\/\\${BLUE}__${RSET}${ORNG}/\\/\\${BLUE}____${RSET}${ORNG}/\\/\\${BLUE}__${RSET}${ORNG}/\\/\\${BLUE}_______${RSET}
${BLUE}   _${RSET}${YLLW}/\\/\\${BLUE}____${RSET}${YLLW}/\\/\\${BLUE}__${RSET}${YLLW}/\\/\\/\\/\\/\\${BLUE}____${RSET}${YLLW}/\\/\\${BLUE}_______${RSET}
${BLUE}  _${RSET}${YLLW}/\\/\\${BLUE}____${RSET}${YLLW}/\\/\\${BLUE}__${RSET}${YLLW}/\\/\\${BLUE}__________${RSET}${YLLW}/\\/\\${BLUE}_______${RSET}
${BLUE} ___${RSET}${YLLW}/\\/\\/\\/\\${BLUE}____${RSET}${YLLW}/\\/\\${BLUE}__________${RSET}${YLLW}/\\/\\/\\/\\/\\${BLUE}_${RSET}`
