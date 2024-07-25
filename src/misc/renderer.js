import { compile } from "pug";

export function renderMessage(template, payload) {
	let fn = compile(template.content);
	return fn(payload);
}
