import { useEffect } from 'react';
import { useHelp, ONBOARDING_STEPS } from '../../context/HelpContext';
import { Button } from '../ui/Button';

export const OnboardingTour = () => {
  const {
    isOnboardingOpen,
    currentStepIndex,
    closeOnboarding,
    nextStep,
    prevStep,
    goToStep
  } = useHelp();

  const step = ONBOARDING_STEPS[currentStepIndex];
  const isLast = currentStepIndex === ONBOARDING_STEPS.length - 1;
  const isFirst = currentStepIndex === 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOnboardingOpen) return;
      if (e.key === 'Escape') closeOnboarding();
      if (e.key === 'ArrowRight') nextStep();
      if (e.key === 'ArrowLeft' && !isFirst) prevStep();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOnboardingOpen, isFirst, nextStep, prevStep, closeOnboarding]);

  if (!isOnboardingOpen || !step) return null;

  return (
    <div className="fixed inset-0 md:left-[250px] z-50 flex items-center justify-center md:justify-start md:pl-10 p-4 bg-black/35 backdrop-blur-[1px] transition-all animate-fadeIn">
      
      {/* ONBOARDING CARD */}
      <div 
        className="bg-white dark:bg-[#202020] border-2 border-primary/40 dark:border-primary/50 rounded-2xl w-full max-w-lg shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col transform transition-all duration-300 relative z-50"
        role="dialog"
        aria-modal="true"
      >
        {/* DIRECTIONAL CALLOUT TAG POINTING TO THE SIDEBAR (DESKTOP) */}
        <div className="hidden md:flex absolute -left-3 top-7 w-3 h-3 bg-white dark:bg-[#202020] border-l-2 border-b-2 border-primary/40 dark:border-primary/50 transform rotate-45" />


        {/* TOP BAR / PROGRESS */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1c1c1c]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
              Paso {currentStepIndex + 1} de {ONBOARDING_STEPS.length}
            </span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
              👈 <span className="text-primary font-bold">{step.badgeText}</span>
            </span>
          </div>
          <button
            onClick={closeOnboarding}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-medium bg-transparent border-none cursor-pointer px-2 py-1 rounded transition-colors"
            title="Saltar guía"
          >
            Omitir ✕
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-3xl shrink-0 shadow-inner ring-1 ring-primary/30">
              {step.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 m-0 leading-tight">
                {step.title}
              </h2>
              <p className="text-sm font-semibold text-primary mt-1 mb-2">
                {step.subtitle}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed m-0">
                {step.description}
              </p>
            </div>
          </div>

          {/* KEY FEATURES BOX */}
          <div className="mt-5 p-3.5 bg-gray-50 dark:bg-[#171717] rounded-xl border border-gray-100 dark:border-gray-800">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
              Funcionalidades clave en pantalla:
            </span>
            <ul className="m-0 p-0 list-none space-y-1.5">
              {step.keyFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-center text-xs text-gray-700 dark:text-gray-300 font-medium">
                  <span className="text-primary mr-2 text-sm leading-none font-bold">✓</span>
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* VISUAL HINT */}
          <div className="mt-3 text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5 italic">
            <span>💡</span> Mira la opción resaltada en el menú lateral y la vista cargada en el fondo.
          </div>
        </div>

        {/* STEP DOTS & CONTROLS FOOTER */}
        <div className="px-6 py-4 bg-gray-50/80 dark:bg-[#181818] border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          {/* STEP INDICATORS */}
          <div className="flex items-center gap-1.5">
            {ONBOARDING_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToStep(idx)}
                aria-label={`Ir al paso ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 border-none cursor-pointer p-0 ${
                  idx === currentStepIndex
                    ? 'w-6 bg-primary'
                    : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button
                variant="secondary"
                size="sm"
                onClick={prevStep}
              >
                Anterior
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={nextStep}
            >
              {isLast ? 'Finalizar y Explorar' : 'Siguiente →'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
