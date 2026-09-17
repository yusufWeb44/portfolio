import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Admin User
  const adminEmail = 'admin@example.com';
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
      },
    });
    console.log('Admin user created (admin@example.com / admin123)');
  }

  // 2. Portfolio Settings
  const settings = await prisma.portfolioSettings.findUnique({ where: { id: 'singleton' } });
  if (!settings) {
    await prisma.portfolioSettings.create({
      data: {
        id: 'singleton',
        name: 'Yusuf',
        bio: "I'm Yusuf, a software developer focused on building modern web applications, intuitive interfaces, and reliable digital products with a strong focus on performance and user experience.",
        heroText: 'Building digital experiences that are fast, thoughtful, and built to last.',
        ctaText: 'View My Work',
        location: 'Available Worldwide',
        availability: 'Available for opportunities',
        email: 'hello@example.com',
      },
    });
    console.log('Portfolio Settings created');
  }

  // 3. Social Links
  const countSocial = await prisma.socialLink.count();
  if (countSocial === 0) {
    await prisma.socialLink.createMany({
      data: [
        { platform: 'GitHub', url: 'https://github.com/yusuf', icon: 'github', order: 1 },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/yusuf', icon: 'linkedin', order: 2 },
      ]
    });
    console.log('Social Links created');
  }

  // 4. Skills
  const countSkills = await prisma.skill.count();
  if (countSkills === 0) {
    await prisma.skill.createMany({
      data: [
        { name: 'TypeScript', category: 'Frontend', icon: 'typescript' },
        { name: 'React', category: 'Frontend', icon: 'react' },
        { name: 'Tailwind CSS', category: 'Frontend', icon: 'tailwind' },
        { name: 'Node.js', category: 'Backend', icon: 'nodedotjs' },
        { name: 'Express.js', category: 'Backend', icon: 'express' },
        { name: 'MySQL', category: 'Database', icon: 'mysql' },
        { name: 'Prisma', category: 'Database', icon: 'prisma' },
      ]
    });
    console.log('Skills created');
  }

  // 5. Sample Project
  const countProjects = await prisma.project.count();
  if (countProjects === 0) {
    const techReact = await prisma.technology.create({ data: { name: 'React' } });
    const techNode = await prisma.technology.create({ data: { name: 'Node.js' } });
    const techMySQL = await prisma.technology.create({ data: { name: 'MySQL' } });

    await prisma.project.create({
      data: {
        title: 'Restaurant QR Menu',
        slug: 'restaurant-qr-menu',
        description: 'A modern digital menu platform designed for restaurants.',
        challenge: 'Restaurants needed a way to update menus dynamically without printing new ones.',
        solution: 'Built a real-time QR code menu system with a merchant dashboard.',
        year: '2023',
        category: 'Web App',
        isFeatured: true,
        isPublished: true,
        technologies: {
          connect: [{ id: techReact.id }, { id: techNode.id }, { id: techMySQL.id }]
        }
      }
    });
    console.log('Sample Project created');
  }

  // 6. About Settings
  const existingAbout = await prisma.aboutSettings.findUnique({ where: { id: 'singleton' } });
  if (!existingAbout) {
    await prisma.aboutSettings.create({
      data: {
        id: 'singleton',
        badge: 'About Me',
        headline: 'Crafting Scalable Software with Purpose & Precision.',
        bioParagraph1: "I'm Yousef — a Computer Engineer & Full-Stack Developer specializing in building systems that actually work in production. From custom CRMs and business operations platforms to high-performance web applications and scalable REST & GraphQL APIs.",
        bioParagraph2: 'My focus is on modern frontends (React, Next.js) paired with robust server-side architectures (Node.js) — with a sharp eye on performance, maintainability, and real business value delivery.',
        coreStack: JSON.stringify([
          'React', 'Next.js', 'TypeScript', 'Node.js',
          'Prisma', 'MySQL', 'PostgreSQL',
          'REST APIs', 'GraphQL', 'MongoDB'
        ]),
        bentoCards: JSON.stringify([
          {
            id: '01',
            title: 'Clean Architecture',
            description: 'Maintainable, scalable codebases built on proven patterns. Every module, layer, and abstraction is intentional — with React, Next.js, and Node.js as the engineering backbone.',
            icon: 'layers',
            colSpan: ''
          },
          {
            id: '02',
            title: 'Business-First Mindset',
            description: 'Software engineered to solve real operational bottlenecks and unlock growth. Custom CRMs, workflow automation, and APIs designed around measurable business outcomes — not just technical elegance.',
            icon: 'trending-up',
            colSpan: ''
          },
          {
            id: '03',
            title: 'Performance & Reliability',
            description: 'Zero compromise on load speeds, database query optimization, and robust API architecture. Sub-second response times, efficient caching strategies, and battle-tested error handling baked in from day one — not bolted on after.',
            icon: 'zap',
            colSpan: 'sm:col-span-2'
          }
        ])
      }
    });
    console.log('About Settings created');
  }

  // 7. Workflow Steps
  const countWorkflow = await prisma.workflowStep.count();
  if (countWorkflow === 0) {
    await prisma.workflowStep.createMany({
      data: [
        {
          num: '01',
          title: 'Requirement Discovery',
          description: 'Analyzing business goals, mapping system logic, and defining clear technical architecture before writing code.',
          pinColor: '#E8732A',
          order: 1,
          isEnabled: true
        },
        {
          num: '02',
          title: 'System & Database Design',
          description: 'Designing robust schemas, ERD models, and high-performance REST API structures tailored for scalability.',
          pinColor: '#3B7DD8',
          order: 2,
          isEnabled: true
        },
        {
          num: '03',
          title: 'Full-Stack Development',
          description: 'Building clean, maintainable codebases using React, Next.js, and Node.js — engineered for speed and security.',
          pinColor: '#9333EA',
          order: 3,
          isEnabled: true
        },
        {
          num: '04',
          title: 'Testing & Optimization',
          description: 'Conducting API stress tests, query optimizations, and UI checks ensuring sub-second response times.',
          pinColor: '#0D9668',
          order: 4,
          isEnabled: true
        },
        {
          num: '05',
          title: 'Deployment & Support',
          description: 'Deploying to reliable cloud servers with CI/CD setups, followed by continuous maintenance and monitoring.',
          pinColor: '#DC2626',
          order: 5,
          isEnabled: true
        }
      ]
    });
    console.log('Workflow Steps created');
  }

  // 8. FAQ Items
  const countFaqs = await prisma.faqItem.count();
  if (countFaqs === 0) {
    await prisma.faqItem.createMany({
      data: [
        {
          category: 'services',
          question: 'What types of projects do you take on?',
          answer: 'I work on full-stack web applications, custom CRM/ERP systems, REST & GraphQL APIs, e-commerce platforms, SaaS products, and mobile apps. Whether you need a polished MVP in weeks or a long-term engineering partner — I can help.',
          order: 1,
          isEnabled: true
        },
        {
          category: 'services',
          question: 'Do you offer freelance and consulting engagements?',
          answer: 'Yes. I am available for freelance project contracts, part-time consulting, and long-term retainer arrangements. I also offer code-review sessions and architecture consulting for existing teams.',
          order: 2,
          isEnabled: true
        },
        {
          category: 'services',
          question: 'Can you build both the front-end and back-end of an application?',
          answer: 'Absolutely. I specialize in end-to-end development — from React/Next.js UI to Node.js/Express APIs, database design (MySQL, PostgreSQL, MongoDB), and cloud deployment. You get a single point of accountability.',
          order: 3,
          isEnabled: true
        },
        {
          category: 'services',
          question: 'Do you provide UI/UX design as well?',
          answer: 'Yes. I design in Figma before writing a single line of code. I focus on clean, conversion-optimized interfaces that are both visually compelling and highly usable — consistent with modern design systems.',
          order: 4,
          isEnabled: true
        },
        {
          category: 'process',
          question: 'How does the project process typically work?',
          answer: 'We start with a discovery call to clarify requirements and scope. I then deliver a technical proposal and timeline. Development follows in milestone-based sprints with live demos along the way. The project closes with deployment, handoff docs, and a support window.',
          order: 5,
          isEnabled: true
        },
        {
          category: 'process',
          question: 'How long does it take to build a web application?',
          answer: 'A focused MVP can be production-ready in 2–4 weeks. A full-featured SaaS or CRM platform typically takes 4–6 weeks. Timeline depends on feature complexity, design requirements, and third-party integrations. I always provide a clear estimate upfront.',
          order: 6,
          isEnabled: true
        },
        {
          category: 'process',
          question: 'Will I be able to track progress during development?',
          answer: 'Yes. I use GitHub for version control (with shared access), and I schedule regular check-in calls. You will always know exactly what has been built, what is in progress, and what is next.',
          order: 7,
          isEnabled: true
        },
        {
          category: 'process',
          question: 'Do you offer post-launch support and maintenance?',
          answer: 'Yes. I offer post-launch support packages that cover bug fixes, performance monitoring, dependency updates, and feature iterations. We agree on the scope at the start of the engagement.',
          order: 8,
          isEnabled: true
        },
        {
          category: 'tech',
          question: 'What is your primary tech stack?',
          answer: 'On the front-end: React, Next.js, TypeScript, and Tailwind CSS. On the back-end: Node.js, Express, Prisma, and REST APIs. For databases: MySQL, PostgreSQL, and MongoDB. For mobile: Flutter/Dart. For DevOps: Docker, Nginx, and VPS/cloud hosting.',
          order: 9,
          isEnabled: true
        },
        {
          category: 'tech',
          question: 'Can you work with an existing codebase or tech stack?',
          answer: 'Yes. I can join and contribute to existing projects regardless of the stack. I am comfortable doing code audits, refactoring legacy systems, and incrementally modernizing architectures without breaking production.',
          order: 10,
          isEnabled: true
        },
        {
          category: 'tech',
          question: 'Do you build mobile applications?',
          answer: 'Yes. I build cross-platform mobile apps using Flutter and Dart — targeting both iOS and Android from a single codebase. This includes REST API integration, local storage, state management (Riverpod/Bloc), and App Store/Play Store deployment.',
          order: 11,
          isEnabled: true
        },
        {
          category: 'tech',
          question: 'What tools do you use for UI/UX design?',
          answer: 'Figma is my primary design tool — for wireframes, high-fidelity mockups, interactive prototypes, and design systems. I also use Framer for motion prototyping when needed.',
          order: 12,
          isEnabled: true
        },
        {
          category: 'collab',
          question: 'How do we get started?',
          answer: 'Send me a message through the contact form below or email me directly. Describe your project, goals, and timeline. I will respond within 24 hours with a discovery call invitation or a direct quote depending on the scope.',
          order: 13,
          isEnabled: true
        },
        {
          category: 'collab',
          question: 'Do you work with international clients?',
          answer: 'Yes, fully. I work asynchronously across time zones and communicate clearly in English and Arabic. Payments are accepted internationally via bank transfer, PayPal, or Wise.',
          order: 14,
          isEnabled: true
        },
        {
          category: 'collab',
          question: 'What information do you need to provide a quote?',
          answer: 'A brief project description, key features or pages needed, any design references you like, your target launch date, and budget range. The more context you share, the more accurate the estimate I can provide.',
          order: 15,
          isEnabled: true
        },
        {
          category: 'collab',
          question: 'Do you sign NDAs or contracts?',
          answer: 'Yes, always. I sign a mutual NDA before any sensitive information is shared, and every project starts with a formal contract that outlines scope, milestones, payment schedule, and IP ownership. Your code and data are yours.',
          order: 16,
          isEnabled: true
        }
      ]
    });
    console.log('FAQ items created');
  }

  // 9. SEO Settings
  const existingSeo = await prisma.seoSettings.findUnique({ where: { id: 'singleton' } });
  if (!existingSeo) {
    await prisma.seoSettings.create({
      data: {
        id: 'singleton',
        metaTitle: 'Yusuf Ayoubi | Software Developer & Engineer',
        metaDescription: 'Building scalable web applications, custom CRM systems, and high-performance APIs for startups and businesses. Clean, maintainable code engineered for reliability.',
        keywords: 'Software Engineer, Full-Stack Developer, React, Next.js, Node.js, TypeScript, Web Development, Istanbul',
        author: 'Yusuf Ayoubi',
        ogTitle: 'Yusuf Ayoubi | Full-Stack Software Engineer',
        ogDescription: 'End-to-End Web Development, Custom CRMs, and High-Performance APIs.',
        ogType: 'website',
        twitterHandle: '@yusuf',
        twitterCardType: 'summary_large_image',
        canonicalUrl: 'https://yusufayoubi.com',
        robots: 'index, follow',
        structuredData: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Yusuf Ayoubi',
          jobTitle: 'Software Engineer & Full-Stack Developer',
          url: 'https://yusufayoubi.com',
          sameAs: ['https://github.com', 'https://linkedin.com']
        })
      }
    });
    console.log('SEO Settings created');
  }

  // 10. Default Translations (English & Arabic)
  const countTranslations = await prisma.translation.count();
  if (countTranslations === 0) {
    const { enDict, arDict } = require('./updateTranslations.js');
    await prisma.translation.createMany({
      data: [
        {
          languageCode: 'en',
          languageName: 'English',
          direction: 'ltr',
          isDefault: true,
          isEnabled: true,
          data: JSON.stringify(enDict, null, 2)
        },
        {
          languageCode: 'ar',
          languageName: 'العربية',
          direction: 'rtl',
          isDefault: false,
          isEnabled: true,
          data: JSON.stringify(arDict, null, 2)
        }
      ]
    });
    console.log('Default Translations (en & ar) created');
  }

  // Update PortfolioSettings with default typewriterWords if missing
  const curSettings = await prisma.portfolioSettings.findUnique({ where: { id: 'singleton' } });
  if (curSettings && !curSettings.typewriterWords) {
    await prisma.portfolioSettings.update({
      where: { id: 'singleton' },
      data: {
        typewriterWords: JSON.stringify([
          'Full-Stack Developer',
          'Software Developer',
          'Web Developer',
          'Mobile App Developer',
          'UI/UX Designer'
        ])
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
