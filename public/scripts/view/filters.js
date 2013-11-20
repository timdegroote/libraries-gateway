define([
    'jquery',
    'lodash',
    'util/events',
    'view/dropdown-selector',
    'view/areacircle',
], function ($, _, events, DropdownSelector, areaCircle) {
    'use strict';
    var LibrariesFilters = function () {
        this.initialize();
    };
    _.extend(LibrariesFilters.prototype, {
        initialize: function (options) {
            _.bindAll(this);
            this.keyword = '';
            this.areaFilter = new DropdownSelector({
                el: '.js-dropdown-selector-area'
            });
            this.alphabetFilter = new DropdownSelector({
                el: '.js-dropdown-selector-alphabet'
            });
            this.bindEvents();
        },

        bindEvents: function () {
            this.areaFilter.on('change', this.onFilterChange);
            this.alphabetFilter.on('change', this.onFilterChange);
            $('.js-mini-search').on('keyup', this.onSearchKeyUp);
        },

        onFilterChange: function () {
            this.updateFilters();
            this.trigger('change', this.filters);
        },

        onSearchKeyUp: function (event) {
            this.setKeyword($(event.currentTarget).val());
        },

        getKeyword: function () {
            return this.keyword;
        },

        setKeyword: function (keyword) {
            if (keyword !== this.keyword) {
                this.keyword = keyword;
                this.updateFilters();
                this.trigger('change', this.filters);
            }
        },

        updateFilters: function () {
            var filters = this.filters = [],
                areaFilter = this.areaFilter.getValue(),
                alphabetFilter = this.alphabetFilter.getValue(),
                keyword = this.getKeyword();

            if (alphabetFilter && alphabetFilter !== 'all') {
                filters.push(function (library) {
                    return library.get('name')[0].toLowerCase() === alphabetFilter;
                });
            }

            if (areaFilter !== 'anywhere') {
                // Convert miles to meters
                areaCircle.setRadius(areaFilter * 1609.344);
                areaCircle.show();
                filters.push(function (library) {
                    var coords = library.getLatLng();
                    // check whether a library is within the bounds of the area
                    return areaCircle.latLngInArea(coords.lat, coords.lng);
                });
            } else {
                areaCircle.hide();
            }

            if (keyword && keyword.length) {
                filters.push(function (library) {
                    return _.some(_.values(library.attributes), function (value) {
                        if (_.isString(value)) {
                            return value.toLowerCase().indexOf(keyword.toLowerCase()) >= 0;
                        }
                    });
                });
            }
        }
    }, events);

    return LibrariesFilters;
});