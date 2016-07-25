_.extend(App.Vent, Backbone.Events);

/**
 *
 * - layoutResize: event fires when layout sizes changed.
 *   For example, sidebar toggle needs to reinit masonry
 *   and video scale.
 *
 * - collectionFilter: event fires when collection needs to be filtered.
 *   Accepts options object.
 *   For example, search, pagination, filter categories
 */
