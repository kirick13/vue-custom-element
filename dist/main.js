import { createApp,
// type Component,
 } from 'vue';
export class VueCustomElement extends HTMLElement {
    app;
    constructor(component, props_data = {}) {
        super();
        this.innerHTML = '';
        const props_data_attrs = {};
        if (component.props) {
            if ('customElement' in component.props) {
                props_data.customElement = this;
            }
            for (let index = 0; index < this.attributes.length; index++) {
                const { name, value, } = this.attributes[index];
                if (name !== 'class'
                    && name !== 'style'
                    && name in component.props) {
                    props_data_attrs[name] = value;
                }
            }
        }
        this.app = createApp(component, {
            ...props_data_attrs,
            ...props_data,
        });
    }
    #is_disconnected_in_microtask = false;
    connectedCallback() {
        if (this.#is_disconnected_in_microtask === true) {
            this.#is_disconnected_in_microtask = false;
        }
        else {
            this.app.mount(this);
        }
    }
    disconnectedCallback() {
        this.#is_disconnected_in_microtask = true;
        queueMicrotask(() => {
            this.#is_disconnected_in_microtask = false;
            if (this.isConnected === false) {
                this.app.unmount();
            }
        });
    }
}
/**
 * Defines a custom element.
 * @param tag_name Custom element tag name.
 * @param VueCustomElementClass Copper component class.
 * @param [css] CSS code.
 */
export function defineElement(tag_name, VueCustomElementClass, css) {
    if (typeof css === 'string') {
        const element = document.createElement('style');
        element.dataset.element = tag_name;
        element.textContent = css;
        document.head.append(element);
    }
    window.customElements.define(tag_name, VueCustomElementClass);
}
