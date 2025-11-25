import type { Group } from "konva/lib/Group";

export interface View {
	getGroup(): Group;
	show(): void;
	hide(): void;
}

export interface Question {
    id: number;
    level: number;
    question: string;
    answer: string;
    hint: string;
	isTest: boolean;
}

/**
 * Screen types for navigation
 *
 * - "home": Home menu screen
 */
export type Screen =
	| { type: "home" }
	| { type: "login" }
	| { type: "start" }
	| { type: "level"; level: number }
	| { type: "minigame"; game: string };

export abstract class ScreenController {
	abstract getView(): View;

	show(): void {
		this.getView().show();
	}

	hide(): void {
		this.getView().hide();
	}
}

export interface ScreenSwitcher {
	switchToScreen(screen: Screen): void;
}

export interface MiniGameInfo {
  name: string;
  unlocked: boolean;
  unlockLevel: number;
}
