import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqData = [
  {
    question: "What is ArtPool?",
    answer: "ArtPool is a premium marketplace and community platform designed to connect independent artists with art collectors. It’s a space to discover, buy, and commission original artwork."
  },
  {
    question: "How do I buy an artwork?",
    answer: "Simply browse the gallery or home feed, find a piece you love, and click 'Buy Piece'. You will be guided through a secure checkout process to purchase directly from the artist."
  },
  {
    question: "Can I commission a custom piece from an artist?",
    answer: "Yes! If you love an artist's style, you can visit their profile and click 'Hire Artist' to send them a direct commission request with your ideas and budget."
  },
  {
    question: "Are the artworks physical or digital?",
    answer: "ArtPool hosts both physical and digital art. The category (e.g., Painting, Sculpture, Digital) and description on the artwork's page will specify whether you are buying a physical item to be shipped or a digital file."
  },
  {
    question: "How does shipping work for physical art?",
    answer: "Shipping is handled directly by the artist. Once you purchase a physical piece, the artist will package and ship it to your provided address, and you will receive tracking information."
  },
  {
    question: "Is there a fee to join ArtPool as an artist?",
    answer: "Creating an account and setting up your portfolio on ArtPool is completely free. We only take a small commission fee when you successfully make a sale or complete a commission."
  },
  {
    question: "Who owns the rights to the artwork?",
    answer: "The artist retains all copyrights to their work even after it is sold, unless a commercial rights agreement is explicitly negotiated during a custom commission."
  },
  {
    question: "How do artists get paid?",
    answer: "Payments from buyers are securely held in escrow and released directly to the artist's connected bank account once the artwork has been successfully delivered or the digital file transferred."
  },
  {
    question: "Can I return an artwork if I don't like it?",
    answer: "Returns depend on the individual artist's policy. Since many pieces are one-of-a-kind or custom-made, please check the specific return policy listed on the artwork before purchasing."
  },
  {
    question: "How do I report a stolen image or copyright violation?",
    answer: "We take intellectual property very seriously. If you see your work uploaded by someone else, please use the 'Report' button on the artwork or contact our support team immediately."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Everything you need to know about the ArtPool platform.</p>
        </div>

        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-none"
                >
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{faq.question}</span>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }} className="flex-shrink-0 ml-4 text-blue-600">
                    <ChevronDown size={24} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FAQ;