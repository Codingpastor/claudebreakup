document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const outputPost = document.getElementById('outputPost');
    const copyBtn = document.getElementById('copyBtn'); // Get the copy button
    let breakupData = null;

    // Function to fetch and store breakup phrases
    async function loadBreakupData() {
        try {
            const response = await fetch('breakup.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            breakupData = await response.json();
            // Enable button only after data is loaded
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Breakup Post';
        } catch (error) {
            console.error("Could not load breakup data:", error);
            outputPost.value = "Error: Could not load breakup phrases. Please check console for details.";
            // Keep button disabled if data loading fails
            generateBtn.textContent = 'Error Loading Data';
        }
    }

    // Function to get a random element from an array
    function getRandomElement(arr) {
        if (!arr || arr.length === 0) {
            return "[Missing Data]"; // Fallback for empty/missing array
        }
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Function to generate the post
    function generatePost() {
        if (!breakupData) {
            return "Breakup data not loaded yet. Please wait or check for errors.";
        }

        const intro = getRandomElement(breakupData.introduction);
        const problem = getRandomElement(breakupData.problem);
        const decision = getRandomElement(breakupData.decision);
        const conclusion = getRandomElement(breakupData.conclusion);

        // Combine the parts into a post format
        return `${intro}\n\n${problem}\n\n${decision}\n\n${conclusion}`;
    }

    // Updated the displayPost function to remove emoji addition
    function displayPost() {
        if (breakupData) {
            const post = generatePost();
            outputPost.value = post; // Directly display the post without emojis
        } else {
            outputPost.value = "Still loading data or an error occurred. Please try again shortly.";
        }
    }

    // --- Initialization ---

    // Disable button initially until data is loaded
    generateBtn.disabled = true;
    generateBtn.textContent = 'Loading Data...';

    // Load the data when the script runs
    loadBreakupData();

    // Add event listener to the generate button
    generateBtn.addEventListener('click', displayPost);

    // Updated the copy button functionality to ensure it works reliably
    copyBtn.addEventListener('click', () => {
        const textToCopy = outputPost.value.trim(); // Ensure no empty or whitespace-only text
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Provide feedback to the user
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy Post';
                }, 2000); // Reset text after 2 seconds
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                alert('Failed to copy text. Please try again or copy manually.');
            });
        } else {
            alert('Nothing to copy yet. Generate a post first!');
        }
    });
});
