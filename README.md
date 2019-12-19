# HypeMutationObserver
![HypeMutationObserver|690x487](https://playground.maxziebell.de/Hype/MutationObserver/HypeMutationObserver.png) 

![20190912-lbcbk|690x459](https://forums.tumult.com/uploads/db2156/original/3X/2/e/2e979e681be7fa9a8f5c21ab4ce0c108aaa727c7.png) 

This extension called Hype MutationObserver, is a wrapper to [MutationObserver](https://developer.mozilla.org/de/docs/Web/API/MutationObserver). It allows to observer elements and act upon changes on their attributes, childlist and subtree.  This Hype specific wrapper takes care to register and unregister the observer. It also helps in keeping the callback mutation events scene specific and offers an update rate feature.

[↑ look at project](https://forums.tumult.com/t/hype-mutationobserver/16734?u=maxzieb)

Use  `updaterate`  on the config object to set it up.
If you use the new `updaterate` feature to limit the amount of triggers on your mutation code, the extension also takes care to apply the first inital update and the last update. If you don't want that you can disable them using the config keys `disableInitialUpdate` and `disableFinalUpdate`

Visual explanation of `updaterate`:
---
![HypeDocumentLoader|690x487](https://playground.maxziebell.de/Hype/MutationObserver/images/updaterate.jpg)

PS: As seen on the right hand side of the visualization, the check against the `updaterate` is not always on the heartbeat of the interval. That is rather what Hype AnimationFrame is for. So if a mutation event falls inbetween to heartbeats (interval) and more time has passed then an interval, it gets fired. That also always sets up a *delayed timeout callback* to fire any cached mutations in the next interval as a final update.

**Online Example:**  
[HypeMutationObserver.html](https://playground.maxziebell.de/Hype/MutationObserver/HypeMutationObserver.html)

**Version-History:**  
`1.0	Initial release under MIT`  
`1.1 Added support for Updaterate`

Content Delivery Network (CDN)
--
Latest minified version can be linked into your project using the following in the head section of your project:
```html
<script src="https://cdn.jsdelivr.net/gh/worldoptimizer/HypeMutationObserver/HypeMutationObserver.min.js"></script>
```

Optionally you can also link a SRI version or specific releases. Read more about that on the JsDelivr (CDN) page for this extension at https://www.jsdelivr.com/package/gh/worldoptimizer/HypeMutationObserver

Learn how to use the latest extension version and how to combine extentions into one file at
https://github.com/worldoptimizer/HypeCookBook/wiki/Including-external-files-and-Hype-extensions
