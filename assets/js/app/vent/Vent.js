_.extend(App.Vent, Backbone.Events);

/**
 *
 * State events
 * ------------
 *
 *** initialized: Application initialized and ready to run
 *
 *
 *
 * Layout events
 * -------------
 *
 *** layoutResize: event fires when layout sizes changed.
 *   For example, sidebar toggle needs to reinit masonry and video scale.
 *
 *** layoutUpdate [options]: fire this event to change page layout options.
 *   For example, to hide sidebar from display and save this option to localStorage.
 *
 *** layoutRender: initial render of base layout.
 *   Layout options can be changed with layoutUpdate.
 *
 * Collection events
 * -----------------
 *
 *** collectionLoad [collection]: event fires when collection needs to be reloaded.
 *   Accept collection data.
 *   For example, search, pagination, filter categories
 *
 *
 * Form events
 * -----------
 *
 *** loginSuccess [user]: success user login.
 *   Accept user object.
 *
 *** loginFailed: failed user login.
 *
 *
 * Router events
 * -------------
 *
 *** userLogout: user logout action
 *
 */
