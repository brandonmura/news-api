document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');

    fetch('/news')
        .then(response => response.json())
        .then(data => {
            data.forEach(article => {
                const newsItem = document.createElement('div');
                newsItem.classList.add('article'); // Use 'article' class for styling

                const newsTitle = document.createElement('h2');
                newsTitle.textContent = article.title;

                const newsSource = document.createElement('p');
                newsSource.textContent = `Source: ${article.source.name}`;

                const newsAuthor = document.createElement('p');
                newsAuthor.textContent = `Author: ${article.author || 'N/A'}`;

                const newsPublishedAt = document.createElement('p');
                newsPublishedAt.textContent = `Published At: ${new Date(article.publishedAt).toLocaleString()}`;

                const newsDescription = document.createElement('p');
                newsDescription.textContent = article.description;

                const newsLink = document.createElement('a');
                newsLink.className = 'button'; // Style as button
                newsLink.href = article.url;
                newsLink.textContent = 'Read more';
                newsLink.target = '_blank';

                // Append elements to newsItem
                newsItem.appendChild(newsTitle);
                newsItem.appendChild(newsSource);
                newsItem.appendChild(newsAuthor);
                newsItem.appendChild(newsPublishedAt);
                newsItem.appendChild(newsDescription);
                newsItem.appendChild(newsLink);

                // Append newsItem to newsContainer
                newsContainer.appendChild(newsItem);
            });
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            newsContainer.innerHTML = '<p>Error fetching news. Please try again later.</p>';
        });
});
