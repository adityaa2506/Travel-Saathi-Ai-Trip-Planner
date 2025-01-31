import { GetPlaceDetails } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';

function InfoSection({ trip }) {
    const [placePhoto, setPlacePhoto] = useState('/placeholder.jpg'); // State to hold the place photo URL

    const getPlacePhoto = async () => { 
        const data = {
            textQuery: trip?.userSelection?.location.label
        };
        try {
            const result = await GetPlaceDetails(data);
            console.log(result.data);
            // Assuming result.data contains the URL of the place photo
            if (result.data && result.data.photoUrl) {
                setPlacePhoto(result.data.photoUrl); // Update state with the fetched photo URL
            }
        } catch (error) {
            console.error("Error fetching place details:", error);
        }
    };

    useEffect(() => {
        if (trip?.userSelection?.location.label) {
            getPlacePhoto(); // Call the function to fetch place photo when the trip changes
        }
    }, [trip]);

    return (
        <div>
            <img src={placePhoto} className='h-[340px] w-full object-cover rounded-xl' alt={trip?.userSelection?.location.label} />
            <div className='my-5 flex flex-col gap-2'>
                <h2 className='font-bold text-2xl'>{trip?.userSelection?.location.label}</h2>
                <div className='flex gap-5'>
                    <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>🗓️ {trip?.userSelection?.totalDays} Day</h2>
                    <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>👩‍👧‍👦 Number of Travelers: {trip?.userSelection?.traveler} People</h2>
                    <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>💵 {trip?.userSelection?.budget} Budget</h2>
                </div>
            </div>
        </div>
    );
}

export default InfoSection;