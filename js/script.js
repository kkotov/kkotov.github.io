$(function () { // Same as document.addEventListener("DOMContentLoaded",...)
  // same as document.querySelector("#navbarToggle").addEventListener("blur",...)
  $("#navbarToggle").blur( function (event) {
    if( window.innerWidth < 768 ){
      $("#collapsable-nav").collapse('hide');
    }
  });
  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});

(function (global) {

  var kk = {};

  document.addEventListener("DOMContentLoaded", function (event) {
    // On first load show home view
    $ajaxUtils.sendGetRequest(
      "snippets/home-snippets.html",
      function(responseText){
        document.querySelector("#main-content").innerHTML = responseText;
      },
      false
    );
  });

  var insertProperty = function(string, propName, propValue) {
    return string.replace(new RegExp("{{"+propName+"}}", "g"), propValue);
  };

  kk.loadPresentations = function() {
    return renderTopics("presentations.json", "snippets/presentations-title-snippet.html", "snippets/tile-snippet.html");
  }

  kk.loadHobbies = function() {
    return renderTopics("hobbies.json", "snippets/hobbies-title-snippet.html", "snippets/tile-snippet.html");
  }

  var renderTopics = function (jsonURI, titleURI, bodyURI) {
    $ajaxUtils.sendGetRequest(
      jsonURI,
      function (items) {
        $ajaxUtils.sendGetRequest(
          titleURI,
          function (title) {
            $ajaxUtils.sendGetRequest(
              bodyURI,
              function (body) {
                finalHtml = title;
                finalHtml += "<section class='row'>";
                for(var i=0; i<items.length; i++){
                  html = body;
                  html = insertProperty(html, "name", items[i].name);
                  html = insertProperty(html, "src",  items[i].src);
                  html = insertProperty(html, "logo", items[i].logo);
                  finalHtml += html;
                }
                finalHtml += "</section>";
                document.querySelector("#main-content").innerHTML = finalHtml;
              },
              false
            )
          },
          false)
        },
      true
    );
  }

  global.$kk = kk;

})(window);
