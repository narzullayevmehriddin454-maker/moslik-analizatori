export const translations = {
  UZ: {
    appTitle: "Moslik Analizatori", appSubtitle: "Yulduzlar sizning taqdiringizni o'qiydi", startTest: "Testni boshlash", person1: "Birinchi shaxs", person2: "Ikkinchi shaxs", name: "Ism", gender: "Jins", male: "Erkak", female: "Ayol", dob: "Tug'ilgan sana", quizTitle: "Shaxsiyat Testi", next: "Keyingisi", finish: "Natijani ko'rish", analyzing: "Koinot sizni tahlil qilmoqda...", compatibility: "Moslik darajasi", highComp: "YUQORI MOSLIK — Yulduzlar sizni qo'llab-quvvatlaydi", midComp: "O'RTACHA MOSLIK — Birgalikda ishlash talab etiladi", lowComp: "PAST MOSLIK — Qiyinchiliklarga tayyor turing", share: "Ulashish", retry: "Qayta urinish", copied: "Nusxa olindi!", adminLogin: "Admin Panel", password: "Maxfiy so'z", login: "Kirish", logout: "Chiqish", dashboard: "Boshqaruv paneli", totalSessions: "Jami testlar", avgScore: "O'rtacha ball", todaySessions: "Bugungi testlar", topLang: "Eng ko'p til", prevPage: "Oldingi", nextPage: "Keyingi", noData: "Ma'lumot yo'q", element: "Unsur",
    zodiacNames: ["Qo'y", "Buzoq", "Egizaklar", "Qisqichbaqa", "Arslon", "Parizod", "Tarozi", "Chayon", "O'qotar", "Tog' echkisi", "Qovg'a", "Baliq"],
    zodiacEmojis: ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"],
    elementNames: { Fire: "Olov 🔥", Earth: "Tuproq 🌿", Air: "Havo 💨", Water: "Suv 💧" },
    shareText: (score: number, verdict: string) => `Moslik ball: ${score}%! ${verdict}`,
    questions: [
      { q: "Ajoyib oqshomni qanday o'tkazasiz?", a: ["Sarguzasht izlab","Uyda shinamgina","Ikkalasi ham"] },
      { q: "Ziddiyatlarda nimani afzal ko'rasiz?", a: ["Darhol gaplashib olish","O'ylab ko'rish uchun vaqt olish","Ziddiyatdan qochish"] },
      { q: "Muloqot uslubingiz qanday?", a: ["Ochiq va ifodali","O'ylanib gapiradigan","Kayfiyatga bog'liq"] },
      { q: "Kelajak rejalari haqida?", a: ["Batafsil rejalashtiruvchi","Oqimga qarab","Ikkalasini aralashtirgan"] },
      { q: "Ijtimoiy hayotingiz?", a: ["Katta davralarni yoqtiraman","Yaqin do'stlarim yetarli","Ikkalasi ham"] },
      { q: "Mehrni qanday izhor qilasiz?", a: ["Jismoniy teginish va so'zlar","Yordam berish orqali","Birga vaqt o'tkazish"] },
      { q: "Stress vaqtida siz...", a: ["Birov bilan gaplashasiz","Yolg'izlikni xohlaysiz","Chalg'ishga harakat qilasiz"] },
      { q: "Hayot falsafangiz?", a: ["Bugungi kun bilan yashash","Kelajakni qurish","Ikkalasini muvozanatlash"] },
      { q: "O'zgarishlarga qanday qaraysiz?", a: ["Yaxshi ko'raman","Barqarorlikni afzal ko'raman","Sekin-asta qabul qilaman"] },
      { q: "Moliyaviy yondashuvingiz?", a: ["Sarflash va rohatlanish","Tejash va sarmoya qilish","Muvozanat"] }
    ]
  },
  RU: {
    appTitle: "Moslik Analizatori", appSubtitle: "Звезды читают вашу судьбу", startTest: "Начать тест", person1: "Первый человек", person2: "Второй человек", name: "Имя", gender: "Пол", male: "Мужской", female: "Женский", dob: "Дата рождения", quizTitle: "Тест личности", next: "Далее", finish: "Узнать результат", analyzing: "Вселенная анализирует вас...", compatibility: "Уровень совместимости", highComp: "ВЫСОКАЯ СОВМЕСТИМОСТЬ — Звезды на вашей стороне", midComp: "СРЕДНЯЯ СОВМЕСТИМОСТЬ — Потребуется работа над отношениями", lowComp: "НИЗКАЯ СОВМЕСТИМОСТЬ — Будьте готовы к трудностям", share: "Поделиться", retry: "Пройти снова", copied: "Скопировано!", adminLogin: "Админ Панель", password: "Пароль", login: "Войти", logout: "Выйти", dashboard: "Панель управления", totalSessions: "Всего тестов", avgScore: "Средний балл", todaySessions: "Тесты сегодня", topLang: "Популярный язык", prevPage: "Назад", nextPage: "Вперед", noData: "Нет данных", element: "Стихия",
    zodiacNames: ["Овен","Телец","Близнецы","Рак","Лев","Дева","Весы","Скорпион","Стрелец","Козерог","Водолей","Рыбы"],
    zodiacEmojis: ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"],
    elementNames: { Fire: "Огонь 🔥", Earth: "Земля 🌿", Air: "Воздух 💨", Water: "Вода 💧" },
    shareText: (score: number, verdict: string) => `Совместимость: ${score}%! ${verdict}`,
    questions: [
      { q: "Как вы проводите идеальный вечер?", a: ["В поисках приключений","Уютно дома","И то, и другое"] },
      { q: "В конфликтах вы предпочитаете?", a: ["Обсудить сразу","Взять время остыть","Избегать конфликта"] },
      { q: "Ваш стиль общения?", a: ["Открытый и экспрессивный","Вдумчивый и сдержанный","Зависит от настроения"] },
      { q: "Планы на будущее?", a: ["Детальное планирование","Плыть по течению","Смесь того и другого"] },
      { q: "Ваша социальная жизнь?", a: ["Люблю большие компании","Предпочитаю узкий круг","И то, и другое"] },
      { q: "Как вы проявляете любовь?", a: ["Прикосновения и слова","Через помощь и заботу","Качественное время вместе"] },
      { q: "Когда вы в стрессе, вы...", a: ["Говорите с кем-то","Нуждаетесь в одиночестве","Пытаетесь отвлечься"] },
      { q: "Ваша жизненная философия?", a: ["Жить сегодняшним днем","Строить будущее","Балансировать"] },
      { q: "Отношение к переменам?", a: ["Обожаю перемены","Предпочитаю стабильность","Принимаю постепенно"] },
      { q: "Отношение к финансам?", a: ["Тратить и наслаждаться","Копить и инвестировать","Баланс"] }
    ]
  },
  EN: {
    appTitle: "Moslik Analizatori", appSubtitle: "The stars are reading your destiny", startTest: "Start Test", person1: "First Person", person2: "Second Person", name: "Name", gender: "Gender", male: "Male", female: "Female", dob: "Date of Birth", quizTitle: "Personality Quiz", next: "Next", finish: "Reveal Result", analyzing: "The universe is analyzing you...", compatibility: "Compatibility Level", highComp: "HIGH COMPATIBILITY — The stars are aligned for you", midComp: "MID COMPATIBILITY — Will require some work together", lowComp: "LOW COMPATIBILITY — Brace for challenges", share: "Share", retry: "Try Again", copied: "Copied!", adminLogin: "Admin Panel", password: "Password", login: "Login", logout: "Logout", dashboard: "Dashboard", totalSessions: "Total Sessions", avgScore: "Average Score", todaySessions: "Today's Sessions", topLang: "Top Language", prevPage: "Previous", nextPage: "Next", noData: "No data", element: "Element",
    zodiacNames: ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"],
    zodiacEmojis: ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"],
    elementNames: { Fire: "Fire 🔥", Earth: "Earth 🌿", Air: "Air 💨", Water: "Water 💧" },
    shareText: (score: number, verdict: string) => `We got ${score}%! ${verdict}`,
    questions: [
      { q: "How do you spend a perfect evening?", a: ["Adventure out","Cozy home","Both equally"] },
      { q: "In conflicts you prefer?", a: ["Talk it out immediately","Take time to cool off","Avoid conflict"] },
      { q: "Your communication style?", a: ["Very open and expressive","Thoughtful and reserved","Depends on mood"] },
      { q: "Regarding future plans?", a: ["Detailed planner","Go with the flow","Mix of both"] },
      { q: "Your social life?", a: ["Love big gatherings","Prefer close circle","Both"] },
      { q: "Showing affection?", a: ["Physical touch and words","Acts of service","Quality time"] },
      { q: "When stressed you?", a: ["Talk to someone","Need alone time","Distract yourself"] },
      { q: "Your life philosophy?", a: ["Live for today","Build for tomorrow","Balance both"] },
      { q: "Dealing with change?", a: ["Love it, embrace change","Prefer stability","Accept it gradually"] },
      { q: "Financial approach?", a: ["Spend and enjoy","Save and invest","Balance"] }
    ]
  }
};