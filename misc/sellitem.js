const sellItem = (itemName, quantity) => {
  const sellEndpoint = 'https://event-dev.blacket.org/api/sell';

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Origin': 'https://event-dev.blacket.org',
      'Referer': 'https://event-dev.blacket.org/stats',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    },
    body: JSON.stringify({ treasure: itemName, quantity: quantity || 1 }), // Added quantity property with default value of 1
  };

  fetch(sellEndpoint, requestOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Request failed');
      }
    })
    .then(data => {
      console.log('Sell Item Response:', data);
    })
    .catch(error => {
      console.log('Sell Item Error:', error.message);
    });
};

// Usage example:
sellItem('Sea Shell Fossil', 1);