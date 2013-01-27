var fs = require('fs');
var hogan = require("hogan.js");
var dir = "./data/";


// Orchestration
readRawPostsAsync(function(rawPosts) {
    var posts = getProcessedPosts(rawPosts);
    var yearsHash = getYears(posts);
    var years = hashToArray(yearsHash);

    var emptyMonthsGenerator = getEmptyMonthsGenerator(years);
    var rawTags = getTags(posts, emptyMonthsGenerator);
    getProcessedTagsAsync(rawTags, function(tagsHash) {

        var tags = hashToArray(tagsHash);
        tags.sort(function sortByTotal(a, b) {
            return b.total - a.total;
        });

        var metatags = groupByMetatags(tags);

        var templateData = {
            years: years,
            tags: tags,
            metatags: metatags
        };

        fs.readFile("templates/metatags.mu", function(err, data) {
            var template = hogan.compile(data.toString());

            fs.writeFile("metatags.html", template.render(templateData), function(err) {
                console.log("Results written to metatags.html");
            });
        });

    });

});




// Functions

function getProcessedTagsAsync(rawTags, callback) {
    fs.readFile(dir + "metatags.txt", function(err, data) {
        var lines = data.toString().split("\n");
        lines.forEach(function(line) {
            var tagLine = line.split("|");
            var tag = tagLine[0];
            var metatag = tagLine[1];
            if (rawTags[tag]) {
                rawTags[tag].metatag = metatag;
            }
        });
        callback(rawTags);
    });
}

function createTagFile(tags) {
    Object.keys(tags).forEach(function(tagName) {
            fs.appendFile(dir + "rawtags.txt", tagName + "|\n");
    });
}


function readRawPostsAsync(callback) {
    var rawPosts = [];
    fs.readdir(dir, function (err, files) {
        files = files.filter(function (fileName) {
            return fileName.match(/\d+\.json/);
        });

        files.sort(function (a, b) {
            return parseInt(a, 10) - parseInt(b, 10);
        });

        files.forEach(function (fileName) {
            var postsChunk = require(dir + fileName);
            if (postsChunk.length) {
                rawPosts = rawPosts.concat(postsChunk);
            }
        });
        callback(rawPosts);
    });
}


function getProcessedPosts(rawPosts) {
    var posts = [];
    rawPosts.forEach(function(rawPost) {
        var post = {
            "title": rawPost.title,
            "url": rawPost.full_url,
            "date": new Date(rawPost.display_date),
            "tags": rawPost.tags.map(function(rawTag) {return rawTag.name;})
        };
        posts.push(post);
    });

    posts.sort(function(a, b) {
        return a.date.getTime() - b.date.getTime();
    });
    return posts;
}


function getTags(posts, getEmptyMonths) {
    var tags = {};
    posts.forEach(function(post) {
        post.tags.forEach(function(tagName) {
            if (!tags[tagName]) {
                tags[tagName] = {
                    total: 0,
                    months: getEmptyMonths()
                };
            }
            tags[tagName].total++;
            var monthId = post.date.getFullYear() + "/" + post.date.getMonth();
            tags[tagName].months[monthId].posts.push(post);
            tags[tagName].months[monthId].hasPosts = true;
            tags[tagName].months[monthId].total++;
        });
    });

    Object.keys(tags).forEach(function(tagName) {
        tags[tagName].months = hashToArray(tags[tagName].months);
    });

    return tags;
}


function groupByMetatags(tags) {
    var i = 0;
    var metatags = {};
    tags.forEach(function(tag) {
        if (!metatags[tag.metatag]) {
            metatags[tag.metatag] = {
                months: [],
                tags: [],
                totalPosts: 0,
                totalTags: 0
            }
        }
        var metatag = metatags[tag.metatag];
        metatag.tags.push(tag);
        for (i = 0; i < tag.months.length; i++) {
            if (!metatag.months[i]) {
                metatag.months[i] = {
                    posts: [],
                    totalPosts: 0
                };
            }
            metatag.months[i].posts = metatag.months[i].posts.concat(tag.months[i].posts);
            if (metatag.months[i].posts.length) {
                metatag.months[i].hasPosts = true;
            }
        }
        metatag.totalTags++;
    });

    metatags = hashToArray(metatags);

    // remove duplicate posts
    metatags.forEach(function(metatag) {
        for (i = 0; i < metatag.months.length; i++) {
            var monthPosts = {};
            metatag.months[i].posts.forEach(function(post) {
                monthPosts[post.url] = post;
            });
            var monthPostsArr = [];
            Object.keys(monthPosts).forEach(function(url) {
                monthPostsArr.push(monthPosts[url]);
            });
            metatag.months[i].posts = monthPostsArr;
            metatag.months[i].totalPosts = monthPostsArr.length;
            metatag.totalPosts += monthPostsArr.length;
        }
    });

    metatags.sort(function(a, b) {
        return b.totalPosts - a.totalPosts;
    });
    return metatags;
}


function getYears(posts) {
    var years = {};
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    posts.forEach(function(post) {
        var year = post.date.getFullYear();
        if (!years[year]) {
            var emptyMonths = [];
            for (var i = 0; i< 12; i++) {
                emptyMonths.push({
                    total: 0,
                    name: monthNames[i].substr(0, 3)
                });
            }
            years[year] = {
                months: emptyMonths,
                total: 0
            }
        }
        var month = post.date.getMonth();
        years[year].months[month].total++;
        years[year].total++;
    });

    var lastPost = posts[posts.length - 1];
    var lastYear = lastPost.date.getFullYear();
    var lastMonth = lastPost.date.getMonth();
    years[lastYear].months.splice(lastMonth + 1);

    return years;
}

function getEmptyMonthsGenerator(years) {
    var months = {};
    years.forEach(function(year) {
        for (var i=0; i<year.months.length; i++) {
            months[year.name + "/" + i] = {
                posts: [],
                total: 0,
                hasPosts: false
            };
        }
    });

    return function() {
        return JSON.parse(JSON.stringify(months));
    }
}

function hashToArray(hash) {
    var array = [];
    Object.keys(hash).forEach(function(key) {
        hash[key].name = key;
        array.push(hash[key]);
    });

    return array;
}

