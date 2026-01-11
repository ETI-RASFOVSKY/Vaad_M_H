import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="section-container bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            אודות ועד מבקשי ה'
          </h1>
        </motion.div>
      </section>

      {/* Main Content */}
      <section className="section-container">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none"
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">הסיפור שלנו</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              ועד מבקשי השם הינו ארגון בעל יוזמה ייחודית בעולם התורה הישיבתי אשר נותן מענה אמיתי ומתמשך לבחורים במצבים רבים ושונים בדורנו.
              המענה ניתן ומותאם לבחורים רגילים וכך גם לבחורים חלשים ומתקשים, באופן פרטני ובאופן כללי.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              הארגון הוקם ע"י הרב אהרון יצחק בירנצוייג שליט"א ר"מ בישיבת מיר בעידודם ותמיכתם הנלהבת של גדולי ישראל שליט"א וזצוקל"ה מתוך מטרה נעלה ונצרכת,
              להיות במקום שאין איש, להציע פתרונות יצירתיים לבעיות שהשגרה והשחיקה מייצרות בקרב הבחורים הצעירים,
              ובמקביל לחזק ולרומם את בני הישיבות הקדושות באופן עקבי ע"י ועד שבועי המטעין את הבחורים בחשק מחודש להמשך עלייתם הרוחנית
              עם נתינת דגש על עניין האמונה והחיבור לבורא עולם בכל זמן ובכל מצב.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              כ"כ נדבך חשוב בקיומם של הועדים הוא, ליצור פלטפורמה נוחה ומקרבת, המאפשרת לבחורים לפנות ולקבל מענה אישי בנושאים שונים
              ולשתף בלבטים העולים אצלם, כשבדרך כלל הם נמנעים מלשתף את הדמויות המקובלות.
              נקודה חשובה לציון היא העובדה שההשתתפות בועדים והקשר האישי עם הרב במקרים רבים היוותה תרופה מקדימה להידרדרות רוחנית.
            </p>
          </motion.div>

          {/* Activities Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-50 p-8 rounded-lg"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900">אופן הפעילות</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              הועד מתקיים מידי יום, בשעת ארוחת הערב כל יום בעיר אחרת, בועד מתרכזים בחורים ממגוון הישיבות בעיר,
              במהלכו של הועד מוסר הרב שליט"א דברי חיזוק ועידוד המתיישבים על הלב, בשילוב נגינה הפורטת על נימי הנפש ושירי דביקות ורגש.
              הבחורים יושבים סביב שולחנות ערוכים באוכל ביתי ומגוון הנותנים מענה גם בפן הגשמי.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              מידי פעם הועד יוצא לרענון ומתקיים שלא במקום הקבוע, פעמים ביערות השקטים הרחוקים משאון העיר ופעמים בקברי צדיקים,
              בזמנים מתאימים כדוגמת תשעת הימים גם בכותל המערבי.
            </p>
            <p className="text-gray-700 leading-relaxed">
              בכל ועד נמצא רכז, אברך יר"ש אשר מתמסר ומשקיע מזמנו ומרצו לקיומו ותחזוקו של הועד הן בהיבט הגשמי והן בהיבט הרוחני
              תוך קשר מתמיד ורצוף עם הבחורים שבועד.
            </p>
          </motion.div>

          {/* Special Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900">אירועים מיוחדים</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-gold-DEFAULT">חנוכה ול"ג בעומר</h3>
                <p className="text-gray-700">
                  פעמיים בשנה מקיים הארגון אירועים מיוחדים (חנוכה ול"ג בעומר) לאירועים אלו מוזמנים הבחורים מכלל הועדים
                  וכן בוגרי וידידי הועד, אירועים אלו תורמים לחיבור נוסף של הבחורים עם הועד ורצון להיות שייך.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3 text-gold-DEFAULT">שבתות גיבוש</h3>
                <p className="text-gray-700">
                  מידי שנה הארגון מקיים שבת גיבוש לכלל בני הועדים המתקיימים בשבתות חופשה שבישיבות,
                  תוך משימה משותפת של סיומי מסכת הנערכים ב"ועדים" במשך השנה,
                  שבתות אלו תורמים תרומה מכרעת בגיבושם של הבחורים וכן בצבירת כוחות מחודשת להמשך התנופה הרוחנית.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Additional Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-gold-50 p-8 rounded-lg"
          >
            <h2 className="text-3xl font-bold mb-6 text-gray-900">ועדים נוספים</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              מלבד הועדים לבני הישיבות מקיים הארגון ועד שבועי לאברכים בני עליה המקבלים הדרכה מעשית ופרקטית לחיי היום יום,
              כ"כ ועד לנשואים העמלים לפרנסתם המהווה בעבורם קשר לעולם התורה, ולהשקפה הברורה תוך חיבור לדמות תורנית כמורינו הרב שליט"א המשייכם לעולם התורני.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <Link to="/gallery" className="btn-primary text-center">
              לגלריה
            </Link>
            <Link to="/contact" className="btn-secondary text-center">
              צור קשר
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
