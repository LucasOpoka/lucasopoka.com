import type { Rule } from 'eslint'
import type { Comment } from 'estree'

const MAX_LINES = 3

// Flags any comment (block, or a run of adjacent standalone // lines) longer
// than MAX_LINES - this codebase's convention is terse comments that explain
// only non-obvious "why", not multi-paragraph rationale.
function isStandalone(
  sourceCode: Rule.RuleContext['sourceCode'],
  comment: Comment,
) {
  const tokenBefore = sourceCode.getTokenBefore(comment, {
    includeComments: true,
  })
  return !tokenBefore || tokenBefore.loc!.end.line < comment.loc!.start.line
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'limit comments to at most 3 lines',
    },
    schema: [],
    messages: {
      tooLong:
        'Comment spans {{lines}} lines; keep comments to {{max}} lines or fewer.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode
    return {
      Program() {
        const comments = sourceCode.getAllComments()
        let i = 0
        while (i < comments.length) {
          const comment = comments[i]

          if (comment.type === 'Block') {
            const lines = comment.loc!.end.line - comment.loc!.start.line + 1
            if (lines > MAX_LINES) {
              context.report({
                loc: comment.loc!,
                messageId: 'tooLong',
                data: { lines: String(lines), max: String(MAX_LINES) },
              })
            }
            i++
            continue
          }

          // Group a run of consecutive, equally-indented, standalone // lines
          // into one logical comment block.
          let j = i
          while (
            j + 1 < comments.length &&
            comments[j + 1].type === 'Line' &&
            isStandalone(sourceCode, comments[j + 1]) &&
            isStandalone(sourceCode, comments[j]) &&
            comments[j + 1].loc!.start.line === comments[j].loc!.end.line + 1 &&
            comments[j + 1].loc!.start.column === comments[j].loc!.start.column
          ) {
            j++
          }

          const lines = j - i + 1
          if (lines > MAX_LINES) {
            context.report({
              loc: comment.loc!,
              messageId: 'tooLong',
              data: { lines: String(lines), max: String(MAX_LINES) },
            })
          }
          i = j + 1
        }
      },
    }
  },
}

export default rule
