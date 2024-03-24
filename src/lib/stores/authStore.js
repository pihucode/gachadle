import { writable } from "svelte/store";

let isSignedIn = writable(false);
let isEnvDev = writable(false);

export { isSignedIn, isEnvDev };