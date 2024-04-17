import React, { useState, useEffect } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import _ from 'lodash';

export default function Statistic() {
    const [xLabel, setXLabel] = useState([]);
    const [duration, setDuration] = useState([]);

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_TRAININGS);
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const data = await response.json();

                console.log('Trainings for statistic: ', data._embedded.trainings);

                const durations = _(data._embedded.trainings)
                    .groupBy(training => training.activity)
                    .map((value, key) => ({
                        activity: key,
                        duration: _.sumBy(value, 'duration')
                    }))
                    .value();

                console.log('durations data:', durations);

                setXLabel(durations.map(entry => entry.activity));
                setDuration(durations.map(entry => entry.duration));
            } catch (error) {
                console.error(error);
            }
        };

        fetchTrainings();
    }, []);

    const chartSetting = {
        yAxis: [{ label: 'Duration (min)', }]
    };

    return (
        <>
            <div style={{ width: '110%', height: '500px' }}>
                {xLabel.length === 0 ? (
                    <p>Loading...</p>
                ) : (
                    <BarChart
                        xAxis={[{ scaleType: 'band', data: xLabel }]}
                        // dataset={[{data: dataSeries}]}
                        series={[{ data: duration, label: 'Duration (min)', type: 'bar' }]}
                        {...chartSetting}
                    />
                )}
            </div>
        </>
    );

}
