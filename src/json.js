/**
 * HBS helper (loaded via webpack) that's used to display
 * the webpack config on the sandbox `index.hbs` page.
 */
export default (object) => JSON.stringify(object, null, 2);
