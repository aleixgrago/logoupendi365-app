create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role user_role;
  v_center_id uuid;
  v_join_code text;
begin
  v_role := coalesce(new.raw_user_meta_data->>'role', 'parent')::user_role;

  if v_role = 'center_admin' then
    -- Crea un centre nou, amb el nom que hagi indicat al formulari.
    insert into centers (name, join_code)
    values (
      coalesce(nullif(new.raw_user_meta_data->>'center_name', ''), 'Centre sense nom'),
      substr(md5(random()::text || clock_timestamp()::text), 1, 8)
    )
    returning id into v_center_id;

  elsif v_role = 'therapist' then
    v_join_code := new.raw_user_meta_data->>'join_code';

    if v_join_code is not null and v_join_code <> '' then
      select id into v_center_id from centers where join_code = v_join_code;
    end if;

    if v_center_id is null then
      -- Cap codi vàlid: terapeuta individual. Se li crea un centre propi
      -- perquè el model d'aïllament sigui idèntic per a tothom, sense
      -- casos especials de "terapeuta sense centre" repartits pel codi.
      insert into centers (name, join_code)
      values (
        coalesce(nullif(new.raw_user_meta_data->>'full_name', ''), 'Logopeda') || ' (individual)',
        substr(md5(random()::text || clock_timestamp()::text), 1, 8)
      )
      returning id into v_center_id;
    end if;
  end if;
  -- Els pares (v_role = 'parent') no tenen center_id: hi accedeixen via
  -- patient_guardians, com fins ara.

  insert into public.profiles (id, role, full_name, locale, center_id)
  values (
    new.id,
    v_role,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'locale', 'ca'),
    v_center_id
  );
  return new;
end;
$$;
