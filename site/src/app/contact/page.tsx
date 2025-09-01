import { Header } from "@/components/Header";
import { Footer } from "@/components/ui/Footer";
import { MapPin, Phone, Mail, Clock, Building2, Users, Navigation, MessageCircle } from "lucide-react";
import { MapWrapper } from "@/components/MapWrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/news/BackButton";

export default async function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            
            {/* Hero секция */}
            <div className="bg-gradient-to-r from-gray-800 to-slate-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <BackButton className="mb-6" />
                    <div className="max-w-4xl">
                        <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Свяжитесь с нами
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Контактная информация
                        </h1>
                        <p className="text-xl text-gray-100 leading-relaxed">
                            Мы всегда готовы ответить на ваши вопросы и обсудить возможности сотрудничества
                        </p>
                    </div>
                </div>
            </div>

            {/* Статистика */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Building2 className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">25+</div>
                            <div className="text-sm text-gray-600">лет опыта</div>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">50+</div>
                            <div className="text-sm text-gray-600">сотрудников</div>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <Navigation className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">100+</div>
                            <div className="text-sm text-gray-600">проектов</div>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                <MessageCircle className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">24/7</div>
                            <div className="text-sm text-gray-600">поддержка</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Основное содержание */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* Карта */}
                    <div className="space-y-6">
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                                    Наше местоположение
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="relative h-96">
                                    <MapWrapper className="w-full h-full" />
                                </div>
                                <div className="p-4 bg-green-50 border-t">
                                    <p className="text-sm text-green-700 flex items-center">
                                        <Navigation className="w-4 h-4 mr-2" />
                                        Интерактивная карта с точным расположением института
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Как добраться */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Как добраться</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                                        <span className="text-xs font-medium text-blue-600">🚌</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm">Общественный транспорт</h4>
                                        <p className="text-sm text-muted-foreground">Автобусы № 5, 12, 23 до остановки "Артема"</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                                        <span className="text-xs font-medium text-green-600">🚗</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm">На автомобиле</h4>
                                        <p className="text-sm text-muted-foreground">Центр города, недалеко от главной площади</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                                        <span className="text-xs font-medium text-purple-600">🅿️</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-sm">Парковка</h4>
                                        <p className="text-sm text-muted-foreground">Доступна на прилегающих улицах</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Контактная информация */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Контактная информация</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <MapPin className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">Адрес</h4>
                                        <p className="text-gray-700 mt-1">
                                            83050, г. Донецк,<br />
                                            ул. Артема, 118Б
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Phone className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">Телефон</h4>
                                        <p className="text-gray-700 mt-1">+7 (XXX) XXX-XX-XX</p>
                                        <Button variant="outline" size="sm" className="mt-2">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Позвонить
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">Email</h4>
                                        <p className="text-gray-700 mt-1">info@ipii-ai.ru</p>
                                        <Button variant="outline" size="sm" className="mt-2">
                                            <Mail className="w-4 h-4 mr-2" />
                                            Написать
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <Clock className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">Режим работы</h4>
                                        <div className="text-gray-700 mt-1 space-y-1">
                                            <p className="flex justify-between">
                                                <span>Понедельник - Пятница:</span>
                                                <span className="font-medium">9:00 - 18:00</span>
                                            </p>
                                            <p className="flex justify-between">
                                                <span>Суббота - Воскресенье:</span>
                                                <span className="text-red-600 font-medium">Выходные</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Организационная информация */}
                        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                            <CardHeader>
                                <CardTitle className="text-blue-900">О нашем институте</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-blue-900">
                                        Федеральное государственное бюджетное научное учреждение
                                    </h4>
                                    <p className="font-medium text-blue-800">
                                        "Институт проблем искусственного интеллекта"
                                    </p>
                                    <p className="text-sm text-blue-700">
                                        Ведущий научно-исследовательский институт в области
                                        искусственного интеллекта и машинного обучения
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <Badge variant="secondary" className="bg-white/50 text-blue-700">ИИ</Badge>
                                        <Badge variant="secondary" className="bg-white/50 text-blue-700">Машинное обучение</Badge>
                                        <Badge variant="secondary" className="bg-white/50 text-blue-700">БПЛА</Badge>
                                        <Badge variant="secondary" className="bg-white/50 text-blue-700">Исследования</Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Социальные сети и дополнительные контакты */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Мы в социальных сетях</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="justify-start">
                                        <div className="w-5 h-5 bg-blue-600 rounded mr-2"></div>
                                        ВКонтакте
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        <div className="w-5 h-5 bg-red-600 rounded mr-2"></div>
                                        YouTube
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        <div className="w-5 h-5 bg-blue-400 rounded mr-2"></div>
                                        Telegram
                                    </Button>
                                    <Button variant="outline" className="justify-start">
                                        <div className="w-5 h-5 bg-green-600 rounded mr-2"></div>
                                        WhatsApp
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}