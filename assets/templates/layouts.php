<!-- Sidebar -->
<script type="text/template" id="sidebarLayout">

	<nav class="sidebar navbar-primary">

		<div class="side-wrapper">
			<div class="side-container">
				<div class="side-content">

					<div class="side-header">
						<div class="account-info"></div>
					</div>

					<ul class="menu-list">
<!--						<li><a href="#!/add-media"><i class="icon-media"></i>Media</a></li>-->
						<li><a href="#!/uploads">My uploads</a></li>
						<li><a href="#!/favorites">Favorites</a></li>
						<li><a href="#!/add-card">Add card</a></li>
					</ul>
				</div>

				<div class="side-footer"><p>Random phrase</p></div>
			</div>
		</div>
	</nav>
</script>
<!-- ./Sidebar -->

<!-- Searchform -->
<script type="text/template" id="searchform">

	<form method="post">
		<div class="form-group">
			<label for="s" class="sr-only">Search</label>
			<div class="input-group">
				<input id="s" name="s" type="text" class="form-control" placeholder="Search"/>
			    <span class="input-group-btn" id="basic-addon3">
			        <button class="btn btn-primary"><i class="icon-search"></i></button>
			    </span>
			</div>
		</div>
	</form>

</script>
<!-- ./Searchform -->


<!-- Page layout -->
<script type="text/template" id="pageLayout">
	<div class="page-layout">

		<div class="topmenu"></div>

		<!-- Dynamic content -->
		<div class="main-content"></div>
		<!-- ./Dynamic content -->
		<div class="footer">

			<div class="container-fluid">
				<div class="pull-right">
					<ul class="soc-links">
						<li><a href="#"><i class="icon-facebook"></i></a></li>
						<li><a href="#"><i class="icon-gplus"></i></a></li>
						<li><a href="#"><i class="icon-twitter"></i></a></li>
						<li><a href="#"><i class="icon-vkontakte"></i></a></li>
						<li><a href="#"><i class="icon-pinterest"></i></a></li>
					</ul>
				</div>
				<div>
					<p>Author: Nikita Slobodian</p>
				</div>
			</div>


		</div>
	</div>
</script>
<!-- ./ Page layout -->


<!-- Topmenu -->
<script type="text/template" id="topMenu">

		<div class="container-fluid">
			<nav class="navbar">

				<div class="navbar-header">
					<ul class="navbar-nav">
						<% if(withSidebar){ %>
						<li class="sidebar-toggle"><a class="btn-sidebar" href="#"><i class="icon-menu"></i></a></li>
						<% } %>
						<li><div class="searchform navbar-form"></div></li>
					</ul>
				</div>

				<ul class="navbar-nav navbar-links navbar-right">
					<% _.each(this.model.menuItems(), function(item){ %>
						<li><%= item %></li>
					<% }) %>
				</ul>


			</nav>
		</div>

</script>
<!-- ./Topmenu -->

<!--Content topline/header-->
<script type="text/template" id="contentTopline">
	<div class="row">
		<div class="content-topline">
			Content topline
		</div>
	</div>
</script>
<!-- ./Content topline/header -->

<script type="text/template" id="wrapperAppends">
	<div class="popup-container"></div>
</script>
<!-- <div class="preloader">-->
<!--  <div class="loader"></div>-->
<!-- </div>-->