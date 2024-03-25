import { Card } from './objects/Card.js';
import { Cards } from './objects/Cards.js';
import { User } from './objects/User.js';
import { Author } from './objects/Author.js';
import { CardHelper } from './cardhelper.js';

export class Searchbar {

    // Some example tags the user can toggle to filter
    knownTags = ["Survival", "Modern", "Cheap", "Rich", "AllItems", "Compact", "Clean"];

    // All the layouts containing this document
    cards;

    sidebar = document.getElementById('sidebar');
    content = document.getElementById('sidebarContent');
    searchInput = document.getElementById('sidebarSearch');
    filters = document.getElementById('sidebarFilters');

    constructor(cardhelper) {
        this.cardhelper = cardhelper;
    }

    /**
    * @param {Cards} cards 
    */
    initItems(cards) {
        this.cards = cards;

        this.getKnownFilters();

        this.sidebar.addEventListener('input', () => {
            this.filterContent();
        });
    }

    /**
     * 
     * @param {Cards} cards 
     */
    filterContent() {
        var searchResult = this.getInitialSearchResult();

        var searchText = this.searchInput.value.toLowerCase();
        var activeFilters = this.getActiveFilters();

        var results = Array.from(this.cards.getAll());

        // Search using title/author param
        if (searchText) {
            var results = results.filter(function ([id, card]) {
                return card.getTitle().toLowerCase().includes(searchText) || card.getAuthor().getAuthor().toLowerCase().includes(searchText);
            });
        }

        // Search using tags
        if (activeFilters.length != 0) {
            results = results.filter(function ([id, card]) {
                return card.getTags().some(tag => activeFilters.indexOf(tag) >= 0);
            });
        }

        // Display the results
        results.forEach(([id, card]) => {
            searchResult.appendChild(this.cardhelper.createCard(id, card));
        });
    }

    /**
     * @returns {Array<string>}
     */
    getActiveFilters() {
        var toggledFilters = [];
        var filters = this.filters.querySelectorAll('div');

        for (var filter of filters) {
            if (filter.querySelector('input').checked) {
                toggledFilters.push(filter.id.replace('_tag', ''));
            }
        }

        return toggledFilters;
    }

    /**
     * @returns {Array<HTMLDivElement>}
     */
    getKnownFilters() {
        for (var filter of this.knownTags) {
            var container = document.createElement('div');
            container.className = 'sidebarFilter';
            container.id = filter + "_tag";

            var input = document.createElement('input');
            input.type = 'checkbox';
            container.appendChild(input);

            var label = document.createElement('label');
            label.setAttribute('for', filter + "_tag");
            label.textContent = filter;
            container.appendChild(label);

            this.filters.appendChild(container);
        }
    }

    /**
     * @returns {HTMLDivElement}
     */
    getInitialSearchResult() {
        var initialPage = document.getElementById('pages');
        if (initialPage != null) {// Already removed
            initialPage.remove();

            var searchResult = document.createElement('div');
            searchResult.className = 'page';
            searchResult.id = 'searchResult';

            document.getElementById('cardContent').appendChild(searchResult);
            return searchResult;
        } else {
            var searchResult = document.getElementById('searchResult');
            for (var e of searchResult.querySelectorAll('div')) {
                e.remove();
            }
            return searchResult;
        }
    }

}