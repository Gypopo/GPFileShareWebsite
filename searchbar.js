import { Card } from './objects/Card.js';
import { Cards } from './objects/Cards.js';
import { User } from './objects/User.js';
import { Author } from './objects/Author.js';
import { CardHelper } from './cardhelper.js';

export class Searchbar {

    // Some example tags the user can toggle to filter
    knownTags = ["Survival", "Modern", "Cheap", "Rich", "AllItems", "Compact", "Clean"];

    // Some example sort options the user can toggle
    knownSorts = ["Downloads", "Creation date"]

    // All the layouts containing this document
    cards;

    sidebar = document.getElementById('sidebar');
    content = document.getElementById('sidebarContent');
    searchInput = document.getElementById('sidebarSearch');
    filters = document.getElementById('sidebarFilters');
    sorts = document.getElementById('sidebarSorts');

    constructor(cardhelper) {
        this.cardhelper = cardhelper;
    }

    /**
    * @param {Cards} cards 
    */
    initItems(cards) {
        this.cards = cards;

        this.getKnownFilters();
        this.getKnownSortOptions();

        this.sidebar.addEventListener('input', (event) => {
            // Make sure only one sort is active at a time
            var checkboxes = document.querySelectorAll('#sidebarSorts input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkboxes.forEach(otherCheckbox => {
                    if (otherCheckbox !== checkbox) {
                        otherCheckbox.checked = false;
                    }
                });

                // Because default browser behavior
                event.target.checked = true;
            });

            this.filterContent();
        });

        // Check the downloads sort option by default and filter
        document.getElementById('Downloads_tag').querySelector('input').checked = true;
        this.filterContent();
    }

    /**
     * 
     * @param {Cards} cards 
     */
    filterContent() {
        var searchResult = this.getInitialSearchResult();

        var searchText = this.searchInput.value.toLowerCase();
        var activeFilters = this.getActiveFilters();
        var activeSort = this.getActiveSort();

        var results = Array.from(this.cards.getAll());

        // Search using title/author param
        if (searchText) {
            results = results.filter(function ([id, card]) {
                return card.getTitle().toLowerCase().includes(searchText) || card.getAuthor().getAuthor().toLowerCase().includes(searchText);
            });
        }

        // Search using tags
        if (activeFilters.length != 0) {
            results = results.filter(function ([id, card]) {
                return card.getTags().some(tag => activeFilters.indexOf(tag) >= 0);
            });
        }

        if (activeSort === 'Downloads') {
            results = results.sort(function ([id1, card1], [id2, card2]) {
                // Multiply download count of premium layouts since naturally they get downloaded less then normal layouts
                return (card2.isPremium() ? card2.getDownloads() * 10 : card2.getDownloads()) - (card1.isPremium() ? card1.getDownloads() * 10 : card1.getDownloads());
            });
        } else if (activeSort === 'Creation date') {
            // Don't do anything since the default order of the cards is already by its creation date
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
     * @returns {Array<string>}
     */
    getActiveSort() {
        var sorts = this.sorts.querySelectorAll('div');

        for (var sort of sorts) {
            if (sort.querySelector('input').checked) {
                return sort.id.replace('_tag', '');
            }
        }

        return 'Creation date'; // Default sort option if no check box is selected
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
     * @returns {Array<HTMLDivElement>}
     */
    getKnownSortOptions() {
        for (var sort of this.knownSorts) {
            var container = document.createElement('div');
            container.className = 'sidebarSort';
            container.id = sort + "_tag";

            var input = document.createElement('input');
            input.type = 'checkbox';
            container.appendChild(input);

            var label = document.createElement('label');
            label.setAttribute('for', sort + "_tag");
            label.textContent = sort;
            container.appendChild(label);

            this.sorts.appendChild(container);
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