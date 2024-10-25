import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';

const timeZones = moment.tz.names();
// .filter(
//     (timezone) => timezone === 'Asia/Kolkata' || timezone.toLowerCase().includes('kolkata')
//   );
timeZones.push('Asia/Kolkata');

function Chat() {
    const [currentTime, setCurrentTime] = useState(moment());
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(moment());
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    const [selectedTimezone, setSelectedTimezone] = useState('');
  const [timezoneList, setTimezoneList] = useState([]);

  // Function to get the current time in a specific timezone
//   const getCurrentTime = (timezone) => {
//     return {
//         time:moment().tz(timezone).format('hh:mm A'),
//         date: moment().tz(timezone).format('dddd, MMMM Do YYYY')
//     }
//   };

  // Function to handle the Add button click
  const handleAddTimezone = () => {
    if (selectedTimezone && !timezoneList.find(tz => tz.name === selectedTimezone)) {
        setTimezoneList([...timezoneList, {
            name: selectedTimezone,
            time: moment().tz(selectedTimezone).format('hh:mm A'),
            date: moment().tz(selectedTimezone).format('dddd, MMMM Do YYYY')
            }
        ]);
        console.log('sdf', timezoneList);
    }
    setSelectedTimezone([]);
  };
    const handleRemoveTimezone = (index) => {
        timezoneList.splice(index, 1);
        // setTimezoneList(timezoneList.filter((tz) => tz.name !== name));
    };
    useEffect(() => {
        const interval = setInterval(() => {
          setTimezoneList((prevList) =>
            prevList.map((tz) => ({ ...tz,
                date: moment().tz(tz.name).format('dddd, MMMM Do YYYY'),
                time: moment().tz(tz.name).format('hh:mm A'),
            }))
          );
        }, 1000);
    
        return () => clearInterval(interval);
      }, [timezoneList]);
    return (
        <div>
            <div style={{ width: 300, textAlign: 'center', margin: '0 auto' }}>
                <div strong style={{ fontSize: '24px' }}>
                    {currentTime.format('hh:mm A')}
                </div>
                <br />
                <div type="secondary">
                    {currentTime.format('dddd, MMMM Do YYYY')}
                </div>
            </div>
            <select id="timezone" value={selectedTimezone} onChange={(e) => setSelectedTimezone(e.target.value)}>
                <option value="">Select a timezone...</option>
                {timeZones.map((timezone, index) => (
                <option key={index} value={timezone}>
                    {timezone}
                </option>
                ))}
            </select>
            <button onClick={handleAddTimezone} disabled={!selectedTimezone}>
                Add Timezone
            </button>
            {timezoneList.length > 0 && (
                <div>
                <h3>Selected Timezones:</h3>
                <ul>
                    {timezoneList.map((tz, index) => (
                    <div style={{ width: 300, textAlign: 'center', margin: '0 auto' }} key={index}>
                        <div onClick={() => handleRemoveTimezone(index)}>
                            X
                        </div>
                        <div strong style={{ fontSize: '24px' }}>
                            {tz.time}
                        </div>
                        <br />
                        <div type="secondary">
                            {tz.date}
                        </div>
                    </div>
                    // <li key={index}>
                    //     {tz.date}: {tz.time}
                    // </li>
                    ))}
                </ul>
                </div>
            )}
            
        </div>
    )
}

export default Chat;