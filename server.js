const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const pageSize = 10; // Number of articles per page
let currentPage = 1; // Initial page
let totalArticles = 0; // Total number of articles (will be updated on each API call)
let articles = []; // Array to hold fetched articles

// Function to fetch articles
const fetchArticles = async (page = 1, query = '') => {
    let articles = []; // Initialize inside the function scope

    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}&pageSize=${pageSize}&page=${page}${query ? `&q=${query}` : ''}`;

    try {
        const response = await axios.get(apiUrl);
        articles = response.data.articles;
        totalArticles = response.data.totalResults;
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }

    return articles; // Return fetched articles
};

// Initial fetch on server start
fetchArticles(currentPage)
    .then(articles => {
        console.log(`Fetched ${articles.length} articles on server start.`);
    })
    .catch(error => {
        console.error('Error fetching articles on server start:', error);
    });

// Serve style.css
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

// Handle index route
app.get('/', async (req, res) => {
    const query = req.query.q || ''; // Get query string for search
    const page = parseInt(req.query.page) || 1; // Get page number

    try {
        const articles = await fetchArticles(page, query);

        let indexHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Latest News</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="header">
                <a href="/" class="home-button">Home</a>
                <div class="search-bar">
                    <form method="GET" action="/">
                        <input type="text" name="q" placeholder="Search for news..." value="${query}" />
                        <button type="submit">Search</button>
                    </form>
                </div>
            </div>
            <h1 class="news-title">Latest News</h1>
            <div class="articles">`;

        articles.forEach(article => {
            indexHTML += `
            <div class="article">
                <h2>${article.title}</h2>
                <p><strong>Source:</strong> ${article.source.name}</p>
                <p><strong>Author:</strong> ${article.author || 'N/A'}</p>
                <p><strong>Published At:</strong> ${new Date(article.publishedAt).toLocaleString()}</p>
                <p><strong>Description:</strong> ${article.description}</p>`;
            if (article.urlToImage) {
                indexHTML += `<img src="${article.urlToImage}" alt="Article Image">`;
            }
            indexHTML += `<a href="${article.url}" target="_blank" class="button">Read more</a>
            </div>`;
        });

        indexHTML += `
            </div>
            <div class="footer">
                <a href="/?page=${page > 1 ? page - 1 : 1}&q=${query}" class="button ${page === 1 ? 'disabled' : ''}">Previous Page</a>
                <a href="/?page=${page + 1}&q=${query}" class="button ${page * pageSize >= totalArticles ? 'disabled' : ''}">Next Page</a>
            </div>
        </body>
        </html>`;

        res.send(indexHTML);
    } catch (error) {
        console.error('Error fetching articles for index:', error);
        res.status(500).send('Error fetching articles for index');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
