/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

  'GET /login': {
    view: 'login'
  },

  'POST /login': 'AuthController.login',
  '/logout': 'AuthController.logout',
  '/isAuthenticated': 'AuthController.isAuthenticated',

  'GET /orders/lotTypes': 'OrderController.getLotTypes',                   //List Order Types
  'GET /orders/orderTypes': 'OrderController.getOrderTypes',                   //List Order Types
  'GET /orders/types': 'OrderController.getTypes',                   //List Order Types
  'GET /orders': 'OrderController.getOrders',                   //List Orders
  'GET /orders/:id': 'OrderController.getOrder',                //View Order
  'POST /orders': 'OrderController.saveOrder',                  //Create Order
  'POST /orders/:id': 'OrderController.saveOrder',              //Edit Order
  //'GET /receipts': 'OrderController.generateReceipt',
  'DELETE /orders/:id': 'OrderController.deleteOrder',             //Delete Order

  'GET /lapidaOrders/size': 'OrderController.getLapidaSize',                   //List Order Types
  'GET /lapidaOrders/options': 'OrderController.getLapidaOptions',                   //List Order Types

  'GET /lotSalesOrders/paymentModes': 'OrderController.getPaymentModes',                   //List Order Types

  //'GET /receipts/:orderId': 'ReceiptController.getReceipts',
  'GET /receipts/:id': 'ReceiptController.getReceipt',
  'GET /receipts/print/:id': 'ReceiptController.printReceipt',
  'POST /receipts': 'ReceiptController.saveReceipt',            //Create Receipt
  'PUT /receipts/:receiptId': 'ReceiptController.issueOR',            //Create Receipt

  'GET /categories': 'CategoryController.getCategories',

  'GET /users/roles': 'UserController.getUserRoles',                      //List Users
  'GET /users/:id': 'UserController.getUser',                   //Get User
  'GET /users': 'UserController.getUsers',                      //List Users
  'POST /users': 'UserController.saveUser',                     //Create Users
  'DELETE /users/:id': 'UserController.deleteUser',             //Delete User
  'PUT /password': 'UserController.changePassword',             //Create Users

  'GET /roles': 'RoleController.getRoles',                       //List Users

  'GET /locations': 'LocationController.getLocations',                    //List Users
  'GET /serviceTypes': 'ServiceTypeController.getServiceTypes',                       //List Users

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
