// BGN Global Variables
var theUrl  = "http://developer.nytimes.com/proxy/https/api.nytimes.com/svc/search/v2/articlesearch.json";
var options = { 'api-key': "47fde69a831a42aeb6cdfc5b0aa4b192" };

// END Global Variables


// BGN Functions
var resetList = function() {
    // Reset theUrl and options
    theUrl  = "http://developer.nytimes.com/proxy/https/api.nytimes.com/svc/search/v2/articlesearch.json";
    options = { 'api-key': "47fde69a831a42aeb6cdfc5b0aa4b192" };
    // Clear div for next list of articles
    $("#articleHolder").empty();
};

var createOptions = function(key, value) {
    // Add key value to options object
    options[key] = value;
};

// END Functions


// BGN Event Handlers
$("#clearAll").on("click", function(){

  // Clear top articles
  resetList();

}); // end function and on click method

$("#runSearch").on("click", function() {

  // Clear top articles
  resetList();

  // Variables
  var queryValue  = $("#searchTerm").val();
  var pageValue   = $("#numRecordSelect").val();
  var startValue  = $("#startDate").val();
  var endValue    = $("#endDate").val();

  // Testing
  //console.log("OnClick pageValue", pageValue);

  // Check to see if each form field was set and add key value pair to options object if form field was set
  if (queryValue !== undefined) {

      createOptions("q", queryValue);
  }
  if (pageValue !== undefined) {

      createOptions("p", pageValue);
  }
  if (startValue !== undefined && startValue !== "" ) {

      createOptions("start_date",startValue);
  }
  if (endValue !== undefined && startValue !== "" ) {

      createOptions("end_date",endValue);
  }

  // Testing
  console.log("options b4 theUrl:",options);

  // Create final url to pass to ajax
  theUrl += '?' + $.param(options);

  // Make ajax call
  $.ajax({
    url: theUrl,
    method: 'GET',
  }).then(function(results) {

    // Testing
    console.log("Result:",results);
    console.log('DOCS'  ,results.response.docs);
  
    // Variables
    var articleHolder     = $("#articleHolder");
    var responseArticles  = results.response.docs;
    var assetsUrl         = "https://www.nytimes.com/";

    // Loop through articles
    $.each(responseArticles, function( index, article ) {

      // Test
      //console.log("article:",article);

      // Variables
      var rowDiv          = $("<div>");
      var sectionLeft     = $("<div>");
      var sectionRight    = $("<div>");
      var articleHeading  = $("<h4>");
      var articleLink     = $("<a>");
      var articleSnippet  = $("<p>");
      var articleImage    = $("<img>");
      var theMultimedia   = article.multimedia;
      var thumbnail       = theMultimedia[2];
      var thumbnailUrl    = null; 
      
      // Check to see if the thumbnail is available
      if ( theMultimedia.length > 0 ) {

        // Set thumbnail to thumbnail of API data
        thumbnailUrl        = theMultimedia[2].url;
        var articleImageUrl = assetsUrl + thumbnailUrl;

      } else {

        // Set a placeholder if a thumbnail is not found
        thumbnailUrl        = 'assets/img/placeholder.png';
        var articleImageUrl = thumbnailUrl;
      }
      
      // Testing
      //console.log("articleImageUrl:",articleImageUrl);

      // An object with our data needs from the API.
      var view = {

        imageUrl: articleImageUrl,
        headline: article.headline.main,
        webUrl: article.web_url,
        snippet: article.snippet
      }; //end view object

      // Create left side of the article display
      articleImage.attr("height", "100px");
      articleImage.attr("width", "100px");
      articleImage.attr("src", view.imageUrl);
      sectionLeft.attr("class", "section-left col-sm-2");
      sectionLeft.append(articleImage);

      // Create right side of the article display
      articleLink.attr("href", view.webUrl);
      articleLink.text(view.headline);
      articleHeading.append(articleLink);
      sectionRight.attr("class", "section-right col-sm-10");
      sectionRight.append(articleHeading);
      articleSnippet.text(view.snippet);
      sectionRight.append(articleSnippet);

      // Create containers of the article display
      rowDiv.append(sectionLeft);
      rowDiv.append(sectionRight);
      rowDiv.attr("class", "row mb");
      articleHolder.append(rowDiv);
            
    }); // end function callback and jquery each method

  }, // end function results

  function(err){

    console.log("AJAX ERROR:", err);

  }); // end function err and ajax then method

}); // end callback function and click on method

// END Event Handlers