'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { AdminIcon } from './Icons';

export type SelectOption = { value: string; label: string };

export function AdminSelect({
  name,
  id,
  label,
  options,
  defaultValue = '',
}: {
  name: string;
  id?: string;
  label: string;
  options: SelectOption[];
  defaultValue?: string;
}) {
  const generated = useId().replace(/:/g, '');
  const baseId = id || `adm-select-${generated}`;
  const listId = `${baseId}-listbox`;
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const active = listRef.current?.querySelector<HTMLElement>("[data-active='true']");
    active?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  function openMenu(index = selectedIndex) {
    setActiveIndex(index);
    setOpen(true);
  }

  function choose(index: number) {
    const option = options[index];
    if (!option) return;
    setValue(option.value);
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function move(delta: number) {
    setActiveIndex((current) => Math.min(options.length - 1, Math.max(0, current + delta)));
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!open) openMenu(Math.min(options.length - 1, selectedIndex + 1));
      else move(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) openMenu(Math.max(0, selectedIndex - 1));
      else move(-1);
    } else if (event.key === 'Home' && open) {
      event.preventDefault();
      setActiveIndex(0);
    } else if (event.key === 'End' && open) {
      event.preventDefault();
      setActiveIndex(options.length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (open) choose(activeIndex);
      else openMenu();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Tab') {
      setOpen(false);
    }
  }

  return (
    <div className="adm-select" ref={rootRef}>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        ref={triggerRef}
        id={baseId}
        className="adm-select-trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${selected?.label ?? '—'}`}
        aria-activedescendant={open ? `${baseId}-opt-${activeIndex}` : undefined}
        data-open={open ? 'true' : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
      >
        <span className="adm-select-value">{selected?.label ?? '—'}</span>
        <AdminIcon name="chevron" size={15} className="adm-select-chevron" />
      </button>
      {open ? (
        <ul className="adm-select-menu" role="listbox" id={listId} aria-label={label} ref={listRef}>
          {options.map((option, index) => {
            const isSelected = option.value === value;
            return (
              <li
                key={option.value || 'empty'}
                id={`${baseId}-opt-${index}`}
                role="option"
                aria-selected={isSelected}
                data-active={index === activeIndex ? 'true' : undefined}
                data-selected={isSelected ? 'true' : undefined}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}
              >
                <span>{option.label}</span>
                {isSelected ? <AdminIcon name="check" size={14} className="adm-select-check" /> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
