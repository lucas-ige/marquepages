# Copyright (c) 2026 Institut des Géosciences de l'Environnement, Grenoble.
#
# This program is free software: you can redistribute it and/or modify it under
# the terms of the GNU Affero General Public License as published by the Free
# Software Foundation, version 3.
#
# This program is distributed in the hope that it will be useful, but WITHOUT
# ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
# FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
# details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <https://www.gnu.org/licenses/>.
#

"""Create bookmarks JavaScript file from bookmarks given in simple text format.

This file is part of "marquepages". For information about the formats of the
text-based and JavaScript lists of bookmarks, see the main README.md of the
"marquepages" repository.

"""


def n_leading_spaces(s):
    """Return the number of leading spaces in character string."""
    n = 0
    while n < len(s) and s[n] == " ":
        n += 1
    return n


def n_indent_levels(s):
    """Return the number of indentation levels of character string.

    Note that an indentation level is hard-coded to 4 spaces.

    """
    quotient, remainder = divmod(n_leading_spaces(s), 4)
    if remainder != 0:
        msg = f'Bad number of leading spaces in "{s}" (not a mulitple of 4).'
        raise ValueError(msg)
    return quotient


def join_urls(urls):
    """Join URLs given as a list of character strings (returns string)."""
    return "".join(urls)


def process_bookmarks(text):
    """Process given text into dictionary of bookmarks.

    Parameters
    ----------
    txt: str
        Text to process, given in the same format as input .txt files.

    Returns
    -------
    list of dicts
        The processed bookmarks, same format as in bookmarks.js.

    """
    lines = [
        line
        for line in txt.split("\n")
        if line.strip() != "" and not line.strip().startswith("#")
    ]
    bookmarks = []
    for line in lines:
        indent = n_indent_levels(line)
        if len(bookmarks) == 0 and indent != 0:
            msg = "The first bookmark should have no indentation."
            raise ValueError(msg)
        elif indent == 0:
            url_root = []
        elif indent > last_indent:
            if indent != last_indent + 1:
                msg = "Indenting more than one level at once is not allowed."
                raise ValueError(msg)
            url_root.append(last_url)
        elif indent < last_indent:
            for j in range(last_indent - indent):
                del url_root[-1]
        i = line.index(":")
        rest = line[i + 1 :].split()
        last_url = rest[0]
        bookmark = {
            "name": line[:i].strip(),
            "url": f"{join_urls(url_root)}{last_url}",
            "tags": [],
            "favourite": False,
        }
        for element in rest[1:]:
            if element == "*":
                bookmark["favourite"] = True
            elif element.startswith("#") and len(element) > 1:
                bookmark["tags"].append(element[1:])
            else:
                msg = f'Could not parse "{element}".'
                raise ValueError(msg)
        bookmarks.append(bookmark)
        last_indent = indent
    return bookmarks


if __name__ == "__main__":
    import argparse
    import json
    import os

    parser = argparse.ArgumentParser(
        prog="txt2js.py for marquemages.",
        description="Transform .txt bookmarks to .js format.",
        epilog="License = GNU Affero General Public License, version 3.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "-f",
        "--files",
        help="Path(s) to the .txt files to process.",
        nargs="+",
        default=[os.path.join(os.path.dirname(__file__), "bookmarks.txt")],
    )
    parser.add_argument(
        "-o",
        "--output",
        help="Path to the output file.",
        default=os.path.join(os.path.dirname(__file__), "bookmarks.js"),
    )
    parser.add_argument(
        "-O",
        "--overwrite",
        help="If present, allow overwrite existing output file.",
        action="store_true",
    )
    args = parser.parse_args()

    # Read all the input files
    bookmarks = []
    for filepath in args.files:
        with open(os.path.expanduser(filepath), mode="r") as f:
            txt = f.read()
        bookmarks += process_bookmarks(txt)

    # Create the output file
    bookmarks = [
        f"    {line}" for line in json.dumps(bookmarks, indent=4).split("\n")
    ]
    mode = {True: "w", False: "x"}[args.overwrite]
    with open(os.path.expanduser(args.output), mode=mode) as f:
        f.write("function getBookmarks() {\n")
        f.write("    return [\n")
        f.write("\n".join(bookmarks[1:]))
        f.write("\n}\n")
