document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
  
    fetch('/news')
      .then(response => response.json())
      .then(data => {
        data.articles.forEach(article => {
          const newsItem = document.createElement('div');
          newsItem.className = 'news-item';
  
          const newsTitle = document.createElement('h2');
          newsTitle.className = 'news-title';
          newsTitle.textContent = article.title;
  
          const newsDescription = document.createElement('p');
          newsDescription.className = 'news-description';
          newsDescription.textContent = article.description;
  
          const newsLink = document.createElement('a');
          newsLink.className = 'news-link';
          newsLink.href = article.url;
          newsLink.textContent = 'Read more';
          newsLink.target = '_blank';
  
          newsItem.appendChild(newsTitle);
          newsItem.appendChild(newsDescription);
          newsItem.appendChild(newsLink);
  
          newsContainer.appendChild(newsItem);
        });
      })
      .catch(error => {
        console.error('Error fetching news:', error);
      });
  });
  