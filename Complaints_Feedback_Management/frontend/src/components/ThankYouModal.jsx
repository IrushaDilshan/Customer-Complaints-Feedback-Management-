import React from "react";

export default function ThankYouModal({ open, onClose }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
                <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl">
                    ✓
                </div>
                <h2 className="text-xl font-semibold mb-1">Thank you!</h2>
                <p className="text-gray-600 mb-6">Your feedback was submitted successfully.</p>
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg"
                    onClick={onClose}
                >
                    View feedback & replies
                </button>
            </div>
        </div>
    );
}
