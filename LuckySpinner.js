var org = org || {};
org.ciroque = org.ciroque || {};
org.ciroque.luckyspin = org.ciroque.luckyspin || {};

org.ciroque.luckyspin.LuckySpinner = function(data) {
    this.LOCAL_STORAGE_PREFIX_KEY = "LuckySpin::";
    this.LOCAL_STORAGE_DATA_KEY = this.LOCAL_STORAGE_PREFIX_KEY + 'DATA';
    this.LOCAL_STORAGE_ACTIVE_KEY = this.LOCAL_STORAGE_PREFIX_KEY + 'ACTIVE';
    this.LOCAL_STORAGE_INACTIVE_KEY = this.LOCAL_STORAGE_PREFIX_KEY + 'INACTIVE';
    this.LOCAL_STORAGE_HISTORY_KEY = this.LOCAL_STORAGE_PREFIX_KEY + 'HISTORY';
    this.LOCAL_STORAGE_CURRENT_KEY = this.LOCAL_STORAGE_PREFIX_KEY + 'CURRENT';

    this.data = data || [];
    this.current = localStorage.getItem(this.LOCAL_STORAGE_CURRENT_KEY);
    this.active = this.loadFromLocalStorage(this.LOCAL_STORAGE_ACTIVE_KEY, this.makeDataCopy(data));
    this.inactive = this.loadFromLocalStorage(this.LOCAL_STORAGE_INACTIVE_KEY, []);
    this.history = this.loadFromLocalStorage(this.LOCAL_STORAGE_HISTORY_KEY, []);
    return this;
};

org.ciroque.luckyspin.LuckySpinner.prototype.loadFromLocalStorage = function(key, alt) {
    var loaded = localStorage.getItem(key);
    if(loaded === null || loaded === undefined) {
        loaded = alt;
    } else {
        loaded = loaded.split(',');
    }

    return loaded;
};

org.ciroque.luckyspin.LuckySpinner.prototype.makeDataCopy = function(d) {
    var copied = [];
    for(var i = 0; i < d.length; i++) {
        copied.push(d[i]);
    }
    return copied;
};

org.ciroque.luckyspin.LuckySpinner.prototype.moveToInactive = function(index) {
    var selected = this.active[index];
    this.inactive.unshift(selected);
    this.history.unshift(JSON.stringify({ 'name': selected, 'date': new Date() }));
    this.active.splice(index, 1);
    return this;
};

org.ciroque.luckyspin.LuckySpinner.prototype.persistToLocalStorage = function() {
    localStorage.setItem(this.LOCAL_STORAGE_DATA_KEY, this.data);
    localStorage.setItem(this.LOCAL_STORAGE_ACTIVE_KEY, this.active);
    localStorage.setItem(this.LOCAL_STORAGE_INACTIVE_KEY, this.inactive);
    localStorage.setItem(this.LOCAL_STORAGE_HISTORY_KEY, this.history);
    localStorage.setItem(this.LOCAL_STORAGE_CURRENT_KEY, this.current);
};

org.ciroque.luckyspin.LuckySpinner.prototype.reset = function() {
    this.data = this.loadFromLocalStorage(this.LOCAL_STORAGE_DATA_KEY, ['WTF']);
    this.active = this.makeDataCopy(this.data);
    this.inactive = [];
    this.persistToLocalStorage();
    return this;
};

org.ciroque.luckyspin.LuckySpinner.prototype.spin = function() {
    var length = (this.active.length - 1);

    if(length == 0) {
        this.current = this.active[0];
        this.moveToInactive(0);
        this.reset();

    } else {

        // Fisher-Yates shuffle: http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
        // see also: http://www.i-programmer.info/programming/theory/2744-how-not-to-shuffle-the-kunth-fisher-yates-algorithm.html
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

    return this;
};
