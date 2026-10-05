-- null = flexible (sense dia fix, apareix sempre a "aquesta setmana").
-- Valors vàlids: 'mon','tue','wed','thu','fri','sat','sun'.
alter table exercise_assignments add column scheduled_days text[];
