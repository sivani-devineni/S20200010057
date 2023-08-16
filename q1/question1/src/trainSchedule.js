import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TrainSchedule = () => {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    axios.get('/api/trains')
      .then(response => {
        setTrains(response.data);
      })
      .catch(error => {
        console.error('Error fetching train data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Train Schedule</h1>
      <ul>
        {trains.map(train => (
          <li key={train.trainNumber}>
            <h2>{train.trainName}</h2>
            <p>Train Number: {train.trainNumber}</p>
            {/* Display other train information */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainSchedule;