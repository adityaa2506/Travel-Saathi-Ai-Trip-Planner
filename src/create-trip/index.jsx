import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import {
    AI_PROMPT,
    SelectBudgetOptions,
    SelectTravelList,
} from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModal";
import { FcGoogle } from "react-icons/fc";
import { VscLoading } from "react-icons/vsc";
import { doc, setDoc } from "firebase/firestore";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
// import { setDoc } from 'firebase/firestore';
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";

function CreateTrip() {

    const navigate=useNavigate();
    const [place, setPlace] = useState();
    const [formData, setFormData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // if(name=='noOfDays' && value>5){
    //     console.log("Please enter days less than 5");
    //     return;
    // }

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: (error) => console.log(error),
    });

    const onGenerateTrip = async () => {
        const user = localStorage.getItem("user");
        if (!user) {
            setOpenDialog(true);
            return;
        }

        if (
            (formData?.noOfDays > 5 && !formData?.location) ||
            !formData.budget ||
            !formData.traveler
        ) {
            toast("Please fill all details");
            return;
        }
        setLoading(true);
        const FINAL_PROMPT = AI_PROMPT.replace(
            "{location}",
            formData?.location?.label
        )
            .replace("{totalDays}", formData?.noOfDays)
            .replace("{traveler}", formData.traveler)
            .replace("{budget}", formData.budget)
            .replace("{totalDays}", formData?.noOfDays);
        // console.log(FINAL_PROMPT);
        const result = await chatSession.sendMessage(FINAL_PROMPT);
        console.log("--", result?.response?.text());
        setLoading(false);
        SaveAiTrip(result?.response?.text());
    };
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    const SaveAiTrip = async (TripData) => {
        setLoading(true);
        await setDoc(doc(db, "AITrips", docId), {
            userSelection: formData,
            tripData: JSON.parse(TripData),
            userEmail: user?.email,
            id: docId,
        });
        setLoading(false);
        navigate('/view-trip/'+docId)
    };

    const GetUserProfile = (tokenInfo) => {
        axios
            .get(
                `https://www.googleapis.com/oauth2/v1/userinfo?acess_token=${tokenInfo.access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenInfo?.access_token}`,
                        Accept: "Application/Json",
                    },
                }
            )
            .then((resp) => {
                console.log(resp);
                localStorage.setItem("user", JSON.stringify(resp.data));
                setOpenDialog(false);
                onGenerateTrip();
            });
    };

    return (
        <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
            <h2 className="font-bold text-3xl">
                Tell us your travel preferences 🏕️🌴
            </h2>
            <p className="mt-3 text-gray-500 text-xl">
                Just provide some basic information, and our trip planner will generate
                a customized itinerary based on your preferences.
            </p>
            <div className="flex flex-col gap-8 mt-20">
                <div>
                    <h2 className="text-xl my-3 font-medium">
                        What is destination of choice?
                    </h2>
                    <GooglePlacesAutocomplete
                        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                        selectProps={{
                            place,
                            onChange: (v) => {
                                setPlace(v);
                                handleInputChange("location", v);
                            },
                        }}
                    />
                </div>
                <div>
                    <h2 className="text-xl my-3 font-medium ">
                        How many days are you planning your trip?
                    </h2>
                    <Input
                        className="border border-gray-300 block w-full p-1.5 rounded"
                        placeholder={"Ex. 3"}
                        type="number"
                        onChange={(e) => handleInputChange("noOfDays", e.target.value)}
                    />
                </div>
                <div>
                    <h2 className="text-xl my-3 font-medium ">What is Your Budget?</h2>
                    <div className="grid grid-cols-3 gap-5 mt-5 cursor-pointer">
                        {SelectBudgetOptions.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleInputChange("budget", item.title)}
                                className={`p-4 border rounded-3xl hover:shadow-lg  ${formData?.budget == item.title && "shadow-lg border-black"
                                    }`}
                            >
                                <h2 className="text-4xl">{item.icon}</h2>
                                <h2 className="text-[22px] font-bold">{item.title}</h2>
                                <h2 className="text-[15px] text-gray-500">{item.desc}</h2>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl my-3 font-medium ">
                        Who do you plan on traveling with on your next adventure?
                    </h2>
                    <div
                        className={`grid grid-cols-4 gap-4 mt-5 cursor-pointer
                        
                        `}
                    >
                        {SelectTravelList.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleInputChange("traveler", item.people)}
                                className={`p-4 border rounded-3xl hover:shadow-lg ${formData?.traveler == item.people && "shadow-lg border-black"
                                    }`}
                            >
                                <h2 className="text-4xl">{item.icon}</h2>
                                <h2 className="text-[22px] font-bold">{item.title}</h2>
                                <h2 className="text-[15px] text-gray-500">{item.desc}</h2>
                                <h2 className="text-[15px] text-gray-500">{item.people}</h2>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex my-10 justify-end">
                <Button
                    className="pl-10 pr-10 pt-5 pb-5"
                    disabled={loading}
                    onClick={onGenerateTrip}
                >
                    {loading ? (
                        <VscLoading className="h-7 w-7 animate-spin" />
                    ) : (
                        "Generate"
                    )}
                </Button>
            </div>
            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription>
                            <div class="flex items-center">
                                <img className="h-12 w-12 mr-4" src="./logo.png" alt="" />
                                <div class="text-gray-800 font-bold font-serif text-[25px]">
                                    Travel Saathi
                                </div>
                            </div>
                            <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
                            <p>sign In TO tThe App With Google Authentication Securely</p>
                            <Button
                                onClick={login}
                                className="w-full mt-5 flex gap-4 items-center"
                            >
                                <FcGoogle className="h-11 w-11" /> Sign In as Google
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CreateTrip;
