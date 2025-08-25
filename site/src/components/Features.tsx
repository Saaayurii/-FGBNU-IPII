import { Building, Target, Users, Award, BookOpen, Globe2, Cpu, GraduationCap } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Building,
      title: "Статус института",
      description: "Федеральное государственное бюджетное научное учреждение с высоким уровнем научно-исследовательских разработок"
    },
    {
      icon: Target,
      title: "Основные цели",
      description: "Концентрация творческих усилий в сфере интеллектуальных и робототехнических систем, компьютерных информационных технологий и ИИ"
    },
    {
      icon: Cpu,
      title: "Современные технологии",
      description: "Разработка систем распознавания речи, зрительных образов, компьютерной лингвистики и интеллектуальных систем слежения"
    },
    {
      icon: Award,
      title: "Международное признание",
      description: "Участие в выставке CeBIT (Ганновер) и организация 13 международных конференций по искусственному интеллекту"
    },
    {
      icon: BookOpen,
      title: "Издательская деятельность",
      description: "Учредитель международного журнала «Проблемы искусственного интеллекта» и выпуск научных пособий, монографий"
    },
    {
      icon: Users,
      title: "Научное сообщество",
      description: "Уникальная сеть участников из России, Украины, Польши, Испании, Беларуси, Азербайджана и других стран"
    },
    {
      icon: Globe2,
      title: "Международное сотрудничество",
      description: "Связи с ведущими ВУЗами международного уровня и российскими коллегами для развития научного сотрудничества"
    },
    {
      icon: GraduationCap,
      title: "Образовательные программы",
      description: "Научная молодежная школа «Системы и средства искусственного интеллекта» и поддержка молодых специалистов"
    }
  ];

  return (
    <section className="py-16 bg-[#f8fafc] bg-background/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            Почему выбирают нас
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ФГБНУ «Институт проблем искусственного интеллекта» — ведущий научно-исследовательский центр, 
            обеспечивающий решение проблем искусственного интеллекта и развитие научного потенциала
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center space-y-4 p-6 rounded-lg hover:bg-secondary/50 transition-colors">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Дополнительная информация */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-secondary/30 rounded-lg p-8 space-y-4">
            <h3 className="text-2xl font-semibold mb-4">Научные функции</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5 text-xs">•</span>
                <span>Теоретическая и практическая реализация проблем искусственного интеллекта</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5 text-xs">•</span>
                <span>Разработка экспертных систем и интеллектуальных интерфейсов</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5 text-xs">•</span>
                <span>Создание программ для интеллектуальной медицинской диагностики</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5 text-xs">•</span>
                <span>Патентно-лицензионная деятельность и защита интеллектуальной собственности</span>
              </li>
            </ul>
          </div>

          <div className="bg-secondary/30 rounded-lg p-8 space-y-4">
            <h3 className="text-2xl font-semibold mb-4">Научные достижения</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5 text-xs">•</span>
                <span>Многолетнее участие в выставке CeBIT (Ганновер, Германия)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5 text-xs">•</span>
                <span>13 международных конференций по ИИ в Крыму и Геленджике</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5 text-xs">•</span>
                <span>Сотрудничество с ЮФУ, институтами Харькова, Москвы, Новосибирска</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1.5 text-xs">•</span>
                <span>Создание научной молодежной школы по системам ИИ</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}