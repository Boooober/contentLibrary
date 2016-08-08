<!-- Image/Video-card template -->
<script type="text/template" id="mediaCard">
	<div class="card-item col-xs-12 col-sm-4">
		<div class="card-content <%= this.typeClass() %>">
			<div class="card-head"></div>

			<div class="card-body hover-toolbox">
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

			<div class="card-footer"></div>
		</div>
	</div>
</script>
<!-- ./Image/Video-card template -->

<!-- Text-type card template -->
<script type="text/template" id="textCard">
	<div class="card-item col-xs-12 col-sm-4">
		<div class="card-content text-card">
			<div class="card-head with-padding">
				<div class="toolbox"></div>
			</div>
			<div class="card-body with-padding">
				<h3 class="post-title"><a href="#!/page/<%= id %>"><%= title %></a></h3>
				<div class="post-content"><%= description %></div>
			</div>
			<div class="card-footer"></div>
		</div>
	</div>
</script>
<!-- ./Text-type card template -->

<!-- Popup card template -->
<script type="text/template" id="cardInPopup">
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
<!-- ./Popup card template -->

<!--Card toolbox template-->
<script type="text/template" id="cardToolbox">
	<div class="pull-right">
		<a href="#" class="rate-button<% if(isFavorite) { %> is-favorite<% } %>"><i class="icon-rate-star"></i><%= favorites %></a>
		<a href="#!/page/<%= id %>" class="post-link"><i class="icon-goto"></i></a>
	</div>
	<a href="#" class="label label-hover"><%= author %></a>
</script>
<!-- ./Card toolbox template-->