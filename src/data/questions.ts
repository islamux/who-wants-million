import type { Question, MoneyLevel } from '../types/game'

export const questions: Question[] = [
  { text: "ما هي عاصمة فرنسا؟", options: [{ text: "لندن", correct: false }, { text: "برلين", correct: false }, { text: "باريس", correct: true }, { text: "مدريد", correct: false }] },
  { text: "ما هو أكبر كوكب في مجموعتنا الشمسية؟", options: [{ text: "الأرض", correct: false }, { text: "المريخ", correct: false }, { text: "زحل", correct: false }, { text: "المشتري", correct: true }] },
  { text: "من هو مخترع المصباح الكهربائي؟", options: [{ text: "نيكولا تيسلا", correct: false }, { text: "توماس إديسون", correct: true }, { text: "ألكسندر جراهام بيل", correct: false }, { text: "ألبرت أينشتاين", correct: false }] },
  { text: "ما هي أطول سورة في القرآن الكريم؟", options: [{ text: "البقرة", correct: true }, { text: "آل عمران", correct: false }, { text: "النساء", correct: false }, { text: "المائدة", correct: false }] },
  { text: "في أي عام بدأت الحرب العالمية الأولى؟", options: [{ text: "1912", correct: false }, { text: "1914", correct: true }, { text: "1916", correct: false }, { text: "1918", correct: false }] },
  { text: "ما هو العنصر الكيميائي الذي رمزه 'O'؟", options: [{ text: "الذهب", correct: false }, { text: "الفضة", correct: false }, { text: "الأكسجين", correct: true }, { text: "الهيدروجين", correct: false }] },
  { text: "من رسم لوحة الموناليزا؟", options: [{ text: "مايكل أنجلو", correct: false }, { text: "ليوناردو دا فينشي", correct: true }, { text: "رافائيل", correct: false }, { text: "فان جوخ", correct: false }] },
  { text: "ما هو المحيط الأكبر في العالم؟", options: [{ text: "الأطلسي", correct: false }, { text: "الهندي", correct: false }, { text: "المتجمد الشمالي", correct: false }, { text: "الهادئ", correct: true }] },
  { text: "كم عدد الدول العربية في قارة آسيا؟", options: [{ text: "10", correct: false }, { text: "11", correct: false }, { text: "12", correct: true }, { text: "13", correct: false }] },
  { text: "ما هي الدولة التي لُقبت بـ 'بلاد الألف بحيرة'؟", options: [{ text: "السويد", correct: false }, { text: "فنلندا", correct: true }, { text: "النرويج", correct: false }, { text: "كندا", correct: false }] },
  { text: "من هو مؤلف كتاب 'ألف ليلة وليلة'؟", options: [{ text: "الجاحظ", correct: false }, { text: "ابن المقفع", correct: false }, { text: "غير معروف/مجموعة مؤلفين", correct: true }, { text: "المتنبي", correct: false }] },
  { text: "ما هي عملة اليابان؟", options: [{ text: "وون", correct: false }, { text: "يوان", correct: false }, { text: "دولار", correct: false }, { text: "ين", correct: true }] },
  { text: "في أي قارة تقع صحراء أتاكاما؟", options: [{ text: "أفريقيا", correct: false }, { text: "آسيا", correct: false }, { text: "أمريكا الجنوبية", correct: true }, { text: "أستراليا", correct: false }] },
  { text: "من هو أول رائد فضاء مشى على سطح القمر؟", options: [{ text: "يوري جاجارين", correct: false }, { text: "نيل أرمسترونج", correct: true }, { text: "باز ألدرن", correct: false }, { text: "جون جلين", correct: false }] },
  { text: "ما هو الاسم القديم لمدينة إسطنبول؟", options: [{ text: "أنقرة", correct: false }, { text: "بيزنطة", correct: false }, { text: "القسطنطينية", correct: true }, { text: "أزمير", correct: false }] },
]

export const moneyLevels: MoneyLevel[] = [
  { amount: "100 ريال", isSafeHaven: false },
  { amount: "200 ريال", isSafeHaven: false },
  { amount: "300 ريال", isSafeHaven: false },
  { amount: "500 ريال", isSafeHaven: false },
  { amount: "1,000 ريال", isSafeHaven: true },
  { amount: "2,000 ريال", isSafeHaven: false },
  { amount: "4,000 ريال", isSafeHaven: false },
  { amount: "8,000 ريال", isSafeHaven: false },
  { amount: "16,000 ريال", isSafeHaven: false },
  { amount: "32,000 ريال", isSafeHaven: true },
  { amount: "64,000 ريال", isSafeHaven: false },
  { amount: "125,000 ريال", isSafeHaven: false },
  { amount: "250,000 ريال", isSafeHaven: false },
  { amount: "500,000 ريال", isSafeHaven: false },
  { amount: "1,000,000 ريال", isSafeHaven: true },
]
