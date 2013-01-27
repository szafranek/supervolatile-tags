# supervolatile-tags

Visualization of my link blog [supervolatile.com](http://supervolatile.com).
Read [the story behind](http://szafranek.net/blog/2013/01/28/link-blog-visualized/).

## Disclaimer & License

The code here is a one-time hack and wasn't intended to conform to any quality standards.
It comes with no support from my side and is available as Public Domain.


## Demo

<http://szafranek.net/files/works/websites/supervolatile/metatags.html>


## Usage

To generate visualization of your own Posterous blog you need first to download all the posts. Since recently Posterous offers a backup option, but I have not investigated it and instead use a brute-force `download.sh` script that calls the API and saves all the posts in XML files stored into the `data` folder. You need to provide your USERNAME, PASSWORD, api TOKEN and SITE_ID in the script. 

Next step is to generate tag file from all the posts. In `process.js` there's a callback function called `createTagFile` that needs raw tags and will save them in the `./data/rawtags.txt` file. The function has to be called only once and the checked in version of the `process.js` script doesn't call it.

```
node process.js
```

You then have to manually annotate each tag with a meta tag it belongs to. See my own `metatags.txt` file for an example.

Next you are ready to disable the call to `createTagFile` and call `getProcessedTagsAsync` instead. Run the script again:

```
node process.js
```

This will generate you the `metatags.html` file – your final result.
