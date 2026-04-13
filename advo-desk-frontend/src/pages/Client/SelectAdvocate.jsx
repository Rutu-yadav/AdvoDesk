import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../services/api";
import requestService from "../../services/RequestService";
import { useAuth } from "../../context/AuthContext";

const SelectAdvocate = () => {
  const { user } = useAuth();
  const [advocates, setAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdvocates();
  }, []);

  const loadAdvocates = async () => {
    try {
      const res = await api.get("/advocates");
      setAdvocates(res.data);
    } catch (err) {
      console.error("Error loading advocates", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (advocateId) => {
    try {
      await requestService.sendRequest(user.id, advocateId);
      alert("Request sent successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to send request ❌");
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <>
      <Navbar />

      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Select Advocate</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advocates.map((adv) => (
            <div key={adv.id} className="card shadow-lg p-4">
              <h2 className="text-xl font-semibold">{adv.fullName}</h2>
              <p>Email: {adv.email}</p>
              <p>Phone: {adv.phone}</p>

              <button
                onClick={() => handleSelect(adv.id)}
                className="btn-primary mt-4"
              >
                Select Advocate
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SelectAdvocate;