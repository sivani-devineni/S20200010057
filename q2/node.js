
const http = require('http');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url.startsWith('/numbers')) {
        const queryParams = querystring.parse(req.url.split('?')[1]);
        const urls = Array.isArray(queryParams.url) ? queryParams.url : [queryParams.url];

        const fetchNumbers = (url) => {
            return new Promise((resolve, reject) => {
                http.get(url, { timeout: 5000 }, (response) => {
                    let data = '';
                    response.on('data', (chunk) => {
                        data += chunk;
                    });
                    response.on('end', () => {
                        try {
                            const jsonData = JSON.parse(data);
                            resolve(jsonData.numbers || []);
                        } catch (error) {
                            resolve([]);
                        }
                    });
                }).on('error', (error) => {
                    resolve([]);
                });
            });
        };

        const mergeUniqueNumbers = (arrays) => {
            const allNumbers = arrays.reduce((acc, array) => acc.concat(array), []);
            const uniqueNumbers = Array.from(new Set(allNumbers));
            return uniqueNumbers.sort((a, b) => a - b);
        };

        const fetchPromises = urls.map(fetchNumbers);

        Promise.all(fetchPromises)
            .then((results) => {
                const mergedNumbers = mergeUniqueNumbers(results);
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ numbers: mergedNumbers }));
            })
            .catch((error) => {
                res.statusCode = 500;
                res.end();
            });
    } else {
        res.statusCode = 404;
        res.end();
    }
});

server.listen(3000, 'localhost', () => {
    console.log('Server is running on http://localhost:3000');
});