"use client";
import Image from "next/image";
import {
  ReactEventHandler,
  ReactNode,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Typewriter from "react-ts-typewriter";
import InputElement from "./_lib/InputElement";
import OutputElement from "./_lib/outputElement";
import { getAllResults } from "./_lib/util/getAllResults";
import LoveMbti from "./_lib/mbti/love";
import HealthMbti from "./_lib/mbti/health";
import MoneyMbti from "./_lib/mbti/money";
import StudyMbti from "./_lib/mbti/study";
import LoadingElement from "./_lib/loadingElement";
import { getFoodRecommendationWithDate } from "./_lib/util/getFoodResult";
import { applyTalismanEffectDeterministic } from "./_lib/util/applyTalismanEffectDeterministic";

export const SET_STEP = "SET_STEP";
export const SET_NAME = "SET_NAME";
export const SET_MBTI = "SET_MBTI";
export const SET_BIRTHDAY = "SET_BIRTHDAY";

function isStep(step: number, currentStep: number) {
  return step >= currentStep;
}

function StepRound({
  step,
  children,
  phrase,
}: {
  step: number;
  phrase: number;
  children: ReactNode;
}) {
  return isStep(phrase, step) ? children : <></>;
}
function MBTIDescription({
  mbti,
  score,
  score_list,
  source,
  onNext,
  title,
  color,
  onFinished,
}: {
  mbti: string;
  score: number;
  score_list: any;
  source: any;
  onNext: any;
  title: string;
  color?: string;
  onFinished?: any;
}) {
  return (
    <div style={{ padding: "10px 0px" }} className="result_mbti">
      <OutputElement text={"=========================="} color={color} />
      <OutputElement
        text={`* 당신의 ${title} : ${score}`}
        onNext={onNext}
        color={color}
        onFinished={onFinished}
      />
      <OutputElement text={"=========================="} color={color} />
      {score_list.length ? (
        score_list.map((ele: number, key: number) => (
          <OutputElement text={" - " + source[mbti][ele]} key={key} />
        ))
      ) : (
        <OutputElement text={`당신의 ${title}은 최고입니다!`} />
      )}
    </div>
  );
}
function Step_1({ step, Mbti, setMbti, setStep }: any) {
  return (
    isStep(step, 1) && (
      <>
        <InputElement
          text={"MBTI를 입력해주세요."}
          result={Mbti}
          type={"select"}
          onChange={(e: any) => {
            setMbti(e.target.value);
          }}
          onNext={() => {
            if (step < 2) setStep(2);
          }}
        />
      </>
    )
  );
}
function Step_2({ step, Birthday, setBirthday, setStep }: any) {
  return (
    isStep(step, 2) && (
      <InputElement
        text={"생년월일을 입력해주세요 (YYYY-MM-DD)"}
        result={Birthday}
        onChange={(e: any) => {
          setBirthday(e.target.value);
        }}
        onNext={() => {
          if (step < 3) setStep(3);
        }}
      />
    )
  );
}
function Step_3({ step, name, setName, setStep }: any) {
  return (
    isStep(step, 3) && (
      <InputElement
        text={"이름을 입력해주세요."}
        result={name}
        onChange={(e: any) => {
          setName(e.target.value);
        }}
        onNext={() => {
          if (step < 4) setStep(4);
        }}
      />
    )
  );
}
function getFood(foodList: any, target: string) {
  return (
    <div style={{ display: "flex", gap: "10px", margin: "20px" }}>
      {foodList[target].map((ele: string, key: number) => {
        const delay = Math.random() * 0.5 + 0.1; // 0.1s ~ 0.6s
        const rotateZ = Math.floor(Math.random() * 20 - 10); // -10deg ~ +10deg
        return (
          <div
            key={key}
            className="food-card"
            style={{
              animationDelay: `${delay}s`,
              ["--rot" as any]: `${rotateZ}deg` as any,
            }}
          >
            {ele}
          </div>
        );
      })}
    </div>
  );
}
function getJewelry(jewelry: any, target: string) {
  return (
    jewelry &&
    jewelry[target] &&
    (jewelry[target]["colorDistribution"] as any) &&
    (function () {
      let keyArray = [];
      let valueArray: any = [];
      for (let key in jewelry[target]["colorDistribution"] as any) {
        keyArray.push(key);
        valueArray.push(jewelry[target]["colorDistribution"][key]);
      }
      return (
        <div style={{ display: "flex" }}>
          <div className="cube-container">
            <div className="cube">
              <div className="face front" style={{ background: "red" }}>
                red
                <br />
                {jewelry[target]["colorDistribution"]["red"]}
              </div>
              <div className="face back" style={{ background: "orange" }}>
                orange
                <br />
                {jewelry[target]["colorDistribution"]["orange"]}
              </div>
              <div
                className="face right"
                style={{ background: "yellow", color: "black" }}
              >
                yellow
                <br />
                {jewelry[target]["colorDistribution"]["yellow"]}
              </div>
              <div className="face left" style={{ background: "green" }}>
                green
                <br />
                {jewelry[target]["colorDistribution"]["green"]}
              </div>
              <div className="face top" style={{ background: "blue" }}>
                blue
                <br />
                {jewelry[target]["colorDistribution"]["blue"]}
              </div>
              <div
                className="face bottom"
                style={{
                  background: "purple",
                }}
              >
                purple
                <br />
                {jewelry[target]["colorDistribution"]["purple"]}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {keyArray.map((ele, index) => {
              return (
                <ul style={{ display: "flex" }} key={index}>
                  <li style={{ color: ele }}>{ele}</li>
                  <li style={{ marginLeft: "10px", color: ele }}>
                    {valueArray[index]}
                  </li>
                </ul>
              );
            })}
          </div>
        </div>
      );
    })()
  );
}
function Step_4({ step, mbti, birthday, name }: any) {
  const [isDone, setIsDone] = useState(false);
  const [love, setLove] = useState(0);
  const [loveList, setLoveList] = useState<any>([]);
  const [health, setHealth] = useState(0);
  const [heathList, setHealthList] = useState<any>([]);
  const [study, setStudy] = useState(0);
  const [studyList, setStudyList] = useState<any>([]);
  const [money, setMoney] = useState(0);
  const [moneyList, setMoneyList] = useState<any>([]);
  const [phrase, setPhrase] = useState(0);
  const [foodList, setFoodList] = useState<any>({});
  const [isLoveLuck, setIsLoveLuck] = useState(false);
  const [isHealthLuck, setIsHealthLuck] = useState(false);
  const [isStudyLuck, setIsStudyLuck] = useState(false);
  const [isMoneyLuck, setIsMoneyLuck] = useState(false);
  const [jewelry, setJewlry] = useState({
    love: null,
    money: null,
    study: null,
    health: null,
  });
  useEffect(() => {
    //    console.log()
    if (name !== "" && mbti !== "" && birthday !== "") {
      getAllResults(name, birthday, mbti).then((result) => {
        console.log(result);
        setLove(result["연애운"].score);
        setLoveList(result["연애운"].단점_index);
        setHealth(result["건강운"].score);
        setHealthList(result["건강운"].단점_index);
        setStudy(result["학업운"].score);
        setStudyList(result["학업운"].단점_index);
        setMoney(result["금전운"].score);
        setMoneyList(result["금전운"].단점_index);
        setPhrase(1);
      });

      getFoodRecommendationWithDate(name, birthday, mbti).then((result) => {
        setFoodList(result);
      });

      ["love", "money", "health", "study"].map((target) => {
        applyTalismanEffectDeterministic(name, birthday, mbti, target).then(
          (result) => {
            setJewlry((prev) => ({ ...prev, [target]: result }));
          }
        );
      });
    }
  }, [name]);
  useEffect(() => {
    console.log(jewelry);
  }, [jewelry]);
  function onNext(step: number) {
    if (phrase < step + 1) {
      setPhrase(step + 1);
    }
  }

  function getLuck({
    color,
    foodQuery,
    jewelryQuery,
  }: {
    color: string;
    foodQuery: string;
    jewelryQuery: string;
  }) {
    return (
      <>
        <h2 style={{ color }}>
          == [ 당신의 행운을 상승시켜줄 수 있는 음식들 ] ==
        </h2>
        {getFood(foodList, foodQuery)}
        <h2 style={{ color }}>== [ 당신을 위한 행운의 색상 조합 ] ==</h2>
        {getJewelry(jewelry, jewelryQuery)}
      </>
    );
  }
  return (
    isStep(step, 4) && (
      <>
        <LoadingElement delay={3000} onNext={() => onNext(1)} />
        <StepRound phrase={phrase} step={2}>
          <MBTIDescription
            title="연애운"
            mbti={mbti}
            score={love}
            score_list={loveList}
            source={LoveMbti}
            onNext={() => onNext(step)}
            color="#e134eb"
            onFinished={async () => {
              await new Promise((resolve) =>
                setTimeout(() => {
                  resolve(null);
                }, 1000)
              );
              setIsLoveLuck(true);
            }}
          />
          {isLoveLuck &&
            getLuck({
              color: "#e134eb",
              foodQuery: "연애운",
              jewelryQuery: "love",
            })}
          <LoadingElement delay={3000} onNext={() => onNext(3)} />
        </StepRound>
        <StepRound phrase={phrase} step={4}>
          <MBTIDescription
            title="건강운"
            mbti={mbti}
            score={health}
            score_list={heathList}
            source={HealthMbti}
            onNext={() => onNext(step)}
            color="#eb6134"
            onFinished={async () => {
              await new Promise((resolve) =>
                setTimeout(() => {
                  resolve(null);
                }, 1000)
              );
              setIsHealthLuck(true);
            }}
          />
          {isHealthLuck &&
            getLuck({
              color: "#eb6134",
              foodQuery: "건강운",
              jewelryQuery: "health",
            })}
          <LoadingElement delay={6000} onNext={() => onNext(5)} />
          {/* {isHealthFood && (
            <>
              <h2 style={{ color: "#eb6134" }}>
                == [ 당신의 건강운을 상승시켜줄 수 있는 음식들 ] ==
              </h2>
              <div style={{ display: "flex" }}>
                {foodList &&
                  foodList["건강운"] &&
                  foodList["건강운"].map((ele: string, key: number) => {
                    return (
                      <div
                        key={key}
                        style={{ padding: "10px", paddingTop: "0" }}
                      >
                        {ele}
                      </div>
                    );
                  })}
              </div>
            </>
          )} */}
        </StepRound>
        <StepRound phrase={phrase} step={6}>
          <MBTIDescription
            title="금전운"
            mbti={mbti}
            score={money}
            score_list={moneyList}
            source={MoneyMbti}
            onNext={() => onNext(step)}
            color="#ebd234"
            onFinished={async () => {
              await new Promise((resolve) =>
                setTimeout(() => {
                  resolve(null);
                }, 1000)
              );
              setIsMoneyLuck(true);
            }}
          />
          {isMoneyLuck &&
            getLuck({
              color: "#ebd234",
              foodQuery: "금전운",
              jewelryQuery: "money",
            })}
          <LoadingElement delay={9000} onNext={() => onNext(7)} />
        </StepRound>
        <StepRound phrase={phrase} step={8}>
          <MBTIDescription
            title="학업운"
            mbti={mbti}
            score={study}
            score_list={studyList}
            source={StudyMbti}
            onNext={() => onNext(step)}
            color="purple"
            onFinished={async () => {
              await new Promise((resolve) =>
                setTimeout(() => {
                  resolve(null);
                }, 1000)
              );
              setIsStudyLuck(true);
            }}
          />
          {isStudyLuck &&
            getLuck({
              color: "purple",
              foodQuery: "학업운",
              jewelryQuery: "study",
            })}
        </StepRound>
      </>
    )
  );
}

export default function Home() {
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case SET_STEP:
          return { ...state, step: action.step };
        case SET_MBTI:
          return { ...state, Mbti: action.Mbti };
        case SET_NAME:
          return { ...state, name: action.name };
        case SET_BIRTHDAY:
          return { ...state, Birthday: action.Birthday };
      }
      return state;
    },
    {
      step: -2,
      Mbti: "ENTP",
      name: "",
      Birthday: "",
    }
  );
  const { step, Mbti, name, Birthday } = state;
  function setStep(step: number) {
    dispatch({ type: SET_STEP, step });
  }
  function setMbti(Mbti: string) {
    dispatch({ type: SET_MBTI, Mbti });
  }
  function setName(name: string) {
    dispatch({ type: SET_NAME, name });
  }
  function setBirthday(Birthday: string) {
    dispatch({ type: SET_BIRTHDAY, Birthday });
  }
  // const [step, setStep] = useState(-2);
  // const [Mbti, setMbti] = useState("");
  // const [name, setName] = useState("");
  // const [Birthday, setBirthday] = useState("");
  return (
    <div className={"terminal"} style={{ position: "relative" }}>
      <div className="header">
        <p className="traffic-light">
          <span className={"red"}></span>
          <span className={"yellow"}></span>
          <span className={"green"}></span>
        </p>
      </div>
      <div className="content">
        <LoadingElement
          delay={1000}
          text={[
            "초기화 중 입니다.",
            "초기화 중 입니다..",
            "초기화 중 입니다...",
          ]}
          onNext={() => {
            if (step < -1) setStep(-1);
          }}
        />
        {step >= -1 && (
          <>
            <OutputElement text="## KOI-DANG 운세 분석 프로그램" />
            <LoadingElement
              delay={1000}
              text={[
                "실행 중 입니다.",
                "실행 중 입니다..",
                "실행 중 입니다...",
              ]}
              onNext={() => {
                if (step < 1) setStep(1);
              }}
            />
          </>
        )}
        <Step_1 step={step} Mbti={Mbti} setStep={setStep} setMbti={setMbti} />
        <Step_2
          step={step}
          Birthday={Birthday}
          setStep={setStep}
          setBirthday={setBirthday}
        />
        <Step_3 step={step} name={name} setStep={setStep} setName={setName} />
        <Step_4 name={name} step={step} mbti={Mbti} birthday={Birthday} />
      </div>
    </div>
  );
}
