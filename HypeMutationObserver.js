/*!
Hype MutationObserver 1.1
copyright (c) 2019 Max Ziebell, (https://maxziebell.de). MIT-license
*/
/*
* Version-History
* 1.0	Initial release under MIT
* 1.1 	Added support for framerate (updaterate)
*/

if("HypeMutationObserver" in window === false) window['HypeMutationObserver'] = (function () {
	
	/* Keeping track of running MutationObserver instances */
	var mO_Instances = {};
	
	/* Public functions */
	function stopMutationObserverByHypeDocumentId (hypeDocId, mOiD){
		mO_Instances[hypeDocId][mOiD].disconnect();
		delete(mO_Instances[hypeDocId][mOiD]);
	}
	
	function stopAllMutationObserverByHypeDocumentId(hypeDocId){
		for (var mOiD in mO_Instances[hypeDocId]) {
			stopMutationObserverByHypeDocumentId (hypeDocId, mOiD);
		}
		
	}
	
	function stopAllMutationObserver(){
		for (var hypeDocId in mO_Instances) {
			stopAllMutationObserverByHypeDocumentId (hypeDocId);
			mO_Instances[hypeDocId] = {};
		}
	}
	
	/* Hype document functions*/
	function extendHype(hypeDocument, element, event) {
		
		/* init document specific lookup */
		var hypeDocId = hypeDocument.documentId();
		mO_Instances[hypeDocId] = {};
		
		/**
		* hypeDocument.startMutationObserver
		* @param {HTMLDivElement} element to observer
		* @param {Function} function callback
		* @param {Object} things to watch (optional) id, scope
		*/
		hypeDocument.startMutationObserver = function(target, callback, config){
			config = config ? config : {attributes: true};
			var mOiD = config.id || callback;
			var scope = config.scope || this;
			if (!mO_Instances[hypeDocId][mOiD]) {
				if (config.updaterate) {
					/* ups version */
					var upsInterval = 1000 / config.updaterate;
    				var then = config.disableInitialUpdate ? 0  : -upsInterval;
    				var startTime = then;
    				var cachedMutations;
    				var lastUpdatedMutations;
    				var lastUpdateInterval;
    				var observer = new MutationObserver(function(mutations) {
						now = performance.now();
		    			elapsed = now - then;
		    			cachedMutations = mutations;
		    			if (elapsed > upsInterval) {
		    				if (!config.disableFinalUpdate) {
		    					clearInterval(lastUpdateInterval);
		    				}	
		    				then = now - (elapsed % upsInterval);
		    				cachedMutations.forEach(function(mutation) {
								callback.apply(scope,[mutation]);
							});
							if (!config.disableFinalUpdate) {
								lastUpdatedMutations = cachedMutations;
								lastUpdateInterval = setTimeout(function(){
									if (lastUpdatedMutations!=cachedMutations){
										cachedMutations.forEach(function(mutation) {
											callback.apply(scope,[mutation]);
										});
									}
								}, upsInterval*1.1);
							}
						} 
					});
				} else {
					/* regular version */
					var observer = new MutationObserver(function(mutations) {
						mutations.forEach(function(mutation) {
							callback.apply(scope,[mutation]);
						});    
					});
				}
				observer.observe(target, config);
				mO_Instances[hypeDocId][mOiD] = observer;
			}
		}
		
		/**
		* hypeDocument.stopMutationObserver
		* @param {String} stop animation by name
		*/
		hypeDocument.stopMutationObserver = function(mOiD){
			stopMutationObserverByHypeDocumentId (hypeDocId, mOiD);
		}
		
		/**
		* hypeDocument.stopAllMutationObserver
		*/
		hypeDocument.stopAllMutationObserver = function(){
			stopAllMutationObserverByHypeDocumentId(hypeDocId);
		}
		
	}
	
	/* Kill Mutation Obbserver for document on scene changes */
	function sceneUnload(hypeDocument, element, event) {
		hypeDocument.stopAllMutationObserver();
	}
	
	/* Setup Hype listeners */
	if("HYPE_eventListeners" in window === false) { window.HYPE_eventListeners = Array();}
	window.HYPE_eventListeners.push({"type":"HypeDocumentLoad", "callback":extendHype});
	window.HYPE_eventListeners.push({"type":"HypeSceneLoad", "callback":sceneUnload});

	/* Reveal Public interface to window['HypeMutationObserver'] */
	return {
		'stopMutationObserverByHypeDocumentId' : stopMutationObserverByHypeDocumentId,
		'stopAllMutationObserverByHypeDocumentId' : stopAllMutationObserverByHypeDocumentId,
		'stopAllMutationObserver' : stopAllMutationObserver
	};
})();