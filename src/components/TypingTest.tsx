import React, { useEffect, useRef, useState } from "react";
import { words } from "../word";
const getRandomWords = (count: number) => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  const getWordCount = () => {
    return Math.floor((1 + Math.random()) * 11);
  };
  
  const TypingTest: React.FC = () => {
    const [input, setInput] = useState("");
    const [wordList, setWordList] = useState<string[]>(getRandomWords(getWordCount()));
    const [currentIndex, setCurrentIndex] = useState(0);
    const [typedHistory, setTypedHistory] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [wpm, setWpm] = useState<number>(0);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [accuracy, setAccuracy] = useState<number>(0);
  
    useEffect(() => {
      inputRef.current?.focus();
    }, []);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!startTime) setStartTime(Date.now());
  
      const value = e.target.value;
      if (value.endsWith(" ")) {
        checkWord(value.trim());
        setInput("");
      } else {
        setInput(value);
      }
    };
  
    const checkWord = (typed: string) => {
        const newHistory = [...typedHistory, typed];
        const newIndex = currentIndex + 1;
        setTypedHistory(newHistory);
        setCurrentIndex(newIndex);
      
        if (startTime) {
          const elapsed = (Date.now() - startTime) / 60000; // in minutes
          
          // Calculate correct words and their characters
          let correctChars = 0;
          let correctWords = 0;
          let totalTypedChars = 0;
      
          newHistory.forEach((typedWord, i) => {
            const expectedWord = wordList[i] || '';
            totalTypedChars += typedWord.length;
            
            // Count fully correct words
            if (typedWord === expectedWord) {
              correctWords++;
              correctChars += expectedWord.length;
            }
          });
      
          // Calculate Net WPM (only fully correct words count)
          const netWPM = ((correctChars / 5) / elapsed);
          
          // Calculate accuracy based on correct characters
          const accuracy = totalTypedChars > 0 
            ? (correctChars / totalTypedChars) * 100 
            : 0;
      
          setWpm(Math.round(netWPM));
          setAccuracy(Math.round(accuracy));
        }
      };

  const restartTest = () => {
    setWordList(getRandomWords(getWordCount()));
    setTypedHistory([]);
    setInput("");
    setCurrentIndex(0);
    setStartTime(null);
    setWpm(0);
    inputRef.current?.focus();
  };

  const renderWord = (word: string, index: number) => {
    let typed = "";
    let isCurrent = false;

    if (index < currentIndex) {
      typed = typedHistory[index] || "";
    } else if (index === currentIndex) {
      typed = input;
      isCurrent = true;
    }

    return (
      <span
        key={index}
        className={`flex gap-[1px] px-1 rounded ${
          isCurrent ? "bg-indigo-500/10 dark:bg-indigo-500/20" : ""
        }`}
      >
        {word.split("").map((char, i) => {
          let className = "text-gray-400";
          if (i < typed.length) {
            className =
              typed[i] === char ? "text-green-500" : "text-red-500";
          } else if (isCurrent && i === typed.length) {
            className = "underline";
          }

          return (
            <span key={i} className={`${className} font-mono`}>
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div
    className={`${
      darkMode ? "bg-neutral-900 text-white" : "bg-white text-black"
    } min-h-screen flex flex-col justify-between transition-colors`}
  >
  
      <header className="flex justify-between items-center px-6 py-4 border-b dark:border-neutral-700">
        <h1 className="text-2xl font-semibold tracking-wide">
          Test your typing speed
        </h1>
        <div className="space-x-3">
          <button
            onClick={restartTest}
            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded transition"
          >
            Restart
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white rounded transition"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-2xl md:text-3xl font-mono flex flex-wrap gap-2 mb-8 leading-relaxed">
          {wordList.map((word, i) => renderWord(word, i))}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          className="w-full px-5 py-3 text-white border rounded-md outline-none text-lg dark:bg-neutral-800 dark:border-neutral-600 focus:ring-2 focus:ring-indigo-500 transition"
          placeholder="Start typing..."
        />

{currentIndex === wordList.length && (
  <div className="mt-6 text-center space-y-2 text-xl font-semibold">
    <div className="text-blue-500">Your WPM: {wpm}</div>
    <div className="text-blue-500">Accuracy: {accuracy}%</div>
  </div>
)}

      </main>
      <footer className="text-center text-sm py-4 border-t dark:border-neutral-700 mt-10">
  <p className="mb-1">
    Built by <span className="font-semibold">Saksham Doda</span> —{" "}
    <a
      href="https://github.com/sakshamdoda/typing-test"
      className="text-indigo-500 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      GitHub Repo
    </a>
  </p>
  <p className="text-gray-500 dark:text-gray-400">
    &copy; {new Date().getFullYear()} Saksham Doda. All rights reserved.
  </p>
</footer>

    </div>
  );
};

export default TypingTest;
