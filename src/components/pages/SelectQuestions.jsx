import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, GraduationCap, BookOpen, Filter, Check, ChevronRight, ChevronLeft, Menu } from 'lucide-react';

// Import your question sets
import { JEEQuestions } from "@/assets/Questions/JEEQuestions";
import { NEETQuestions } from "@/assets/Questions/NEETQuestions";
import { KCETQuestions } from "@/assets/Questions/KCETQuestions";
import { EleventhQuestions } from "@/assets/Questions/11thQuestions";
import { TwelfthQuestions } from "@/assets/Questions/12thQuestions";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SelectQuestions() {
  console.log("Rendering SelectQuestions component");

  const query = useQuery();
  const exam = query.get('exam');
  const subject = query.get('subject');
  const chapters = query.get('chapters').split(',');
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [chapterFilter, setChapterFilter] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load cached selected questions or initialize empty array
  const [selectedQuestions, setSelectedQuestions] = useState(() => {
    const cachedData = localStorage.getItem('selectedQuestions');
    if (cachedData) {
      const { cachedExam, cachedSubject, cachedQuestions } = JSON.parse(cachedData);
      if (cachedExam === exam && cachedSubject === subject) {
        return cachedQuestions;
      }
    }
    return [];
  });

  // Cache selected questions whenever they change
  useEffect(() => {
    localStorage.setItem('selectedQuestions', JSON.stringify({
      cachedExam: exam,
      cachedSubject: subject,
      cachedQuestions: selectedQuestions
    }));
  }, [selectedQuestions, exam, subject]);

  // Fetch questions only when exam, subject, or chapters change
  useEffect(() => {
    console.log("Fetching questions", { exam, subject, chapters });
    const fetchQuestions = () => {
      let questionSet;
      switch (exam) {
        case 'JEE':
          questionSet = JEEQuestions;
          break;
        case 'NEET':
          questionSet = NEETQuestions;
          break;
        case 'KCET':
          questionSet = KCETQuestions;
          break;
        case '11th':
          questionSet = EleventhQuestions;
          break;
        case '12th':
          questionSet = TwelfthQuestions;
          break;
        default:
          questionSet = {};
      }
      
      const fetchedQuestions = chapters.reduce((acc, chapter) => {
        if (questionSet[subject] && questionSet[subject][chapter]) {
          return [...acc, ...questionSet[subject][chapter].map(q => ({...q, chapter}))];
        }
        return acc;
      }, []);
      
      setQuestions(prevQuestions => {
        if (JSON.stringify(prevQuestions) !== JSON.stringify(fetchedQuestions)) {
          return fetchedQuestions;
        }
        return prevQuestions;
      });
    };

    fetchQuestions();
  }, [exam, subject, chapters]);

  // Apply filters when questions, difficultyFilter, or chapterFilter change
  useEffect(() => {
    const applyFilters = () => {
      let filtered = questions;
      if (difficultyFilter !== 'all') {
        filtered = filtered.filter(q => q.difficulty === difficultyFilter);
      }
      if (chapterFilter !== 'all') {
        filtered = filtered.filter(q => q.chapter === chapterFilter);
      }
      setFilteredQuestions(filtered);
    };

    applyFilters();
  }, [questions, difficultyFilter, chapterFilter]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleCart = (question) => {
    setSelectedQuestions(prevSelected => {
      const isSelected = prevSelected.some(item => item.id === question.id);
      if (isSelected) {
        return prevSelected.filter(item => item.id !== question.id);
      } else {
        return [...prevSelected, question];
      }
    });
  };


  const handleCartClick = () => {
    navigate('/addedQuestions', { state: { selectedQuestions } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {console.log("Rendering JSX")}
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-indigo-600">Question Hive</h1>
            <Button
              variant="outline"
              size="sm"
              className="text-indigo-600 border-indigo-600"
              onClick={handleCartClick}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Selected ({selectedQuestions.length})
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{exam} - {subject}</h2>
          <p className="text-sm text-gray-500">Chapters: {chapters.join(', ')}</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Selected: {selectedQuestions.length}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedQuestions([])} 
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Difficulty</h4>
              <div className="flex flex-wrap gap-2">
                {['all', 'easy', 'medium', 'hard'].map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={difficultyFilter === difficulty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDifficultyFilter(difficulty)}
                    className={`capitalize ${difficultyFilter === difficulty ? 'bg-indigo-600 text-white' : 'text-indigo-600'}`}
                  >
                    {difficulty}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Chapter</h4>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={chapterFilter === 'all' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChapterFilter('all')}
                  className={chapterFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-indigo-600'}
                >
                  All
                </Button>
                {chapters.map((chapter) => (
                  <Button
                    key={chapter}
                    variant={chapterFilter === chapter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChapterFilter(chapter)}
                    className={chapterFilter === chapter ? 'bg-indigo-600 text-white' : 'text-indigo-600'}
                  >
                    {chapter}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredQuestions.map((question, index) => {
                  const isSelected = selectedQuestions.some(item => item.id === question.id);
                  return (
                    <tr key={question.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer ${
                            isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                          }`}
                          onClick={() => toggleCart(question)}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 font-medium mb-2">{question.text}</div>
                        {question.options && (
                          <ul className="space-y-1">
                            {question.options.map((option, i) => (
                              <li key={i} className="text-sm text-gray-600 flex">
                                <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                                <span>{option}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {question.answer && (
                          <div className="mt-2 text-sm font-medium text-green-600">
                            Answer: {question.answer}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {question.difficulty}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {selectedQuestions.length > 0 && (
          <div className="fixed bottom-4 inset-x-0 px-4 sm:px-6 lg:px-8">
            <Button 
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-3 rounded-lg shadow-lg"
              onClick={handleCartClick}
            >
              View Selected Questions ({selectedQuestions.length})
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Question Hive. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default SelectQuestions;