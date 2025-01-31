import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
const TripCards = ({trip}) => {

    const [photoUrl, setPhotoUrl] = useState()

    useEffect(() => {
        trip && GetPlacePhoto();
    }, [trip])

    const GetPlacePhoto = async () => {
        const data = {
            textQuery: trip?.userSelection?.location?.label
        }
        // eslint-disable-next-line no-unused-vars
        const result = await GetPlaceDetails(data).then(res => {
            // console.log(res.data.places[0].photos[3].name);

            const photourl = PHOTO_REF_URL.replace('{NAME}', res.data.places[0].photos[3].name)
            setPhotoUrl(photourl);

        })
    }

  return (
    <Link to={"/view-trip/"+trip?.id}>
    <div className="rounded-md mt-5 cursor-pointer hover:scale-105 transition-all hover:shadow-md hover:shadow-slate-700">
      <img src={photoUrl ? photoUrl : "/placeholder.jpg"} className="object-cover w-full h-[180px] rounded-lg" />
      <div className="p-2">
        <h2 className="font-bold text-lg line-clamp-1">{trip?.userSelection?.location?.label}</h2>
        <h2 className="text-sm text-gray-500"><b>{trip?.userSelection?.noOfDays} </b>{trip?.userSelection?.noOfDays > 1 ? "Days" : "Day"} Trip with {trip?.userSelection?.budget} budget</h2>
      </div>
    </div>
    </Link>
  );
};

export default TripCards;