const http = require('http');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url.startsWith('/numbers')) {
        const queryParams = querystring.parse(req.url.split('?')[1]);
        const urls = queryParams.url || [];

        const fetchNumbers = async (url) => {
            try {
                const response = await fetch(url, { timeout: 5000 });
                if (response.ok) {
                    const data = await response.json();
                    return data.numbers || [];
                }
            } catch (error) {
                // Handle fetch error or timeout
            }
            return [];
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