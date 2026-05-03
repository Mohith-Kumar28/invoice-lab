"use client";

import * as React from "react";

type SlotProps = { children: React.ReactNode };

function LeftSlot(_props: SlotProps) {
  return null;
}

function MiddleSlot(_props: SlotProps) {
  return null;
}

function RightSlot(_props: SlotProps) {
  return null;
}

function getSlotChildren(children: React.ReactNode) {
  let left: React.ReactNode = null;
  let middle: React.ReactNode = null;
  let right: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement<SlotProps>(child)) return;
    if (child.type === LeftSlot) left = child.props.children;
    if (child.type === MiddleSlot) middle = child.props.children;
    if (child.type === RightSlot) right = child.props.children;
  });

  return { left, middle, right };
}

export const ToolActionsBar = Object.assign(
  function ToolActionsBar({ children }: { children: React.ReactNode }) {
    const { left, middle, right } = getSlotChildren(children);

    return (
      <div className="sticky top-0 z-40 w-full shrink-0 border-b border-border/40 bg-background/95 p-2 shadow-sm backdrop-blur sm:p-4">
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap no-scrollbar">
          {left}
          {middle}
          <div className="ml-auto flex items-center gap-1.5">{right}</div>
        </div>
      </div>
    );
  },
  {
    Left: LeftSlot,
    Middle: MiddleSlot,
    Right: RightSlot,
  },
);
