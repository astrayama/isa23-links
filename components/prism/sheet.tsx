"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

// The design's --pg-spring (SwiftUI .smooth, 600ms) as a framer-motion spring.
const SPRING = { type: "spring", duration: 0.6, bounce: 0.18 } as const;

/**
 * iOS bottom sheet on thick glass: grabber, title, a short explanation and
 * whatever actions or form it holds. It slides up over a dimmed, blurred page
 * and closes on the scrim, Escape, or a drag down on the grabber. Radix handles
 * the focus trap, scroll lock and labelling.
 */
export function Sheet({
  open,
  onOpenChange,
  title,
  text,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  text?: ReactNode;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const drag = useDragControls();
  const panel = useRef<HTMLDivElement>(null);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="pg-sheet__scrim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              />
            </Dialog.Overlay>
            <div className="pg-sheet">
              <Dialog.Content
                asChild
                forceMount
                {...(text ? {} : { "aria-describedby": undefined })}
                // Focus the sheet, not its first field, so phones don't pop the keyboard on open.
                onOpenAutoFocus={(e) => {
                  e.preventDefault();
                  panel.current?.focus();
                }}
              >
                <motion.div
                  ref={panel}
                  tabIndex={-1}
                  className="pg-sheet__panel pg-glass pg-glass--thick"
                  initial={reduce ? { opacity: 0 } : { y: "110%" }}
                  animate={reduce ? { opacity: 1 } : { y: 0 }}
                  exit={reduce ? { opacity: 0 } : { y: "110%" }}
                  transition={reduce ? { duration: 0.01 } : SPRING}
                  drag={reduce ? false : "y"}
                  dragListener={false}
                  dragControls={drag}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0.05, bottom: 0.6 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 90 || info.velocity.y > 600) onOpenChange(false);
                  }}
                >
                  <div
                    className="-mx-5 -mt-2.5 cursor-grab touch-none pb-1 pt-2.5 active:cursor-grabbing"
                    onPointerDown={(e) => drag.start(e)}
                    aria-hidden="true"
                  >
                    <div className="pg-sheet__grabber" />
                  </div>
                  <Dialog.Title className="pg-sheet__title title-3">{title}</Dialog.Title>
                  {text && <Dialog.Description className="pg-sheet__text subheadline">{text}</Dialog.Description>}
                  {children}
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
