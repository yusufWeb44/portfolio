import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding experiences and certificates...');
  
  // Clean existing empty/sample if needed
  await prisma.experience.deleteMany({});
  await prisma.certificate.deleteMany({});

  // 1. University first (as requested: "يعني اول شيء جامعة و يكون في ايكون واضحة مع عنوان و سنة و شرح لكل فترة")
  await prisma.experience.create({
    data: {
      position: 'B.Sc. in Computer Science & Software Engineering',
      company: 'Faculty of Computer & Information Engineering',
      startDate: '2016',
      endDate: '2020',
      location: 'University Campus',
      type: 'education',
      icon: 'graduation-cap',
      color: 'amber',
      order: 1,
      description: 'Comprehensive study of computer architecture, software engineering principles, algorithms, data structures, relational databases, and network security. Graduated with high honors and received First Place in the annual Engineering Capstone showcase.'
    }
  });

  // 2. Research & Frontend Internship
  await prisma.experience.create({
    data: {
      position: 'Frontend & UI/UX Developer',
      company: 'Apex Digital Solutions',
      startDate: '2020',
      endDate: '2021',
      location: 'Hybrid / Remote',
      type: 'work',
      icon: 'search',
      color: 'coral',
      order: 2,
      description: 'Built modular component libraries and interactive dashboards. Conducted user experience audits, improved page load speed by 35%, and established modern frontend state management workflows.'
    }
  });

  // 3. Full-Stack Developer
  await prisma.experience.create({
    data: {
      position: 'Full-Stack Software Engineer',
      company: 'Nexus Innovations',
      startDate: '2021',
      endDate: '2023',
      location: 'Tech Hub',
      type: 'work',
      icon: 'calendar',
      color: 'teal',
      order: 3,
      description: 'Developed scalable RESTful and event-driven backend microservices with Node.js and TypeScript. Integrated real-time WebSocket communications and reduced database query bottlenecks by 40%.'
    }
  });

  // 4. Senior Developer
  await prisma.experience.create({
    data: {
      position: 'Senior Software Developer',
      company: 'CloudScale Enterprises',
      startDate: '2023',
      endDate: '2024',
      location: 'Remote',
      type: 'work',
      icon: 'briefcase',
      color: 'blue',
      order: 4,
      description: 'Led a cross-functional squad delivering cloud-native customer portals. Mentored 4 engineers, designed clean hexagonal system architecture, and introduced automated CI/CD deployment pipelines.'
    }
  });

  // 5. Lead Architect & Consultant
  await prisma.experience.create({
    data: {
      position: 'Lead Architect & Tech Consultant',
      company: 'Quantum Studio / Tech Solutions',
      startDate: '2024',
      endDate: 'Present',
      location: 'Worldwide',
      type: 'work',
      icon: 'chart',
      color: 'purple',
      order: 5,
      description: 'Leading strategic architectural decisions for high-availability enterprise web apps, AI tool integrations, and design systems. Helping organizations scale their digital products with confidence.'
    }
  });

  // Certificates
  await prisma.certificate.createMany({
    data: [
      {
        title: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        issueDate: '2024',
        credentialUrl: 'https://aws.amazon.com/verification',
        credentialId: 'AWS-SAA-89301',
        icon: 'cloud',
        skills: 'Cloud Architecture, Lambda, S3, IAM, Microservices',
        order: 1
      },
      {
        title: 'Meta Front-End Developer Professional Certificate',
        issuer: 'Meta (Facebook)',
        issueDate: '2023',
        credentialUrl: 'https://www.coursera.org/verify/professional-cert/meta-fe',
        credentialId: 'META-FE-48190',
        icon: 'code',
        skills: 'React, Next.js, TypeScript, UI/UX Systems',
        order: 2
      },
      {
        title: 'Google Cloud Professional Cloud Developer',
        issuer: 'Google Cloud Platform',
        issueDate: '2023',
        credentialUrl: 'https://cloud.google.com/certification',
        credentialId: 'GCP-PCD-92814',
        icon: 'award',
        skills: 'Docker, Kubernetes, Cloud Run, CI/CD',
        order: 3
      },
      {
        title: 'Advanced TypeScript & Software Design Patterns',
        issuer: 'Frontend Masters',
        issueDate: '2022',
        credentialUrl: 'https://frontendmasters.com',
        credentialId: 'FM-TS-10294',
        icon: 'terminal',
        skills: 'TypeScript, OOP, Clean Code, System Design',
        order: 4
      },
      {
        title: 'Certified ScrumMaster (CSM)',
        issuer: 'Scrum Alliance',
        issueDate: '2022',
        credentialUrl: 'https://scrumalliance.org',
        credentialId: 'CSM-66381',
        icon: 'users',
        skills: 'Agile Methodology, Sprint Planning, Team Leadership',
        order: 5
      }
    ]
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
