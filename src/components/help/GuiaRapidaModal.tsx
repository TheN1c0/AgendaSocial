import { Modal } from '../ui/Modal';
import { useHelp } from '../../context/HelpContext';
import { Button } from '../ui/Button';

export const GuiaRapidaModal = () => {
  const { isGuiaRapidaOpen, closeGuiaRapida, startOnboarding } = useHelp();

  return (
    <Modal
      isOpen={isGuiaRapidaOpen}
      onClose={closeGuiaRapida}
      title="📖 Guía Rápida de Uso - Agenda Social"
      size="lg"
    >
      <div className="space-y-6 text-gray-700 dark:text-gray-200">
        
        {/* INTRO */}
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          Agenda Social te permite gestionar todo el ciclo de atención social en 3 pasos clave:
        </p>

        {/* STEP 1 */}
        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
            1
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 m-0">
              Registrar o Buscar al Beneficiario
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 mb-2">
              Ingresa a <strong>Beneficiarios</strong> para buscar a una persona mediante su nombre o RUT. Si no existe, pulsa <strong>"+ Nuevo Beneficiario"</strong> para ingresarla con sus datos de contacto.
            </p>
            <div className="text-xs text-primary font-medium">
              📍 Sección: <code className="bg-primary/10 px-1.5 py-0.5 rounded font-mono">/beneficiarios</code>
            </div>
          </div>
        </div>

        {/* STEP 2 */}
        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
            2
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 m-0">
              Abrir un Caso o Intervención
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 mb-2">
              En la sección <strong>Casos</strong>, haz clic en <strong>"+ Nuevo Caso"</strong>. Selecciona al beneficiario, define el tipo de intervención (asistencia, subsidio, etc.), el nivel de prioridad (Baja, Media, Urgente) y el profesional asignado.
            </p>
            <div className="text-xs text-primary font-medium">
              📍 Sección: <code className="bg-primary/10 px-1.5 py-0.5 rounded font-mono">/casos</code>
            </div>
          </div>
        </div>

        {/* STEP 3 */}
        <div className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#1a1a1a] border border-gray-100 dark:border-gray-800">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
            3
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 m-0">
              Seguimiento y Registro de Avances
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 mb-2">
              Haz clic en cualquier caso para ver su ficha. Desde ahí podrás agregar <strong>notas de intervención en la bitácora</strong>, registrar gestiones y <strong>cambiar el estado</strong> (Pendiente ➔ En Proceso ➔ Resuelto) para dar cierre.
            </p>
            <div className="text-xs text-primary font-medium">
              📍 Sección: <code className="bg-primary/10 px-1.5 py-0.5 rounded font-mono">/casos/:id</code>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-3 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={startOnboarding}
            className="text-xs font-semibold text-primary hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1.5"
          >
            <span>🚀</span> Ver recorrido visual interactivo
          </button>
          <Button variant="primary" size="sm" onClick={closeGuiaRapida}>
            Entendido
          </Button>
        </div>

      </div>
    </Modal>
  );
};
