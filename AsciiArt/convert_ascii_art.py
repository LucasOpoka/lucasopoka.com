#!/usr/bin/env python3
"""
Script that converts source file with ANSI escape sequences constants
to a text file with the final ANSI escape sequence embedded in the text.
"""

import sys
import re


def extract_constants(content):
    """
    Extract constant definitions from the content.
    Returns a dictionary mapping constant names to their values.
    """
    constants = {}

    # Pattern to match const CONSTANT = 'value' or const CONSTANT = "value"
    const_pattern = re.compile(r'const\s+(\w+)\s*=\s*[\'"]([^\'"]*)[\'"]')

    for match in const_pattern.finditer(content):
        const_name = match.group(1)
        const_value = match.group(2)
        constants[const_name] = const_value

    return constants


def substitute_constants(content, constants):
    """
    Substitute ${CONSTANT} placeholders with their actual values.
    """
    result = content

    # Find all ${CONSTANT} patterns and replace them
    for const_name, const_value in constants.items():
        pattern = r'\$\{' + re.escape(const_name) + r'\}'
        result = re.sub(pattern, const_value, result)

    return result


def extract_template_content(content):
    """
    Extract only the content within the const text = `...` template.
    """
    # Find the start of the template (const text = `)
    template_start = content.find('const text = `')
    if template_start == -1:
        return content

    # Find the opening backtick
    start_quote = content.find('`', template_start)
    if start_quote == -1:
        return content

    # Find the closing backtick
    end_quote = content.find('`', start_quote + 1)
    if end_quote == -1:
        return content

    # Extract only the content between the backticks
    template_content = content[start_quote + 1:end_quote]
    return template_content


def final_conversion(content):
    """
    Convert escape sequences and fix backslash issues.
    Now handles constants that have the [ part but need the escape character.
    """
    # Convert [ to \x1b[ (add escape character to ANSI codes)
    # This handles cases where constants are like [0m, [34m, etc.
    content = re.sub(r'(?<!\x1b)\[', '\x1b[', content)

    # Fix double backslashes - convert \\ to \ without breaking \033[
    # Replace \\ with \ but only when it's not part of an escape sequence
    content = re.sub(r'\\\\(?![0-9])', r'\\', content)

    return content


def main():
    if len(sys.argv) < 2:
        print("Usage:\n\
        python3 final_ansi_conversion.py <input_file> [output_file]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    if output_file is None:
        output_file = input_file.replace('.txt', '_final.txt')

    try:
        # Read input file
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Step 1: Extract constants
        constants = extract_constants(content)
        print(f"Found {len(constants)} constants: {list(constants.keys())}")

        # Step 2: Extract template content
        template_content = extract_template_content(content)

        # Step 3: Substitute constants in template
        substituted_content = substitute_constants(template_content, constants)

        # Step 4: Convert escape sequences and fix backslashes
        converted_content = final_conversion(substituted_content)

        # Write the converted content
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(converted_content)

        print(f"Final converted file saved to: {output_file}")

    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
