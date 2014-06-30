var org = org || {};
org.ciroque = org.ciroque || {};
org.ciroque.luckyspin = org.ciroque.luckyspin || {};

org.ciroque.luckyspin.LuckySpin = function(spinner) {
    this.spinner = spinner;
};

org.ciroque.luckyspin.LuckySpin.prototype.spin = function() {
    this.spinner.spin();
    this.updateNames();
};

org.ciroque.luckyspin.LuckySpin.prototype.updateNames = function() {

    function generateNameElements(className, names) {
        var $el = $(className);
        $el.empty();
        $.each(names, function (idx, val) {
            $el.append($('<div></div>')
                .attr('class', 'name')
                .attr('value', val)
                .text(val));
        });
    }

    generateNameElements('.active', this.spinner.active);
    generateNameElements('.inactive', this.spinner.inactive);

    $('.current').text(this.spinner.current);
};

org.ciroque.luckyspin.LuckySpin.prototype.animate = function() {
    var count = $('.active').children().length;
    var rolls = count * 3;
    var self = this;

    function selector(roll, prevIndex) {
        var randomIndex = Math.floor(Math.random() * count);
        var $active = $('.active');

        $($active.children()[randomIndex]).addClass('highlighted');

        if(prevIndex >= 0) {
            $($active.children()[prevIndex]).removeClass('highlighted');
        }

        if(roll > 0) {
            window.setTimeout(function() { selector(roll - 1, randomIndex) }, 50 * (1 / count));
        } else {
            self.spin();
        }
    }

    selector(rolls, -1);
};