<script type="text/template" id="loginForm">
	<div class="login-form-box">
		<div class="form-box-head">
			<h1>Login form</h1>
		</div>
		<div class="form-box-body">
			<p class="form-message">Please log in to continue</p>

			<form class="login-form" method="post">
				<div class="form-group">
					<label for="loginName" class="sr-only">Your name:</label>
					<input id="loginName" name="name" type="text" class="form-control" placeholder="Your name"/>
				</div>

				<div class="form-group">
					<label for="loginPassword" class="sr-only">Your password:</label>
					<input id="loginPassword" name="password" type="password" class="form-control" placeholder="Your password"/>
				</div>

				<div class="row">
					<div class="col-xs-8">
						<div class="checkbox">
							<label for="rememberMe">
								<input id="rememberMe" type="checkbox"/>
								Remember me
							</label>
						</div>
					</div>
					<div class="col-xs-4">

					</div>
				</div>
				<div class="form-group">
					<button type="submit" class="btn btn-promary">Log in</button>
				</div>
			</form>
		</div>
		<div class="form-box-footer">
			<ul>
				<li><a href="#">I don`t have an accout</a></li>
				<li><a href="#">I forgot my password</a></li>
			</ul>
		</div>
	</div>
</script>