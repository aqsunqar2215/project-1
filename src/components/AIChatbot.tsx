import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";

const AIChatbot: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
        { role: 'ai', content: 'Hello! I\'m your Smart City AI assistant. Ask me about smart cities, traffic management, energy optimization, IoT sensors, or sustainability!' }
    ]);
    const [loading, setLoading] = useState<boolean>(false);

    const getAIResponse = (userInput: string): string => {
        const input = userInput.toLowerCase();

        if (input.includes('traffic') || input.includes('congestion') || input.includes('jam')) {
            const responses = [
                'Smart traffic management uses real-time data from IoT sensors to optimize traffic flow. AI algorithms analyze patterns and adjust traffic lights dynamically, reducing congestion by up to 30% in major cities.',
                'Intelligent traffic systems leverage machine learning to predict congestion before it happens. By analyzing historical data and current conditions, cities can reroute traffic and prevent jams.',
                'Advanced traffic management includes adaptive signal control, smart parking guidance, and incident detection systems that respond within seconds to changing conditions.'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        if (input.includes('energy') || input.includes('power') || input.includes('electricity')) {
            const responses = [
                'Smart cities optimize energy through intelligent grids that balance supply and demand in real-time. AI predicts usage patterns and automatically adjusts distribution, reducing waste by 15-20%.',
                'Energy optimization in smart cities includes LED street lighting with sensors that dim when no one is around, building management systems that optimize HVAC, and renewable energy integration.',
                'Smart grids use IoT devices to monitor energy consumption across the city, enabling utilities to identify inefficiencies and residents to reduce their carbon footprint through real-time feedback.'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        if (input.includes('iot') || input.includes('sensor') || input.includes('device')) {
            const responses = [
                'Smart cities deploy thousands of IoT sensors to monitor air quality, noise levels, traffic flow, waste management, and more. These sensors create a digital twin of the city for better decision-making.',
                'IoT sensors in smart cities collect data on everything from parking availability to water quality. This data is analyzed in real-time to improve city services and resident quality of life.',
                'Modern smart city infrastructure includes environmental sensors, smart meters, connected streetlights, and surveillance systems that work together to create a responsive urban environment.'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        if (input.includes('park')) {
            return 'Smart parking systems use sensors in parking spaces to detect availability and guide drivers to open spots via mobile apps. This reduces time spent searching for parking by 40% and decreases emissions from circling vehicles.';
        }

        if (input.includes('sustain') || input.includes('environment') || input.includes('green') || input.includes('eco')) {
            const responses = [
                'Smart cities prioritize sustainability through integrated systems: renewable energy, efficient waste management, green transportation, and environmental monitoring. Barcelona reduced water consumption by 25% using smart systems.',
                'Environmental sustainability in smart cities includes air quality monitoring, smart waste collection that reduces truck routes by 30%, and green building standards enforced through IoT monitoring.',
                'Cities like Copenhagen use smart technology to achieve carbon neutrality goals, with bike-sharing systems, district heating networks, and comprehensive environmental data platforms.'
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        // Waste management responses
        if (input.includes('waste') || input.includes('garbage') || input.includes('trash')) {
            return 'Smart waste management uses IoT sensors in bins to monitor fill levels and optimize collection routes. This reduces collection costs by 30-40% and decreases truck emissions by only collecting when needed.';
        }

        if (input.includes('safety') || input.includes('security') || input.includes('crime')) {
            return 'Smart cities enhance safety through AI-powered video analytics, gunshot detection systems, emergency response optimization, and predictive policing. These systems can reduce emergency response times by 20-30%.';
        }

        if (input.includes('transport') || input.includes('bus') || input.includes('metro') || input.includes('transit')) {
            return 'Smart public transportation uses real-time tracking, predictive maintenance, and demand-responsive routing. Mobile apps provide live updates, and AI optimizes schedules based on ridership patterns, improving efficiency by 25%.';
        }

        if (input.includes('water')) {
            return 'Smart water management systems detect leaks in real-time using acoustic sensors and pressure monitors. AI algorithms predict pipe failures before they occur, reducing water loss by up to 40% in cities like Singapore.';
        }

        if (input.includes('example') || input.includes('city') && (input.includes('which') || input.includes('what'))) {
            return 'Leading smart cities include Singapore (comprehensive smart nation initiative), Barcelona (IoT sensors throughout city), Copenhagen (carbon neutral goals), Amsterdam (smart mobility), and Dubai (AI and blockchain integration).';
        }

        if (input.includes('challenge') || input.includes('problem') || input.includes('difficult')) {
            return 'Key smart city challenges include data privacy concerns, high implementation costs, cybersecurity threats, integrating legacy systems, and ensuring digital equity so all residents benefit from smart technologies.';
        }

        if (input.includes('benefit') || input.includes('advantage')) {
            return 'Smart city benefits include reduced operational costs (10-30%), improved quality of life, lower emissions (15-20%), enhanced public safety, better traffic flow, and data-driven decision making for city planners.';
        }

        if (input.includes('ai') || input.includes('artificial intelligence') || input.includes('machine learning') || input.includes('data')) {
            return 'AI in smart cities analyzes vast amounts of sensor data to predict needs, optimize resources, and automate responses. Machine learning models improve over time, making cities increasingly efficient and responsive to resident needs.';
        }

        return 'I can help you learn about smart cities! Try asking about: traffic management, energy optimization, IoT sensors, smart parking, public transportation, waste management, sustainability, or specific smart city examples.';
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        setLoading(true);
        const userMessage = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        setTimeout(() => {
            const aiResponse = getAIResponse(input);
            setMessages(prev => [...prev, { role: 'ai' as const, content: aiResponse }]);
            setLoading(false);
        }, 500);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 min-h-screen bg-gray-950">
            <Card className="shadow-lg bg-gray-900 border-gray-800">
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                        <Bot className="w-8 h-8 text-blue-400" />
                        <div>
                            <h2 className="text-2xl font-bold text-white">Smart City AI Chatbot</h2>
                            <p className="text-sm text-gray-400">Ask about smart cities, traffic, energy & more</p>
                        </div>
                    </div>

                    <div className="h-96 overflow-y-auto space-y-3 border border-gray-800 rounded-lg p-4 bg-gray-950">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
                                        {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                                    </div>
                                    <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 border border-gray-700 text-gray-100 shadow-sm'}`}>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex gap-3 justify-start">
                                <div className="flex gap-2 max-w-[80%]">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-green-600">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="p-3 rounded-lg bg-gray-800 border border-gray-700 shadow-sm">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about traffic, energy, IoT sensors, sustainability..."
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={loading}
                            className="flex-1"
                        />
                        <Button onClick={handleSend} disabled={loading || !input.trim()} className="bg-blue-600 hover:bg-blue-700">
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="text-xs text-gray-500 text-center">
                        Powered by keyword-based AI simulation • Try asking about specific topics!
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AIChatbot;
