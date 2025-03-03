const fs = require('fs');
const { Collection, Item } = require('postman-collection');

// Load JSDoc JSON output
const jsdocData = JSON.parse(fs.readFileSync('api.json', 'utf-8'));

console.log("Extracted JSDoc Data:", JSON.stringify(jsdocData, null, 2));

// Create a new Postman Collection
const collection = new Collection({
    info: {
        name: "My API Collection",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: []
});

// Extract endpoints from JSDoc and add to Postman Collection
jsdocData.forEach(doc => {
    if (doc.kind === 'function' && doc.tags) {
        const apiTag = doc.tags.find(tag => tag.title === 'api');
        const apiNameTag = doc.tags.find(tag => tag.title === 'apiname');
        const paramTags = doc.tags.filter(tag => tag.title === 'apiparam');
        const headerTags = doc.tags.filter(tag => tag.title === 'apiheader');
        const successExample = doc.tags.find(tag => tag.title === 'apisuccessexample');

        if (apiTag) {
            // Extract method and route from @api {method} /route
            const match = apiTag.text.match(/\{(\w+)\}\s+([^ ]+)/);
            if (match) {
                const method = match[1].toUpperCase();
                let route = match[2].split(" ")[0]; // Remove description

                console.log(`Adding API: ${method} ${route}`);

                // Extract parameters (query/path)
                const queryParams = [];
                const pathParams = [];
                paramTags.forEach(param => {
                    const paramDetails = param.text.split(' ');
                    const paramName = (paramDetails[1] || '').replace(/\[|\]/g, '').trim(); // Remove []
                    const paramType = (paramDetails[0] || '').replace('{', '').replace('}', '');

                    if (route.includes(`:${paramName}`)) {
                        pathParams.push({
                            key: paramName,
                            type: paramType || 'string'
                        });
                    } else {
                        queryParams.push({
                            key: paramName,
                            value: '',
                            description: paramDetails.slice(2).join(' ')
                        });
                    }
                });

                // Extract headers (if any)
                const headers = headerTags.map(header => {
                    const headerParts = header.text.split(' ');
                    return {
                        key: headerParts[1] || '',
                        value: '',
                        description: headerParts.slice(2).join(' ')
                    };
                });

                // Extract success response example
                let successResponse = "";
                if (successExample) {
                    successResponse = successExample.text.split("\n").slice(1).join("\n"); // Remove @tag line
                }

                collection.items.add(new Item({
                    name: apiNameTag ? apiNameTag.text : route,
                    request: {
                        method: method,
                        url: {
                            raw: `{{baseUrl}}${route}`,
                            host: ['{{baseUrl}}'],
                            path: route.split('/'),
                            query: queryParams
                        },
                        header: headers,
                        body: {
                            mode: "raw",
                            raw: "{}",
                            options: {
                                raw: {
                                    language: "json"
                                }
                            }
                        }
                    },
                    response: successResponse ? [{
                        name: "Success Response",
                        status: "OK",
                        code: 200,
                        body: successResponse,
                        header: []
                    }] : []
                }));
            }
        }
    }
});

// Save as Postman Collection JSON
fs.writeFileSync('postman_collection.json', JSON.stringify(collection.toJSON(), null, 2));

console.log("✅ Postman Collection generated successfully: postman_collection.json");
