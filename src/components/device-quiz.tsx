"use client";

import { CheckCircle2, RefreshCcw, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { questions } from "@/data/questions";

export function DeviceQuiz() {
  const [seed, setSeed] = useState(0);
  const question = useMemo(() => questions[seed % questions.length], [seed]);
  const [selected, setSelected] = useState<number | null>(null);

  function next() {
    setSeed((value) => value + 1);
    setSelected(null);
  }

  return (
    <section className="border border-[#9fa7af] bg-[#fcfcfa] p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="task-code">知识检查 / 随机题</p>
          <h2 className="mt-2 text-3xl font-black">设备认知小测验</h2>
          <p className="muted mt-2">学习模式即时显示解释，不计正式成绩。</p>
        </div>
        <span className="tag">{question.type === "judge" ? "判断题" : question.type === "match" ? "匹配题" : question.type === "sequence" ? "顺序理解题" : "单项选择题"}</span>
      </div>
      <h3 className="mt-8 text-xl font-bold leading-8">{question.title}</h3>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {question.options.map((option, index) => {
          const answered = selected !== null;
          const correct = index === question.answer;
          const chosenWrong = answered && index === selected && !correct;
          return (
            <button
              key={option}
              onClick={() => setSelected(index)}
              disabled={answered}
              className={`lab-button flex items-center justify-between ${
                answered && correct ? "!border-emerald-400 !bg-emerald-500/15" : chosenWrong ? "!border-red-400 !bg-red-500/15" : ""
              }`}
            >
              <span>{String.fromCharCode(65 + index)}. {option}</span>
              {answered && correct && <CheckCircle2 className="text-emerald-300" size={19} />}
              {chosenWrong && <XCircle className="text-red-300" size={19} />}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className={`mt-5 border-l-4 p-4 ${selected === question.answer ? "border-[#258260] bg-[#edf5f1]" : "border-[#d99b28] bg-[#fff8e5]"}`}>
          <strong>{selected === question.answer ? "回答正确" : "再想一想"}</strong>
          <p className="muted mt-2 leading-7">{question.explanation}</p>
        </div>
      )}
      <button className="lab-button mt-5 inline-flex items-center gap-2" onClick={next}><RefreshCcw size={17} /> 随机下一题</button>
    </section>
  );
}
