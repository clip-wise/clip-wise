import React, { useState } from "react";
import { Flashcard } from "../../types";

interface FlashCardProps {
  flashcards: Flashcard[];
  isLoading: boolean;
}

const FlashCard: React.FC<FlashCardProps> = ({ flashcards, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setFlipped(false);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
    setFlipped(false);
  };

  if (isLoading) {
    return (
      <div className="p-5 italic text-center text-gray-600">
        Loading flashcards...
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="p-5 italic text-center text-gray-600">
        No flashcards available.
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="p-5 mx-auto w-full max-w-md">
      <div className="mb-5 perspective-1000">
        <div
          className={`relative w-full h-48 transition-transform duration-500 transform-style-preserve-3d cursor-pointer ${
            flipped ? "rotate-y-180" : ""}`}
          onClick={handleFlip}>
          <div className="flex absolute justify-center items-center p-4 w-full h-full bg-red-100 rounded-lg shadow-md backface-hidden">
            <h3 className="text-lg font-semibold text-center text-gray-800">
              {currentCard.question}
            </h3>
          </div>
          <div className="flex absolute justify-center items-center p-4 w-full h-full bg-red-200 rounded-lg shadow-md backface-hidden rotate-y-180">
            <p className="text-base text-center text-gray-800">
              {currentCard.answer}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 text-white bg-red-400 rounded transition-all duration-300 hover:bg-red-500 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={flashcards.length <= 1}>
          Previous
        </button>
        <span className="text-gray-600">{`${currentIndex + 1} / ${
          flashcards.length
        }`}</span>
        <button
          onClick={handleNext}
          className="px-4 py-2 text-white bg-red-400 rounded transition-all duration-300 hover:bg-red-500 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={flashcards.length <= 1}>
          Next
        </button>
      </div>
    </div>
  );
};

export default FlashCard;
