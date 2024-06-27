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
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}&pageSize=${pageSize}&page=${page}${query ? `&q=${query}` : ''}`;

    try {
        const response = await axios.get(apiUrl);
        articles = response.data.articles;
        totalArticles = response.data.totalResults;
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw error;
    }
};

// Initial fetch on server start
fetchArticles(currentPage);

// Serve style.css
app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'style.css'));
});

// Handle news route
app.get('/news', async (req, res) => {
    const query = req.query.q || '';
    const page = parseInt(req.query.page) || 1;

    try {
        await fetchArticles(page, query);

        let newsHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Latest News</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <a href="/news" class="home-button">Home</a>
            <div class="search-bar">
                <form method="GET" action="/news">
                    <input type="text" name="q" placeholder="Search for news..." value="${query}" />
                    <button type="submit">Search</button>
                </form>
            </div>
            <h1 class="news-title">Latest News</h1>
            <div class="articles">`;

        articles.forEach(article => {
            newsHTML += `
            <div class="article">
                <h2>${article.title}</h2>
                <p><strong>Source:</strong> ${article.source.name}</p>
                <p><strong>Author:</strong> ${article.author || 'N/A'}</p>
                <p><strong>Published At:</strong> ${new Date(article.publishedAt).toLocaleString()}</p>
                <p><strong>Description:</strong> ${article.description}</p>`;
            if (article.urlToImage) {
                newsHTML += `<img src="${article.urlToImage}" alt="Article Image">`;
            }
            newsHTML += `<a href="${article.url}" target="_blank" class="button">Read more</a>
            </div>`;
        });

        newsHTML += `
            </div>
            <div class="footer">
                <a href="/news?page=${page > 1 ? page - 1 : 1}&q=${query}" class="button">Previous Page</a>
                <a href="/news?page=${page + 1}&q=${query}" class="button">Next Page</a>
                <a href="/" class="home-button">Home</a>
            </div>
        </body>
        </html>`;

        res.send(newsHTML);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).send('Error fetching news');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
