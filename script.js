document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');

    fetch('/news')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Receive response as text (HTML)
        })
        .then(data => {
            // Set the received HTML as innerHTML of newsContainer
            newsContainer.innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            newsContainer.innerHTML = '<p>Error fetching news. Please try again later.</p>';
        });
});
