import { useState, useEffect } from 'react';
import WeeklyStats from './WeeklyStats';

const Timer = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60); // Initial 25 minutes
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus' or 'break'
    const [focusData, setFocusData] = useState([]);
    const [customFocusTime, setCustomFocusTime] = useState(25); // User custom time

    // Initialize data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('pomodoroWeeklyData');
        const days = ['월', '화', '수', '목', '금', '토', '일'];
        const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // Mon=0, Sun=6

        if (savedData) {
            let parsedData = JSON.parse(savedData);
            // Ensure compatibility: add 'sessions' if missing, and refresh 'today'
            parsedData = parsedData.map((d, i) => ({
                ...d,
                today: i === todayIndex,
                sessions: d.sessions || 0 // Default to 0 if migrating from old data
            }));
            setFocusData(parsedData);
        } else {
            const initialData = days.map((day, index) => ({
                day,
                minutes: 0,
                sessions: 0,
                today: index === todayIndex
            }));
            setFocusData(initialData);
            localStorage.setItem('pomodoroWeeklyData', JSON.stringify(initialData));
        }
    }, []);

    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Timer finished
            setIsActive(false);

            // Play cute alarm sound 🎵
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.play().catch(e => console.log('Audio play failed:', e));

            if (mode === 'focus') {
                const minutesToAdd = customFocusTime;

                // Functional update to ensure we have fresh data
                setFocusData(prevData => {
                    const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
                    const newData = prevData.map((item, index) => {
                        if (index === todayIndex) {
                            return {
                                ...item,
                                minutes: item.minutes + minutesToAdd,
                                sessions: (item.sessions || 0) + 1 // Increment session count
                            };
                        }
                        return item;
                    });
                    localStorage.setItem('pomodoroWeeklyData', JSON.stringify(newData));
                    return newData;
                });

                setMode('break');
                setTimeLeft(5 * 60);
            } else {
                setMode('focus');
                setTimeLeft(customFocusTime * 60);
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, customFocusTime]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'focus') {
            setTimeLeft(customFocusTime * 60);
        } else {
            setTimeLeft(5 * 60);
        }
    };

    const handleModeChange = (newMode) => {
        setIsActive(false);
        setMode(newMode);
        if (newMode === 'focus') {
            setTimeLeft(customFocusTime * 60);
        } else {
            setTimeLeft(5 * 60);
        }
    };

    const handleTimeInputChange = (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val) && val > 0) {
            setCustomFocusTime(val);
            if (mode === 'focus' && !isActive) {
                setTimeLeft(val * 60);
            }
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#2d1b2e] text-pink-50 p-4 transition-colors duration-500 w-full overflow-y-auto">
            {/* Main Title */}
            <div className="w-full flex justify-center mt-8 mb-6">
                <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-400 to-yellow-400 drop-shadow-md animate-pulse font-sans text-center">
                    귀염뽀짝 뽀모도로 🎀
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-center justify-center w-full max-w-6xl px-4 flex-grow pb-10">

                {/* Visual Timer Section */}
                <div className="bg-[#4a2b3e] p-6 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(255,105,180,0.3)] w-full max-w-md text-center border-4 border-pink-300/20 backdrop-blur-sm flex-shrink-0 relative">

                    {/* Time Settings Input */}
                    {!isActive && mode === 'focus' && (
                        <div className="absolute top-4 right-4 flex items-center bg-pink-900/50 rounded-lg px-2 py-1 border border-pink-500/30">
                            <span className="text-xs text-pink-300 mr-2">시간 설정:</span>
                            <input
                                type="number"
                                min="1"
                                max="120"
                                value={customFocusTime}
                                onChange={handleTimeInputChange}
                                className="w-12 bg-transparent text-pink-100 text-center font-bold border-b border-pink-400 focus:outline-none text-sm"
                            />
                            <span className="text-xs text-pink-300 ml-1">분</span>
                        </div>
                    )}

                    {/* Header / Mode Selector */}
                    <div className="flex justify-center space-x-2 md:space-x-4 mb-8 md:mb-10 mt-4">
                        <button
                            onClick={() => handleModeChange('focus')}
                            className={`px-4 py-2 md:px-6 rounded-full font-bold transition-all duration-300 border-2 text-sm md:text-base ${mode === 'focus'
                                ? 'bg-pink-500 border-pink-400 text-white shadow-[0_0_15px_rgba(255,105,180,0.6)] scale-105 md:scale-110'
                                : 'bg-transparent border-pink-800 text-pink-300 hover:bg-pink-900/50'
                                }`}
                        >
                            🔥 집중
                        </button>
                        <button
                            onClick={() => handleModeChange('break')}
                            className={`px-4 py-2 md:px-6 rounded-full font-bold transition-all duration-300 border-2 text-sm md:text-base ${mode === 'break'
                                ? 'bg-purple-500 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.6)] scale-105 md:scale-110'
                                : 'bg-transparent border-pink-800 text-pink-300 hover:bg-pink-900/50'
                                }`}
                        >
                            ☕ 휴식
                        </button>
                    </div>

                    {/* Timer Display */}
                    <div className="mb-8 md:mb-12 relative">
                        <div className="text-6xl md:text-8xl font-mono font-black tracking-wider text-pink-100 drop-shadow-[0_4px_8px_rgba(255,105,180,0.5)]">
                            {formatTime(timeLeft)}
                        </div>
                        <div className="mt-4 text-pink-300 text-xs md:text-sm font-bold tracking-widest uppercase">
                            {isActive ? (mode === 'focus' ? '✨ 집중하는 중... ✨' : '🌸 힐링 타임... 🌸') : '시작할 준비 되셨나요?'}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex justify-center space-x-4 md:space-x-6">
                        <button
                            onClick={toggleTimer}
                            className={`px-6 py-3 md:px-8 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-200 transform active:scale-95 shadow-lg flex items-center space-x-2 border-b-4 ${isActive
                                ? 'bg-yellow-400 hover:bg-yellow-500 border-yellow-600 text-yellow-900'
                                : 'bg-pink-500 hover:bg-pink-600 border-pink-700 text-white'
                                }`}
                        >
                            <span>{isActive ? '⏸ 일시정지' : '▶ 시작'}</span>
                        </button>

                        <button
                            onClick={resetTimer}
                            className="px-6 py-3 md:px-8 md:py-4 rounded-2xl font-bold text-base md:text-lg bg-gray-700 hover:bg-gray-600 border-b-4 border-gray-900 text-gray-200 transition-all duration-200 transform active:scale-95 shadow-lg flex items-center mb-0"
                        >
                            <span>🔄 초기화</span>
                        </button>
                    </div>
                </div>

                {/* Functionality: Statistics Chart (Responsive wrapper) */}
                <div className="w-full max-w-md flex-shrink-0 flex justify-center">
                    <div className="w-full">
                        <WeeklyStats focusData={focusData} />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="w-full text-center mt-auto mb-4">
                <div className="text-pink-400/60 text-xs font-semibold">
                    오늘도 힘차게! 파이팅 💖
                </div>
            </div>
        </div>
    );
};

export default Timer;
