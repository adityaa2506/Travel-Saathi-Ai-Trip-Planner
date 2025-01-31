import { db } from '@/service/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';
import InfoSection from '../components/infoSection';
import Hotels from '../components/Hotels';
import TripPlace from '../components/TripPlace';

function viewTrip() {
  const {tripId} = useParams();
  const[trip,setTrip]=useState([]);
  useEffect(() => {
    tripId&&getTripData()
  }, [tripId])
  
  const getTripData=async()=>{
    const docRef = doc(db,'AITrips',tripId);
    const docSnap=await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("document:",docSnap.data());
      setTrip(docSnap.data());
    }
    else{
      console.log("no such data")
      toast("No such trip found")
    }

  }
  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56 '>
      {/* information section */}
          <InfoSection trip={trip} />
      {/* recommended hotels */}
          <Hotels trip={trip}/>
      {/* daily plan */}
          <TripPlace trip={trip} />
    </div>
  )
}

export default viewTrip