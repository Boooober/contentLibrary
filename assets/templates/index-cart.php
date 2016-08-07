<!-- Image/Video-cart template -->
<script type="text/template" id="mediaCart">
	<div class="cart-item col-xs-12 col-sm-4">
		<div class="cart-content <%= this.typeClass() %>">
			<div class="cart-head"></div>

			<div class="cart-body hover-toolbox">
				<% if(mediaLink) { %>
					<figure>
						<%= this.processMediaTag(mediaLink, title) %>
						<% if(this.model.isImage()) { %>
							<%= this.getLink('post-link') %>
						<% } %>
					</figure>
				<% } %>
				<div class="toolbox with-padding"></div>
			</div>

			<div class="cart-footer"></div>
		</div>
	</div>
</script>
<!-- ./Image/Video-cart template -->

<!-- Text-type cart template -->
<script type="text/template" id="textCart">
	<div class="cart-item col-xs-12 col-sm-4">
		<div class="cart-content text-cart">
			<div class="cart-head with-padding">
				<div class="toolbox"></div>
			</div>
			<div class="cart-body with-padding">
				<h3 class="post-title"><a href="#!/page/<%= id %>"><%= title %></a></h3>
				<div class="post-content"><%= description %></div>
			</div>
			<div class="cart-footer"></div>
		</div>
	</div>
</script>
<!-- ./Text-type cart template -->

<!-- Popup cart template -->
<script type="text/template" id="cartInPopup">
	<div class="box-popup <%= this.typeClass() %>">
		<div class="box-header with-border">
			<h1><%= title %></h1>
		</div>
		<div class="box-body">
			<% if(mediaLink) { %>
				<figure>
					<%= this.processMediaTag(mediaLink, title) %>
				</figure>
			<% } %>
			<div class="box-content"><%= description %></div>
		</div>
		<div class="box-footer">
			<div class="toolbox"></div>
		</div>
	</div>
</script>
<!-- ./Popup cart template -->

<!--Cart toolbox template-->
<script type="text/template" id="cartToolbox">
	<div class="pull-right">
		<a href="#" class="rate-button<% if(isFavorite) { %> is-favorite<% } %>"><i class="icon-rate-star"></i><%= favorites %></a>
		<a href="#!/page/<%= id %>" class="post-link"><i class="icon-goto"></i></a>
	</div>
	<a href="#" class="label label-hover"><%= author %></a>
</script>
<!-- ./Cart toolbox template-->