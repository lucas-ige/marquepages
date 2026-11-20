This repository contains marquepages, a web-based software to use bookmarks.

# How it works

Clone this repository and locally open `index.html` to start navigate bookmarks with the following keyboard shortcuts:

| Key                   | Effect                    |
|-----------------------|---------------------------|
| `/` or `n` or `Enter` | Search bookmarks by name  |
| `u`                   | Search bookmarks by URL   |
| `t`                   | Search bookmarks by tag   |
| `c`                   | Clear displayed bookmarks |
| `f`                   | Show favourite bookmarks  |

While in search mode, the following keyboard shortcuts are available:

| Key      | Effect                  |
|----------|-------------------------|
| `Enter`  | Launch the search       |
| `Escape` | Close the search window |

The list of bookmarks is defined in the file `bookmarks.js`. It should be easy enough to deduce the required format of
this file from the example provided here. Searching by name is case-insensitive, but tags should all be lower-case. An
empty search by name or URL will show all available bookmarks.

Editing this JSON list of bookmarks can be tedious. For convenience, a script named `txt2js.py` is provided, which
creates the file `bookmarks.js` from a list provided in a more simple format. The file `bookmarks.txt` shows an example
of this syntax. To summarise:

 - A bookmark is indicated by a line with the format `name: url #tag1 #tag2 *`.
 - The tags are optional. If present, they should use lower-case only.
 - The asterisk is optional and indicates that the bookmark is a favourite.
 - The URL of an indented bookmark line will be prepended with the URL of its parent bookmark.
 - Nested indentations are supported.
 - An indentation level is 4 spaces, no more, no less.
 - Lines which first non-blank character is `#` are treated as comments and thus ignored.
 - Empty lines are ignored.

Use `python txt2js.py --help` for instructions on how to use this script.

# Organic software :seedling:

This software has been entirely written "by hand" (on a computer), without the use of LLMs at any stage of the process.

# Copyright and license

Copyright (c) 2026 Institut des Géosciences de l'Environnement, Grenoble.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General
Public License as published by the Free Software Foundation, version 3.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
details.

You should have received a copy of the GNU Affero General Public License along with this program. If not, see
<https://www.gnu.org/licenses/>.
