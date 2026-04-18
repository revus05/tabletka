import "dotenv/config"
import { PrismaClient } from "../generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Starting seed...")

  // ── Users ──────────────────────────────────────────────────────────────────
  const adminHash = await bcrypt.hash("Admin123!", 12)
  const userHash = await bcrypt.hash("User1234!", 12)

  await prisma.user.upsert({
    where: { email: "admin@tabletka.by" },
    update: {},
    create: { email: "admin@tabletka.by", name: "Администратор", passwordHash: adminHash, role: "ADMIN" },
  })
  await prisma.user.upsert({
    where: { email: "user@tabletka.by" },
    update: {},
    create: { email: "user@tabletka.by", name: "Тестовый пользователь", passwordHash: userHash, role: "USER" },
  })
  console.log("✅ Users created")

  // ── Pharmacies ─────────────────────────────────────────────────────────────
  const pharmacyData = [
    { name: "Белфармация Аптека N25", address: "ул. Олега Кошевого, 10", city: "Минск", region: "Минск", phone: "+375 17 270 11 25" },
    { name: "Белфармация Аптека N100", address: "ул. Асаналиева, 40Б", city: "Минск", region: "Минск", phone: "+375 17 270 10 00" },
    { name: "ЯССА ПКФ Аптека N10", address: "ул. Олешева, 1", city: "Минск", region: "Минск", phone: "+375 17 290 55 10" },
    { name: "Гомельское УП Фармация Аптека N196", address: "аг. Коммунар, ул. Спортивная, 3", city: "Гомель", region: "Гомель", phone: "+375 23 245 19 60" },
    { name: "Витебское УП Фармация Аптека NT125", address: "д. Добромысли", city: "Витебск", region: "Витебск", phone: "+375 21 260 12 25" },
    { name: "Доминантафарм ОДО Аптека N28", address: "ул. Генерала Ивановского, 17", city: "Витебск", region: "Витебск", phone: "+375 21 236 02 28" },
    { name: "Гродненское РУП Фармация Аптека N197", address: "ул. Дзержинского, 2", city: "Гродно", region: "Гродно", phone: "+375 15 274 19 70" },
    { name: "Брестское РУП Фармация Аптека N45", address: "ул. Советская, 78", city: "Брест", region: "Брест", phone: "+375 16 220 04 50" },
  ]

  const pharmacies = []
  for (const data of pharmacyData) {
    const pharmacy = await prisma.pharmacy.upsert({
      where: { id: pharmacyData.indexOf(data) + 1 },
      update: data,
      create: data,
    })
    pharmacies.push(pharmacy)
  }
  console.log(`✅ ${pharmacies.length} pharmacies created`)

  // ── Medications ────────────────────────────────────────────────────────────
  const medicationData = [
    { name: "Синупрет таблетки", genericName: "Экстракт вербены", manufacturer: "Bionorica SE, Германия", description: "Комбинированный растительный препарат для лечения синуситов." },
    { name: "Амоксиклав 625 мг", genericName: "Амоксициллин + клавулановая кислота", manufacturer: "Sandoz, Словения", description: "Антибиотик широкого спектра действия." },
    { name: "Нольпаза 20 мг", genericName: "Пантопразол", manufacturer: "KRKA, Словения", description: "Ингибитор протонной помпы. Применяется при язве и ГЭРБ." },
    { name: "Витрум со вкусом", genericName: "Поливитамины", manufacturer: "Unipharm, США", description: "Комплекс витаминов и минералов для детей." },
    { name: "Вобэнзим", genericName: "Бромелаин + Папаин + Рутозид", manufacturer: "MUCOS Pharma, Германия", description: "Системная энзимотерапия. Противовоспалительное действие." },
    { name: "Линекс капсулы", genericName: "Лактобациллы + Бифидобактерии", manufacturer: "Sandoz, Словения", description: "Пробиотик для восстановления микрофлоры кишечника." },
    { name: "Димексид раствор 50%", genericName: "Диметилсульфоксид", manufacturer: "Нижфарм, Россия", description: "Противовоспалительный и обезболивающий препарат для местного применения." },
    { name: "Форлакс 10 г", genericName: "Макрогол 4000", manufacturer: "Beaufour Ipsen, Франция", description: "Слабительное осмотического действия при запорах." },
    { name: "Остеогенон", genericName: "Оссеин-гидроксиапатит", manufacturer: "Pierre Fabre, Франция", description: "Препарат для лечения остеопороза." },
    { name: "Нейромидин 20 мг", genericName: "Ипидакрин", manufacturer: "Олайнфарм, Латвия", description: "Применяется при периферических парезах и параличах." },
    { name: "Атоксил порошок", genericName: "Кремния диоксид коллоидный", manufacturer: "ФК Здоровье, Украина", description: "Энтеросорбент. Лечение отравлений и диареи." },
    { name: "Магний B6 таблетки", genericName: "Магния лактат + Пиридоксин", manufacturer: "Sanofi, Франция", description: "Дефицит магния, стресс, судороги мышц." },
    { name: "Аугментин 875 мг", genericName: "Амоксициллин + клавулановая кислота", manufacturer: "GlaxoSmithKline, Великобритания", description: "Антибиотик для лечения инфекций." },
    { name: "Нефроник капсулы", genericName: "Экстракт листьев брусники", manufacturer: "Rekvizit, Беларусь", description: "Мочегонное и противомикробное действие при болезнях почек." },
    { name: "Омепразол 20 мг", genericName: "Омепразол", manufacturer: "KRKA, Словения", description: "Лечение язвенной болезни желудка." },
    { name: "Цитрамон П", genericName: "Ацетилсалициловая кислота + Парацетамол + Кофеин", manufacturer: "Дальхимфарм, Россия", description: "Обезболивающее и жаропонижающее." },
    { name: "Но-шпа 40 мг", genericName: "Дротаверин", manufacturer: "Chinoin, Венгрия", description: "Спазмолитик. Снимает спазмы гладкой мускулатуры." },
    { name: "Фурацилин таблетки", genericName: "Нитрофурал", manufacturer: "Авексима, Россия", description: "Антисептик для промывания ран и полосканий." },
    { name: "Панкреатин 25 ЕД", genericName: "Панкреатин", manufacturer: "Фармстандарт, Россия", description: "Ферментный препарат. Улучшает пищеварение." },
    { name: "Ибупрофен 200 мг", genericName: "Ибупрофен", manufacturer: "Медисорб, Россия", description: "НПВС. Обезболивание, жаропонижение, противовоспалительное." },
    { name: "Мезим форте 10 000", genericName: "Панкреатин", manufacturer: "Berlin-Chemie, Германия", description: "Пищеварительный фермент при недостаточности поджелудочной железы." },
    { name: "Кетонал 100 мг", genericName: "Кетопрофен", manufacturer: "Sandoz, Словения", description: "НПВС для лечения болевого синдрома." },
    { name: "Лоратадин 10 мг", genericName: "Лоратадин", manufacturer: "КРКА, Словения", description: "Антигистаминный препарат. Лечение аллергии." },
    { name: "Бисептол 480 мг", genericName: "Ко-тримоксазол", manufacturer: "Polpharma, Польша", description: "Комбинированный антибактериальный препарат." },
    { name: "Валерианы экстракт", genericName: "Экстракт валерианы", manufacturer: "Фармстандарт, Россия", description: "Успокоительное и снотворное растительное средство." },
  ]

  const medications = []
  for (const data of medicationData) {
    const medication = await prisma.medication.upsert({
      where: { id: medicationData.indexOf(data) + 1 },
      update: data,
      create: data,
    })
    medications.push(medication)
  }
  console.log(`✅ ${medications.length} medications created`)

  // ── Stock ──────────────────────────────────────────────────────────────────
  const stockEntries: Array<{
    medicationId: number
    pharmacyId: number
    price: number
    quantity: number
    maxQuantity: number
    inStock: boolean
  }> = []

  // Each medication gets assigned to 3-6 random pharmacies with varying prices
  for (const med of medications) {
    const pharmacyCount = 3 + Math.floor(Math.random() * 4)
    const shuffled = [...pharmacies].sort(() => Math.random() - 0.5).slice(0, pharmacyCount)
    const basePrice = 3 + Math.random() * 25

    for (const pharmacy of shuffled) {
      const variance = (Math.random() - 0.5) * 4
      const price = Math.max(1, basePrice + variance)
      const quantity = Math.random() > 0.15 ? Math.floor(Math.random() * 80) + 1 : 0
      stockEntries.push({
        medicationId: med.id,
        pharmacyId: pharmacy.id,
        price: Math.round(price * 100) / 100,
        quantity,
        maxQuantity: 100,
        inStock: quantity > 0,
      })
    }
  }

  for (const entry of stockEntries) {
    await prisma.stock.upsert({
      where: { medicationId_pharmacyId: { medicationId: entry.medicationId, pharmacyId: entry.pharmacyId } },
      update: entry,
      create: entry,
    })
  }
  console.log(`✅ ${stockEntries.length} stock entries created`)

  // ── Popular searches ────────────────────────────────────────────────────────
  const popularCounts = [1988, 1492, 1278, 1201, 962, 924, 909, 863, 840, 821]
  for (let i = 0; i < Math.min(medications.length, popularCounts.length); i++) {
    await prisma.popularSearch.upsert({
      where: { id: i + 1 },
      update: { searchCount: popularCounts[i] },
      create: { medicationId: medications[i].id, searchCount: popularCounts[i] },
    })
  }
  console.log("✅ Popular searches created")

  // ── News ───────────────────────────────────────────────────────────────────
  const newsData = [
    {
      title: "В Беларуси расширили список льготных лекарств",
      excerpt: "Министерство здравоохранения утвердило расширенный перечень льготных лекарственных средств.",
      content: "С 1 мая 2025 года в Беларуси вступает в силу новый перечень льготных лекарственных средств, включающий более 500 наименований.",
      publishedAt: new Date("2025-04-18"),
    },
    {
      title: "Аптечные сети Минска переходят на новый формат обслуживания",
      excerpt: "Крупнейшие аптечные сети столицы внедряют систему самообслуживания.",
      content: "В рамках модернизации аптечной сферы ряд крупных сетей начинает установку терминалов самообслуживания.",
      publishedAt: new Date("2025-04-17"),
    },
    {
      title: "Мингорздрав: запасы инсулина в аптеках стабильны",
      excerpt: "Представители Минздрава опровергли слухи о дефиците инсулина.",
      content: "Запасы инсулина всех типов в государственных аптеках находятся на достаточном уровне.",
      publishedAt: new Date("2025-04-16"),
    },
    {
      title: "Онлайн-бронирование лекарств стало доступно в 500 аптеках",
      excerpt: "Сервис бронирования лекарств через интернет расширил географию присутствия.",
      content: "Теперь жители всех областных центров могут забронировать нужный препарат не выходя из дома.",
      publishedAt: new Date("2025-04-15"),
    },
    {
      title: "Белорусские фармацевты создали новый препарат против гриппа",
      excerpt: "Учёные Института биоорганической химии разработали инновационное противовирусное средство.",
      content: "Новый препарат прошёл клинические испытания и показал эффективность 89% при лечении гриппа типа А и В.",
      publishedAt: new Date("2025-04-14"),
    },
    {
      title: "Весенняя акция: скидки до 30% на витаминные комплексы",
      excerpt: "Аптечные сети объявили о весенних скидках на популярные витаминные препараты.",
      content: "С 15 апреля по 15 мая 2025 года в аптеках действуют скидки до 30% на витаминные комплексы.",
      publishedAt: new Date("2025-04-13"),
    },
  ]

  for (let i = 0; i < newsData.length; i++) {
    await prisma.news.upsert({
      where: { id: i + 1 },
      update: newsData[i],
      create: newsData[i],
    })
  }
  console.log("✅ News created")

  // ── Promotions ─────────────────────────────────────────────────────────────
  const promotionsData = [
    {
      pharmacyId: pharmacies[0].id,
      title: "«СОБИРАЙКА» — долгожданная акция снова в аптеках Белфармация!",
      description: "При покупке 3 любых товаров — 4-й в подарок. Акция действует до 30 мая 2025.",
      startDate: new Date("2025-04-01"),
      endDate: new Date("2025-05-30"),
    },
    {
      pharmacyId: pharmacies[3].id,
      title: "Скидка 20% на все противопростудные препараты",
      description: "Весенняя акция Гомельской фармации. Скидки на антибиотики и противовирусные.",
      startDate: new Date("2025-04-10"),
      endDate: new Date("2025-04-30"),
    },
    {
      pharmacyId: pharmacies[6].id,
      title: "Гродненское РУП Фармация: бесплатная доставка от 30 рублей",
      description: "При заказе лекарств на сумму от 30 рублей — бесплатная доставка по городу.",
      startDate: new Date("2025-03-01"),
      endDate: new Date("2025-06-01"),
    },
  ]

  for (let i = 0; i < promotionsData.length; i++) {
    await prisma.promotion.upsert({
      where: { id: i + 1 },
      update: promotionsData[i],
      create: promotionsData[i],
    })
  }
  console.log("✅ Promotions created")

  console.log("\n🎉 Seed completed successfully!")
  console.log("   Admin: admin@tabletka.by / Admin123!")
  console.log("   User:  user@tabletka.by / User1234!")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
