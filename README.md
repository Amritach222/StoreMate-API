# The StoreMate

## Description

- This is an Inventory Management System with intergrated Point of Sale (POS) system. This system targets shop owners/ retailers who intent to keep track of their inventory as well as sales from their multiple shops that they own.

## Features

- Inventory tracking: Track and record inventory levels accurately, including quantities, locations, and status.
- Stock replenishment: Generate purchase orders or replenishment requests based on predefined reorder points or minimum stock levels.
- Order management: Process customer orders, including order placement, tracking, and fulfillment.
- Barcode/RFID scanning: Support barcode or RFID scanning capabilities for efficient inventory updates and item tracking.
- Stock movement and transfers: Record and track stock movements, transfers between locations, returns, and adjustments.
- Real-time inventory visibility: Provide real-time visibility into current inventory levels for quick stock availability checks.
- Product categorization and classification: Support product categorization and classification for better organization and searchability.
- Batch and serial number tracking: Track and manage inventory based on batch numbers or serial numbers for traceability.
- Supplier management: Maintain a supplier database with information, pricing, and lead times for efficient procurement.
- Reporting and analytics: Generate reports and provide analytics on inventory levels, stock movements, and sales trends.
- Integration with other systems: Integrate with other systems such as POS, e-commerce platforms, and accounting software.
- User access controls: Provide user access controls and permissions for secure and authorized actions.
- Alerts and notifications: Send automated alerts and notifications for critical events such as low stock levels or order delays.
- Mobile access: Support mobile-friendly interface or dedicated mobile app for on-the-go inventory management.
- Multi-location support: Manage inventory across multiple warehouses or storage locations.

### System Requirements

- To run the Inventory Management System, the following minimum hardware and software requirements should be met:

#### Hardware Requirements

- Processor: Intel Core i5 or equivalent
- Memory: 8GB RAM or higher
- Storage: Minimum 100GB of free disk space
- Network: Stable internet connection

#### Software Requirements

- Operating System: Windows 10, macOS Mojave (10.14) or later, or a modern Linux distribution (e.g., Ubuntu 18.04 LTS)
- Web Server: Node.js (version 12 or later)
- Database: MySQL (version 5.7 or later)
- Browser: Google Chrome (latest version), Mozilla Firefox (latest version), or Safari (latest version)

### API Documentation

- The Inventory Management System provides a RESTful API that allows developers to interact with the system programmatically. Below is the documentation for the available endpoints, request/response formats, and authentication/authorization mechanisms.

#### Base URL

- The base URL for the API is: https://api.inventorysystem.com

### Authentication

- The API uses token-based authentication. To access the API endpoints, include an Authorization header in your requests with a valid API token.

- Example:

```
Authorization: Bearer your_api_token
```

### Endpoints

- `GET /api/products`
- Description: Retrieve a list of products.
- Request: GET /api/products
- Response: Array of products in JSON format.
- Example Response:

```
[
  {
    "id": 1,
    "name": "Product 1",
    "quantity": 10,
    "price": 19.99
  },
  {
    "id": 2,
    "name": "Product 2",
    "quantity": 5,
    "price": 29.99
  }
]
```

- `POST /api/products`

  - Description: Create a new product.
  - Request: POST /api/products
  - Request Body: Product object in JSON format.
  - Response: Newly created product in JSON format.

- Example Request Body:

```
{
  "name": "New Product",
  "quantity": 15,
  "price": 49.99
}
```

- Example Response:

```
{
  "id": 3,
  "name": "New Product",
  "quantity": 15,
  "price": 49.99
}
```

## How to Run StoreMate (For Developers)

### Installation

1. Clone the repository:
   `git clone git@github.com:makaubenson/StoreMate-API.git`
2. Install the necessary dependencies:

```
cd StoreMate-API
npm install
```

3. Edit the `config.env` file and replace the credentials with your own. e.g database connection
4. Start the application:
5. Access the application in your browser at `http://localhost:3000`.

### Technologies Used

- Programming Language: [JavaScript]
- Backend Framework: [Node.js]
- Frontend Framework: [React]
- Database: [MongoDB]
- Additional Libraries and Tools: [Express.js, Bootstrap]

## Contributing

Contributions to the Inventory Management System are welcome! If you find any bugs or have suggestions for new features, please open an issue or submit a pull request.

## License

This project is licensed under the [GNU GENERAL PUBLIC LICENSE](LICENSE).
