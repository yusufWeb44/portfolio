import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TRANSLATIONS = [
  // ── 1. Services & Scope ──
  {
    order: 1,
    question: 'What types of projects do you take on?',
    categoryAr: 'الخدمات ونطاق العمل',
    questionAr: 'ما هي أنواع المشاريع التي تعمل عليها؟',
    answerAr: 'أعمل على تطوير تطبيقات الويب المتكاملة، أنظمة CRM/ERP المخصصة، واجهات برمجية REST و GraphQL، منصات التجارة الإلكترونية، منتجات SaaS، وتطبيقات الموبايل. سواءً كنت بحاجة لنموذج أولي سريع أو شريك تقني طويل الأمد.',
  },
  {
    order: 2,
    question: 'Do you offer freelance and consulting engagements?',
    categoryAr: 'الخدمات ونطاق العمل',
    questionAr: 'هل تقدم خدمات العمل الحر والاستشارات البرمجية المستمرة؟',
    answerAr: 'نعم، أنا متاح للمشاريع التعاقدية الحرة، والاستشارات الجزئية، وعقود الدعم المستمر، بالإضافة لجلسات تدقيق الأكواد وتقديم الاستشارات المعمارية للفرق البرمجية.',
  },
  {
    order: 3,
    question: 'Can you build both the front-end and back-end of an application?',
    categoryAr: 'الخدمات ونطاق العمل',
    questionAr: 'هل يمكنك بناء كل من الواجهة الأمامية والخلفية للتطبيق بالكامل؟',
    answerAr: 'بالتأكيد، أنا متخصص في التطوير المتكامل من البداية إلى النهاية — بدءاً من واجهات React/Next.js العصرية، إلى خوادم Node.js/Express، وتصميم قواعد البيانات (MySQL, PostgreSQL, MongoDB)، والنشر السحابي، مما يضمن لك نقطة مسؤولية واحدة لكامل المشروع.',
  },
  {
    order: 4,
    question: 'Do you provide UI/UX design as well?',
    categoryAr: 'الخدمات ونطاق العمل',
    questionAr: 'هل تقدم خدمات تصميم واجهات وتجربة المستخدم (UI/UX) أيضاً؟',
    answerAr: 'نعم، أصمم الواجهات على Figma قبل البدء بكتابة الأكواد. أركز على تجارب استخدام مدروسة وسلسة تجمع بين الجمالية البصرية وسهولة الاستخدام العالية المتوافقة مع أحدث أنظمة التصميم.',
  },

  // ── 2. Process & Timeline ──
  {
    order: 5,
    question: 'How does the project process typically work?',
    categoryAr: 'منهجية وسير العمل',
    questionAr: 'كيف تسير مرحلة تنفيذ المشروع عادةً؟',
    answerAr: 'نبدأ بجلسة استكشافية لتحديد المتطلبات والنطاق بدقة، ثم أقدم مقترحاً فنياً وجدولاً زمنياً مفصلاً. يجري التطوير عبر مراحل قصيرة مع عروض تجريبية حية، ويختتم المشروع بالنشر السحابي وتوثيق الكود وفترة دعم مخصصة.',
  },
  {
    order: 6,
    question: 'How long does it take to build a web application?',
    categoryAr: 'منهجية وسير العمل',
    questionAr: 'كم من الوقت يستغرق بناء تطبيق ويب متكامل؟',
    answerAr: 'النموذج الأولي المركز (MVP) يمكن إطلاقه خلال 2 إلى 4 أسابيع. المنصات الشاملة أو أنظمة الـ CRM تستغرق عادة من 4 إلى 6 أسابيع حسب تعقيد الميزات والربط مع الخدمات الخارجية، مع تقديم جدول زمني واضح ومحدد مسبقاً.',
  },
  {
    order: 7,
    question: 'Will I be able to track progress during development?',
    categoryAr: 'منهجية وسير العمل',
    questionAr: 'هل يمكنني متابعة سير العمل أثناء مرحلة التطوير؟',
    answerAr: 'نعم بكل تأكيد. أستخدم مستودعات GitHub مع منح صلاحية المتابعة، بالإضافة لاجتماعات دورية وعروض حية لتعرف دائماً ما تم إنجازه وما يجري العمل عليه حالياً.',
  },
  {
    order: 8,
    question: 'Do you offer post-launch support and maintenance?',
    categoryAr: 'منهجية وسير العمل',
    questionAr: 'هل تقدم خدمات الدعم الفني والصيانة بعد الإطلاق؟',
    answerAr: 'نعم. أقدم حزم دعم فني بعد الإطلاق تشمل إصلاح أي مشكلات، مراقبة الأداء، تحديث التبعيات البرمجية، وإضافة تحسينات وميزات جديدة حسب الاتفاق.',
  },

  // ── 3. Tech Stack ──
  {
    order: 9,
    question: 'What is your primary tech stack?',
    categoryAr: 'التقنيات المستخدمة',
    questionAr: 'ما هي حزمتك التقنية الأساسية (Tech Stack)؟',
    answerAr: 'في الواجهات: React, Next.js, TypeScript, و Tailwind CSS. في الخوادم: Node.js, Express, Prisma, و REST APIs. في قواعد البيانات: MySQL, PostgreSQL, و MongoDB. في الموبايل: Flutter. وفي الاستضافة والـ DevOps: Docker, Nginx, وسيرفرات سحابية.',
  },
  {
    order: 10,
    question: 'Can you work with an existing codebase or tech stack?',
    categoryAr: 'التقنيات المستخدمة',
    questionAr: 'هل يمكنك العمل على مشروع أو كود موجود مسبقاً؟',
    answerAr: 'نعم. أستطيع الانضمام للمشاريع الحالية، تدقيق الأكواد القائمة، إعادة الهيكلة (Refactoring)، وتحديث المعماريات البرمجية تدريجياً دون تعطيل بيئة العمل المباشرة.',
  },
  {
    order: 11,
    question: 'Do you build mobile applications?',
    categoryAr: 'التقنيات المستخدمة',
    questionAr: 'هل تقوم بتطوير تطبيقات الهواتف المحمولة أيضاً؟',
    answerAr: 'نعم. أقوم بتطوير تطبيقات متعددة المنصات باستخدام Flutter و Dart لنظامي iOS و Android مع تكامل الـ APIs، التخزين المحلي، إدارة الحالة المتقدمة، والنشر على المتاجر الرسمية.',
  },
  {
    order: 12,
    question: 'What tools do you use for UI/UX design?',
    categoryAr: 'التقنيات المستخدمة',
    questionAr: 'ما هي الأدوات التي تستخدمها في تصميم واجهات المستخدم؟',
    answerAr: 'أعتمد على Figma كأداة رئيسية لتصميم النماذج الأولية والأنظمة التصميمية المتكاملة، بالإضافة إلى Framer لاختبار الحركات والتفاعلات المتقدمة.',
  },

  // ── 4. Working Together ──
  {
    order: 13,
    question: 'How do we get started?',
    categoryAr: 'التعاون والبدء',
    questionAr: 'كيف نبدأ العمل معاً؟',
    answerAr: 'أرسل لي رسالة عبر نموذج التواصل أدناه أو تواصل مباشرة عبر واتساب أو البريد الإلكتروني. وضح أهداف مشروعك والجدول المتوقع، وسأرد عليك خلال 24 ساعة بمقترح ومكالمة لتحديد تفاصيل البدء.',
  },
  {
    order: 14,
    question: 'Do you work with international clients?',
    categoryAr: 'التعاون والبدء',
    questionAr: 'هل تعمل مع عملاء دوليين من مختلف الدول؟',
    answerAr: 'نعم، أعمل مع عملاء حول العالم عبر مناطق زمنية مختلفة بتواصل سلس باللغتين العربية والإنجليزية، واستقبال الدفعات عبر التحويلات الدولية، PayPal، أو Wise.',
  },
  {
    order: 15,
    question: 'What information do you need to provide a quote?',
    categoryAr: 'التعاون والبدء',
    questionAr: 'ما هي التفاصيل المطلوبة لتقديم عرض سعر وتقدير زمني؟',
    answerAr: 'وصف موجز للمشروع، الميزات الرئيسية المطلوبة، نماذج أو مواقع ملهمة تعجبك، موعد الإطلاق المستهدف، والنطاق المالي المتوقع. كلما كانت التفاصيل أوضح، كان التقدير أكثر دقة.',
  },
  {
    order: 16,
    question: 'Do you sign NDAs or contracts?',
    categoryAr: 'التعاون والبدء',
    questionAr: 'هل توقع اتفاقيات عدم إفصاح (NDA) وعقود عمل رسمية؟',
    answerAr: 'نعم دائماً. أوقع اتفاقية عدم إفصاح متبادلة (NDA) لحماية أفكارك، ويبدأ كل مشروع بعقد رسمي يوضح النطاق والمراحل وجدول الدفع وحقوق الملكية الفكرية الكاملة للكود الخاص بك.',
  },
];

async function main() {
  const existingFaqs = await prisma.faqItem.findMany();
  console.log(`Found ${existingFaqs.length} FAQs in database.`);

  let updatedCount = 0;
  for (const item of existingFaqs) {
    // Match by question or order
    const match = TRANSLATIONS.find(
      (t) => t.question.trim().toLowerCase() === item.question.trim().toLowerCase() || t.order === item.order
    );

    if (match) {
      await prisma.faqItem.update({
        where: { id: item.id },
        data: {
          questionAr: match.questionAr,
          answerAr: match.answerAr,
          categoryAr: match.categoryAr,
        },
      });
      updatedCount++;
      console.log(`Updated FAQ [${item.order}]: "${match.question}" -> "${match.questionAr}"`);
    } else {
      console.warn(`No translation match found for FAQ id=${item.id}: "${item.question}"`);
    }
  }

  console.log(`\nSuccessfully updated ${updatedCount} FAQs with Arabic translations!`);
}

main()
  .catch((e) => {
    console.error('Error updating FAQs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

