/**
 * Registry and firing of events.
 *
 * MediaWiki has various interface components that are extended, enhanced or manipulated in some other way by extensions, gadgets and even in core itself.
 *
 * This framework helps streamlining the timing of when these other code paths fire their plugins (instead of using document-ready, which can and should be limited to firing only once).
 *
 * Features like navigating to other wiki pages, previewing an edit and editing itself – without a refresh – can then retrigger these hooks accordingly to ensure everything still works as expected.
 *
 * Example usage:
 * ```js
 * mw.hook( 'wikipage.content' ).add( fn ).remove( fn );
 * mw.hook( 'wikipage.content' ).fire( $content );
 * ```
 *
 * Handlers can be added and fired for arbitrary event names at any time. The same event can be fired multiple times. The last run of an event is memorized (similar to `$(document).ready` and `$.Deferred().done`). This means if an event is fired, and a handler added afterwards, the added function will be fired right away with the last given event data.
 *
 * Like Deferreds and Promises, the `mw.hook` object is both detachable and chainable. Thus allowing flexible use and optimal maintainability and authority control. You can pass around the `add` and/or `fire` method to another piece of code without it having to know the event name (or `mw.hook` for that matter).
 * ```js
 * var h = mw.hook( 'bar.ready' );
 * new mw.Foo( .. ).fetch( { callback: h.fire } );
 * ```
 *
 * Note: Events are documented with an underscore instead of a dot in the event
 * name due to jsduck not supporting dots in that position.
 *
 * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook
 */
interface Hook<E extends keyof HookEvents> {
    /**
     * Register a hook handler.
     *
     * @param {...Function} handler Function(s) to bind.
     * @chainable
     */
    add(...handler: Array<HookEvents[E]>): this;

    /**
     * Run a hook.
     *
     * @param {*} data
     * @chainable
     */
    fire(data: any): this;

    /**
     * Unregister a hook handler.
     *
     * @param {...Function} handler Function(s) to unbind.
     * @chainable
     */
    remove(...handler: Array<HookEvents[E]>): this;
}

interface HookEvents {
    /**
     * Fired after an edit was successfully saved.
     *
     * Does not fire for null edits.
     *
     * @param {{ message: (string | JQuery | HTMLElement[])?, user: string? }?} data Optional data
     * @returns {void}
     */
    "postEdit": (data?: { message?: string | JQuery | HTMLElement[]; user?: string }) => void;

    /**
     * After the listener for postEdit removes the notification.
     *
     * @returns {void}
     */
    "postEdit.afterRemoval": () => void;

    /**
     * Fired when initialization of the filtering interface for changes list is complete.
     *
     * @returns {void}
     */
    "structuredChangeFilters.ui.initialized": () => void;

    /**
     * Fired when categories are being added to the DOM
     *
     * It is encouraged to fire it before the main DOM is changed (when $content is still detached). However, this order is not defined either way, so you should only rely on $content itself.
     *
     * This includes the ready event on a page load (including post-edit loads) and when content has been previewed with LivePreview.
     *
     * @param {JQuery} $content The most appropriate element containing the content, such as .catlinks
     * @returns {void}
     */
    "wikipage.categories": ($content: JQuery) => void;

    /**
     * Fired after collapsible content has been initialized
     *
     * This gives an option to modify the collapsible behavior.
     *
     * @param {JQuery} $content All the elements that have been made collapsible
     * @returns {void}
     */
    "wikipage.collapsibleContent": ($content: JQuery) => void;

    /**
     * Fired when wiki content is being added to the DOM.
     *
     * It is encouraged to fire it before the main DOM is changed (when $content is still detached). However, this order is not defined either way, so you should only rely on $content itself.
     *
     * This includes the ready event on a page load (including post-edit loads) and when content has been previewed with LivePreview.
     *
     * @param {JQuery} $content All the elements that have been made collapsible
     * @returns {void}
     */
    "wikipage.content": ($content: JQuery) => void;

    /**
     * Fired when the diff is added to a page containing a diff.
     *
     * Similar to the `wikipage.content` hook, `$diff` may still be detached when the hook is fired.
     *
     * @param {JQuery<HTMLTableElement>} $diff The root element of the MediaWiki diff (`table.diff`).
     * @returns {void}
     */
    "wikipage.diff": ($content: JQuery<HTMLTableElement>) => void;

    /**
     * Fired when the editform is added to the edit page.
     *
     * Similar to the `wikipage.content` hook, `$editForm` can still be detached when this hook is fired.
     *
     * @param {JQuery<HTMLFormElement>} $editForm The most appropriate element containing the editform, usually `#editform`.
     * @returns {void}
     */
    "wikipage.editform": ($editForm: JQuery<HTMLFormElement>) => void;

    // custom hooks
    [name: string]: (...args: any[]) => any;
}

declare global {
    namespace mw {
        /**
         * Create a hook.
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.hook
         */
        function hook<E extends keyof HookEvents>(event: E): Hook<E>;
    }
}

export {};
