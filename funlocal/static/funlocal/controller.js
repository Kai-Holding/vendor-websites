// Fetch data from XanoDatabase
async function fetchDataFromXano(id) {
    let url = 'https://x8ki-letl-twmt.n7.xano.io/api:JpiZp5ux/landing_page?businessId=' + id;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers you need here
            },
        });

        // Check if the request was successful
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the JSON response
        const data = await response.json();

        // Assign the data to the global variable
        //xanoData = toBarInfoModel(JSON.stringify(data));
        //console.log(xanoData.barInfo[0]); // Use the fetched data here 
        
        return toLandingPageModel(JSON.stringify(data))[0];

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}













  
  
