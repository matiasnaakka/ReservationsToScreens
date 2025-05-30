
/**
 * Function to perform a fetch request and return the response data.
 * @param {string} url - The URL to fetch.
 * @param {Object} [options={}] - The options for the fetch request.
 * @returns {Promise<any>} The response data.
 * @throws {Error} If the URL is not provided, the fetch fails, or the response status is not ok.
 */
const doFetch = async (url, options = {}) => {
  // Check if the URL is provided
  if (!url) {
    throw new Error('URL is required');
  }

  let response;
  try {
    // Perform the fetch request
    response = await fetch( url, options );

  } catch (error) {
    // Log and rethrow any errors
    console.error(`Fetch failed: ${error.message}`);
    throw error;
  }

  // Check if the response status is ok
  if (!response.ok) {
    const errorText = `HTTP error! status: ${response.status}`;
    console.error(errorText);
    throw new Error(errorText);
  }

  let data;
  try {
    // Parse the response data as JSON
    data = await response.json();
  } catch (error) {
    // Log and rethrow any errors
    console.error(`Failed to parse response as JSON: ${error.message}`);
    throw error;
  }

  // Return the response data
  return data;
};

export default doFetch;
