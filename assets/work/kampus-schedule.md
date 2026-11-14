---
title: KampusSchedule: one app for an IIM Kozhikode student's day
date: 2026-10-30
readTime: 3 min read
---

# KampusSchedule: one app for an IIM Kozhikode student's day

> **Result:** A live, public web app that brings classes, attendance, campus buses, the mess menu and friends' schedules into one place for IIM Kozhikode students. It syncs from the official timetable sheet, sends push alerts when a class changes, and is backed by **172 automated test cases**.

**Role:** Product owner and solo builder · **Type:** 0-to-1 side product · **Stack:** Next.js web app (installable on phones), Supabase, Google Sheets sync, push notifications, Vercel

---

## The results first

- **Replaced five sources with one screen.** Timetable sheet, attendance tracking, bus timings, mess menu and exam slots now live in a single "Today" view.
- **No sign-up wall.** Students open the link and start using the core features straight away, which removes the biggest **activation** hurdle.
- **Real-time change alerts.** When the timetable sheet changes, the app spots the difference and sends a push notification, with class reminders before each session.
- **Built for reliability.** 172 automated test cases cover attendance maths, clash detection, reminders, sync and calendar export.

## Situation

At IIM Kozhikode, each student picks their own electives, so no two timetables match. The official schedule lives in one large shared sheet that changes often. Students track attendance in personal spreadsheets, check bus timings in a PDF and the mess menu in a group chat. Planning a group meeting means comparing everyone's timetable by hand.

## Task

As a student with the same pain, I set out to build the **MVP** of a single daily companion, scoped to the jobs students repeat every day: *What's next? Can I miss this class? When's the bus? When are my friends free?*

## Action

- **Ran quick user research** with classmates to rank pain points by frequency, then used that to drive **backlog prioritization**. Daily schedule and attendance came first; friends and calendar sync came next.
- **Kept the official sheet as the single source of truth.** The app syncs from it on a schedule rather than asking anyone to re-enter data, so adoption needs no behaviour change from the programme office.
- **Designed for trust in the numbers.** Attendance counts a class as "held" only once it has actually started, which fixed an early bug where later classes were counted too soon.
- **Added a social layer.** Students can compare schedules with friends, see shared courses and clashes, and find **common free time** for group work.
- **Shipped in small releases.** Each feature (bus timings, mess menu, end-term exam slots, Google Calendar sync) went out as its own increment, with tests added alongside.
- **Made it installable** on phones like a native app, with optional sign-in only for personal features.

## What success looks like

- **North Star:** weekly active students who open the app before class.
- **Input metrics:** courses picked per student, alerts opened, friend comparisons made.
- **Guardrails:** schedule accuracy against the official sheet, notification opt-outs.

## What I learned

The best adoption lever was **removing steps**, not adding features. No login, no data entry, one link. A product that fits into an existing habit spreads by word of mouth.

---

**Keywords:** 0-to-1 product development · MVP · user research · backlog management · release management · retention · KPIs · UX collaboration · product-led growth

[View KampusSchedule on GitHub →](https://github.com/ArunTejaKamisetti/schedule-app)
