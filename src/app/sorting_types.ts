export function compareByName(
  a: SteamAppOverview,
  b: SteamAppOverview
): number {
  return a.display_name.localeCompare(b.display_name);
}

export function compareByLastPlayedDate(
  a: SteamAppOverview,
  b: SteamAppOverview
): number {
  return (
    b.rt_last_time_played_or_installed - a.rt_last_time_played_or_installed
  );
}

export function compareByLastTimePlayedLocally(
  a: SteamAppOverview,
  b: SteamAppOverview
): number {
  const timeA = a.rt_last_time_locally_played;
  const timeB = b.rt_last_time_locally_played;

  if (timeA === undefined && timeB === undefined) return 0;
  if (timeA === undefined) return 1;
  if (timeB === undefined) return -1;

  return timeB - timeA;
}

export function compareBySteamReleaseDate(
  a: SteamAppOverview,
  b: SteamAppOverview
): number {
  const dateA = a.rt_steam_release_date;
  const dateB = b.rt_steam_release_date;

  if (dateA === 0 && dateB === 0) return 0;
  if (dateA === 0) return 1;
  if (dateB === 0) return -1;

  return dateB - dateA;
}

export function compareByPurchasedTime(
  a: SteamAppOverview,
  b: SteamAppOverview
): number {
  const timeA = a.rt_purchased_time;
  const timeB = b.rt_purchased_time;

  // Handle 0 values, treating them as later
  if (timeA === undefined && timeB === undefined) return 0;
  if (timeA === undefined) return 1;
  if (timeB === undefined) return -1;

  return timeB - timeA;
}

export function compareByPlaytime(
  a: SteamAppOverview,
  b: SteamAppOverview
): number {
  const playtimeA = a.minutes_playtime_forever;
  const playtimeB = b.minutes_playtime_forever;

  if (playtimeA === 0 && playtimeB === 0) return 0;
  if (playtimeA === 0) return 1;
  if (playtimeB === 0) return -1;

  return playtimeB - playtimeA;
}
