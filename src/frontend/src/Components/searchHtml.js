export const searchHtml = `<!DOCTYPE html>
<head>
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
        crossorigin="anonymous">
    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp"
        crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@microsoft/azsearch.js@0.0.21/dist/AzSearch.css">
    <title>Azure Cognitive Search Demo App</title>
    <style>
        .searchResults__result h4 {
            margin-top: 0px;
            text-transform: uppercase;
        }

        .searchResults__result .resultDescription {
            margin: 0.5em 0 0 0;
        }
    </style>
</head>
<body>
    <div id="app">
        <nav class="navbar navbar-inverse navbar-fixed-top">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#facetPanel" aria-expanded="false"
                        aria-controls="navbar">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <div class="row">
                        <div class="col-md-2 pagelabel">
                            <a class="navbar-brand pagelabel" target="_blank" href="https://portal.azure.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Search%2FsearchServices">Azure Cognitive Search</a>
                        </div>
                        <div id="searchBox" class="col-mid-8 col-sm-8 col-xs-6"></div>
                        <div id="navbar" class="navbar-collapse collapse">
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <div class="container-fluid">
            <div class="row">
                <div id="facetPanel" class="col-sm-3 col-md-3 sidebar collapse">
                    <div id="clearFilters"></div>
                    <ul class="nav nav-sidebar">
                        <div className="panel panel-primary behclick-panel">
                            
                            <li>
                                <div id="aggregatedResults/translation/translations/toFacet">
                                </div>
                            </li>
                        </div>
                    </ul>
                </div>
                <div class="col-sm-9 col-sm-offset-3 col-md-9 col-md-offset-3 results_section">
                    <div id="results" class="row placeholders">
                    </div>
                    <div id="pager" class="row">
                    </div>
                </div>
            </div>
        </div>
        <!-- Bootstrap core JavaScript
            ================================================== -->
        <!-- Placed at the end of the document so the pages load faster -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa"
            crossorigin="anonymous"></script>
</body>
<!-- Dependencies -->
<script src="https://cdn.jsdelivr.net/react/15.5.0/react.min.js"></script>
<script src="https://cdn.jsdelivr.net/react/15.5.0/react-dom.min.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/redux/3.6.0/redux.min.js"></script>
<!-- Main -->
<script src="https://cdn.jsdelivr.net/npm/@microsoft/azsearch.js@0.0.21/dist/AzSearch.bundle.js"></script>
<script>
    // WARNING
    // For demonstration purposes only, do not use in a production environment. For simplicity, this is a single HTML page that has the query key to the search service.
    // CORS (*) must be enabled in the index before using the demo app.

    // Initialize and connect to your search service
    var automagic = new AzSearch.Automagic({ index: "cosmosdb-index", queryKey: "QHqpzzQur8JsNSr6k2RTjFtc0eMCbQWQk07hi5U5VNAzSeCWkRZi", service: "bpatestjph22", dnsSuffix:"search.windows.net" });
    
    const resultTemplate = \`<div class="col-xs-12 col-sm-3 col-md-3 result_img" >
            <img class="img-responsive result_img" src={{label}} alt="image not found" />
        </div><div class="col-xs-12 col-sm-9 col-md-9"><h4>{{filename}}</h4><div class="resultDescription">{{{aggregatedResults.ocr}}}</div></div>\`;

    // add a results view using the template defined above
    automagic.addResults("results", { count: true }, resultTemplate);
    
    // Adds a pager control << 1 2 3 ... >>
    automagic.addPager("pager");
    
        automagic.addSearchBox("searchBox");
        
       automagic.addCheckboxFacet("aggregatedResults/translation/translations/toFacet", "aggregatedResults/translation/translations/to", "string");


    // Adds a button to clear any applied filters
    automagic.addClearFiltersButton("clearFilters");
</script>
<style>
</style>
</html>`