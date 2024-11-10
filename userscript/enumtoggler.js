// ==UserScript==
// @name         Supabase Enum Toggler
// @namespace    http://tampermonkey.net/
// @version      2024-11-09
// @description  try to take over the world!
// @author       You
// @match        https://supabase.com/dashboard/project/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=supabase.com
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	function handleContainer(container) {
		for (const ta of container.querySelectorAll('textarea')) {
			const options = Array.from(
				/Default: ARRAY(\[.*\])/
					.exec(ta.placeholder)?.[1]
					?.matchAll(/'(.*?)'::/g)
					?.map((m) => m[1]) ?? [],
			);
			const selected = [];
			for (const opt of options) {
				const btn = document.createElement('button');
				btn.textContent = opt;
				btn.style.fontSize = 'larger';
				btn.style.border = '1px solid gray';
				btn.style.margin = '4px';
				btn.style.padding = '3px 6px';
				btn.style.borderRadius = '6px';
				btn.style.opacity = 0.4;
				btn.onclick = (e) => {
					e.preventDefault();
					const i = selected.indexOf(opt);
					if (i >= 0) {
						selected.splice(i, 1);
						btn.style.opacity = 0.4;
					} else {
						selected.push(opt);
						btn.style.opacity = 1;
					}

					var nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
						window.HTMLTextAreaElement.prototype,
						'value',
					).set;
					nativeTextAreaValueSetter.call(ta, JSON.stringify(selected));
					ta.dispatchEvent(new Event('input', { bubbles: true }));
				};
				ta.parentNode.insertAdjacentElement('beforeEnd', btn);
			}
		}
	}

	const observer = new MutationObserver((records) => {
		for (const record of records) {
			for (const added of record.addedNodes) {
				if (added.role == 'dialog') {
					setTimeout(() => handleContainer(added), 10);
				}
			}
		}
	});
	observer.observe(document.body, {
		childList: true,
		subtree: false,
		attributes: false,
	});
})();
