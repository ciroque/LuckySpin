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

    function loadFromLocalStorage(key, alt) {
        var loaded = localStorage.getItem(key);
        if(loaded === null || loaded === undefined) {
            loaded = alt;
        } else {
            loaded = loaded.split(',');
        }

        return loaded;
    }

    this.active = loadFromLocalStorage(this.LOCAL_STORAGE_ACTIVE_KEY, arguments[0] || []);
    this.inactive = loadFromLocalStorage(this.LOCAL_STORAGE_INACTIVE_KEY, []);

    console.log('DEBUG>> { ' + this.active + ' } { ' + this.inactive + ' }');

    this.moveToInactive = function(index) {
        this.inactive.push(this.active[index]);
        this.active.splice(index, 1);
    };

    this.persistToLocalStorage = function() {
        localStorage.setItem(this.LOCAL_STORAGE_ACTIVE_KEY, this.active);
        localStorage.setItem(this.LOCAL_STORAGE_INACTIVE_KEY, this.inactive);
    };

    this.reset = function() {
        this.active = this.inactive;
        this.inactive = [];
    };

    this.spin = function() {
        var callback = arguments[0] || function(list) {};
        var length = (this.active.length - 1);
        var chosen = null;

        if(length == 0) {
            callback(this.active);
            chosen = this.active[0];
            this.moveToInactive(0);
            this.reset();

        } else {
            for(var index = length; index > 0; index--) {
                var randomIndex = Math.floor(Math.random() * (index + 1));
                var current = this.active[index];
                this.active[index] = this.active[randomIndex];
                this.active[randomIndex] = current;
                callback(this.active);
            }

            var selectedIndex = Math.floor((Math.random() * length) + 1);
            chosen = this.active[selectedIndex];
            this.moveToInactive(selectedIndex);
        }

        this.persistToLocalStorage();

        return chosen;
    };
};

var ls = new org.ciroque.luckyspin.LuckySpinner(['Adrianne', 'Andrew', 'Blake', 'Brian', 'Mike', 'Nick', 'Ronnie', 'Ryan', 'Steve', 'Terry']);



