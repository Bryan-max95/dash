'use client';

import { motion } from 'framer-motion';
import TicketForm from '../components/widgets/TicketForm';

export default function Support() {
  const handleTicketSubmit = (data: {
    subject: string;
    description: string;
    category: string;
    files: File[];
  }) => {
    console.log('Ticket enviado:', {
      subject: data.subject,
      description: data.description,
      category: data.category,
      fileNames: data.files.map((file) => file.name),
    });
    alert('Ticket enviado con éxito. ¡Gracias por contactarnos!');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-[#8B0000]">Soporte</h2>
      <TicketForm onSubmit={handleTicketSubmit} />
    </motion.div>
  );
}