import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: 'Who can participate in NumrenoHacks?',
      answer: 'Any student from a recognized educational institution can participate. Teams can have 2-4 members. Both undergraduate and graduate students are welcome!',
    },
    {
      question: 'Is there a registration fee?',
      answer: 'No! NumrenoHacks is completely free to participate. We believe in making innovation accessible to everyone.',
    },
    {
      question: 'What should I bring to the hackathon?',
      answer: 'Bring your laptop, charger, a valid student ID, and your creativity! We\'ll provide WiFi, food, and lots of festive cheer.',
    },
    {
      question: 'Do I need to have a team before registering?',
      answer: 'Yes, you need to register as a team. If you don\'t have a team yet, join our Discord server where you can find teammates with complementary skills.',
    },
    {
      question: 'What are the judging criteria?',
      answer: 'Projects will be judged on innovation, technical complexity, design, practicality, and presentation. The Christmas spirit in your project is a bonus!',
    },
    {
      question: 'Can I work on a project I\'ve already started?',
      answer: 'No, all projects must be started from scratch during the hackathon period. However, you can use existing libraries, frameworks, and APIs.',
    },
    {
      question: 'What kind of projects can we build?',
      answer: 'You can choose from our problem statement tracks: AI & Machine Learning, Web3 & Blockchain, Healthcare, or Sustainability. Be creative and innovative!',
    },
    {
      question: 'Will there be mentors available?',
      answer: 'Absolutely! We have industry experts and experienced developers available throughout the hackathon to guide you and answer technical questions.',
    },
    {
      question: 'What are the prizes?',
      answer: 'Winners will receive cash prizes, gadgets, certificates, exclusive swag, and potential internship opportunities with our sponsor companies. Plus, eternal glory!',
    },
    {
      question: 'How will the hackathon be conducted?',
      answer: 'The hackathon will be held in person at our venue. You\'ll have 48 hours to build your project, with breaks for food, rest, and fun activities.',
    },
  ];

  return (
    <section id="faq" className="py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <HelpCircle className="w-8 h-8 text-christmas-gold" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Frequently Asked <span className="text-christmas-red">Questions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers! If you don't find what you're looking for,
            feel free to reach out to us.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="glass-card px-6 border-0 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline hover:text-christmas-gold py-4">
                <span className="text-left font-medium">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a
            href="mailto:hello@numrenohacks.com"
            className="inline-flex items-center gap-2 text-christmas-gold hover:text-christmas-red transition-colors font-medium"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
