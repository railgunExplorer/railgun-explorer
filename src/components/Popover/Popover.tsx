import React, { useState, useRef, useEffect, ReactNode } from "react";

interface PopoverProps {
  trigger: ReactNode;
  content: ReactNode;
}

const Popover: React.FC<PopoverProps> = ({ trigger, content }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    setIsVisible(true);
  };

  const handleMouseMove = () => {
    if (isVisible) {
      updatePosition();
    }
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setIsVisible(false)}
      >
        {trigger}
      </div>
      {isVisible && (
        <div
          ref={popoverRef}
          className="fixed z-50 mt-1 transform -translate-x-1/2"
          style={{ top: `${position.top}px`, left: `${position.left}px` }}
        >
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="relative bg-white p-3">{content}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Popover;
