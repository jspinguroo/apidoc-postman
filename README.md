# apidoc-postman
apidoc.js --> postman collection pipeline

# API Documentation to Postman Collection Generator

This script, `generatePostman.js`, converts **API documentation** into a **Postman collection**, making it easy to import API definitions into Postman for testing and development.

## Features
- Parses structured API documentation
- Generates a **Postman Collection (v2.1)** JSON file
- Supports dynamic request parameters and headers
- Easy-to-use CLI tool

## Installation
### Prerequisites
Ensure you have **Node.js (v14+)** installed.

### Clone the Repository
```sh
git clone https://github.com/jspinguroo/apidoc-postman.git
cd apidoc-postman
```

### Install Dependencies
```sh
npm install
```

## Usage
### Generate a Postman Collection
Run the script with an API documentation JSON file:
```sh
node generatePostman.js path/to/api-doc.json output/postman-collection.json
```

### Example
```sh
node generatePostman.js ./api-doc.json ./postman-collection.json
```

This will generate a `postman-collection.json` file that can be imported into Postman.

## Importing into Postman
1. Open Postman.
2. Click on **Import** (top left corner).
3. Select **File**, then choose the generated `postman-collection.json` file.
4. Click **Import** to load the API requests into Postman.

## Contributing
1. Fork the repository.
2. Create a new feature branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to your branch (`git push origin feature-branch`).
5. Submit a **Pull Request**.

## License
[MIT](LICENSE)

## Contact
For support and inquiries, reach out at [jon.k.spindler@gurooit.com](mailto:jon.k.spindler@gurooit.com).
