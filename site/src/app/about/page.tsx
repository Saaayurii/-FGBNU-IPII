import { Header } from "@/components/Header";
import { Footer } from "@/components/ui/Footer";
import { BackButton } from '@/components/news/BackButton';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Target, Award, BookOpen, Globe } from "lucide-react";
import Image from "next/image";

export default async function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            
            {/* Hero секция */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <BackButton className="mb-6" />
                    <div className="max-w-4xl">
                        <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
                            <Building2 className="w-4 h-4 mr-2" />
                            О лаборатории
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Лаборатория интеллектуальных систем анализа данных
                        </h1>
                        <p className="text-xl text-blue-100 leading-relaxed">
                            Современные исследования в области компьютерного зрения, машинного обучения и интеллектуальных систем для беспилотных технологий
                        </p>
                    </div>
                </div>
            </div>

            {/* Основная информация */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                {/* Карточки с ключевой информацией */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Target className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Наша миссия</h3>
                            <p className="text-muted-foreground text-sm">
                                Разработка передовых технологий для автономных систем навигации
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Команда</h3>
                            <p className="text-muted-foreground text-sm">
                                Опытные исследователи и молодые ученые в области ИИ
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Award className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Достижения</h3>
                            <p className="text-muted-foreground text-sm">
                                Участие в международных конференциях и проектах
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Основное содержание */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Левая колонка - основной текст */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-xl shadow-sm border p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-semibold">Правовая основа исследований</h2>
                            </div>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed">
                                    Исследования лаборатории проводятся в соответствии с <strong>Указом Президента Российской Федерации от 28 февраля 2024 г. N 145</strong> "О Стратегии научно-технологического развития Российской Федерации" и относятся к п. 5. «Интеллектуальные транспортные и телекоммуникационные системы, включая автономные транспортные средства» приоритетных направлений согласно <strong>Указу Президента Российской Федерации от 18 июня 2024 г. № 529</strong>.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                    <Target className="w-4 h-4 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-semibold">Направления исследований</h2>
                            </div>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    Разработка технологий <strong>компьютерного зрения</strong>, предназначенных для навигации беспилотными летательными аппаратами (БПЛА) с помощью ориентиров и карты местности, позволяющие достичь высокой точности навигации для БПЛА, особенно без сигнала от спутниковой навигационной системы (СНС).
                                </p>
                                
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-red-800 mb-2">Вызовы и препятствия:</h4>
                                    <ul className="text-red-700 space-y-1 text-sm">
                                        <li>• Окружающая среда с подвижными и неподвижными препятствиями</li>
                                        <li>• Потеря сигнала дистанционного управления с пульта оператора</li>
                                        <li>• Отсутствие сигнала спутниковой навигационной системы</li>
                                        <li>• Обеспечение достоверности навигационной информации</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border p-8">
                            <div className="flex items-center mb-6">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                    <Globe className="w-4 h-4 text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-semibold">Научная активность</h2>
                            </div>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    Институт всячески способствует участию сотрудников лаборатории в конференциях и семинарах, обеспечивая обмен опытом и презентацию результатов исследований.
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                                                <Users className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-blue-800 mb-1">ПЕРСПЕКТИВА-2024</h4>
                                                <p className="text-blue-700 text-sm">4 молодых ученых приняли участие в школе-семинаре по информационной безопасности (г. Таганрог)</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                                                <BookOpen className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-green-800 mb-1">Когнитивная наука</h4>
                                                <p className="text-green-700 text-sm">2 молодых ученых участвовали в Десятой международной конференции (г. Пятигорск)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка - дополнительная информация */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="font-semibold text-lg mb-4">Ключевые технологии</h3>
                            <div className="space-y-3">
                                <Badge variant="outline" className="mr-2 mb-2">Компьютерное зрение</Badge>
                                <Badge variant="outline" className="mr-2 mb-2">Машинное обучение</Badge>
                                <Badge variant="outline" className="mr-2 mb-2">БПЛА навигация</Badge>
                                <Badge variant="outline" className="mr-2 mb-2">Автономные системы</Badge>
                                <Badge variant="outline" className="mr-2 mb-2">Обработка изображений</Badge>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="font-semibold text-lg mb-4">Статистика</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Участников конференций</span>
                                    <span className="font-semibold">6</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Научных направлений</span>
                                    <span className="font-semibold">3</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Активных проектов</span>
                                    <span className="font-semibold">5</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                            <h3 className="font-semibold text-lg mb-4 text-blue-900">Присоединяйтесь к нам</h3>
                            <p className="text-blue-700 text-sm mb-4">
                                Заинтересованы в исследованиях в области ИИ и компьютерного зрения?
                            </p>
                            <div className="text-blue-600 text-sm">
                                <p>📧 Email: lab@institute.ru</p>
                                <p>📍 Адрес: г. Донецк</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}