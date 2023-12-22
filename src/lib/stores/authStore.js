import { writable } from "svelte/store";

let isSignedIn = writable(true);
let isEnvDev = writable(false);

export { isSignedIn, isEnvDev };