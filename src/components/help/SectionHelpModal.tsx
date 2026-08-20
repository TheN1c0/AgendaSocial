import { Modal } from '../ui/Modal';
import { useHelp } from '../../context/HelpContext';
import { Button } from '../ui/Button';

export const SectionHelpModal = () => {
  const { isSectionHelpOpen, closeSectionHelp, getCurrentSectionInfo, startOnboarding } = useHelp();
  const info = getCurrentSectionInfo();

  return (
    <Modal
      isOpen={isSectionHelpOpen}
      onClose={closeSectionHelp}
      title={`💡 Ayuda: ${info.title}`}
      size="md"
    >
      <div className="space-y-5 text-gray-700 dark:text-gray-200">
        
        {/* HEADER SUMMARY */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20">
          <span className="text-3xl">{info.icon}</span>
          <div>
            <h4 className="m-0 font-bold text-gray-900 dark:text-gray-100 text-sm">
              ¿Qué puedes hacer aquí?
            </h4>
            <p className="m-0 text-xs text-gray-600 dark:text-gray-300 mt-0.5">
              {info.desc}
            </p>
          </div>
        </div>

        {/* TIPS */}
        <div>
          <h5 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2.5">
            Consejos de uso rápido:
          </h5>
          <ul className="space-y-2 m-0 p-0 list-none">
            {info.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-[#1a1a1a] p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                <span className="text-primary mr-2 font-bold shrink-0">👉</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* FOOTER */}
        <div className="pt-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => {
              closeSectionHelp();
              startOnboarding();
            }}
            className="text-xs font-medium text-primary hover:underline bg-transparent border-none cursor-pointer"
          >
            Ver tour completo →
          </button>
          <Button variant="primary" size="sm" onClick={closeSectionHelp}>
            Cerrar
          </Button>
        </div>

      </div>
    </Modal>
  );
};
