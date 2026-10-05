alter table exercise_assignments add column ease_rating smallint check (ease_rating between 1 and 5);
alter table exercise_assignments add column motivation_rating smallint check (motivation_rating between 1 and 5);
alter table exercise_assignments add column needed_help boolean;
alter table exercise_assignments add column outcome text check (outcome in ('better', 'same', 'worse'));
alter table exercise_assignments add column feedback_comment text;
