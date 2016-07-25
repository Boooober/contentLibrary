<!-- Video-cart template -->
<script type="text/template" id="videoCart">
	<div class="cart-item col-xs-12 col-sm-4">
		<div class="cart-content video-cart">
			<div class="cart-head"></div>

			<div class="cart-body hover-toolbox">
				<figure>
					<!-- Video -->
					<div class="video-frame">
						<iframe width="640" height="360" src="<%= mediaLink %>" frameborder="0" allowfullscreen=""></iframe>
					</div>
					<!-- ./Video -->
				</figure>
				<div class="toolbox with-padding"></div>
			</div>

			<div class="cart-footer"></div>
		</div>
	</div>
</script>
<!-- ./Video-cart template -->

<!-- Image-cart template -->
<script type="text/template" id="imageCart">
	<div class="cart-item col-xs-12 col-sm-4">
		<div class="cart-content image-cart">
			<div class="cart-head"></div>

			<div class="cart-body hover-toolbox">
				<figure>
					<!-- Image -->
					<a href="#" class="cart-link">
						<img src="<%= mediaLink %>" alt="<%= title %>"/>
					</a>
					<!-- ./Image -->
				</figure>
				<div class="toolbox with-padding"></div>
			</div>

			<div class="cart-footer"></div>
		</div>
	</div>
</script>
<!-- ./Image-cart template -->

<!-- Test-type cart template -->
<script type="text/template" id="textCart">
	<div class="cart-item col-xs-12 col-sm-4">
		<div class="cart-content text-cart">
			<div class="cart-head with-padding">
				<h3 class="post-title"><%= title %></h3>
				<div class="toolbox"></div>
			</div>
			<div class="cart-body with-padding">
				<div class="post-content"><%= content %></div>
			</div>
			<div class="cart-footer"></div>
		</div>
	</div>
</script>
<!-- ./Text-type cart template -->


<!--Cart toolbox template-->
<script type="text/template" id="cartToolbox">
	<div class="pull-right">
		<a href="#" class="rate-button<% if(isFavorite) { %> is-favorite<% } %>"><i class="icon-rate-star"></i><%= favorites %></a>
		<a href="#"><i class="icon-goto"></i></a>
	</div>
	<a href="#" class="label label-hover"><%= author %></a>
</script>
<!-- ./Cart toolbox template-->