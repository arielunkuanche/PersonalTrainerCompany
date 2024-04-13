import React, { useState, useEffect} from "react";
import { BarChart } from '@mui/x-charts/BarChart';

export default function Statistic(){
    // const [trainings, setTrainings] = useState([]); 
    const [xLabel, setXLabel] = useState([]);
    const [dataSeries, setDataSeries] = useState([]);

    useEffect(() => fetchTrainings(), [])

    const fetchTrainings = () => {
        fetch(import.meta.env.VITE_API_TRAININGS)
        .then (response => {
            if (!response.ok)
                throw new Error(response.statusText);
            return response.json();
        })
        .then(data => {
            console.log('Trainings for statistic: ', data._embedded.trainings);
            // setTrainings(data._embedded.trainings);

            const activities = data._embedded.trainings.map(training => training.activity);
            console.log('activities data:', activities);
        
            //extract activities and duration
            const durations = data._embedded.trainings.map(training => parseInt(training.duration));
            console.log('duration data:', durations);

            // update state
            setXLabel(activities);
            setDataSeries(durations);

        })
        .catch(error => console.error(error))
    }

    const chartSetting = {
        yAxis: [{label: 'Duration (min)',}]
    };

    return (
        <>
            <div style={{width:'108%', height: '500px'}}>
                <BarChart
                    xAxis={[ { scaleType: 'band', data: xLabel} ]}
                    dataset={[{data: dataSeries}]}
                    series={[{ dataKey: 'data', label: 'Duration (min)'}]}
                    {...chartSetting}
            />
            </div>
        </>       
    );

}