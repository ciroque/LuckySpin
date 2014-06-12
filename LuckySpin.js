/**
 * Created by steve on 5/29/14.
 */

var org = org || {};
org.ciroque = org.ciroque || {};
org.ciroque.luckyspin = org.ciroque.luckyspin || {};

org.ciroque.luckyspin.LuckySpinner = function() {
    this.LOCAL_STORAGE_PREFIX_KEY = "LuckySpin::";
    this.LOCAL_STORAGE_ACTIVE_KEY = this.LOCAL_STORAGE_PREFIX_KEY + 'ACTIVE';
    this.LOCAL_STORAGE_INACTIVE_KEY = this.LOCAL_STORAGE_PREFIX_KEY + 'INACTIVE';
    this.LOCAL_STORAGE_HISTORY_KEY = this.LOCAL_STORAGE_PREFIX_KEY + 'HISTORY';
    this.LOCAL_STORAGE_CURRENT_KEY = this.LOCAL_STORAGE_PREFIX_KEY + 'CURRENT';

    function loadFromLocalStorage(key, alt) {
        var loaded = localStorage.getItem(key);
        if(loaded === null || loaded === undefined) {
            loaded = alt;
        } else {
            loaded = loaded.split(',');
        }

        return loaded;
    }

    this.current = localStorage.getItem(this.LOCAL_STORAGE_CURRENT_KEY);
    this.active = loadFromLocalStorage(this.LOCAL_STORAGE_ACTIVE_KEY, arguments[0] || []);
    this.inactive = loadFromLocalStorage(this.LOCAL_STORAGE_INACTIVE_KEY, []);
    this.history = loadFromLocalStorage(this.LOCAL_STORAGE_HISTORY_KEY, []);
};

org.ciroque.luckyspin.LuckySpinner.prototype.moveToInactive = function(index) {
    var selected = this.active[index];
    this.inactive.unshift(selected);
    this.history.unshift(JSON.stringify({ 'name': selected, 'date': new Date() }));
    this.active.splice(index, 1);
};

org.ciroque.luckyspin.LuckySpinner.prototype.persistToLocalStorage = function() {
    localStorage.setItem(this.LOCAL_STORAGE_ACTIVE_KEY, this.active);
    localStorage.setItem(this.LOCAL_STORAGE_INACTIVE_KEY, this.inactive);
    localStorage.setItem(this.LOCAL_STORAGE_HISTORY_KEY, this.history);
    localStorage.setItem(this.LOCAL_STORAGE_CURRENT_KEY, this.current);
};

org.ciroque.luckyspin.LuckySpinner.prototype.reset = function() {
    this.active = this.inactive;
    this.inactive = [];
};

org.ciroque.luckyspin.LuckySpinner.prototype.spin = function() {
    var length = (this.active.length - 1);

    if(length == 0) {
        this.current = this.active[0];
        this.moveToInactive(0);
        this.reset();

    } else {

        // Fisher-Yates shuffle: http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
        for(var index = length; index > 0; index--) {
            var randomIndex = Math.floor(Math.random() * (index + 1));
            var current = this.active[index];
            this.active[index] = this.active[randomIndex];
            this.active[randomIndex] = current;
        }

        var selectedIndex = Math.floor((Math.random() * length) + 1);
        this.current = this.active[selectedIndex];
        this.moveToInactive(selectedIndex);
    }

    this.persistToLocalStorage();

    return this.current;
};

var luckySpinner = new org.ciroque.luckyspin.LuckySpinner(['A of Clubs', '2 of Clubs', '3 of Clubs', '4 of Clubs', '5 of Clubs', '6 of Clubs', '7 of Clubs', '8 of Clubs', '9 of Clubs', '10 of Clubs', 'J of Clubs', 'Q of Clubs', 'K of Clubs', 'A of Spades', '2 of Spades', '3 of Spades', '4 of Spades', '5 of Spades', '6 of Spades', '7 of Spades', '8 of Spades', '9 of Spades', '10 of Spades', 'J of Spades', 'Q of Spades', 'K of Spades', 'A of Hearts', '2 of Hearts', '3 of Hearts', '4 of Hearts', '5 of Hearts', '6 of Hearts', '7 of Hearts', '8 of Hearts', '9 of Hearts', '10 of Hearts', 'J of Hearts', 'Q of Hearts', 'K of Hearts', 'A of Diamonds', '2 of Diamonds', '3 of Diamonds', '4 of Diamonds', '5 of Diamonds', '6 of Diamonds', '7 of Diamonds', '8 of Diamonds', '9 of Diamonds', '10 of Diamonds', 'J of Diamonds', 'Q of Diamonds', 'K of Diamonds']);

