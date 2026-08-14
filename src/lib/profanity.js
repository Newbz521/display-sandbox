/**
 * Light client-side swear filter for anonymous comments.
 * Not exhaustive — keeps the board civil without a heavy dependency.
 */

const TERMS = [
  'asshole',
  'assholes',
  'bastard',
  'bastards',
  'bitch',
  'bitches',
  'bollocks',
  'bullshit',
  'cock',
  'cocks',
  'cunt',
  'cunts',
  'damn',
  'damned',
  'dick',
  'dicks',
  'douche',
  'fag',
  'faggot',
  'fags',
  'fuck',
  'fucked',
  'fucker',
  'fuckers',
  'fuckin',
  'fucking',
  'fucks',
  'motherfucker',
  'motherfuckers',
  'nigger',
  'niggers',
  'piss',
  'pissed',
  'prick',
  'pricks',
  'pussy',
  'shit',
  'shits',
  'shitty',
  'slut',
  'sluts',
  'twat',
  'wanker',
  'whore',
  'whores',
]

// Longest first so "motherfucker" wins over "fuck"
const PATTERN = new RegExp(
  `\\b(${[...TERMS].sort((a, b) => b.length - a.length).join('|')})\\b`,
  'gi',
)

function mask(word) {
  if (word.length <= 1) return '*'
  if (word.length === 2) return word[0] + '*'
  return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1]
}

/** Replace whole-word profanity with a light mask (e.g. f**k). */
export function censorProfanity(text) {
  if (!text || typeof text !== 'string') return text ?? ''
  return text.replace(PATTERN, (match) => mask(match))
}
