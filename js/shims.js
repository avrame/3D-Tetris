/* Fixes toLocaleString() function in Safari so it adds 1000 separator commas */
(function (old) {
    var dec = 0.12 .toLocaleString().charAt(1),
        tho = dec === "." ? "," : ".";

    if (1000 .toLocaleString() !== "1,000.00") {
        Number.prototype.toLocaleString = function () {
           var neg = this < 0,
               f = this.toFixed(2).slice(+neg);

           return (neg ? "-" : "") 
                  + f.slice(0,-3).replace(/(?=(?!^)(?:\d{3})+(?!\d))/g, tho);
        }
    }
})(Number.prototype.toLocaleString);