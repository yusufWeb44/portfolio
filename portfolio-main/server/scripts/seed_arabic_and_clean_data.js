const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Arabic & Clean Data Seeding ---');

  // 1. Projects Translation Seeding
  const projects = await prisma.project.findMany();
  for (const p of projects) {
    let titleAr = p.title;
    let categoryAr = 'تطبيقات الويب';
    let roleAr = 'مطور ومصمم متكامل (Full-Stack Developer)';
    let descriptionAr = '';
    let challengeAr = '';
    let solutionAr = '';
    let featuresAr = '';
    let resultsAr = '';

    const lower = (p.title + ' ' + (p.description || '')).toLowerCase();
    if (lower.includes('vecmenu') || lower.includes('menu') || lower.includes('qr')) {
      titleAr = 'نظام فيك منيو الذكي (VecMenu)';
      categoryAr = 'منصات الـ SaaS وقوائم المطاعم الرقمية';
      roleAr = 'مؤسس مشارك ورئيس مهندسي الواجهات (Co-Founder & Lead Frontend)';
      descriptionAr = 'منصة ويب متكاملة تتيح للمطاعم والمقاهي إنشاء وإدارة قوائم طعام رقمية تفاعلية عبر رمز QR، مما يتيح للزبائن تصفح المنيو فوراً من هواتفهم دون الحاجة لتحميل أي تطبيق، مع تحديث فوري للأسعار والأطباق.';
      challengeAr = 'توفير تجربة استعراض قائمة أطباق سريعة جداً تعمل بسلاسة على كافة أنواع الهواتف الذكية مع استهلاك منخفض للبيانات وتحديث فوري متزامن للأسعار.';
      solutionAr = 'بناء واجهة تفاعلية فائقة السرعة باستخدام React و Next.js مع معمارية تخزين مؤقت ذكية وتصميم متجاوب 100% يدعم مختلف اللغات.';
      featuresAr = 'توليد رموز QR مخصصة، لوحة تحكم فورية لإدارة الأطباق، دعم متعدد اللغات، وتصميم متجاوب متكامل.';
      resultsAr = 'تحسين تجربة أكثر من 15 مطعماً وتقليل تكاليف طباعة المنيو الورقي بنسبة 100% مع زيادة سرعة الطلب.';
    } else if (lower.includes('anime') || lower.includes('anilist')) {
      titleAr = 'منصة أنمي بلس (AnimePlus)';
      categoryAr = 'تطبيقات الويب التفاعلية والترفيهية';
      roleAr = 'مطور ويب متكامل (Full-Stack Engineer)';
      descriptionAr = 'تطبيق ويب متكامل وشامل لعشاق الأنمي، يتيح استعراض أحدث الأعمال الرائجة، وإدارة قوائم المشاهدة المخصصة، مع مزامنة فورية للبيانات وتقييمات الحلقات والعروض الدعائية عبر واجهات برمجة AniList.';
      challengeAr = 'التعامل مع كميات هائلة من البيانات الخارجية ومزامنتها لحظياً دون التأثير على سرعة تصفح المستخدم.';
      solutionAr = 'تصميم طبقة وسيطة للتخزين المؤقت في الواجهة الخلفية مع واجهات عرض سينمائية جذابة باستخدام Framer Motion و Tailwind.';
      featuresAr = 'بحث متقدم وفلترة، قوائم مشاهدة شخصية، مشغل عروض ترويجية تفاعلي، ومزامنة بيانات سحابية.';
      resultsAr = 'تحقيق سرعة استجابة أقل من 400ms لتصفح آلاف العناوين مع تقييم أداء 98% في Lighthouse.';
    } else if (lower.includes('gym') || lower.includes('management')) {
      titleAr = 'نظام إدارة النوادي الرياضية (GYM Management)';
      categoryAr = 'الأنظمة الإدارية وواجهات الـ CRM';
      roleAr = 'مهندس معماريات برمجية وقواعد بيانات';
      descriptionAr = 'منظومة سحابية متقدمة لإدارة الاشتراكات والمدربين، وتتبع الحضور اليومي للمشتركين والتقارير المالية الدورية، مع نظام صلاحيات دقيق لإدارة الفروع المتعددة بكفاءة عالية.';
      challengeAr = 'أتمتة إدارة اشتراكات مئات الأعضاء المتجددة وتفادي تضارب الجداول التدريبية وحسابات الإيرادات.';
      solutionAr = 'تطوير لوحة تحكم إدارية تفاعلية بـ Node.js و MySQL مع لوحة مؤشرات رسومية وأتمتة تنبيهات التجديد.';
      featuresAr = 'إدارة الاشتراكات والمدفوعات، تقارير مالية تفاعلية، نظام صلاحيات متعدد المستويات (RBAC)، وسجل حضور رقمي.';
      resultsAr = 'تقليل الأخطاء الحسابية والورقية بنسبة 95% وزيادة معدل تجديد الاشتراكات بنسبة 30%.';
    } else {
      titleAr = p.title;
      categoryAr = 'حلول برمجية مخصصة';
      roleAr = 'مطور برمجيات متكامل';
      descriptionAr = p.description || 'مشروع برمجي متكامل تم بناؤه وفق أعلى معايير الجودة والأداء لخدمة متطلبات الأعمال الرقمية الحديثة.';
      challengeAr = 'تطبيق أفضل الممارسات الهندسية لتحقيق أداء عالي وسهولة في الصيانة.';
      solutionAr = 'تصميم كود معياري نظيف بالاعتماد على أحدث التقنيات مع اختبارات تكاملية شاملة.';
      featuresAr = 'كود نظيف، أداء سريع، تصميم متجاوب، وواجهات مستخدم عصرية.';
      resultsAr = 'تسليم ناجح مع موثوقية عالية في بيئة الإنتاج.';
    }

    await prisma.project.update({
      where: { id: p.id },
      data: {
        titleAr,
        categoryAr,
        roleAr,
        descriptionAr,
        challengeAr,
        solutionAr,
        featuresAr,
        resultsAr
      }
    });
  }
  console.log(`Updated ${projects.length} projects with full Arabic details.`);

  // 2. Skills Translation & Hover Tooltips Seeding
  const skills = await prisma.skill.findMany();
  const skillTranslations = {
    'database design': { nameAr: 'تصميم قواعد البيانات', catAr: 'قواعد البيانات', descAr: 'رسم وتصميم مخططات الكيانات والعلاقات (ERDs)، تسوية الجداول ومطابقتها للمعاير القياسية، وضبط الفهارس والقيود العلائقية لأعلى كفاءة واستقرار.' },
    'html': { nameAr: 'لغة HTML5', catAr: 'الواجهات الأمامية', descAr: 'بناء هياكل صفحات الويب المعيارية والوصولية (Semantic & Accessible HTML) المتوافقة مع أحدث محركات المتصفحات وقارئات الشاشة لتحسين الـ SEO.' },
    'react': { nameAr: 'مكتبة React.js', catAr: 'الواجهات الأمامية', descAr: 'تطوير واجهات تفاعلية مبنية على المكونات المعيارية والـ Custom Hooks مع إدارة متقدمة لحالة التطبيق المعقدة للأنظمة المؤسسية.' },
    'data structures & algorithims': { nameAr: 'هياكل البيانات والخوارزميات', catAr: 'الأسس الهندسية', descAr: 'تحليل وتطبيق هياكل البيانات المعقدة وخوارزميات المعالجة الفعالة لحل المشكلات البرمجية بأقل تعقيد زمني ومكاني (Big-O).' },
    'node.js': { nameAr: 'بيئة تشغيل Node.js', catAr: 'الواجهات الخلفية', descAr: 'بناء خوادم وخدمات مصغرة عالية الأداء، وتصميم مسارات RESTful قابلة للتوسع، وإدارة قنوات الاتصال الفوري عبر WebSockets.' },
    'css': { nameAr: 'تنسيقات CSS3', catAr: 'الواجهات الأمامية', descAr: 'تصميم واجهات بصرية احترافية ومتجاوبة بالكامل مع كافة الشاشات باستخدام أحدث تقنيات Flexbox و Grid وحركات Micro-animations السلسة.' },
    'javascript': { nameAr: 'لغة JavaScript (ES6+)', catAr: 'الواجهات الأمامية والخلفية', descAr: 'كتابة شيفرات جافاسكريبت حديثة، وإدارة العمليات غير المتزامنة (Async/Await, Promises)، والتعامل المتقدم مع الذاكرة والأحداث.' },
    'typescript': { nameAr: 'لغة TypeScript', catAr: 'الواجهات الأمامية والخلفية', descAr: 'بناء تطبيقات برمجية محكمة النوعية (End-to-End Type Safety) للحد من الأخطاء أثناء التطوير وتسريع صيانة الأكواد الضخمة.' },
    'next.js': { nameAr: 'إطار العمل Next.js', catAr: 'الواجهات الأمامية الكاملة', descAr: 'تطوير تطبيقات فائقة السرعة بالاعتماد على العرض من جهة الخادم (SSR) وإنشاء الصفحات الثابتة (SSG) لتحقيق أعلى أداء ونتائج SEO مثالية.' },
    'tailwind css': { nameAr: 'مكتبة Tailwind CSS', catAr: 'الواجهات الأمامية', descAr: 'تصميم أنظمة واجهات متناسقة وسريعة للغاية باستخدام صنف الأدوات المساعدة مع دعم أنماط الوضع الليلي وتخصيص الثيمات.' },
    'postgresql': { nameAr: 'قاعدة بيانات PostgreSQL', catAr: 'قواعد البيانات', descAr: 'إدارة قواعد البيانات العلائقية المتقدمة، كتابة استعلامات SQL معقدة، وتطبيق استراتيجيات الفهرسة والنسخ الاحتياطي السحابي.' },
    'mysql': { nameAr: 'قاعدة بيانات MySQL', catAr: 'قواعد البيانات', descAr: 'تصميم واستضافة قواعد بيانات MySQL مستقرة وعالية التوافر، مع تحسين زمن استجابة الاستعلامات وفهرسة المفاتيح.' },
    'mongodb': { nameAr: 'قاعدة بيانات MongoDB', catAr: 'قواعد البيانات', descAr: 'تصميم مستندات وقواعد بيانات NoSQL مرنة للمشاريع ذات البيانات المتغيرة وسريعة النمو مع التجميع البياني (Aggregation).' },
    'prisma': { nameAr: 'أداة Prisma ORM', catAr: 'الواجهات الخلفية', descAr: 'تكامل قواعد البيانات مع نماذج TypeScript لضمان أمان الأنواع الكامل في استعلامات البيانات والتحديث التلقائي للـ Migrations.' },
    'docker': { nameAr: 'حاويات Docker', catAr: 'ديف أوبس والبنية التحتية', descAr: 'حزم التطبيقات والبيئات البرمجية في حاويات خفيفة ومعزولة لضمان توافق التشغيل والتطوير بنسبة 100% بين الأجهزة وسيرفرات الإنتاج.' },
    'git': { nameAr: 'نظام Git للتحكم بالإصدارات', catAr: 'الأدوات وسير العمل', descAr: 'إدارة فروع الكود والتكامل المستمر، وحل التعارضات، وتتبع تطور الشيفرة البرمجية عبر GitHub بدقة واحترافية.' },
    'express': { nameAr: 'إطار العمل Express.js', catAr: 'الواجهات الخلفية', descAr: 'بناء واجهات برمجة تطبيقات RESTful معمارية خفيفة وسريعة مع معالجة الأخطاء، المصادقة بـ JWT، وفلاتر الأمان (Middleware).' },
    'figma': { nameAr: 'أداة التصميم Figma', catAr: 'تصميم تجربة المستخدم', descAr: 'تحليل وتصميم النماذج الأولية التفاعلية وتصميم واجهات المستخدم (UI/UX) وتحويلها بدقة بكسلية إلى كود متجاوب.' },
    'rest api': { nameAr: 'معمارية RESTful APIs', catAr: 'الواجهات الخلفية', descAr: 'تصميم نقاط نهاية (Endpoints) نظيفة وموثقة وفق المعايير العالمية مع التخزين المؤقت ومصادقة الأذونات الدقيقة.' },
    'graphql': { nameAr: 'لغة استعلام GraphQL', catAr: 'الواجهات الخلفية', descAr: 'تطوير واجهات استعلام مرنة تسمح للتطبيقات بطلب الحقول المحددة فقط وتفادي مشكلة الإفراط في جلب البيانات (Over-fetching).' },
    'framer motion': { nameAr: 'مكتبة Framer Motion', catAr: 'الواجهات الأمامية', descAr: 'صياغة تأثيرات بصرية وانتقالات تفاعلية انسيابية تمنح واجهة المستخدم مظهراً حديثاً وحيوياً دون التأثير على الأداء.' }
  };

  for (const s of skills) {
    const key = s.name.toLowerCase().trim();
    const matched = skillTranslations[key] || {
      nameAr: s.name,
      catAr: s.category || 'عام',
      descAr: s.description ? `تطوير وتطبيق حلول ${s.name} الهندسية بكفاءة عالية واحترافية في بيئات الإنتاج.` : `خبرة متقدمة في استخدام ${s.name} لبناء الأنظمة الرقمية الحديثة.`
    };

    await prisma.skill.update({
      where: { id: s.id },
      data: {
        nameAr: matched.nameAr,
        categoryAr: matched.catAr,
        descriptionAr: matched.descAr
      }
    });
  }
  console.log(`Updated ${skills.length} skills with rich Arabic hover descriptions.`);

  // 3. Experience Seeding
  const experiences = await prisma.experience.findMany();
  for (const e of experiences) {
    let posAr = e.position;
    let compAr = e.company;
    let locAr = e.location || 'عن بُعد / تركيا';
    let descAr = e.description || '';

    const lower = (e.position + ' ' + e.company).toLowerCase();
    if (lower.includes('biruni') || lower.includes('computer engineering')) {
      posAr = 'بكالوريوس هندسة الحاسوب والبرمجيات';
      compAr = 'جامعة بيروني (Biruni University)';
      locAr = 'إسطنبول، تركيا';
      descAr = 'دراسة أكاديمية متعمقة في هندسة الحاسوب تشمل أسس هندسة البرمجيات، الخوارزميات المتقدمة، وهندسة النظم الواقعية، مع التركيز على تسوية قواعد البيانات ومعماريات الويب الحديثة.';
    } else if (lower.includes('scramblebit') || lower.includes('intern')) {
      posAr = 'متدرب تطوير برمجيات متكامل (Full-Stack Intern)';
      compAr = 'شركة Scramblebit للبرمجيات والتسويق';
      locAr = 'إسطنبول، تركيا';
      descAr = 'التعاون مع الفريق الهندسي لتطوير تطبيقات ويب تفاعلية وواجهات برمجة خلفية، والمساهمة في تحسين أداء استعلامات قواعد البيانات واختبارات التكامل وفق كود نظيف.';
    } else if (lower.includes('vecmenu') || lower.includes('lead frontend')) {
      posAr = 'مؤسس مشارك ورئيس مهندسي الواجهات';
      compAr = 'منصة فيك منيو (VecMenu)';
      locAr = 'تركيا / عن بُعد';
      descAr = 'المشاركة في تأسيس منصة القوائم الرقمية عبر الـ QR للمطاعم. هندسة واجهات أمامية متطورة وسريعة بالاعتماد على React و TypeScript، وقيادة هندسة المنتج من الفكرة حتى إطلاق الإنتاج.';
    } else if (lower.includes('freelance') || lower.includes('ui/ux')) {
      posAr = 'مطور واجهات ومصمم تجربة مستخدم حر (Freelance UI/UX)';
      compAr = 'عمل حر ومشاريع مستقلة';
      locAr = 'عن بُعد / دولي';
      descAr = 'بناء مكتبات مكونات برمجية ولوحات تحكم تفاعلية مخصصة. تدقيق تجارب المستخدم وتحسين سرعات تحميل المواقع بنسبة 35% واعتماد مسارات إدارة حالة حديثة.';
    } else {
      posAr = 'مطور برمجيات وحلول ويب متكامل';
      compAr = e.company;
      locAr = locAr;
      descAr = 'قيادة القرارات الهندسية المعمارية لتطبيقات الويب المؤسسية، والدمج مع واجهات الذكاء الاصطناعي، وبناء أنظمة تصميم برمجية تساند نمو الأعمال.';
    }

    await prisma.experience.update({
      where: { id: e.id },
      data: {
        positionAr: posAr,
        companyAr: compAr,
        locationAr: locAr,
        descriptionAr: descAr
      }
    });
  }
  console.log(`Updated ${experiences.length} experience entries with Arabic translations.`);

  // 4. Services Seeding
  const services = await prisma.service.findMany();
  for (const s of services) {
    let tAr = s.title;
    let dAr = s.description;
    const lower = s.title.toLowerCase();

    if (lower.includes('full-stack') || lower.includes('web development')) {
      tAr = 'تطوير تطبيقات الويب المتكاملة (Full-Stack)';
      dAr = 'بناء تطبيقات ويب مخصصة وقابلة للتوسع بأحدث أطر العمل للواجهات والأنظمة الخلفية، مع التركيز على الأداء العالي وسهولة الصيانة.';
    } else if (lower.includes('maintenance') || lower.includes('freelance-maintenance')) {
      tAr = 'الدعم الفني والصيانة المستمرة';
      dAr = 'تقديم دعم فني مخصص، وحل المشكلات البرمجية، وتحديثات الأمان الدورية، وتطوير الميزات الإضافية للتطبيقات الإنتاجية القائمة.';
    } else if (lower.includes('mobile')) {
      tAr = 'تطوير تطبيقات الهواتف الذكية';
      dAr = 'بناء تطبيقات عالية الأداء لنظامي iOS و Android باستخدام Flutter و Dart مع معمارية برمجية نظيفة وإدارة حالة معتمدة.';
    } else if (lower.includes('seo') || lower.includes('speed')) {
      tAr = 'تحسين محركات البحث والسرعة الفائقة';
      dAr = 'تحسين مقاييس Core Web Vitals وسرعات تحميل الصفحات، والتوافق الدقيق مع معايير Google لتحقيق أعلى المراتب في نتائج البحث.';
    } else if (lower.includes('ui/ux') || lower.includes('interactive')) {
      tAr = 'تصميم الواجهات التفاعلية وتجربة المستخدم';
      dAr = 'تحويل التصاميم المعقدة إلى واجهات بكسلية متجاوبة وسلسة باستخدام Tailwind CSS و Framer Motion وأحدث أنماط الثيمات.';
    } else if (lower.includes('crm') || lower.includes('dashboard')) {
      tAr = 'أنظمة الـ CRM ولوحات التحكم المخصصة';
      dAr = 'هندسة لوحات تحكم إدارية ومؤشرات ذكاء أعمال مع صلاحيات وصول دقيقة (RBAC) ومسارات أتمتة ترفع من كفاءة العمليات التشغيلية.';
    }

    await prisma.service.update({
      where: { id: s.id },
      data: { titleAr: tAr, descriptionAr: dAr }
    });
  }
  console.log(`Updated ${services.length} services with Arabic translations.`);

  // 5. Workflow Steps Seeding
  const steps = await prisma.workflowStep.findMany();
  const stepArData = [
    { titleAr: 'الاستكشاف وتحديد النطاق', descAr: 'دراسة عميقة لمتطلبات المشروع، وتحديد النطاق الهندسي ونماذج البيانات لضمان مسار تنفيذ واضح المعالم.' },
    { titleAr: 'المعمارية وهندسة النظام', descAr: 'تصميم مخطط قاعدة البيانات، وهندسة الـ API، ورسم المكونات الأساسية قبل كتابة المنطق البرمجي.' },
    { titleAr: 'التطوير البرمجي الشامل', descAr: 'تنفيذ مراحل التطوير باستخدام كود نظيف، وإدارة حالة متقدمة، وأمان وحماية تامة للبيانات.' },
    { titleAr: 'الفحص وضمان الجودة', descAr: 'اختبارات وحدية وتكاملية وفحص توافقية المتصفحات والشاشات مع رفع كفاءة وسرعة التحميل.' },
    { titleAr: 'النشر والإطلاق السحابي', descAr: 'إعداد بيئة الإنتاج السحابية، وخطوط النشر التلقائي، والتخزين المؤقت لسرعة استجابة خارقة.' }
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    const item = stepArData[i] || {
      titleAr: s.title,
      descAr: s.description
    };
    await prisma.workflowStep.update({
      where: { id: s.id },
      data: { titleAr: item.titleAr, descriptionAr: item.descAr }
    });
  }
  console.log(`Updated ${steps.length} workflow steps with Arabic translations.`);

  // 6. FAQs Seeding
  const faqs = await prisma.faqItem.findMany();
  for (const f of faqs) {
    let qAr = f.question;
    let aAr = f.answer;
    let catAr = f.category;

    const lowerQ = f.question.toLowerCase();
    if (lowerQ.includes('front-end and back-end')) {
      qAr = 'هل يمكنك بناء كل من الواجهة الأمامية والخلفية للتطبيق بالكامل؟';
      aAr = 'بالتأكيد، أنا متخصص في التطوير المتكامل من البداية إلى النهاية — بدءاً من واجهات React/Next.js العصرية، إلى خوادم Node.js/Express، وتصميم قواعد البيانات (MySQL, PostgreSQL, MongoDB)، والنشر السحابي، مما يضمن لك نقطة مسؤولية واحدة لكامل المشروع.';
      catAr = 'الخدمات ونطاق العمل';
    } else if (lowerQ.includes('get started')) {
      qAr = 'كيف نبدأ العمل معاً؟';
      aAr = 'أرسل لي رسالة عبر نموذج التواصل أدناه أو راسلني مباشرة على الواتساب أو البريد الإلكتروني. وضح أهداف مشروعك وجدولك الزمني المتوقع، وسأرد عليك خلال 24 ساعة بمقترح ومكالمة استكشافية لتحديد تفاصيل التنفيذ.';
      catAr = 'العملية والجدول الزمني';
    } else if (lowerQ.includes('freelance and consulting')) {
      qAr = 'هل تقدم خدمات العمل الحر والاستشارات البرمجية المستمرة؟';
      aAr = 'نعم، أنا متاح للمشاريع التعاقدية الحرة، والاستشارات الجزئية، وعقود الدعم المستمر، بالإضافة لجلسات تدقيق الأكواد وتقديم الاستشارات المعمارية للفرق البرمجية.';
      catAr = 'الخدمات ونطاق العمل';
    } else if (lowerQ.includes('ui/ux design as well')) {
      qAr = 'هل تقدم خدمات تصميم واجهات وتجربة المستخدم (UI/UX) أيضاً؟';
      aAr = 'نعم، أهتم بصياغة تجارب مستخدم سهلة وبديهية، وتصميم الواجهات عبر Figma وتحويلها مباشرة إلى أكواد تفاعلية متجاوبة تخدم أهداف العمل.';
      catAr = 'التقنيات المستخدمة';
    }

    await prisma.faqItem.update({
      where: { id: f.id },
      data: {
        questionAr: qAr,
        answerAr: aAr,
        categoryAr: catAr
      }
    });
  }
  console.log(`Updated ${faqs.length} FAQ items with Arabic translations.`);

  // 7. Certificates Seeding
  const certs = await prisma.certificate.findMany();
  for (const c of certs) {
    let tAr = c.title;
    let issAr = c.issuer;
    if (c.title.includes('Meta') || c.title.includes('Frontend')) {
      tAr = 'شهادة مهندس واجهات أمامية محترف';
      issAr = 'ميتا (Meta) العالمية';
    } else if (c.title.includes('React') || c.title.includes('JavaScript')) {
      tAr = 'اعتماد تطوير تطبيقات React و JavaScript المتقدمة';
      issAr = 'أكاديميات البرمجة المعتمدة';
    }
    await prisma.certificate.update({
      where: { id: c.id },
      data: { titleAr: tAr, issuerAr: issAr }
    });
  }
  console.log(`Updated ${certs.length} certificates with Arabic translations.`);

  // 8. Portfolio Settings & UI Theme Seeding
  await prisma.portfolioSettings.upsert({
    where: { id: 'singleton' },
    update: {
      nameAr: 'يوسف الأيوبي',
      heroTextAr: 'تطوير برمجيات متكاملة وهندسة حلول الويب',
      bioAr: 'تطوير تطبيقات ويب قابلة للتوسع، وأنظمة CRM مخصصة، وواجهات برمجة تطبيقات عالية الأداء للشركات الناشئة والمؤسسات، بكود نظيف وموثوق يضمن النمو المستمر.',
      ctaTextAr: 'شاهد أعمالي',
      availabilityAr: 'متاح للمشاريع الحرة والاستشارات',
      locationAr: 'إسطنبول، تركيا / عن بُعد',
      footerTextAr: 'مهندس برمجيات متكامل شغوف ببناء منتجات رقمية عالية الأداء ومعماريات برمجية تصمد وتنمو مع أعمالك.',
      typewriterWordsAr: JSON.stringify(['مطور ويب متكامل', 'مهندس برمجيات ونظم', 'خبير React و Next.js', 'معماري Node.js و واجهات برمجية', 'مصمم واجهات وتجربة مستخدم']),
      heroStatsAr: JSON.stringify([
        { value: '99.9%', label: 'جودة وموثوقية الكود' },
        { value: '100%', label: 'رضا العملاء' },
        { value: '+35', label: 'مشروع مكتمل' },
        { value: '+4', label: 'سنوات خبرة' }
      ]),
      primaryThemeColor: 'emerald',
      fontFamilyEn: 'Geist',
      fontFamilyAr: 'Cairo',
      cardStyle: 'glassmorphic',
      enableGlow: true,
      backgroundPattern: 'subtle-grid',
      workflowBadgeAr: 'منهجية وسير العمل',
      workflowTitleAr: 'كيف أطور وأبني الحلول الرقمية',
      workflowSubtitleAr: 'عملية تطوير منظمة وشاملة تضمن أعلى درجات الموثوقية وتوافق الأعمال.',
      projectsBadgeAr: 'أعمال مختارة ودراسات حالة',
      projectsTitleAr: 'المشاريع المميزة.',
      projectsSubtitleAr: 'مجموعة مختارة من حلول الويب، ومنصات الـ SaaS، والأنظمة المؤسسية المصممة بعناية.',
      skillsBadgeAr: 'المهارات والقدرات التقنية',
      skillsTitleAr: 'القدرات الهندسية الأساسية',
      skillsParagraph1Ar: 'أبني أنظمة متكاملة ومترابطة من البداية إلى النهاية — من طبقات خدمة Node.js النظيفة بقواعد بيانات معيارية، إلى واجهات React و Next.js المتطورة المصممة للأداء العالي وسهولة الصيانة.',
      skillsParagraph2Ar: 'كل قرار هندسي يرتكز على قابلية التوسع: تصميم واجهات برمجية API معيارية، وفهرسة دقيقة لقواعد البيانات، وخطوط نشر مجربة تضمن استقرار النظام تحت الضغط العالي.',
      skillsPoint1TitleAr: 'المعمارية أولاً',
      skillsPoint1TextAr: 'واجهات برمجية RESTful نظيفة وتصميم قواعد بيانات متين صُمم ليدوم.',
      skillsPoint2TitleAr: 'تقنيات حديثة',
      skillsPoint2TextAr: 'تطبيقات عالية الأداء بالاعتماد على React و Next.js و Tailwind.',
      experienceBadgeAr: 'المسيرة المهنية والمحطات',
      experienceTitleAr: 'الخبرات والمؤهلات.',
      experienceSubtitleAr: 'تسلسل زمني يوثق المسيرة الأكاديمية، والخبرات العملية، والمشاريع المؤثرة والشهادات المعتمدة.',
      servicesBadgeAr: 'الخدمات والاستشارات',
      servicesTitleAr: 'ما الذي أقدمه لك.',
      servicesSubtitleAr: 'خدمات تطوير برمجيات متكاملة مصممة لمساعدتك على الإطلاق بشكل أسرع والنمو بثقة.',
      faqBadgeAr: 'لديك سؤال؟',
      faqTitleAr: 'الأسئلة الأكثر شيوعاً.',
      faqSubtitleAr: 'كل ما يهمك معرفته حول آليات العمل المشترك، الجداول الزمنية، ومراحل التسليم.',
      contactBadgeAr: 'تواصل معي',
      contactTitleAr: 'لديك فكرة أو مشروع؟ دعنا نتحدث.',
      contactSubtitleAr: 'سواء كنت تخطط لإطلاق تطبيق جديد، أو تطوير بنيتك الحالية، أو تبحث عن استشارة برمجية — يسعدني التحدث معك.'
    },
    create: {
      id: 'singleton',
      name: 'Yousef Ayoubi',
      nameAr: 'يوسف الأيوبي',
      heroText: 'End-to-End Web Development & Software Engineering',
      heroTextAr: 'تطوير برمجيات متكاملة وهندسة حلول الويب',
      bio: 'Building scalable web applications, custom CRM systems, and high-performance APIs for startups and businesses. Delivering clean, maintainable code engineered for reliability and seamless growth.',
      bioAr: 'تطوير تطبيقات ويب قابلة للتوسع، وأنظمة CRM مخصصة، وواجهات برمجة تطبيقات عالية الأداء للشركات الناشئة والمؤسسات، بكود نظيف وموثوق يضمن النمو المستمر.',
      ctaText: 'See My Work',
      ctaTextAr: 'شاهد أعمالي',
      availability: 'Available for Freelance & Consulting',
      availabilityAr: 'متاح للمشاريع الحرة والاستشارات',
      location: 'Istanbul, Turkey',
      locationAr: 'إسطنبول، تركيا / عن بُعد',
      email: 'yosof2005a@gmail.com',
      whatsappNumber: '+905528080277',
      typewriterWordsAr: JSON.stringify(['مطور ويب متكامل', 'مهندس برمجيات ونظم', 'خبير React و Next.js', 'معماري Node.js و واجهات برمجية', 'مصمم واجهات وتجربة مستخدم']),
      heroStatsAr: JSON.stringify([
        { value: '99.9%', label: 'جودة وموثوقية الكود' },
        { value: '100%', label: 'رضا العملاء' },
        { value: '+35', label: 'مشروع مكتمل' },
        { value: '+4', label: 'سنوات خبرة' }
      ]),
      primaryThemeColor: 'emerald',
      fontFamilyEn: 'Geist',
      fontFamilyAr: 'Cairo',
      cardStyle: 'glassmorphic',
      enableGlow: true,
      backgroundPattern: 'subtle-grid'
    }
  });
  console.log('Updated PortfolioSettings with bilingual and appearance data.');

  // 9. AboutSettings Seeding
  await prisma.aboutSettings.upsert({
    where: { id: 'singleton' },
    update: {
      badgeAr: 'نبذة عني',
      headlineAr: 'بناء برمجيات قابلة للتوسع بدقة واحترافية هندسية.',
      bioParagraph1Ar: 'أنا يوسف — مهندس حاسوب ومطور برمجيات متكامل متخصص في بناء أنظمة تعمل بكفاءة حقيقية في بيئات الإنتاج. من أنظمة الـ CRM المخصصة ومنصات إدارة الأعمال، إلى تطبيقات الويب عالية الأداء وواجهات REST & GraphQL.',
      bioParagraph2Ar: 'تركيزي ينصب على واجهات المستخدم الحديثة (React, Next.js) المقترنة بمعماريات الخوادم المتينة (Node.js) — مع اهتمام فائق بالأداء، وسهولة الصيانة، وتقديم قيمة حقيقية للأعمال.',
      coreStackAr: JSON.stringify(['React', 'Next.js', 'TypeScript', 'Node.js', 'Prisma', 'MySQL', 'PostgreSQL', 'REST APIs', 'GraphQL', 'Docker']),
      bentoCardsAr: JSON.stringify([
        { id: '01', title: 'معمارية برمجية نظيفة', description: 'أكواد برمجية نظيفة وقابلة للتوسع مبنية على أفضل الأنماط العالمية، حيث تُبنى كل طبقة ومكون بعناية فائقة.', icon: 'layers' },
        { id: '02', title: 'عقلية تركز على نمو الأعمال', description: 'برمجيات مصممة لحل المشاكل التشغيلية وتسريع النمو، وتحقيق نتائج أعمال ملموسة ومدروسة.', icon: 'trending-up' },
        { id: '03', title: 'أداء فائق وموثوقية تامة', description: 'لا مساومة على سرعة التحميل، مع تحسين استعلامات قواعد البيانات، وسرعة استجابة فائقة واستراتيجيات كاش متقدمة.', icon: 'zap', colSpan: 'sm:col-span-2' }
      ])
    },
    create: {
      id: 'singleton',
      badge: 'About Me',
      badgeAr: 'نبذة عني',
      headline: 'Crafting Scalable Software with Purpose & Precision.',
      headlineAr: 'بناء برمجيات قابلة للتوسع بدقة واحترافية هندسية.',
      bioParagraph1: "I'm Yousef — a Computer Engineer & Full-Stack Developer specializing in building systems that actually work in production.",
      bioParagraph1Ar: 'أنا يوسف — مهندس حاسوب ومطور برمجيات متكامل متخصص في بناء أنظمة تعمل بكفاءة حقيقية في بيئات الإنتاج.',
      bioParagraph2: 'My focus is on modern frontends paired with robust server-side architectures.',
      bioParagraph2Ar: 'تركيزي ينصب على واجهات المستخدم الحديثة المقترنة بمعماريات الخوادم المتينة.',
      coreStack: JSON.stringify(['React', 'Next.js', 'TypeScript', 'Node.js', 'Prisma', 'MySQL', 'PostgreSQL', 'REST APIs', 'GraphQL', 'Docker']),
      bentoCards: JSON.stringify([
        { id: '01', title: 'Clean Architecture', description: 'Maintainable, scalable codebases built on proven patterns.', icon: 'layers' },
        { id: '02', title: 'Business-First Mindset', description: 'Software engineered to solve real operational bottlenecks and unlock growth.', icon: 'trending-up' },
        { id: '03', title: 'Performance & Reliability', description: 'Zero compromise on load speeds and query optimization.', icon: 'zap', colSpan: 'sm:col-span-2' }
      ])
    }
  });
  console.log('Updated AboutSettings with bilingual data.');

  console.log('--- Seeding Completed Successfully! All DB content is now rich and bilingual ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
