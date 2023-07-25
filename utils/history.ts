import { v4 as randomUUID } from 'uuid';

export interface HistoryNode {
	id: string;
	url: string;
}

export class History {
	private array: HistoryNode[];
	private index: number;

	constructor() {
		this.array = [];
		this.index = -1;
	}

	set_next(url: string) {
		if ((this.current_url() ?? '') !== url) {
			const node: HistoryNode = {
				id: randomUUID(),
				url
			};
	
			this.array = [...this.array.slice(0, this.index + 1), node];
			this.go_forward();
		}
	}

	can_go_back() {
		return this.index >= 1;
	}

	can_go_forward() {
		return this.index + 1 < this.array.length;
	}

	go_back() {
		this.index--;
	}

	go_forward() {
		this.index++;
	}

	current_url(): string | undefined {
		return this.array.at(this.index)?.url;
	}
}