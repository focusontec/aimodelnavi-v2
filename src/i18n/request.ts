import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  // If localeDetection is off, requestLocale may not be set from URL.
  // Try to extract from the request URL as fallback.
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`./${locale}.json`)).default,
  };
});
