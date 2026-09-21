import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EXACT_SKILLS = [
  {
    name: 'React',
    category: 'Frontend',
    size: 30,
    x: 10,
    y: 10,
    depth: 1.0,
    order: 1,
    description: 'Building reactive, component-driven UIs with custom hooks and advanced state management for enterprise web applications.',
  },
  {
    name: 'Next.js',
    category: 'Frontend',
    size: 19,
    x: 55,
    y: 5,
    depth: 0.7,
    order: 2,
    description: 'Leveraging SSR, ISR, and API routes to deliver SEO-friendly, performance-optimized production sites.',
  },
  {
    name: 'TypeScript',
    category: 'Frontend',
    size: 20,
    x: 56,
    y: 56,
    depth: 1.0,
    order: 3,
    description: 'Enforcing strict type safety and domain models across full-stack codebases to eliminate runtime errors.',
  },
  {
    name: 'Dart',
    category: 'Mobile',
    size: 24,
    x: 4,
    y: 45,
    depth: 0.85,
    order: 4,
    description: 'Writing structured mobile core logic using strong OOP architecture, async streams, and sound null safety.',
  },
  {
    name: 'Node.js',
    category: 'Backend',
    size: 25,
    x: 60,
    y: 78,
    depth: 1.0,
    order: 5,
    description: 'Developing scalable backend microservices, RESTful routes, and real-time WebSocket communication channels.',
  },
  {
    name: 'PostgreSQL',
    category: 'Database',
    size: 16,
    x: 28,
    y: 68,
    depth: 0.55,
    order: 6,
    description: 'Architecting relational schemas with advanced indexing, foreign keys, and complex query performance tuning.',
  },
  {
    name: 'MySQL',
    category: 'Database',
    size: 20,
    x: 42,
    y: 38,
    depth: 0.5,
    order: 7,
    description: 'Designing normalized production databases, stored procedures, and high-availability data structures.',
  },
  {
    name: 'REST APIs',
    category: 'Backend',
    size: 17,
    x: 12,
    y: 30,
    depth: 0.9,
    order: 8,
    description: 'Engineering clean, versioned RESTful endpoints secured with JWT auth, rate limiting, and OpenAPI specs.',
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend',
    size: 22,
    x: 35,
    y: 25,
    depth: 0.5,
    order: 9,
    description: 'Crafting highly responsive, pixel-perfect UI design systems with modern glassmorphism tokens.',
  },
  {
    name: 'Docker',
    category: 'DevOps',
    size: 17,
    x: 18,
    y: 85,
    depth: 0.9,
    order: 10,
    description: 'Containerizing full-stack environments with docker-compose to ensure smooth, uniform local-to-cloud deployments.',
  },
  {
    name: 'Git & GitHub',
    category: 'Tools',
    size: 15,
    x: 66,
    y: 32,
    depth: 0.5,
    order: 11,
    description: 'Managing codebase versions through structured feature branching, interactive rebases, and automated CI/CD.',
  },
  {
    name: 'JavaScript',
    category: 'Frontend',
    size: 25,
    x: 30,
    y: 48,
    depth: 1.0,
    order: 12,
    description: 'Utilizing modern ES6+ paradigms, event loops, and asynchronous patterns to write high-performance web code.',
  },
  {
    name: 'CSS',
    category: 'Frontend',
    size: 21,
    x: 70,
    y: 20,
    depth: 0.95,
    order: 13,
    description: 'Structuring layout systems with CSS Grid, Flexbox, keyframe animations, and custom CSS variables.',
  },
  {
    name: 'GraphQL',
    category: 'Backend',
    size: 15,
    x: 72,
    y: 65,
    depth: 0.5,
    order: 14,
    description: 'Building schema-first API endpoints to eliminate over-fetching and enable flexible front-end data queries.',
  },
  {
    name: 'MongoDB',
    category: 'Database',
    size: 16,
    x: 46,
    y: 85,
    depth: 0.55,
    order: 15,
    description: 'Modeling document-based NoSQL collections for flexible data structures and high-throughput read operations.',
  },
  {
    name: 'Flutter',
    category: 'Mobile',
    size: 28,
    x: 65,
    y: 40,
    depth: 1.0,
    order: 16,
    description: 'Building cross-platform mobile apps using Bloc architecture, custom animations, and seamless native integration.',
  },
  {
    name: 'Express',
    category: 'Backend',
    size: 16,
    x: 56,
    y: 70,
    depth: 0.55,
    order: 17,
    description: 'Structuring lightweight Node.js API layers, request middlewares, and modular route controllers.',
  },
  {
    name: 'prisma ORM',
    category: 'Database',
    size: 20,
    x: 15,
    y: 60,
    depth: 0.5,
    order: 18,
    description: 'Managing database migrations and querying SQL engines with auto-generated, type-safe client interfaces.',
  },
  {
    name: 'OOP',
    category: 'Architecture',
    size: 20,
    x: 35,
    y: 10,
    depth: 0.8,
    order: 19,
    description: 'Applying SOLID design principles, inheritance, and encapsulation to build reusable, maintainable software systems.',
  },
  {
    name: 'prompt engineering',
    category: 'AI',
    size: 15,
    x: 15,
    y: 40,
    depth: 0.5,
    order: 20,
    description: 'Designing system prompts, few-shot patterns, and structured AI workflows to integrate LLMs into software products.',
  },
  {
    name: 'ASP.NET',
    category: 'Backend',
    size: 18,
    x: 10,
    y: 70,
    depth: 0.5,
    order: 21,
    description: 'Building enterprise-grade web APIs and backend services powered by C# and the .NET ecosystem.',
  },
  {
    name: 'database design',
    category: 'Database',
    size: 18,
    x: 45,
    y: 15,
    depth: 0.8,
    order: 22,
    description: 'Modeling Entity-Relationship Diagrams (ERDs), normalizing data tables, and defining efficient relational constraints.',
  },
  {
    name: 'Figma',
    category: 'Design',
    size: 25,
    x: 70,
    y: 10,
    depth: 0.5,
    order: 23,
    description: 'Designing interactive wireframes, UI prototypes, and translating design tokens directly into production code.',
  },
  {
    name: 'HTML',
    category: 'Frontend',
    size: 20,
    x: 20,
    y: 20,
    depth: 0.4,
    order: 24,
    description: 'Structuring semantic, accessible web pages optimized for modern browser engines and screen readers.',
  },
  {
    name: 'java',
    category: 'Backend',
    size: 25,
    x: 40,
    y: 58,
    depth: 0.5,
    order: 25,
    description: 'Developing strongly-typed object-oriented applications, backend services, and algorithmic problem solutions.',
  },
];

async function main() {
  console.log('Seeding exact non-overlapping skills coordinates...');

  for (const s of EXACT_SKILLS) {
    const existing = await prisma.skill.findFirst({
      where: {
        OR: [
          { name: { equals: s.name } },
          { name: { equals: s.name.toLowerCase() } }
        ]
      }
    });

    if (existing) {
      await prisma.skill.update({
        where: { id: existing.id },
        data: {
          name: s.name,
          category: s.category,
          positionX: s.x,
          positionY: s.y,
          depth: typeof s.depth === 'number' ? (s.depth <= 1 ? Math.round(s.depth * 10) : s.depth) : 5,
          weight: typeof s.size === 'number' ? Math.min(5, Math.max(1, Math.round(s.size / 6))) : 3,
          size: s.size,
          x: s.x,
          y: s.y,
          order: s.order,
          description: s.description,
          isEnabled: true,
        },
      });
      console.log(`Updated skill: ${s.name} at (x: ${s.x}, y: ${s.y})`);
    } else {
      await prisma.skill.create({
        data: {
          name: s.name,
          category: s.category,
          positionX: s.x,
          positionY: s.y,
          depth: typeof s.depth === 'number' ? (s.depth <= 1 ? Math.round(s.depth * 10) : s.depth) : 5,
          weight: typeof s.size === 'number' ? Math.min(5, Math.max(1, Math.round(s.size / 6))) : 3,
          size: s.size,
          x: s.x,
          y: s.y,
          order: s.order,
          description: s.description,
          isEnabled: true,
        },
      });
      console.log(`Created skill: ${s.name} at (positionX: ${s.x}%, positionY: ${s.y}%)`);
    }
  }

  // Update PortfolioSettings with exact separated paragraphs
  await prisma.portfolioSettings.update({
    where: { id: 'singleton' },
    data: {
      skillsBadge: 'SKILLS & EXPERTISE',
      skillsTitle: 'Engineered Core Capabilities',
      skillsParagraph1: 'I architect full-stack systems end-to-end — from clean Laravel & Node.js service layers with normalized relational schemas, to reactive React and Next.js frontends built for performance, accessibility, and long-term maintainability.',
      skillsParagraph2: 'Every engineering decision is grounded in scalability: modular API design, precise database indexing, and production-tested deployment workflows that keep systems reliable under real-world load and rapid iteration.',
      skillsPoint1Title: 'Architecture First',
      skillsPoint1Text: 'Clean RESTful APIs & modular database design built to last.',
      skillsPoint2Title: 'Modern Stack',
      skillsPoint2Text: 'High-performance React, Next.js, and Tailwind implementations.',
    },
  });

  console.log('Done!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
