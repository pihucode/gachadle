import { writable } from "svelte/store";

let isSignedIn = writable(false);
let signedInUser = writable(null);
let isEnvDev = writable(false);

export { isSignedIn, signedInUser, isEnvDev };