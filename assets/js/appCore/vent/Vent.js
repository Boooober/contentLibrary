_.extend(App.Vent, Backbone.Events);

/**
 *
 * Layout events
 * -------------
 *
 *** layoutResize: event fires when layout sizes changed.
 *   For example, sidebar toggle needs to reinit masonry and video scale.
 *
 *** layoutUpdate: fire this event to change users layout options.
 *   After success update, this event triggers layoutRender.
 *   For example, to hide sidebar from display and save this option to localStorage.
 *
 *** layoutForceUpdate: change layout options, but do not save them anywhere.
 *   After success update, this event triggers layoutRender.
 *   Fire this event to change layout for current page.
 *   For example, {sidebar: false} to remove sidebar.
 *
 *** layoutRender: event fires from router to create page layout.
 *   If you need to change layout options before render, use
 *   layoutUpdate or layoutForceUpdate
 *
 * Collection events
 * -----------------
 *
 *** collectionLoad: event fires when collection needs to be reloaded.
 *   Accepts collection data.
 *   For example, search, pagination, filter categories
 */
