alter table clinical_sessions add column goal_ids uuid[];
alter table clinical_sessions add column activities text;
alter table clinical_sessions add column evolution text;
alter table clinical_sessions add column next_steps text;
