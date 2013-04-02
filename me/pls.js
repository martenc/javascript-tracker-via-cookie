// http://www.quirksmode.org/
function createTRCCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readTRCCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseTRCCookie(name) {
	createCookie(name,"",-1);
}


// get qs parameter
var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value that is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();



// check if user has content ref cookie
var contentrefid;
if (readTRCCookie('trc') != undefined) {
	contentrefid = readTRCCookie('trc');
}
else {
	// check if crefid qs is present in the url
	if (QueryString.crefid != undefined) {
		contentrefid = QueryString.crefid;
		// create cookie 
		createTRCCookie('trc', contentrefid, 90)
	}
}


// only if anything is set should we call our pixel
if (contentrefid != undefined) {
	// setup parameters
	var params = {
	    resolution: screen.width + ',' + screen.height,
	    crefid: contentrefid,
	    pageurl: window.location.href.split('?')[0],
	    cid: 'XYZ' //TODO: coordinate with media on this value
	};

	// serialize qs paramters
	var serialisedGetParams = [];
	for (var param in params) {
	    if ( ! params.hasOwnProperty(param)) {
	       continue;
	    }
	    serialisedGetParams.push(param + '=' + encodeURIComponent(params[param]));
	}
	serialisedGetParams = serialisedGetParams.join('&');

	// call our pixel
	(new Image).src = 'http://yourdomain.com/pixel?' + serialisedGetParams;
}

