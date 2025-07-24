import React, { useEffect, useState } from "react";
import initialFaqs from "/faq.json";

const STORAGE_KEY = "admin_faq_list";

const GuestFAQ = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const storedFaqs = localStorage.getItem(STORAGE_KEY);
    if (storedFaqs) {
      setFaqs(JSON.parse(storedFaqs));
    } else {
      setFaqs(initialFaqs);
    }
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Pertanyaan yang Sering Diajukan</h2>

      <div className="space-y-4">
        {faqs.length === 0 ? (
          <p className="text-gray-500">Belum ada FAQ yang tersedia.</p>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id} className="border p-4 rounded shadow bg-gray-50">
              <p className="font-semibold text-gray-900">{faq.question}</p>
              <p className="text-gray-700 mt-1">{faq.answer}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GuestFAQ;
