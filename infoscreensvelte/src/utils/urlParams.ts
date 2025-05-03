export const hasAnyUrlParams = () => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return params.toString().length > 0;
};
