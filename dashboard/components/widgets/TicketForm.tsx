// components/widgets/TicketForm.tsx
'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip } from 'lucide-react';

interface TicketFormProps {
  onSubmit: (data: { subject: string; description: string; category: string; files: File[] }) => void;
}

export default function TicketForm({ onSubmit }: TicketFormProps) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles).filter(
        (file) => file.type.startsWith('image/') || file.type.startsWith('video/')
      );
      if (newFiles.length !== selectedFiles.length) {
        setError('Solo se permiten imágenes y videos.');
      } else {
        setError('');
      }
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setError('El asunto y la descripción son obligatorios.');
      return;
    }
    onSubmit({ subject, description, category, files });
    setSubject('');
    setDescription('');
    setCategory('general');
    setFiles([]);
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#2D2D2D] p-6 rounded-lg border border-[#8B0000]/50"
    >
      <h3 className="text-lg font-bold text-[#8B0000] mb-4 flex items-center gap-2">
        <Send className="w-5 h-5" />
        Crear Ticket de Soporte
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Asunto</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-[#1F1F1F] text-white border border-[#8B0000]/50 rounded px-3 py-2 focus:outline-none focus:border-[#8B0000]"
            placeholder="Ej: Problema con el dashboard"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#1F1F1F] text-white border border-[#8B0000]/50 rounded px-3 py-2 focus:outline-none focus:border-[#8B0000]"
          >
            <option value="general">General</option>
            <option value="technical">Técnico</option>
            <option value="billing">Facturación</option>
            <option value="security">Seguridad</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#1F1F1F] text-white border border-[#8B0000]/50 rounded px-3 py-2 focus:outline-none focus:border-[#8B0000] min-h-[120px]"
            placeholder="Describe el problema en detalle..."
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Adjuntos (imágenes o videos)</label>
          <div className="flex items-center gap-2">
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 bg-[#8B0000] text-white px-3 py-2 rounded hover:bg-[#8B0000]/80 cursor-pointer"
            >
              <Paperclip className="w-4 h-4" />
              Adjuntar
            </label>
          </div>
          {files.length > 0 && (
            <div className="mt-2 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-white">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <motion.button
          whileHover={{ scale: 1.05 }}
          type="submit"
          className="w-full bg-[#8B0000] text-white px-4 py-2 rounded hover:bg-[#8B0000]/80 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Enviar Ticket
        </motion.button>
      </form>
    </motion.div>
  );
}