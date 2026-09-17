import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from './Button';

/* ─── Types ──────────────────────────────────────────────────────── */
interface FAQItem {
  question: string;
  answer: string;
}

interface FAQData {
  [category: string]: FAQItem[];
}

interface FAQCategories {
  [key: string]: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  categories: FAQCategories;
  faqData: FAQData;
  className?: string;
  [key: string]: any;
}

/* ─── FAQ Header ─────────────────────────────────────────────────── */
const FAQHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="relative z-10 flex flex-col items-start justify-start mb-12">
    <div className="flex items-center gap-3 mb-4">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground font-mono">
        {subtitle}
      </span>
    </div>
    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05]">
      {title}
    </h2>
  </div>
);

/* ─── FAQ Tabs ───────────────────────────────────────────────────── */
const FAQTabs = ({
  categories,
  selected,
  setSelected,
}: {
  categories: FAQCategories;
  selected: string;
  setSelected: (key: string) => void;
}) => (
  <div className="relative z-10 flex flex-wrap items-center gap-2 mb-12">
    {Object.entries(categories).map(([key, label]) => (
      <button
        key={key}
        onClick={() => setSelected(key)}
        className={cn(
          'relative overflow-hidden whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300 cursor-pointer',
          selected === key
            ? 'border-emerald-500/50 text-background'
            : 'border-border bg-transparent text-muted-foreground hover:text-foreground hover:border-border/80'
        )}
      >
        <span className="relative z-10">{label}</span>
        <AnimatePresence>
          {selected === key && (
            <motion.span
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: 'backIn' }}
              className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-600 to-emerald-500"
            />
          )}
        </AnimatePresence>
      </button>
    ))}
  </div>
);

/* ─── FAQ List ───────────────────────────────────────────────────── */
const FAQList = ({ faqData, selected }: { faqData: FAQData; selected: string }) => (
  <div className="w-full">
    <AnimatePresence mode="wait">
      {Object.entries(faqData).map(([category, questions]) => {
        if (selected !== category) return null;
        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3"
          >
            {questions.map((faq, index) => (
              <FAQItemCard key={index} {...faq} />
            ))}
          </motion.div>
        );
      })}
    </AnimatePresence>
  </div>
);

/* ─── FAQ Item Card ──────────────────────────────────────────────── */
const FAQItemCard = ({ question, answer }: FAQItem) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      animate={isOpen ? 'open' : 'closed'}
      className={cn(
        'rounded-2xl border backdrop-blur-xl transition-all duration-300',
        isOpen
          ? 'bg-card/60 dark:bg-white/[0.04] border-emerald-500/30 shadow-lg shadow-emerald-500/5'
          : 'bg-card/30 dark:bg-white/[0.02] border-border/50 hover:border-emerald-500/25'
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-6 p-6 text-start cursor-pointer"
      >
        <span
          className={cn(
            'text-base md:text-lg font-medium tracking-tight transition-colors leading-snug',
            isOpen ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {question}
        </span>
        <motion.span
          variants={{
            open: { rotate: '45deg' },
            closed: { rotate: '0deg' },
          }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <Plus
            className={cn(
              'h-5 w-5 transition-colors',
              isOpen ? 'text-emerald-500' : 'text-muted-foreground'
            )}
          />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : '0px',
          marginBottom: isOpen ? '24px' : '0px',
        }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden px-6"
      >
        <p className="text-muted-foreground leading-relaxed text-sm md:text-base text-start">{answer}</p>
      </motion.div>
    </motion.div>
  );
};

/* ─── Main FAQ Component ─────────────────────────────────────────── */
export const FAQ = ({
  title = 'FAQs',
  subtitle = 'Frequently Asked Questions',
  categories,
  faqData,
  className,
  ...props
}: FAQProps) => {
  const categoryKeys = Object.keys(categories);
  const [selectedCategory, setSelectedCategory] = useState(categoryKeys[0]);

  return (
    <section
      className={cn(
        'relative overflow-hidden bg-transparent px-6 py-28',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto">
        <FAQHeader title={title} subtitle={subtitle} />
        <FAQTabs
          categories={categories}
          selected={selectedCategory}
          setSelected={setSelectedCategory}
        />
        <FAQList faqData={faqData} selected={selectedCategory} />
      </div>
    </section>
  );
};

export default FAQ;
