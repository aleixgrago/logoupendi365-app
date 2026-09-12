-- La taula `profiles` no té policy d'INSERT (a propòsit: un usuari no s'hauria
-- de poder auto-assignar un rol via insert directe des del client). En comptes
-- d'això, el perfil es crea automàticament mitjançant aquest trigger quan
-- Supabase Auth crea la fila a auth.users, llegint role/full_name dels
-- `user_metadata` que s'envien des del formulari de registre.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'parent')::user_role,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- NOTA IMPORTANT: perquè un pare no pugui simplement "registrar-se" i triar
-- rol=therapist per accedir a tot, en producció real caldria restringir el
-- registre lliure de terapeutes (p. ex. invitació manual o codi d'accés).
-- Per a la fase de beta amb amics logopedes això és acceptable, però marca-ho
-- com a pendent abans d'obrir el registre públicament.
