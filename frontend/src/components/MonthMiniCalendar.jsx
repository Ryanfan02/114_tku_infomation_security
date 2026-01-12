import React, { useMemo } from "react";

function pad2(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

function ymd(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}


function startOfCalendarGrid(monthDate) {
  const s = startOfMonth(monthDate);
  const day = s.getDay();
  return new Date(s.getFullYear(), s.getMonth(), s.getDate() - day);
}

function addDays(d, n) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
}

export default function MonthMiniCalendar({
  monthDate,
  selectedDate,
  onPickDate,
  onPrevMonth,
  onNextMonth
}) {
  const grid = useMemo(() => {
    const start = startOfCalendarGrid(monthDate);
    const cells = [];
    for (let i = 0; i < 42; i += 1) {
      cells.push(addDays(start, i));
    }
    return cells;
  }, [monthDate]);

  const title = `${monthDate.getFullYear()} / ${monthDate.getMonth() + 1}`;

  const selectedKey = selectedDate ? ymd(selectedDate) : "";

  return (
    <div className="miniCal card">
      <div className="miniCalHeader">
        <button className="miniBtn" type="button" onClick={onPrevMonth}>
          ◀
        </button>
        <div className="miniTitle">{title}</div>
        <button className="miniBtn" type="button" onClick={onNextMonth}>
          ▶
        </button>
      </div>

      <div className="miniWeekdays">
        <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
      </div>

      <div className="miniGrid">
        {grid.map((d) => {
          const inMonth = d.getMonth() === monthDate.getMonth();
          const key = ymd(d);
          const isSelected = key === selectedKey;

          const cls = [
            "miniCell",
            inMonth ? "" : "muted",
            isSelected ? "selected" : ""
          ].join(" ");

          return (
            <button
              key={key}
              type="button"
              className={cls}
              onClick={() => onPickDate(d)}
              title={key}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
