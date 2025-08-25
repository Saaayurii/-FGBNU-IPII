"use client"	;

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { LeafletMap } from "./LeafletMap";

export function ContactMap() {
  return (
    <section className="py-16 bg-[#f8fafc] dark:bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black-900 mb-4">Как нас найти</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ФГБНУ "Институт проблем искусственного интеллекта" располагается в центре Донецка
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Карта */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              Наше местоположение
            </h3>
            <div
              className="bg-white rounded-lg overflow-hidden shadow-lg border-2 border-blue-100"
              style={{ height: "400px" }}
            >
              <LeafletMap className="rounded-lg" />
            </div>
            <p className="text-sm text-blue-600">
              * Интерактивная карта с точным расположением института
            </p>
          </div>

          {/* Контактная информация */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-6">
                Контактная информация
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold dark:text-black">Адрес</h4>
                    <p className="dark:text-black">
                      83050, г. Донецк,
                      <br />
                      ул. Артема, 118Б
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold dark:text-black">Телефон</h4>
                    <p className="dark:text-black">+7 (XXX) XXX-XX-XX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold dark:text-black">Email</h4>
                    <p className="dark:text-black">info@ipii-ai.ru</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm border border-blue-100">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold dark:text-black">
                      Режим работы
                    </h4>
                    <div>
                      <p className="dark:text-black">Понедельник - Пятница: 9:00 - 18:00</p>
                      <p className="dark:text-black">Суббота - Воскресенье: Выходные</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg p-6 border border-blue-200">
              <h4 className="font-semibold mb-3 dark:text-black">
                Как добраться
              </h4>
              <div className="space-y-2 text-sm dark:text-black">
                <p>
                  • <strong>На общественном транспорте:</strong> автобусы № 5,
                  12, 23 до остановки "Артема"
                </p>
                <p>
                  • <strong>На автомобиле:</strong> центр города, недалеко от
                  главной площади
                </p>
                <p>
                  • <strong>Парковка:</strong> доступна на прилегающих улицах
                </p>
              </div>
            </div>

            {/* Организационная информация */}
            <div className="border-t border-blue-200 pt-6">
              <h4 className="font-semibold mb-3">
                Федеральное государственное бюджетное научное учреждение
              </h4>
              <p className="font-medium">
                "Институт проблем искусственного интеллекта"
              </p>
              <p className="text-sm mt-2">
                Ведущий научно-исследовательский институт в области
                искусственного интеллекта и машинного обучения
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
