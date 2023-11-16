import { writable } from "svelte/store";

let isSignedIn = writable(false);
let isEnvDev = writable(true);

export { isSignedIn, isEnvDev };