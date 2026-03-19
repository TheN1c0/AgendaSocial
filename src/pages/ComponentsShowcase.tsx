import { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Avatar } from '../components/ui/Avatar';
import { Spinner } from '../components/ui/Spinner';

export const ComponentsShowcase = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [inputValue, setInputValue] = useState('');

  const renderSection = (title: string, children: React.ReactNode) => (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200">
        {title}
      </h2>
      <div className="flex flex-wrap items-end gap-6 bg-white dark:bg-[#242424] p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-5xl mx-auto bg-gray-50 dark:bg-[#1a1a1a] min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Components Showcase</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Design system display specific to development environment.</p>
      </div>

      {renderSection('Buttons',
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500 font-semibold uppercase">Variants (md)</span>
            <div className="flex gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="danger">Danger Button</Button>
              <Button variant="primary" disabled>Disabled Button</Button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500 font-semibold uppercase">Sizes (Primary)</span>
            <div className="flex items-center gap-4">
              <Button size="sm">Small (sm)</Button>
              <Button size="md">Medium (md)</Button>
              <Button size="lg">Large (lg)</Button>
            </div>
          </div>
        </div>
      )}

      {renderSection('Badges',
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500 font-semibold uppercase">Estados</span>
            <div className="flex gap-4">
              <Badge estado="abierto">Abierto</Badge>
              <Badge estado="en_proceso">En Proceso</Badge>
              <Badge estado="cerrado">Cerrado</Badge>
              <Badge estado="derivado">Derivado</Badge>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs text-gray-500 font-semibold uppercase">Prioridades</span>
            <div className="flex gap-4">
              <Badge prioridad="alta">Alta Prioridad</Badge>
              <Badge prioridad="media">Media Prioridad</Badge>
              <Badge prioridad="baja">Baja Prioridad</Badge>
              <Badge>Neutral Default</Badge>
            </div>
          </div>
        </div>
      )}

      {renderSection('Form Inputs',
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="flex flex-col gap-4">
            <Input 
              label="Standard Input" 
              placeholder="Escribe algo..." 
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
            <Input 
              label="Required Input" 
              placeholder="Obligatorio" 
              required 
            />
            <Input 
              label="Input with Hint" 
              placeholder="ej: 12.345.678-9" 
              hint="Ingresa el RUT sin puntos y con guión" 
            />
            <Input 
              label="Input with Error" 
              placeholder="ej: email@dominio.com" 
              value="emailinvalido"
              error="El formato del correo es incorrecto" 
            />
            <Input 
              label="Disabled Input" 
              placeholder="No puedes escribir aquí" 
              disabled 
            />
          </div>
          <div className="flex flex-col gap-4">
            <Select 
              label="Standard Select" 
              options={[
                { value: '1', label: 'Opción 1' },
                { value: '2', label: 'Opción 2' },
                { value: '3', label: 'Opción 3' },
              ]}
            />
             <Select 
              label="Required Select" 
              required
              options={[
                { value: '1', label: 'Opción 1' },
              ]}
            />
            <Select 
              label="Select with Error" 
              error="Debes seleccionar una opción"
              options={[
                { value: '1', label: 'Opción 1' },
              ]}
            />
             <Select 
              label="Disabled Select" 
              disabled
              options={[]}
            />
          </div>
        </div>
      )}

      {renderSection('Cards',
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <Card title="Card With Title">
            <p className="text-sm text-gray-600 dark:text-gray-400 m-0">
              This is a standard card with a bold title and a separator line. Perfect for distinct sections of content.
            </p>
          </Card>
          <Card>
            <p className="text-sm text-gray-600 dark:text-gray-400 m-0">
              This is a card without a title, just padding and border properties.
            </p>
          </Card>
          <Card noPadding className="col-span-1 md:col-span-2">
            <div className="p-4 bg-primary-light text-primary-dark font-medium border-b border-gray-200 dark:border-gray-700">
              Card without default padding (noPadding prop)
            </div>
            <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
              Allows edge-to-edge content like tables or images.
            </div>
          </Card>
        </div>
      )}

      {renderSection('Avatars',
        <div className="flex gap-8 items-end">
          <div className="flex flex-col items-center gap-2">
            <Avatar name="Juan Pérez" size="sm" />
            <span className="text-xs text-gray-500">sm (24px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar name="Marta Gómez" size="md" />
            <span className="text-xs text-gray-500">md (32px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar name="Carlos Ruíz Silva" size="lg" />
            <span className="text-xs text-gray-500">lg (44px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Avatar name="Single" size="md" />
            <span className="text-xs text-gray-500">1 Word</span>
          </div>
        </div>
      )}

      {renderSection('Spinners',
        <div className="flex gap-8 items-end">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="sm" />
            <span className="text-xs text-gray-500">sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" />
            <span className="text-xs text-gray-500">md</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Spinner size="lg" />
            <span className="text-xs text-gray-500">lg</span>
          </div>
        </div>
      )}

      {renderSection('Modals',
        <div className="flex gap-4">
          <Button onClick={() => { setModalSize('sm'); setIsModalOpen(true); }}>Open Modal (sm)</Button>
          <Button onClick={() => { setModalSize('md'); setIsModalOpen(true); }}>Open Modal (md)</Button>
          <Button onClick={() => { setModalSize('lg'); setIsModalOpen(true); }}>Open Modal (lg)</Button>

          <Modal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            title="Ejemplo de Modal"
            size={modalSize}
          >
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Este es un modal de prueba con tamaño <strong>{modalSize}</strong>.
              Puedes cerrarlo dando clic en la X arriba a la derecha, presionando Escape o haciendo clic fuera del modal.
            </p>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button variant="primary" onClick={() => setIsModalOpen(false)}>Confirmar Acción</Button>
            </div>
          </Modal>
        </div>
      )}

    </div>
  );
};
