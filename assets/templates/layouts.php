<!-- Sidebar -->
<script type="text/template" id="sidebarLayout">

	<nav class="sidebar navbar-primary">

		<div class="side-wrapper">
			<div class="side-container">
				<div class="side-content">
					Sidebar
					<div class="searchform"></div>

					<ul class="cat-list">
						<li><a href="#">Category 1</a></li>
						<li><a href="#">Category 2</a></li>
						<li><a href="#">Category 3</a></li>
						<li><a href="#">Category 4</a></li>
						<li><a href="#">Category 5</a></li>
					</ul>
				</div>

				<div class="side-footer">
					<ul class="soc-icons">
						<li><a href="#">FB</a></li>
						<li><a href="#">GP</a></li>
						<li><a href="#">TW</a></li>
						<li><a href="#">PIN</a></li>
						<li><a href="#">VK</a></li>
					</ul>
				</div>
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
				<input id="s" name="s" type="text" class="form-control" placeholder="Search" value="<%= s %>"/>
				<span class="input-group-btn" id="basic-addon3">
					<button class="btn btn-primary">s</button>
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
		<div class="page-content"></div>
		<!-- ./Dynamic content -->
		<div class="row">
			<div class="footer">
				<div class="container-fluid">
					<div class="pull-right">
						New theme sceleton
					</div>
					<div>
						<p>Author: Nikita Slobodian</p>
					</div>
				</div>
			</div>

		</div>
	</div>
</script>
<!-- ./ Page layout -->


<!-- Topmenu -->
<script type="text/template" id="topMenu">
	<div class="row">
		<div class="container-fluid">
			<nav class="navbar">
				<div class="navbar-header">
					<p class="sidebar-toggle">Toggle sidebar</p>
				</div>

				<ul class="navbar-links navbar-right">
					<li><a href="#">Index</a></li>
					<li><a href="#!/signin">Add media</a></li>
					<li><a href="#!/login">Login</a></li>
					<li><a href="/logout.html">Login</a></li>
					<li><a href="#">Messages</a></li>
					<li><a href="#">Other</a></li>
					<li><a href="/account.html">Account</a></li>
				</ul>


			</nav>
		</div>

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

<script type="text/template" id="wrapperAppends"></script>
<!--	<div class="preloader">-->
<!--		<div class="loader"></div>-->
<!--	</div>-->