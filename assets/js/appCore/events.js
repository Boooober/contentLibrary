_.extend(App.Vent, Backbone.Events);

/**
 *
 * - layoutResize: event fires when layout sizes changed.
 *   For example, sidebar toggle needs to reinit masonry
 *   and video scale.
 *
 * - collectionLoad: event fires when collection needs to be reloaded.
 *   Accepts collection data.
 *   For example, search, pagination, filter categories
 */
