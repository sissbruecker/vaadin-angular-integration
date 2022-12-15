import { typography } from '@vaadin/vaadin-lumo-styles/typography.js';
import { color } from '@vaadin/vaadin-lumo-styles/color.js';
import { spacing } from '@vaadin/vaadin-lumo-styles/spacing.js';
import { badge } from '@vaadin/vaadin-lumo-styles/badge.js';
import { utility } from '@vaadin/vaadin-lumo-styles/utility.js';

const moduleList = [typography, color, spacing, badge, utility];

const css = moduleList.map((module) => module.cssText).join('\n');
const sheet = new CSSStyleSheet();
sheet.replaceSync(css);
document.adoptedStyleSheets = [sheet, ...document.adoptedStyleSheets];
