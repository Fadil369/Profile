import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Lang, AppId } from './content';
import { APP_TITLES } from './content';
import WorkspaceScene from './WorkspaceScene';
import AboutApp from './apps/About';
import ProjectsApp from './apps/Projects';
import WritingApp from './apps/Writing';
import BrainSAITApp from './apps/BrainSAIT';
import CollaborateApp from './apps/Collaborate';
import TerminalApp from './apps/Terminal';
import FAQApp from './apps/FAQ';
import type { Localized } from './content';
import './Desktop.css';
import { useAppState } from '../AppState';
import './Apps.css';
import './RemainingApps.css';

export type AppWindow = {
  id: AppId;
  title: Localized;
  icon: string;
  mounted: boolean;
  fullscreen: boolean;
  position?: WindowPosition;
  width?: number;
  height?: number;
};

type WindowPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

interface Props {
  lang: Lang;
  theme: ThemeName;
  quality: 'low' | 'high';
}

const DEFAULT_WIDTH = 720;
const DEFAULT_HEIGHT = 500;
const WINDOW_PADDING = 16;

export default function WorkspaceDesktop({ lang, theme, quality }: Props) {
  const { toggleTheme } = useAppState();
  const [sceneFailed, setSceneFailed] = useState(false);
  const [activeApp, setActiveApp] = useState<AppWindow | null>(null);

  const [windows, setWindows] = useState<Record<AppId, { mounted: boolean; position?: WindowPosition }>>({
    about: { mounted: false },
    projects: { mounted: false },
    writing: { mounted: false },
    brainsait: { mounted: false },
    contact: { mounted: false },
    terminal: { mounted: false },
    faq: { mounted: false },
  });

  const draggedRef = useRef<{
    app: AppId;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  } | null>(null);

  const Icons = {
    about: '📋',
    projects: '🚀',
    writing: '📖',
    brainsait: '🧠',
    contact: '🤝',
    terminal: '💻',
    faq: '❓',
  } as const;

  const getInitialPosition = useCallback((existing?: WindowPosition): WindowPosition => {
    if (existing) return existing;

    const windowsCount = Object.values(windows).filter(w => w.mounted).length;
    const offset = windowsCount * 20;
    return {
      x: offset + 20,
      y: offset + 20,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
    };
  }, [windows]);

  const handleOpen = useCallback((appId: AppId) => {
    if (activeApp?.id === appId) {
      setActiveApp(null);
      setWindows(prev => ({
        ...prev,
        [appId]: { mounted: true },
      }));
      return;
    }

    setActiveApp({ id: appId, title: APP_TITLES[appId], icon: Icons[appId], mounted: true, fullscreen: false, position: getInitialPosition() });
    setWindows(prev => ({
      ...prev,
      [appId]: { mounted: true },
    }));
  }, [activeApp, getInitialPosition]);

  const handleEnter = useCallback(() => {
    const existing = windows.terminal.position;
    setActiveApp({ id: 'terminal', title: APP_TITLES.terminal, icon: Icons.terminal, mounted: true, fullscreen: false, position: existing || getInitialPosition(existing) });
    setWindows(prev => ({
      ...prev,
      terminal: { mounted: true, position: existing },
    }));
  }, [windows, getInitialPosition]);

  const handleTheme = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const handleClose = useCallback((appId: AppId) => {
    setActiveApp(prev => (prev?.id === appId ? null : prev));
    setWindows(prev => ({
      ...prev,
      [appId]: { mounted: false },
    }));
  }, []);

  const requestFullscreen = useCallback((appId: AppId) => {
    if (activeApp?.id === appId) {
      setActiveApp(prev => ({ ...prev!, fullscreen: !prev!.fullscreen }));
    }
  }, [activeApp]);

  const [dragging, setDragging] = useState(false);

  const handleMouseDown = useCallback((appId: AppId, e: React.MouseEvent) => {
    e.preventDefault();
    const existingPosition = windows[appId]?.position;
    const initialPos = getInitialPosition(existingPosition);
    const currentPos = activeApp?.id === appId ? (activeApp.position ?? initialPos) : initialPos;
    draggedRef.current = {
      app: appId,
      startX: e.clientX,
      startY: e.clientY,
      initialX: currentPos.x,
      initialY: currentPos.y,
    };
    setDragging(true);
  }, [activeApp, windows, getInitialPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const drag = draggedRef.current;
    if (!drag) return;

    const dx = e.clientX - drag.startX;
    const dy = e.clientY - drag.startY;

    const newX = Math.max(WINDOW_PADDING, drag.initialX + dx);
    const newY = Math.max(WINDOW_PADDING, drag.initialY + dy);

    setActiveApp(prev => {
      if (!prev || prev.id !== drag.app) return prev;
      const currentWidth = prev.width ?? prev.position?.width ?? DEFAULT_WIDTH;
      const currentHeight = prev.height ?? prev.position?.height ?? DEFAULT_HEIGHT;
      return { ...prev, position: { x: newX, y: newY, width: currentWidth, height: currentHeight } };
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    draggedRef.current = null;
    setDragging(false);
  }, []);

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (!activeApp) {
      setWindows(prev => ({
        ...prev,
        about: { mounted: false },
        projects: { mounted: false },
        writing: { mounted: false },
        brainsait: { mounted: false },
        contact: { mounted: false },
        terminal: { mounted: false },
        faq: { mounted: false },
      }));
    }
  }, [activeApp]);

  const windowComponent = (id: AppId, onClose: () => void) => {
    const appProps = { lang, theme, quality, onClose };
    switch (id) {
      case 'about': return <AboutApp {...appProps} />;
      case 'projects': return <ProjectsApp {...appProps} />;
      case 'writing': return <WritingApp {...appProps} />;
      case 'brainsait': return <BrainSAITApp {...appProps} />;
      case 'contact': return <CollaborateApp {...appProps} />;
      case 'terminal': return <TerminalApp {...appProps} />;
      case 'faq': return <FAQApp {...appProps} />;
      default: return null;
    }
  }

  return (
    <div className="workspace-desktop" data-theme={theme}>
      {!activeApp && !sceneFailed && (
        <WorkspaceScene
          lang={lang}
          theme={theme}
          quality={quality}
          onOpen={handleOpen}
          onEnter={handleEnter}
          onTheme={handleTheme}
          onFailure={() => setSceneFailed(true)}
        />
      )}

      {!activeApp && sceneFailed && <nav className="workspace-fallback" aria-label={lang === 'ar' ? 'تطبيقات مساحة العمل' : 'Workspace apps'}>
        {(Object.keys(APP_TITLES) as AppId[]).map(id => <button className="btn btn-secondary" key={id} onClick={() => handleOpen(id)}>{APP_TITLES[id][lang]}</button>)}
      </nav>}
      {activeApp && (
        <div
          className={`desktop-window${activeApp.fullscreen ? " is-fullscreen" : ""}`}
          style={{
            left: `${activeApp.position?.x ?? 0}px`,
            top: `${activeApp.position?.y ?? 0}px`,
            width: `${activeApp.position?.width ?? DEFAULT_WIDTH}px`,
            height: `${activeApp.position?.height ?? DEFAULT_HEIGHT}px`,
          }}
        >
          <div
            className="window-header"
            onMouseDown={(e) => handleMouseDown(activeApp.id, e)}
          >
            <div className="window-title">
              <span className="window-icon">{Icons[activeApp.id as AppId]}</span>
              <span className="window-title-text">{activeApp.title[lang]}</span>
            </div>
            <div className="window-controls" onMouseDown={e => e.stopPropagation()}>
              <button
                className="control-btn control-btn-minimize"
                onClick={() => handleClose(activeApp.id)}
                aria-label="Close window"
              >
                <span className="icon">−</span>
              </button>
              <button
                className="control-btn control-btn-fullscreen"
                onClick={() => requestFullscreen(activeApp.id)}
                aria-label="Toggle fullscreen"
              >
                <span className="icon">⛶</span>
              </button>
            </div>
          </div>
          <div className="window-content">
            {windowComponent(activeApp.id, () => handleClose(activeApp.id))}
          </div>
        </div>
      )}
    </div>
  );
}

type ThemeName = 'light' | 'dark';