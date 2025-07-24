import React, { useEffect, useState } from "react";
import initialFaqs from "/faq.json";

const STORAGE_KEY = "admin_faq_list";

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  // Load data dari localStorage atau fallback ke JSON
  useEffect(() => {
    const storedFaqs = localStorage.getItem(STORAGE_KEY);
    if (storedFaqs) {
      setFaqs(JSON.parse(storedFaqs));
    } else {
      setFaqs(initialFaqs);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialFaqs));
    }
  }, []);

  // Simpan ke localStorage setiap kali ada perubahan
  const updateFaqStorage = (updatedFaqs) => {
    setFaqs(updatedFaqs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFaqs));
  };

  const handleAdd = () => {
    if (!newQuestion || !newAnswer) return;

    const newEntry = {
      id: Date.now(),
      question: newQuestion,
      answer: newAnswer,
    };

    const updated = [...faqs, newEntry];
    updateFaqStorage(updated);
    setNewQuestion("");
    setNewAnswer("");
  };

  const handleDelete = (id) => {
    const updated = faqs.filter((faq) => faq.id !== id);
    updateFaqStorage(updated);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manajemen FAQ</h2>

      <div className="mb-6 space-y-3">
        <input
          className="border border-gray-300 p-3 w-full text-black placeholder-gray-600 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Pertanyaan"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <textarea
          className="border border-gray-300 p-3 w-full text-black placeholder-gray-600 bg-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Jawaban"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Tambah FAQ
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="border p-4 rounded shadow bg-white">
            <p className="font-semibold text-gray-800">{faq.question}</p>
            <p className="text-gray-700 mt-1">{faq.answer}</p>

            <button
              onClick={() => handleDelete(faq.id)}
              className="text-red-500 text-sm mt-3 hover:underline"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFAQ;
