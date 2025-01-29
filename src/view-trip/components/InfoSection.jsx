import React from 'react'

function InfoSection({ trip }) {
    return (
        <div >
            <img src="/placeholder.jpg" className='h-[340px] w-full object-cover rounded-xl' />
            <div className='my-5 flex flex-col gap-2'>
                <h2 className='font-bold text-2xl'>{trip?.userSelection?.location.label}</h2>
                <div className='flex gap-5'>
                    <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>🗓️ {trip?.userSelection?.totalDays} Day</h2>
                    <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>👩‍👧‍👦 Number of Traveler : {trip?.userSelection?.traveler} People</h2>
                    <h2 className='bg-gray-200 font-medium text-gray-600 rounded-full p-1 px-4 md:text-md'>💵 {trip?.userSelection?.budget} Budget </h2>
                </div>
            </div>
        </div>
    )
}

export default InfoSection