const request = require('request');
const scrapeIt = require('scrape-it');
const jsonfile = require('jsonfile');
const cheerio = require('cheerio');

var i = 0;

var file = 'db.json'

var options = {

    url: 'http://www.imdb.com/list/ls063676189/',

    headers: {
        'User-Agent': 'request'
    }

};

var data = {
    articles: {
        listItem: "div.list_item",
        data: {
            url: {
                selector: "a",
                attr: "href",
                convert: function(x) {
                    return 'http://www.imdb.com/list/ls063676189/' + x;
                }
            },
            title: {
                selector: "b a",
                how: "text"
            },
            year_type: {
                selector: "span.year_type",
                how: "text",
                convert: function(x) {
                    var reg = new RegExp(/\d+/g);
                    if (reg.test(x)) {
                        var found = x.match(reg);
                        return found[0];
                    } else {
                        return '';
                    }
                }
            },
            rating: {
                selector: "span.value",
                how: "text"
            },
            description: {
                selector: ".item_description",
                how: "text"
            },
            director: {
                selector: "div.secondary:nth-child(even)",
                how: "text",
                convert: function(x) {
                    var str = x;
                    var res = str.replace("Director: ", "");
                    return res;
                }
            },
            stars: {
                selector: "div.secondary:nth-child(odd)",
                how: "text",
                convert: function(x) {
                    var str = x;
                    var res = str.replace("Stars: ", "");
                    return res;
                }
            },
            duration: {
                selector: ".item_description span",
                how: "text",
                convert: function(x) {
                    var reg = new RegExp(/\d+/g);
                    if (reg.test(x)) {
                        var found = x.match(reg);
                        return found[0];
                    } else {
                        return '';
                    }
                }
            }
        }
    }
}

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        page = scrapeIt.scrapeHTML(body, data);

        jsonfile.readFile(file, function(err, obj) {
            if (err) console.error(err);

            console.log("start: ", obj.articles.length);
            obj.articles = [...obj.articles, ...page.articles];
            console.log("end: ", obj.articles.length);
            //var data = Object.assign(obj, page);
            jsonfile.writeFile(file, obj, {
                flag: 'w',
                spaces: 2
            }, function(err) {
                if (err) console.error(err);
                else {
                    console.log('success');
                    scraperloop(++i);
                }
            });
        });
    }
};

function scraperloop(i) {
    setTimeout(function() {
        if (i < 50) {
            options.url = 'http://www.imdb.com/list/ls063676189/?start=' + i + '01&view=detail&sort=listorian:asc';
            request(options, callback);
        } else if (i >= 50 && i < 100) {
            options.url = 'http://www.imdb.com/list/ls063676660/?start=' + (i - 50) + '01&view=detail&sort=listorian:asc';
            request(options, callback);
        }
    }, 1000)
}

(function() {
    jsonfile.writeFile(file, {
        "articles": []
    }, {
        flag: 'w',
        spaces: 2
    }, function(err) {
        if (err) {
            console.error(err);
        } else {
            console.log("Run scraperloop");
            scraperloop(i);
        }
    });
})();