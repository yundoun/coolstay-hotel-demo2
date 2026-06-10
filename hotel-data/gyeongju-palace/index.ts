import type { SiteConfig } from "@/domain/site-config/types";
import configJson from "./config.json";

const config: SiteConfig = configJson as SiteConfig;

export default config;
