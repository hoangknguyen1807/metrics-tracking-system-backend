// insert-distance-metrics.js
import fetch from 'node-fetch';

// Base URL of your API
const API_URL = 'http://localhost:3000/metrics/distance';

// Initial request body
const initialBody = {
  userId: 'user123',
  date: '2025-02-15T14:30:00Z',
  value: 170.5,
  type: 'DISTANCE',
  unit: 'CENTIMETER',
};

// Function to insert metrics
async function insertMetrics() {
  let currentDate = new Date(initialBody.date);
  let currentValue = initialBody.value;

  console.log('Starting to insert 60 distance metrics...');

  for (let i = 0; i < 60; i++) {
    // Create the request body for this iteration
    const requestBody = {
      ...initialBody,
      date: currentDate.toISOString(),
      value: currentValue,
    };

    try {
      // Make the POST request
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(
        `Inserted metric #${i + 1}: ${currentDate.toISOString()} - ${currentValue} cm`,
      );

      // Update values for next iteration
      // Add 12 hours (12 * 60 * 60 * 1000 milliseconds) to current date
      currentDate = new Date(currentDate.getTime() + 12 * 60 * 60 * 1000);
      // Increase value by 0.5
      currentValue += 0.5;
    } catch (error) {
      console.error(`Error inserting metric #${i + 1}:`, error);
    }

    // Optional: Add a small delay between requests to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log('Finished inserting distance metrics.');
}

// Run the function
insertMetrics().catch((error) => {
  console.error('Fatal error:', error);
});
