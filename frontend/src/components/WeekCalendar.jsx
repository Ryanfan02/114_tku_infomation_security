import React, { useMemo } from "react";

const WEEK_LABELS = ["日", "一", "二", "三", "四", "五", "六"];

function pad2(n) {
  return n < 10 ? `0${n}` : `${n}`;
}
function ymd(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function addDays(d, n) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}
function startOfWeek(d) {
  // 以週日為一週開始
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay());
}

export default function WeekCalendar({
  selectedDate,
  onPickDate,
  eventsByDate
}) {
  const weekDays = useMemo(() => {
    const base = startOfWeek(selectedDate);
    const arr = [];
    for (let i = 0; i < 7; i += 1) arr.push(addDays(base, i));
    return arr;
  }, [selectedDate]);

  const selectedKey = ymd(selectedDate);

  return (
    <div className="weekCal card">
      <div className="weekHeader">
        <div className="weekTitle">本週行事曆</div>
        <div className="small">點日期可切換；右側可新增事件（先存本機）</div>
      </div>

      <div className="weekGrid">
        {weekDays.map((d) => {
          const key = ymd(d);
          const isSelected = key === selectedKey;
          const count = eventsByDate[key] ? eventsByDate[key].length : 0;

          return (
            <button
              key={key}
              type="button"
              className={`weekCell ${isSelected ? "selected" : ""}`}
              onClick={() => onPickDate(d)}
              title={key}
            >
              <div className="weekCellTop">
                <div className="weekDow">{WEEK_LABELS[d.getDay()]}</div>
                <div className="weekDate">
                  {d.getMonth() + 1}/{d.getDate()}
                </div>
              </div>

              <div className="weekCellBody">
                {count > 0 ? (
                  <div className="badge">{count} 件</div>
                ) : (
                  <div className="small">（無事件）</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
