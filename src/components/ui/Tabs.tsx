import { useAuthContext } from '../../context/AuthContext';

export interface TabItem {
  key: string;
  label: string;
  onlyAdmin?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (key: string) => void;
}

export const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => {
  const { user } = useAuthContext();
  const isAdmin = user?.role === 'ADMIN';

  const visibleTabs = tabs.filter(t => !t.onlyAdmin || isAdmin);

  return (
    <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-800 scrollbar-hide">
      <div className="flex gap-6 min-w-full">
        {visibleTabs.map(tab => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={`whitespace-nowrap pb-3 pt-2 px-1 text-sm font-medium border-b-2 transition-colors cursor-pointer bg-transparent uppercase tracking-wide ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {tab.label}
              {tab.onlyAdmin && <span className="ml-2 text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500 px-1.5 py-0.5 rounded-full">Admin</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};
