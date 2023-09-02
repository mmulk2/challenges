import React, { useEffect,useState } from 'react';

// Script to select elements with class "ramp" and retrieve their values
const rampScript = `
  const elements = document.querySelectorAll('code.ramp div.ramp span.ramp i.ramp.char');
  const charValues = Array.from(elements).map((element) =>
    element.getAttribute('value')
  );
  const joinedValue = charValues.join('');
  console.log(joinedValue);
`;

const FlagTypewriter = ({ flag }) => {
  const [displayedFlag, setDisplayedFlag] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (index < flag.length) {
        setDisplayedFlag((prevFlag) => [...prevFlag, flag[index]]);
        setIndex((prevIndex) => prevIndex + 1);
      } else {
        // Stop the typewriter effect
        clearInterval(interval); 
      }
    }, 500);
    // Cleanup on unmount
    return () => clearInterval(interval); 
  }, [flag, index]);

  return (
    <ul>
      {displayedFlag.map((char, idx) => (
        <li key={idx}>{char}</li>
      ))}
    </ul>
  );
};

// Function to fetch the flag from the URL
const fetchFlag = async () => {
  try {
    const response = await fetch('https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/776173');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error loading the flag:', error);
    throw error;
  }
};

function App() {
  const [flag, setFlag] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Show "Loading..." while the request is ongoing
        setLoading(true);
  
        // Fetch the flag
        const data = await fetchFlag();
        setFlag(data);
        setLoading(false); // Set loading to false when the request is complete
  
        // Execute the rampScript
        try {
          eval(rampScript);
        } catch (error) {
          console.error('Error executing rampScript:', error);
        }
      } catch (error) {
        console.error('Error loading the flag:', error);
        setLoading(false); // Set loading to false on error as well
      }
    };
  
    fetchData();
  }, []);

  return (
    <div>
      <h1>Flag:</h1>
      {loading ? (
        <p>Loading...</p>
      ) : flag ? (
        <>
          <pre>
            {/* Include the script comment here */}
            {rampScript}
          </pre>
          <FlagTypewriter flag={flag} />
        </>
      ) : (
        <p>Error loading flag</p>
      )}
    </div>
  );
}

export default App;
