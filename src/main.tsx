import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { StoreProvider, useStore } from './store';
import { TabBar, type Tab } from './components/TabBar';
import { Today } from './screens/Today';
import { History } from './screens/History';
import { Library } from './screens/Library';
import { Profile } from './screens/Profile';

function ThemeManager() {
  const { state } = useStore();

  useEffect(() => {
    const html = document.documentElement;
    if (state.theme === 'dark') {
      html.classList.add('dark');
    } else if (state.theme === 'light') {
      html.classList.remove('dark');
    } else {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      html.classList.toggle('dark', mq.matches);
      const handler = (e: MediaQueryListEvent) => html.classList.toggle('dark', e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [state.theme]);

  return null;
}

function App() {
  const [tab, setTab] = useState<Tab>('today');

  return (
    <>
      <ThemeManager />
      {tab === 'today'   && <Today />}
      {tab === 'history' && <History />}
      {tab === 'library' && <Library />}
      {tab === 'profile' && <Profile />}
      <TabBar active={tab} onChange={setTab} />
    </>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>
);
