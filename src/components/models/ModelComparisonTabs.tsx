"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { AI_MODEL_TABS, buildTabSearch, type ModelTabId } from "@/lib/modelComparison";

interface ModelComparisonTabsProps {
  initialTab: ModelTabId;
  panels: Record<ModelTabId, ReactNode>;
  counts?: Partial<Record<ModelTabId, number>>;
}

const tabId = (id: ModelTabId) => `model-tab-${id}`;
const panelId = (id: ModelTabId) => `model-panel-${id}`;

/** WAI-ARIA Tabs パターン準拠のタブ。選択状態は ?tab= に同期する（再読み込みなし） */
export function ModelComparisonTabs({ initialTab, panels, counts }: ModelComparisonTabsProps) {
  const [active, setActive] = useState<ModelTabId>(initialTab);
  const [hasInteracted, setHasInteracted] = useState(false);
  const tabRefs = useRef<Partial<Record<ModelTabId, HTMLButtonElement | null>>>({});

  const select = (id: ModelTabId, focus = false) => {
    setActive(id);
    setHasInteracted(true);
    if (focus) tabRefs.current[id]?.focus();
    const { pathname, search, hash } = window.location;
    window.history.replaceState(window.history.state, "", `${pathname}${buildTabSearch(search, id)}${hash}`);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = AI_MODEL_TABS.length - 1;
    const next: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in next)) return;
    event.preventDefault();
    select(AI_MODEL_TABS[next[event.key]].id, true);
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="表示する情報"
        className="grid grid-cols-2 gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm"
      >
        {AI_MODEL_TABS.map((tab, index) => {
          const selected = tab.id === active;
          const count = counts?.[tab.id];
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              id={tabId(tab.id)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(tab.id)}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={`relative flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:text-sm ${
                selected ? "text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="model-tab-indicator"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-lg bg-gray-900 shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative">{tab.label}</span>
              {count !== undefined && count > 0 && (
                <span
                  className={`relative hidden rounded-full px-1.5 py-px font-mono text-[10px] tabular-nums sm:inline ${
                    selected ? "bg-white/15 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {AI_MODEL_TABS.map((tab) => {
        const selected = tab.id === active;
        return (
          <div
            key={tab.id}
            id={panelId(tab.id)}
            role="tabpanel"
            aria-labelledby={tabId(tab.id)}
            hidden={!selected}
            tabIndex={0}
            className="mt-6 focus-visible:outline-none"
          >
            <div className={selected && hasInteracted ? "motion-safe:animate-panel-in" : undefined}>
              {panels[tab.id]}
            </div>
          </div>
        );
      })}
    </div>
  );
}
