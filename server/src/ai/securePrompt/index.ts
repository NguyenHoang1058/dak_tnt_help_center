import rs01 from "./prompt_injection.json";
import rs01b from "./language_bypass.json";
import rs02 from "./pii.json";
import rs03 from "./phishing.json";

export const forbiddenRegexes: RegExp[] = [
  ...rs01.patterns.map(p => new RegExp(p, "i")),
  ...rs01b.patterns.map(p => new RegExp(p, "i")),
  ...rs02.patterns.map(p => new RegExp(p, "i")),
  ...rs03.patterns.map(p => new RegExp(p, "i"))
];
