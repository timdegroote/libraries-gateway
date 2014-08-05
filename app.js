/*!
 * Copyright 2014 Digital Services, University of Cambridge Licensed
 * under the Educational Community License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the
 * License. You may obtain a copy of the License at
 *
 *     http://opensource.org/licenses/ECL-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an "AS IS"
 * BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

var AccountController = require('./lib/controllers/client/nodes/AccountController').AccountController;
var BlogsController = require('./lib/controllers/client/nodes/BlogsController').BlogsController;
var ErrorHandler = require('./lib/controllers/error/ErrorHandler').ErrorHandler;
var HomeController = require('./lib/controllers/client/nodes/HomeController').HomeController;
var LibrariesAPI = require('./lib/controllers/api/libraries');
var LibrariesController = require('./lib/controllers/client/nodes/LibrariesController').LibrariesController;
var ResourcesController = require('./lib/controllers/client/nodes/ResourcesController').ResourcesController;
var SearchRESTAPI = require('./lib/controllers/api/search/rest');
var UsingLibrariesController = require('./lib/controllers/client/nodes/UsingLibrariesController').UsingLibrariesController;

var Server = require('lg-util/lib/server');

/**
 * Function that initializes the server by calling the 'createServer' method in the server util.
 * After the server has been created and successfully spun up, the routes are registered.
 * @api private
 */
var init = function() {

    // Create a new Express server
    Server.createServer()

    // Register the application routes
    .then(registerRoutes);
};

/**
 * Function that registers the routes after the server has been started
 *
 * @param  {Express}    app     The Express server the routes should be registered for
 * @api private
 */
var registerRoutes = function(app) {

    ////////////////
    // API routes //
    ////////////////

    app.get('/api/libraries', LibrariesAPI.getLibraries);
    app.get('/api/libraries/:slug', LibrariesAPI.getLibraryBySlug);
    app.get('/api/search', SearchRESTAPI.getResults);
    app.get('/api/search/facets', SearchRESTAPI.getFacetsForResults);
    app.get('/api/search/:api', SearchRESTAPI.getResultById);

    ///////////////////
    // Client routes //
    ///////////////////

    // Home
    var homeController = new HomeController();
    app.get('/', homeController.getContent);

    // Blog
    var blogsController = new BlogsController();
    app.get('/blogs', blogsController.getContent);

    // Find a library
    var librariesController = new LibrariesController();
    app.get('/find-a-library', librariesController.getContent);
    app.get('/find-a-library/:id', librariesController.getLibraryDetail);

    // Find a resource
    var resourcesController = new ResourcesController();
    app.get('/find-a-resource', resourcesController.getContent);
    app.get('/find-a-resource/facets', resourcesController.getFacetsForResults);
    app.get('/find-a-resource/:api/:id', resourcesController.getResourceDetail);

    // My account
    var accountController = new AccountController();
    app.get('/my-account', accountController.getContent);

    // Using our libraries
    var usingLibrariesController = new UsingLibrariesController();
    app.get('/using-our-libraries', usingLibrariesController.getContent);

    ////////////
    // ERRORS //
    ////////////

    // ErrorHandler
    var errorHandler = new ErrorHandler();
    app.use(errorHandler.getErrorPage);
};

init();
