-- Actualitza handle_new_user (definida a 0002) perquè reculli també
-- `locale` dels user_metadata. S'afegeix com a migració nova (no es
-- modifica 0002 directament) perquè si ja has desplegat i executat les
-- migracions anteriors en un projecte real, cal aplicar els canvis de
-- forma incremental, no reescriure l'historial.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, locale)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'parent')::user_role,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'locale', 'ca')
  );
  return new;
end;
$$;
