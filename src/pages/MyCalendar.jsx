import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function MyCalendar(){
    const [events, setEvents] = useState([]);

    useEffect(() => 
        fetchEvents(), []);

    const fetchEvents = ()=>{
        fetch(import.meta.env.VITE_API_TRAININGS)
        .then (response => {
            if (!response.ok)
                throw new Error(response.statusText);
            return response.json();
        })
        .then(data => {
            console.log('event data ', data._embedded.trainings);
            const events = data._embedded.trainings.map(training => {
                const startDate = new Date(training.date);
                const endDate = new Date(startDate.getTime() + training.duration * 60000);
                return {
                    start: startDate,
                    end: endDate,
                    title: training.activity
                };
            });
            console.log('here are events:', events);
            setEvents(events);
        })
        .catch(error => console.error('Error fetching events:', error))
    };


    return(
    <>
        <h1>Training schedules</h1>
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
        >
        </Calendar>
    </>
    
    )
}