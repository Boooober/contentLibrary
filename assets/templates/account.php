<script type="text/template" id="accountInfo">
	<figure>
		<img class="image-circle" src="<%= avatar %>" alt="<%= fullname %>" />
	</figure>

	<div class="account-links">
		<a href="#!/account"><%= fullname %></a>
		<div class="account-dropdown dropdown">
			<span class="dropdown-toggle" type="button" data-toggle="dropdown"><i class="icon-pencil"></i></span>
			<ul class="dropdown-menu">
				<li><a href="#!/account/edit">Edit profile</a></li>
				<li><a href="#!/account/destroy">Delete profile</a></li>
			</ul>
		</div>
	</div>
</script>

