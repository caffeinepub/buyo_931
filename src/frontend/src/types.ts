import type { HeaderButton } from "./components/header";

export enum Screen {
  ONBOARDING = "onboarding",
  START = "start",
  LIST = "list",
  SUBLIST = "sublist",
}

export interface FamilySession {
  familyName: string;
  memberName: string;
}

export enum ButtonType {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TERTIARY = "tertiary",
}

export interface HeaderConfig {
  text: string | null;
  hasBackBtn: boolean;
  buttons?: HeaderButton[];
}
