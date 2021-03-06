declare global {
    namespace mw {
        /**
         * Client for ResourceLoader server end point.
         *
         * This client is in charge of maintaining the module registry and state machine, initiating network (batch) requests for loading modules, as well as dependency resolution and execution of source code.
         *
         * For more information, refer to https://www.mediawiki.org/wiki/ResourceLoader/Features
         *
         * @see https://doc.wikimedia.org/mediawiki-core/master/js/#!/api/mw.loader
         */
        namespace loader {
            /**
             * The module registry is exposed as an aid for debugging and inspecting page state; it is not a public interface for modifying the registry.
             *
             * @type {{ [name: string]: { dependencies: string[], group: number?, module: { exports: any }, packageExports: any, skip: string?, source: string, state: "registered" | "ready", version: string } }}
             * @private
             */
            const moduleRegistry: {
                [name: string]: {
                    dependencies: string[];
                    group?: number;
                    module: { exports: any };
                    packageExports: any;
                    skip?: string;
                    source: string;
                    state: "registered" | "ready";
                    version: string;
                };
            };

            /**
             * Create a new style element and add it to the DOM.
             *
             * @param {string} text CSS text
             * @param {Node?} nextNode The element which the style tag should be inserted before
             * @returns {HTMLStyleElement} Reference to the created style element
             * @private
             */
            function addStyleTag(text: string, nextNode?: Node): HTMLElement;

            /**
             * Get the names of all registered modules.
             *
             * @returns {string[]}
             */
            function getModuleNames(): string[];

            /**
             * Load a script by URL.
             *
             * Example:
             * ```js
             * mw.loader.getScript( 'https://example.org/x-1.0.0.js' )
             *     .then( function () {
             *        // Script succeeded. You can use X now.
             *     }, function ( e ) {
             *         // Script failed. X is not avaiable
             *         mw.log.error( e.message ); // => "Failed to load script"
             *     } );
             * ```
             *
             * @param {string} url Script URL
             * @returns {JQuery.Promise<void>} Resolved when the script is loaded
             */
            function getScript(url: string): JQuery.Promise<void>;

            /**
             * Get the state of a module.
             *
             * @param {string} module Name of module
             * @returns {string | null} The state, or null if the module (or its state) is not in the registry.
             */
            function getState(module: string): string | null;

            /**
             * Load an external script or one or more modules.
             *
             * This method takes a list of unrelated modules. Use cases:
             *
             * * A web page will be composed of many different widgets. These widgets independently queue their ResourceLoader modules (`OutputPage::addModules()`). If any of them have problems, or are no longer known (e.g. cached HTML), the other modules should still be loaded.
             * * This method is used for preloading, which must not throw. Later code that calls `using()` will handle the error.
             *
             * @param {string | string[]} modules Either the name of a module, array of modules, or the URL of an external script or style
             * @param {("text/css" | "text/javascript")?} type MIME type to use if calling with a URL of an external script or style; acceptable values are "text/css" and "text/javascript"; if no type is provided, `text/javascript` is assumed.
             * @returns {void}
             */
            function load(modules: string | string[], type?: string): void;

            /**
             * Register a module, letting the system know about it and its properties.
             *
             * The startup module calls this method.
             *
             * When using multiple module registration by passing an array, dependencies that are specified as references to modules within the array will be resolved before the modules are registered.
             *
             * @param {string | Array} modules Module name or array of arrays, each containing a list of arguments compatible with this method
             * @param {(string | number)?} version Module version hash (falls backs to empty string). Can also be a number (timestamp) for compatibility with MediaWiki 1.25 and earlier
             * @param {string[]?} dependencies Array of module names on which this module depends
             * @param {string?} group Group which the module is in
             * @param {string?} source Name of the source
             * @param {string?} skip Script body of the skip function
             * @returns {void}
             */
            function register(
                modules: string,
                version?: string | number,
                dependencies?: string[],
                group?: string,
                source?: string,
                skip?: string
            ): void;
            function register(
                modules: Array<[string, string | number, string[], string, string, string]>
            ): void;

            /**
             * Change the state of one or more modules.
             *
             * @param {{ [name: string]: "string }} states Object of module name/state pairs
             * @returns {void}
             */
            function state(states: Record<string, string>): void;

            /**
             * Execute a function after one or more modules are ready.
             *
             * Use this method if you need to dynamically control which modules are loaded and/or when they loaded (instead of declaring them as dependencies directly on your module.)
             *
             * This uses the same loader as for regular module dependencies. This means ResourceLoader will not re-download or re-execute a module for the second time if something else already needed it. And the same browser HTTP cache, and localStorage are checked before considering to fetch from the network. And any on-going requests from other dependencies or using() calls are also automatically re-used.
             *
             * Example of inline dependency on OOjs:
             * ```
             * mw.loader.using( 'oojs', function () {
             *     OO.compare( [ 1 ], [ 1 ] );
             * } );
             * ```
             *
             * Example of inline dependency obtained via `require()`:
             * ```
             * mw.loader.using( [ 'mediawiki.util' ], function ( require ) {
             *     var util = require( 'mediawiki.util' );
             * } );
             * ```
             *
             * Since MediaWiki 1.23 this returns a promise.
             *
             * Since MediaWiki 1.28 the promise is resolved with a `require` function.
             *
             * @param {string[] | string} dependencies Module name or array of modules names the callback depends on to be ready before executing
             * @param {(() => any)?} ready Callback to execute when all dependencies are ready
             * @param {(() => any)?} error Callback to execute if one or more dependencies failed
             * @returns {JQuery.Promise<(name: string) => any>} `require` function
             */
            function using(
                dependencies: string[] | string,
                ready?: () => any,
                error?: () => any
            ): JQuery.Promise<(name: string) => any>;
        }
    }
}

export {};
