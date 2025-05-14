# API Routes

## Authentication

### Swagger Link -> http://localhost:3000/api-docs/

### POST /api/auth/register

Registers a new user

* Request Body:
	+ name: string
	+ username: string
	+ email: string
	+ password: string
* Response:
	+ 201 Created: User registered successfully
	+ 400 Bad Request: Invalid input

### POST /api/auth/login

Logs in an existing user

* Request Body:
	+ email: string
	+ password: string
* Response:
	+ 200 OK: User logged in successfully
	+ 401 Unauthorized: Invalid email or password

## Products

### GET /api/products

Gets all products

* Response:
	+ 200 OK: List of all products

### GET /api/products?id

Gets a product by ID

* Query Parameters:
	+ id: string
* Response:
	+ 200 OK: Product found
	+ 404 Not Found: Product not found

### POST /api/products

Creates a new product

* Request Body:
	+ name: string
	+ price: number
	+ quantity: number
* Response:
	+ 201 Created: Product created successfully
	+ 400 Bad Request: Invalid input

### PUT /api/products?id

Updates a product by ID

* Query Parameters:
	+ id: string
* Request Body:
	+ name: string
	+ price: number
	+ quantity: number
* Response:
	+ 200 OK: Product updated successfully
	+ 404 Not Found: Product not found

### DELETE /api/products?id

Deletes a product by ID

* Query Parameters:
	+ id: string
* Response:
	+ 204 No Content: Product deleted successfully
	+ 404 Not Found: Product not found

## Warehouses

### GET /api/warehouses

Gets all warehouses

* Response:
	+ 200 OK: List of all warehouses

### GET /api/warehouses?id

Gets a warehouse by ID

* Query Parameters:
	+ id: string
* Response:
	+ 200 OK: Warehouse found
	+ 404 Not Found: Warehouse not found

### POST /api/warehouses

Creates a new warehouse

* Request Body:
	+ name: string
	+ capacity: number
	+ location: {
			type: 'Point',
			coordinates: [number, number]
		}
* Response:
	+ 201 Created: Warehouse created successfully
	+ 400 Bad Request: Invalid input

### PUT /api/warehouses?id

Updates a warehouse by ID

* Query Parameters:
	+ id: string
* Request Body:
	+ name: string
	+ capacity: number
	+ location: {
			type: 'Point',
			coordinates: [number, number]
		}
* Response:
	+ 200 OK: Warehouse updated successfully
	+ 404 Not Found: Warehouse not found

### DELETE /api/warehouses?id

Deletes a warehouse by ID

* Query Parameters:
	+ id: string
* Response:
	+ 204 No Content: Warehouse deleted successfully
	+ 404 Not Found: Warehouse not found
