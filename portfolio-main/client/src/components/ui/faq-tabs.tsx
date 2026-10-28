import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from './Button';
import { SplitText, BlurText, SpotlightCard } from '../react-bits';

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

const FAQHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="relative z-10 flex flex-col items-start justify-start mb-10 sm:mb-12">
    {subtitle && (
      <BlurText
        text={subtitle}
        delay={25}
        className="text-xs font-mono uppercase tracking-wider text-emerald-500 font-semibold mb-2"
      />
    )}
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] text-foreground">
      <SplitText
        text={title}
        delay={35}
        duration={0.45}
      />
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
          'relative overflow-hidden whitespace-nowrap rounded-full border px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none active:scale-[0.98]',
          selected === key
            ? 'border-emerald-500/60 text-white shadow-md shadow-emerald-500/25 -translate-y-0.5'
            : 'border-border/80 dark:border-white/10 bg-card/40 dark:bg-white/[0.03] text-muted-foreground hover:text-foreground hover:border-emerald-500/40 hover:-translate-y-0.5'
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
const FAQList = ({ faqData, selected }: { faqData: FAQData; selected: string }) => {
  const questions = faqData[selected] || [];

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={selected || 'empty'}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          {questions.length > 0 ? (
            questions.map((faq, index) => (
              <FAQItemCard key={`${selected}-${index}`} {...faq} />
            ))
          ) : (
            <div className="py-12 text-center border border-dashed border-border/60 rounded-xl bg-card/20 backdrop-blur-sm">
              <p className="text-sm text-muted-foreground">No questions found for this category.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ─── FAQ Item Card ──────────────────────────────────────────────── */
const FAQItemCard = ({ question, answer }: FAQItem) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SpotlightCard
      spotlightColor="rgba(16, 185, 129, 0.08)"
      size={350}
      className={cn(
        'rounded-xl border backdrop-blur-xl transition-all duration-300',
        isOpen
          ? 'bg-card/60 dark:bg-white/[0.04] border-emerald-500/30 shadow-lg shadow-emerald-500/5'
          : 'bg-card/30 dark:bg-white/[0.02] border-border/50 hover:border-emerald-500/25'
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-6 p-6 text-start cursor-pointer relative z-10"
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
          animate={{ rotate: isOpen ? 45 : 0 }}
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
        className="overflow-hidden px-6 relative z-10"
      >
        <p className="text-muted-foreground leading-relaxed text-sm md:text-base text-start">{answer}</p>
      </motion.div>
    </SpotlightCard>
  );
};

/* ─── Main FAQ Component ─────────────────────────────────────────── */
export const FAQ = ({
  title = 'FAQs',
  subtitle = 'Frequently Asked Questions',
  categories = {},
  faqData = {},
  className,
  ...props
}: FAQProps) => {
  const categoryKeys = Object.keys(categories || {});
  const [selectedCategory, setSelectedCategory] = useState<string>(() => categoryKeys[0] || '');

  // Synchronously determine active category so the first category is always selected on initial mount
  const activeCategory = (selectedCategory && categories[selectedCategory])
    ? selectedCategory
    : (categoryKeys[0] || '');

  return (
    <section
      className={cn(
        'scroll-mt-24 relative overflow-hidden bg-transparent px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20',
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto">
        <FAQHeader title={title} subtitle={subtitle} />
        {categoryKeys.length > 0 && (
          <FAQTabs
            categories={categories}
            selected={activeCategory}
            setSelected={setSelectedCategory}
          />
        )}
        <FAQList faqData={faqData} selected={activeCategory} />
      </div>
    </section>
  );
};

export default FAQ;
