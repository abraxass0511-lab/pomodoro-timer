import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

const WeeklyStats = ({ focusData }) => {
    // Generate ticks for every hour (60 minutes) based on max data
    const maxMinutes = Math.max(...focusData.map(d => d.minutes || 0), 120); // Default max 2h for empty chart
    const maxHours = Math.ceil(maxMinutes / 60);
    // Create an array of ticks: [0, 60, 120, 180, ...]
    const ticks = Array.from({ length: maxHours + 1 }, (_, i) => i * 60);

    return (
        <div className="w-full max-w-md mt-6 bg-[#4a2b3e] p-6 rounded-3xl shadow-[0_10px_30px_rgba(255,105,180,0.2)] border-4 border-pink-300/20 backdrop-blur-sm">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-pink-200">
                📅 이번 주 집중 시간 ⏰
            </h2>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={focusData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                        <XAxis
                            dataKey="day"
                            stroke="#fbcfe8"
                            tick={{ fill: '#fbcfe8', fontSize: 12, fontWeight: 'bold' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#fbcfe8"
                            tick={{ fill: '#fbcfe8', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                            domain={[0, 'auto']}
                            ticks={ticks} // Set explicit ticks at 60min intervals
                            tickFormatter={(value) => `${value / 60}시간`} // Display as 1시간, 2시간
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#2d1b2e',
                                border: '2px solid #f472b6',
                                borderRadius: '12px',
                                color: '#fff'
                            }}
                            itemStyle={{ color: '#f472b6' }}
                            cursor={{ fill: 'rgba(255, 105, 180, 0.1)' }}
                            formatter={(value) => [`${(value / 60).toFixed(1)}시간`, '집중 시간']}
                        />
                        <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                            <LabelList
                                dataKey="minutes"
                                position="top"
                                fill="#fbcfe8"
                                fontSize={10}
                                formatter={(value) => value > 0 ? `${(value / 60).toFixed(1)}시간` : ''}
                            />
                            {focusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.today ? '#fbbf24' : '#ec4899'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 text-center text-pink-300/70 text-xs">
                * 매 정각 단위(1시간, 2시간)로 눈금을 표시합니다.
            </div>
        </div>
    );
};

export default WeeklyStats;
