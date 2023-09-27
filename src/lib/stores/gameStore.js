import { writable } from "svelte/store";

let tagList = ['aaaa', 'bbbb', 'cccc', 'dddd', 'eeee', 'ffff'];
let tags = writable(tagList);

export { tags };