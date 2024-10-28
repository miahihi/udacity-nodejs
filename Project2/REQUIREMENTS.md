# Project API Requirements

## Product Endpoints
### Get All Products
- Endpoint: `/products`
- HTTP Verb: GET

### Get a Specific Product
- Endpoint: `/products/:id`
- HTTP Verb: GET

### Create a New Product
- Endpoint: `/product/create`
- HTTP Verb: POST

### Update a Product
- Endpoint: `/products/:id`
- HTTP Verb: PUT

### Delete a Product
- Endpoint: `/products/:id`
- HTTP Verb: DELETE

## User Endpoints
### Get All Users
- Endpoint: `/users`
- HTTP Verb: GET

### Get a Specific User
- Endpoint: `/users/:id`
- HTTP Verb: GET

### Create a New User
- Endpoint: `/user/create`
- HTTP Verb: POST

### Check authentication
- Endpoint: `/user/auth`
- HTTP Verb: POST

### Delete a User
- Endpoint: `/users/:id`
- HTTP Verb: DELETE

## Category Endpoints
### Get All Categories
- Endpoint: `/categories`
- HTTP Verb: GET

### Get a Specific Category
- Endpoint: `/categories/:id`
- HTTP Verb: GET

### Create a New Category
- Endpoint: `/categories`
- HTTP Verb: POST

### Delete a Category
- Endpoint: `/categories/:id`
- HTTP Verb: DELETE

## Order Endpoints
### Get All Orders
- Endpoint: `/orders`
- HTTP Verb: GET

### Get a Specific Order
- Endpoint: `/orders/:id`
- HTTP Verb: GET

### Create a New Order
- Endpoint: `/orders/create`
- HTTP Verb: POST

### Update an Order
- Endpoint: `/orders/:id`
- HTTP Verb: PUT

### Update an Order
- Endpoint: `/orders/:id`
- HTTP Verb: PUT

### Delete an Order
- Endpoint: `/orders/:id`
- HTTP Verb: DELETE

## Order Detail Endpoints
### Get All Order-Details
- Endpoint: `/order-details`
- HTTP Verb: GET

### Get an Order-Detail
- Endpoint: `/order-details/:order_id`
- HTTP Verb: GET

### Create an Order-Detail
- Endpoint: `/order-details/create`
- HTTP Verb: POST

### Update an Order-Detail
- Endpoint: `/order-details/:order_id/:product_id`
- HTTP Verb: PUT

### Delete an Order-Detail
- Endpoint: `/order-details/:order_id/:product_id`
- HTTP Verb: DELETE