(function (global) {

// Set up a namespace for our utility
var ajaxUtils = {};

ajaxUtils.sendGetRequest = function (requestUri, responseHandler, isJsonResponse) {
  if( !window.XMLHttpRequest ){
    global.alert("Ajax is not supported!");
    return(null);
  }
  var req = new XMLHttpRequest();
  req.onreadystatechange = function (){ helper(req, responseHandler, isJsonResponse); };
  req.open("GET", requestUri, true); // true for dispatching it to background
  req.send(null);
};

function helper(req, responseHandler, isJsonResponse) {
  if( req.readyState == 4 && req.status == 200 ){
    if( isJsonResponse == undefined || isJsonResponse ){
      responseHandler( JSON.parse(req.responseText) );
    } else {
      responseHandler( req.responseText );
    } 
  } 
}

// Expose utility to the global object
global.$ajaxUtils = ajaxUtils;

})(window);
