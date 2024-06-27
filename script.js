document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');

    fetch('/news')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Receive response as text (HTML)
        })
        .then(data => {
            console.log('Received HTML data:', data); // Log the received HTML for debugging
            newsContainer.innerHTML = data;
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            newsContainer.innerHTML = '<p>Error fetching news. Please try again later.</p>';
        });
});
