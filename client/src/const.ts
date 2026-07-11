export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Navigate to the login page. Call this from an event handler or effect
 * at the moment of navigation, e.g. `onClick={() => startLogin()}`.
 * Never call during render.
 */
export const startLogin = (redirectTo?: string) => {
  const target = redirectTo ?? window.location.pathname;
  window.location.href = `/login?redirect=${encodeURIComponent(target)}`;
};
