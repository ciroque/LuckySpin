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

    this.moveToInactive = function(index) {
        var selected = this.active[index];
        this.inactive.unshift(selected);
        this.history.unshift(JSON.stringify({ 'name': selected, 'date': new Date() }));
        this.active.splice(index, 1);
    };

    this.persistToLocalStorage = function() {
        localStorage.setItem(this.LOCAL_STORAGE_ACTIVE_KEY, this.active);
        localStorage.setItem(this.LOCAL_STORAGE_INACTIVE_KEY, this.inactive);
        localStorage.setItem(this.LOCAL_STORAGE_HISTORY_KEY, this.history);
        localStorage.setItem(this.LOCAL_STORAGE_CURRENT_KEY, this.current);
    };

    this.reset = function() {
        this.active = this.inactive;
        this.inactive = [];
    };

    this.spin = function() {
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
};

var luckySpinner = new org.ciroque.luckyspin.LuckySpinner(['Adrianne', 'Andrew', 'Blake', 'Brian', 'Mike', 'Nick', 'Ronnie', 'Ryan', 'Steve', 'Terry']);
