import argparse
import json
import regex

flag_mapping = {
  'i': regex.IGNORECASE,
  'm': regex.MULTILINE,
  's': regex.DOTALL,
  'u': regex.UNICODE,
  'x': regex.VERBOSE,
  'a': regex.ASCII,
  'l': regex.LOCALE,
  't': regex.TEMPLATE,
  'd': regex.DEBUG,
  'r': regex.REVERSE,
  'f': regex.FULLCASE,
  'e': regex.ENHANCEMATCH,
  'v': regex.VERSION1,
  'w': regex.WORD,
  'b': regex.BESTMATCH,
  'y': regex.POSIX,
}

def regex_findall(text, pattern, flags=''):
    """
    This function accepts a text input, a regular expression pattern, and optional flags for the regex,
    and returns the results matched by the regex.
    """
    pattern = regex.compile(pattern, flags=flags)
    regex_matches = pattern.findall(text)
    return json.dumps(regex_matches)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Regex matcher')
    parser.add_argument('method', type=str, help='Method to use (findall, match, search, split, sub, subf, subn, subfn, fullmatch, finditer, scan, splititer, findalliter, find, finditer, fullmatch, match, search, split, sub, subf, subfn, subn, scan, splititer, findalliter)')
    parser.add_argument('text', type=str, help='Text input to search for regex pattern')
    parser.add_argument('pattern', type=str, help='Regular expression pattern to search for')
    parser.add_argument('--flags', type=str, default='', help='Optional flags for the regex')
    parser.add_argument('--fuzzy', type=str, default='', help='Optional fuzzy matching for the regex')
    args = parser.parse_args()

    flags = sum(flag_mapping.get(flag, 0) for flag in args.flags)

    matches = []
    if (args.method == 'findall'):
        matches = regex_findall(args.text, args.pattern, flags)
    elif (args.method == 'match'):
        matches = regex.match(args.pattern, args.text, flags)
    elif (args.method == 'search'):
        matches = regex.search(args.pattern, args.text, flags)

    print(matches)
