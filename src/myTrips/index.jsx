/* eslint-disable react/jsx-key */
import Header from "@/components/custom/Header";
import { db } from "@/service/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TripCards from "./components/CardItem";

const MyTrips = () => {

    const navigate = useNavigate()
    const [userTrips, setUserTrips] = useState([])

    const getUserTrips = async () => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (!user) {
            navigate("/")
            return;
        }
        const q = query(collection(db, "AITrips"), where("userEmail", "==", user?.email));
        const querySnapshot = await getDocs(q);
        setUserTrips([])
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            setUserTrips(preVal => [...preVal, doc.data()])
        });

    }

    useEffect(() => {
        getUserTrips()
    }, [])


    return (
        <>
            {/* <Header /> */}
            <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 mb-5">
                <h1 className="font-bold text-3xl">My Trips</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                    {
                        userTrips.map((trip, index) => (
                            <TripCards trip={trip} key={index} />
                        ))
                    }
                </div>
            </div>
        </>
    );
};

export default MyTrips;