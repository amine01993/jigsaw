import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import "./index.css";
import App from "./App.tsx";
import translationEN from "@/locales/en/translation.json";
import translationFR from "@/locales/fr/translation.json";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: translationEN
            },
            fr: {
                translation: translationFR
            }
        },
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
