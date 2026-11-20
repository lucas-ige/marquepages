// Main JS code of "marquepages", a web interface to show and use bookmarks.
//
// Copyright (c) 2026 Institut des Géosciences de l'Environnement, Grenoble.
//
// This program is free software: you can redistribute it and/or modify it
// under the terms of the GNU Affero General Public License as published by the
// Free Software Foundation, version 3.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
// FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License
// for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

//---------------------------//
// Generic utility functions //
//---------------------------//

function setHTML(id, content) {
    // Convenience function to set the innerHTML of elements.
    //
    // Parameters
    // ----------
    // id: str
    //     The ID of the element.
    // content: str
    //     The innerHTML to give to the element.
    //
    document.getElementById(id).innerHTML = content;
}

function setDisplay(id, value) {
    // Convenience function to set the "display" CSS property of elements.
    //
    // Parameters
    // ----------
    // id: str
    //     The ID of the element.
    // value: str
    //     The value to give to the "display" CSS property of the element.
    //
    document.getElementById(id).style.display = value;
}

//-----------------------------//
// Handling of keyboard events //
//-----------------------------//

document.addEventListener("keydown", onKeyPress);

function searchWindowActive() {
    // Logical function that tells whether the search window is active.
    let element = document.getElementById("search-window");
    return getComputedStyle(element).display !== "none";
}

function onKeyPress(event) {
    // Call back to handle keypress events.
    //
    // Parameters
    // ----------
    // event
    //     The key-press event.
    //
    if (searchWindowActive()) {
        if (event.key === "Escape") {
            event.preventDefault();
            hideSearchWindow();
        }
        if (event.key === "Enter") {
            event.preventDefault();
            searchBookmarks();
        }
    } else {
        if (event.key === "n" || event.key === "/" || event.key === "Enter") {
            event.preventDefault();
            showSearchWindow("name");
        } else if (event.key === "u") {
            event.preventDefault();
            showSearchWindow("URL");
        } else if (event.key === "t") {
            event.preventDefault();
            showSearchWindow("tag");
        } else if (event.key === "c") {
            event.preventDefault();
            setHTML("results-of-bookmark-search", "");
        } else if (event.key === "f") {
            event.preventDefault();
            setSearchWindowTitle("name");
            searchBookmarks(favourite=true);
        }
    }
}

//---------------------//
// Searching bookmarks //
//---------------------//

function setSearchWindowTitle(which) {
    // Set the title of the search window.
    //
    // Parameters
    // ----------
    // which: "name" | "URL" | "tag"
    //     Search criterion.
    //
    setHTML("search-window-title", "Search by " + which);
}

function showSearchWindow(which) {
    // Configure and show search window.
    //
    // Parameters
    // ----------
    // which: "name" | "URL" | "tag"
    //     Search criterion.
    //
    setSearchWindowTitle(which);
    setDisplay("search-window-background", "block");
    setDisplay("search-window", "flex");
    document.getElementById("search-window-user-input").focus();
}

function hideSearchWindow() {
    // Hide the search window.
    setDisplay("search-window-background", "none");
    setDisplay("search-window", "none");
}

function searchBookmarks(favourite=false) {
    // Callback to search and display bookmarks based on user-input.
    //
    // Parameters
    // ----------
    // favourite: bool
    //     Whether to restrict search to favourites.
    //
    let title = document.getElementById("search-window-title").innerHTML;
    let which = title.split(" ")[2];
    let userInput = document.getElementById("search-window-user-input")
    let search = userInput.value;
    let content = "";
    for (selected of getBookmarks()) {
        let include = false;
        if (favourite && !selected.favourite) {
            // Do nothing
        } else if (which === "name") {
            include = selected.name.toLowerCase().includes(search);
        } else if (which === "URL") {
            let url = selected.url
            if (url.substr(0, 8) === "https://")
                url = url.substr(8, url.length + 1);
            if (url.substr(0, 4) === "www.")
                url = url.substr(4, url.length + 1);
            include = url.includes(search);
        } else if (which === "tag") {
            include = selected.tags.includes(search.toLowerCase());
        }
    if (include)
        content += ("<a href=\""
                    + selected.url
                    + "\">"
                    + selected.name
                    + "</a>\n");
    }
    userInput.value = "";
    setHTML("results-of-bookmark-search", content);
    hideSearchWindow();
}

// Show favourites at startup
setSearchWindowTitle("name");
searchBookmarks(favourite=true);
