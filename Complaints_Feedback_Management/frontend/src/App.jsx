import { useState } from "react";
import axios from "axios";
import FeedbackList from "./pages/FeedbackList";
import ThankYouModal from "./components/ThankYouModal";
import { Routes, Route, Link } from "react-router-dom";
import ComplaintForm from "./pages/ComplaintForm";
import ComplaintHistory from "./pages/ComplaintHistory";

// Feedback Form Component
function FeedbackForm({
  fullName,
  setFullName,
  email,
  setEmail,
  message,
  setMessage,
  rating,
  setRating,
  submitFeedback,
  setView,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-2">
            <div className="bg-yellow-400 text-white px-3 py-1 rounded-full flex items-center space-x-1">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
            </div>
          </div>
          <h1 className="text-2xl font-bold">Submit Feedback</h1>
          <p className="text-gray-500 text-sm">National Insurance Trust Fund</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            placeholder="Your Message"
            rows="4"
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {/* Rating */}
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`w-12 h-12 flex items-center justify-center border rounded-lg ${rating >= star ? "bg-yellow-400 text-white" : "bg-white"
                  }`}
                onClick={() => setRating(star)}
              >
                ⭐
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            onClick={submitFeedback}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Submit
          </button>

          {/* Go to feedbacklist */}
          <button
            type="button"
            onClick={() => setView("list")}
            className="w-full mt-2 text-blue-600 hover:underline"
          >
            View feedback & replies
          </button>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [view, setView] = useState("form"); // form | list

  // validation and submitting feedback
  const submitFeedback = async () => {
    if (!fullName || !email || !message) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = { username: fullName, email, message };

      if (rating > 0) payload.rating = rating;

      await axios.post("http://localhost:5000/feedback", payload);

      setFullName("");
      setEmail("");
      setMessage("");
      setRating(0);

      try {
        localStorage.setItem("feedbackEmail", email);
      } catch { "" }

      setShowThankYou(true);
    } catch (e) {
      alert(e?.response?.data?.error || e.message || "Failed to submit feedback");
    }
  };

  if (view === "list") {
    return <FeedbackList onBack={() => setView("form")} />;
  }

  return (
    <>
      <nav className="w-full py-3 px-4 bg-white shadow flex gap-4">
        <Link to="/" className="hover:underline">Feedback</Link>
        <Link to="/complaint" className="hover:underline">Complaint</Link>
        <Link to="/complaints/view" className="hover:underline">Complaint History</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <FeedbackForm
                fullName={fullName}
                setFullName={setFullName}
                email={email}
                setEmail={setEmail}
                message={message}
                setMessage={setMessage}
                rating={rating}
                setRating={setRating}
                submitFeedback={submitFeedback}
                setView={setView}
              />
              <ThankYouModal
                open={showThankYou}
                onClose={() => {
                  setShowThankYou(false);
                  setView("list");
                }}
              />
            </>
          }
        />
        <Route path="/complaint" element={<ComplaintForm />} />
        <Route path="/complaints/view" element={<ComplaintHistory />} />
      </Routes>
    </>
  );
}

export default App;
