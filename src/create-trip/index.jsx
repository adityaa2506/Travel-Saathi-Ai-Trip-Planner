import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/Components/ui/input";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelList,
} from "@/constants/options";
import { Button } from "@/Components/ui/button";
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
} from "@/Components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const navigate = useNavigate();
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
    const result = await chatSession.sendMessage(FINAL_PROMPT);
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
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        onGenerateTrip();
      });
  };

  return (
    <div className="travel-container">
      {/* Animated Background Elements */}
      <div className="sky-gradient"></div>


      {/* Form Content */}
      <div className="form-content">
        <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10 pt-3 pb-3">
          <h2 className="font-bold text-3xl">
            Tell us your travel preferences 🏕️🌴
          </h2>
          <p className="mt-3 text-gray-500 text-xl">
            Just provide some basic information, and our trip planner will generate
            a Customized itinerary based on your preferences.
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
              <h2 className="text-xl my-3 font-medium">
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
              <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
              <div className="grid grid-cols-3 gap-5 mt-5 cursor-pointer">
                {SelectBudgetOptions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange("budget", item.title)}
                    className={`p-4 border rounded-3xl hover:shadow-lg ${formData?.budget === item.title && "shadow-lg border-black"}`}
                  >
                    <h2 className="text-4xl">{item.icon}</h2>
                    <h2 className="text-[22px] font-bold">{item.title}</h2>
                    <h2 className="text-[15px] text-gray-500">{item.desc}</h2>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl my-3 font-medium">
                Who do you plan on traveling with?
              </h2>
              <div className="grid grid-cols-4 gap-4 mt-5 cursor-pointer">
                {SelectTravelList.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange("traveler", item.people)}
                    className={`p-4 border rounded-3xl hover:shadow-lg ${formData?.traveler === item.people && "shadow-lg border-black"}`}
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
        </div>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <div className="flex items-center">
                <img className="h-12 w-12 mr-4" src="./logo.png" alt="" />
                <div className="text-gray-800 font-bold font-serif text-[25px]">
                  Travel Saathi
                </div>
              </div>
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              <p>Sign in to the app with Google Authentication securely</p>
              <Button
                onClick={login}
                className="w-full mt-5 flex gap-4 items-center"
              >
                <FcGoogle className="h-11 w-11" /> Sign In with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <style>{`
        .travel-container {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }

        .sky-gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, #87CEEB 0%, #E0F6FF 100%);
          z-index: 1;
        }

        .moving-road {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100px;
          background: #555;
          z-index: 2;
          animation: roadMove 1s linear infinite;
        }

        @keyframes roadMove {
          from { background-position: 0 0; }
          to { background-position: 100px 0; }
        }

        .animated-car {
          position: absolute;
          bottom: 80px;
          left: -100px;
          font-size: 3rem;
          z-index: 3;
          animation: carDrive 8s linear infinite;
        }

        @keyframes carDrive {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200vw); }
        }

        .animated-clouds {
          position: absolute;
          top: 50px;
          left: -200px;
          width: 100%;
          height: 100px;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%23ffffff" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>');
          opacity: 0.8;
          animation: cloudsMove 20s linear infinite;
        }

        @keyframes cloudsMove {
          from { transform: translateX(-100%); }
          to { transform: translateX(100%); }
        }

        .form-content {
          position: relative;
          z-index: 4;
          background: rgba(255, 255, 255, 0.9);
          margin: 2rem auto;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
          width: 100%;
          max-width: 1500px;
        }
      `}</style>
    </div>
  );
}

export default CreateTrip;