import { useState, useRef, useEffect } from "react";
import { CaretDown } from "@phosphor-icons/react";

function Dropdown({ options, value, onChange, icon, label, width }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const selectedIndex = options.findIndex((opt) => opt.value === value);

  useEffect(() => {
    if (isOpen) {
      setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      setIsClosing(false);
    }
  }, [isOpen, selectedIndex]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        closeDropdown();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function closeDropdown() {
    setIsClosing(true);
    setIsOpen(false);
    setIsClosing(false);
  }

  function handleMouseDown(e) {
    e.preventDefault();
    if (isOpen) {
      closeDropdown();
    } else {
      setIsOpen(true);
    }
  }

  function handleKeyDown(e) {
    if (!isOpen) {
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "Enter" ||
        e.key === " "
      ) {
        e.preventDefault();
        setIsOpen(true);
        return;
      }
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0) {
          onChange(options[focusedIndex].value);
          closeDropdown();
          triggerRef.current?.focus();
        }
        break;
      case "Escape":
        e.preventDefault();
        closeDropdown();
        triggerRef.current?.focus();
        break;
      case "Tab":
        closeDropdown();
        break;
    }
  }

  function handleOptionClick(optionValue) {
    onChange(optionValue);
    closeDropdown();
    triggerRef.current?.focus();
  }

  return (
    <div className="dropdown">
      <button
        ref={triggerRef}
        type="button"
        className="dropdown-trigger"
        style={width ? { width } : undefined}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
      >
        {icon && <span className="dropdown-icon">{icon}</span>}
        <span className="dropdown-value">{selectedOption?.label}</span>
        <span className={`dropdown-caret ${isOpen ? "open" : ""}`}>
          <CaretDown size={14} weight="bold" />
        </span>
      </button>
      {(isOpen || isClosing) && (
        <ul
          ref={menuRef}
          className={`dropdown-menu ${isClosing ? "exiting" : "entering"}`}
          role="listbox"
          aria-label={label}
        >
          {options.map((opt, index) => (
            <li
              key={opt.value}
              className="dropdown-option"
              role="option"
              aria-selected={opt.value === value}
              data-focused={index === focusedIndex}
              onClick={() => handleOptionClick(opt.value)}
              style={{
                background:
                  index === focusedIndex
                    ? "rgba(0, 0, 0, 0.06)"
                    : opt.value === value
                      ? "rgba(0, 0, 0, 0.04)"
                      : undefined,
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
