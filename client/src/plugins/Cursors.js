export default class QuillCursors {
    static cursors = {};

    constructor(quill, options) {
        this.quill = quill;
        this.options = options;

        this._container = this.quill.addContainer("ql-cursors");
    }

    createCursor(id, color) {
        let cursor = this.constructor.cursors[id];

        if (!cursor) {
            cursor = new Cursor(id, color);
            this.constructor.cursors[id] = cursor;
            const element = cursor.build();
            this._container.appendChild(element);
        }

        return cursor;
    }

    moveCursor(id, range) {
        const cursor = this.constructor.cursors[id];

        if (!cursor) return;

        cursor.updateCaret(this.quill.getBounds(range.index + range.length));
    }
}

class Cursor {
    constructor(id, color) {
        this.id = id;
        this.color = color;
    }

    build() {
        const element = document.createElement("span");
        element.classList.add("ql-cursor");
        element.id = `ql-cursor-${this.id}`;
        element.innerHTML = `
            <span class="ql-selection"></span>
            <span class="ql-caret"></span>
        `;

        const selectionElement =
            element.getElementsByClassName("ql-selection")[0];
        const caretElement = element.getElementsByClassName("ql-caret")[0];

        selectionElement.style.backgroundColor = this.color;
        caretElement.style.backgroundColor = this.color;

        this._el = element;
        this._selectionEl = selectionElement;
        this._caretEl = caretElement;

        return this._el;
    }

    updateCaret(bounds) {
        this._caretEl.style.top = `${bounds.top}px`;
        this._caretEl.style.left = `${bounds.left}px`;
        this._caretEl.style.height = `${bounds.height}px`;
    }
}
