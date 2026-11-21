import { useState, type HTMLAttributes } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cn } from '../ui/Button';
import { SplitText, SpotlightCard } from '../react-bits';
import { useIsMobile } from '../../hooks/useIsMobile';

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

interface FAQProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: string;
  subtitle?: string;
  categories: FAQCategories;
  faqData: FAQData;
  className?: string;
}

const FAQHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => {
  const isMobile = useIsMobile();
  return (
    <div className="relative z-10 flex flex-col items-start justify-start mb-6 sm:mb-8 md:mb-10">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-foreground mb-2 sm:mb-3">
        {isMobile ? title : (
          <SplitText
            text={title}
            delay={35}
            duration={0.45}
          />
        )}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
};

/* ─── FAQ Tabs ───────────────────────────────────────────────────── */
const FAQTabs = ({
  categories,
  selected,
  setSelected,
}: {
  categories: FAQCategories;
  selected: string;
  setSelected: (key: string) => void;
}) => {
  const isMobile = useIsMobile();
  return (
    <div className="relative z-10 flex flex-nowrap sm:flex-wrap items-center gap-2 mb-7 sm:mb-10 lg:mb-12 overflow-x-auto sm:overflow-visible pb-1.5 sm:pb-0 no-scrollbar">
      {Object.entries(categories).map(([key, label]) => (
        <button
          key={key}
          type="button"
          aria-pressed={selected === key}
          onClick={() => setSelected(key)}
          className={cn(
            'relative shrink-0 overflow-hidden whitespace-nowrap rounded-xl border px-3.5 sm:px-5 py-2 sm:py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer select-none active:scale-[0.98]',
            selected === key
              ? 'border-emerald-500/60 text-white shadow-md shadow-emerald-500/25 sm:-translate-y-0.5'
              : 'border-border/80 dark:border-white/10 bg-card/40 dark:bg-white/[0.03] text-muted-foreground hover:text-foreground hover:border-emerald-500/40 sm:hover:-translate-y-0.5'
          )}
        >
          <span className="relative z-10">{label}</span>
          {isMobile ? (
            selected === key && (
              <span className="absolute inset-0 z-0 bg-gradient-to-r from-emerald-600 to-emerald-500" />
            )
          ) : (
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
          )}
        </button>
      ))}
    </div>
  );
};

/* ─── FAQ List ───────────────────────────────────────────────────── */
const FAQList = ({ faqData, selected }: { faqData: FAQData; selected: string }) => {
  const isMobile = useIsMobile();
  const questions = faqData[selected] || [];

  if (isMobile) {
    return (
      <div className="w-full space-y-3">
        {questions.length > 0 ? (
          questions.map((faq, index) => (
            <FAQItemCard key={`${selected}-${index}`} {...faq} isMobile />
          ))
        ) : (
          <div className="py-12 text-center border border-dashed border-border/60 rounded-xl bg-card/20">
            <p className="text-sm text-muted-foreground">No questions found for this category.</p>
          </div>
        )}
      </div>
    );
  }

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
const FAQItemCard = ({ question, answer, isMobile }: FAQItem & { isMobile?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SpotlightCard
      spotlightColor="rgba(0, 0, 0, 0.02)"
      darkSpotlightColor="rgba(255, 255, 255, 0.007)"
      size={340}
      darkSize={560}
      className={cn(
        'rounded-xl border md:backdrop-blur-xl transition-colors duration-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_16px_32px_-12px_rgba(0,0,0,0.4)]',
        isOpen
          ? 'bg-white/98 dark:bg-zinc-900/95 md:bg-white/95 md:dark:bg-zinc-900/80 border-zinc-300 dark:border-white/[0.18]'
          : 'bg-white/98 dark:bg-zinc-900/95 md:bg-white/90 md:dark:bg-zinc-900/60 border-zinc-200/90 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/[0.18]'
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 sm:gap-6 p-4 sm:p-5 lg:p-6 text-start cursor-pointer relative z-10"
      >
        <span
          className={cn(
            'text-sm sm:text-base md:text-lg font-medium tracking-tight transition-colors leading-snug',
            isOpen ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {question}
        </span>
        {isMobile ? (
          <span
            className={cn(
              'shrink-0 transition-transform duration-200',
              isOpen ? 'rotate-45' : 'rotate-0'
            )}
          >
            <Plus
              className={cn(
                'h-5 w-5 transition-colors',
                isOpen ? 'text-emerald-500' : 'text-muted-foreground'
              )}
            />
          </span>
        ) : (
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
        )}
      </button>
      {isMobile ? (
        isOpen && (
          <div className="px-4 pb-5 relative z-10">
            <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm md:text-base text-start">{answer}</p>
          </div>
        )
      ) : (
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : '0px',
            marginBottom: isOpen ? '1.25rem' : '0rem',
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden px-4 sm:px-5 lg:px-6 relative z-10"
        >
          <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm md:text-base text-start">{answer}</p>
        </motion.div>
      )}
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
        'scroll-mt-24 relative overflow-hidden bg-transparent px-4 sm:px-6 lg:px-8 py-12 sm:py-14 md:py-16 lg:py-20',
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
