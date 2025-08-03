"use client";
import { useRef, useState } from "react";
import Typewriter from "react-ts-typewriter";

export default function OutputElement({
  text,
  onNext,
  speed,
  color,
  onFinished,
}: {
  text: string;
  onNext?: any;
  speed?: number;
  color?: string;
  onFinished?: any;
}) {
  const [isCursor, setIsCursor] = useState(true);
  return (
    <ul>
      <li>
        <Typewriter
          text={text}
          speed={speed ? speed : 1}
          cursor={isCursor}
          onFinished={() => {
            setIsCursor(false);
            if (onNext) {
              onNext();
            }
            if (onFinished) {
              onFinished();
            }
          }}
        />
      </li>
    </ul>
  );
}
