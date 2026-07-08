export function getFirstName(fullName: string | null | undefined) {
  const trimmed = fullName?.trim();

  if (!trimmed) {
    return "there";
  }

  return trimmed.split(/\s+/)[0];
}

export function getInitials(fullName: string | null | undefined) {
  const trimmed = fullName?.trim();

  if (!trimmed) {
    return "?";
  }

  const words = trimmed.split(/\s+/);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

export function getGreeting(date: Date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}
