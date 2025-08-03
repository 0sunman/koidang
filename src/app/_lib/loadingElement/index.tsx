"use client";
import { useEffect, useRef, useState } from "react";
import Typewriter from "react-ts-typewriter";

export default function LoadingElement({
  onNext,
  speed,
  delay,
  text,
}: {
  onNext?: any;
  speed?: number;
  delay: number;
  text?: string[];
}) {
  const [isCursor, setIsCursor] = useState(true);
  useEffect(() => {
    async function next() {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(null);
        }, delay);
      });
      if (onNext) {
        setIsCursor(false);
        onNext();
      }
    }
    next();
  }, []);
  return isCursor ? (
    <ul>
      <li>
        <Typewriter
          loop={true}
          text={
            !text
              ? [
                  "[ 분석 중 입니다 . ]",
                  "[ 분석 중 입니다 .. ]",
                  "[ 분석 중 입니다 ... ]",
                ]
              : text
          }
          speed={speed ? speed : 100}
          cursor={isCursor}
          onFinished={() => {
            setIsCursor(false);
          }}
        />
      </li>
    </ul>
  ) : (
    <></>
  );
}
