"use client";
import { useRef, useState } from "react";
import Typewriter from "react-ts-typewriter";

export default function InputElement({
  text,
  result,
  onChange,
  onNext,
  type,
}: {
  text: string;
  result: string;
  onChange: any;
  onNext: any;
  type?: "select";
}) {
  const [isCursor, setIsCursor] = useState(true);
  const cmdRef = useRef(null);
  const [isDone, setIsDone] = useState(false);
  const [selectedMBTI, setSelectedMBTI] = useState("ENTP");
  const mbtiTypes = [
    "ENTP",
    "ENFP",
    "ENTJ",
    "ENFJ",
    "ESTP",
    "ESFP",
    "ESTJ",
    "ESFJ",
    "INTP",
    "INFP",
    "INTJ",
    "INFJ",
    "ISTP",
    "ISFP",
    "ISTJ",
    "ISFJ",
  ];
  return (
    <ul>
      <li>
        <Typewriter
          text={text}
          speed={1}
          cursor={isCursor}
          onFinished={() => {
            setIsCursor(false);
            const cmd = cmdRef.current as unknown as HTMLInputElement;
            if (cmd) cmd.focus();
          }}
        />
      </li>
      <li>
        {isDone ? (
          result
        ) : (
          <>
            {!isCursor && "> "}
            {(() => {
              switch (type) {
                case "select":
                  return (
                    <>
                      <select
                        style={{
                          marginRight: "10px",
                          border: "1px solid #00ff00",
                          padding: "3px 0px",
                          marginTop: "10px",
                          borderRadius: "5px",
                        }}
                        onChange={onChange}
                      >
                        <option value="" disabled>
                          MBTI를 선택하세요
                        </option>
                        {mbtiTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <button
                        style={{
                          border: "1px solid #00ff00",
                          padding: "1.5px 10px",
                          borderRadius: "5px",
                        }}
                        onClick={() => {
                          onNext();
                          setIsDone(true);
                        }}
                      >
                        선택
                      </button>
                    </>
                  );
                default:
                  return (
                    <input
                      style={{
                        userSelect: "none",
                        border: 0,
                        outline: 0,
                      }}
                      ref={cmdRef}
                      type=""
                      onChange={onChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onNext(); // 원하는 함수 실행
                          setIsDone(true);
                        }
                      }}
                    />
                  );
              }
            })()}
          </>
        )}
      </li>
    </ul>
  );
}
