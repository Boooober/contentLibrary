<script type="text/template" id="loginForm">
	<div class="form-box">
		<div class="form-headline">
			<p>Login form</p>
		</div>

		<div class="box primary-box">
			<div class="box-body">
				<p class="form-title">Please log in to continue</p>

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
						<div class="col-sm-8">
							<div class="checkbox">
								<label for="rememberMe">
									<input id="rememberMe" type="checkbox"/>
									Remember me
								</label>
							</div>
						</div>
						<div class="col-sm-4">
							<div class="form-group">
								<button type="submit" class="btn btn-block btn-primary">Log in</button>
							</div>
						</div>
					</div>
				</form>
			</div>

			<div class="box-footer">
				<ul>
					<li><a href="#!/account/signin">I don`t have an accout</a></li>
					<li><a href="#!/account/recover">I forgot my password</a></li>
				</ul>
			</div>
		</div>
	</div>
</script>

<script type="text/template" id="signinForm">
	<div class="form-box">
		<div class="form-headline">
			<p>Signin form</p>
		</div>

		<div class="box primary-box">
			<div class="box-body">
				<p class="form-title">Please sign in</p>

				<form class="sigin-form" method="post">
					<div class="form-group">
						<label for="signName" class="sr-only">Your name:</label>
						<input id="signName" name="name" type="text" class="form-control" placeholder="Your name" data-validate='{"min":4}'/>
					</div>

					<div class="form-group">
						<label for="signEmail" class="sr-only">Your email:</label>
						<input id="signEmail" name="email" type="email" class="form-control" placeholder="Your email"/>
					</div>

					<div class="form-group">
						<label for="signEmail" class="sr-only">Age:</label>
						<input id="signEmail" name="email" type="number" class="form-control" placeholder="Age" data-validate='{"min":0,"max":15}' required/>
					</div>

					<div class="form-group">
						<label for="signPassword" class="sr-only">Your password:</label>
						<input id="signPassword" name="password" type="password" class="form-control" placeholder="Your password" data-validate='{"min":5}'/>
					</div>

					<div class="form-group">
						<label for="signPassword2" class="sr-only">Repeat your password:</label>
						<input id="signPassword2" name="password2" type="password" class="form-control" placeholder="Repeat your password" data-validate='{"min":5}' required/>
					</div>

					<button type="submit" class="btn btn-block btn-primary">Sign in</button>

				</form>
			</div>

			<div class="box-footer">
				<ul>
					<li><a href="#!/account/login">Already have an account?</a></li>
				</ul>
			</div>
		</div>
	</div>
</script>

<script type="text/template" id="recoverForm">
	<div class="form-box">
		<div class="form-headline">
			<p>Account recover</p>
		</div>

		<div class="box primary-box">
			<div class="box-body">
				<p class="form-title">Please enter your email that was used on registration</p>

				<form class="sigin-form" method="post">

					<div class="form-group">
						<label for="signEmail" class="sr-only">Your email:</label>
						<input id="signEmail" name="email" type="email" class="form-control" placeholder="Your email" />
					</div>
					<button type="submit" class="btn btn-block btn-primary">Recover</button>

				</form>
			</div>

			<div class="box-footer">
				<ul>
					<li><a href="#!/account/login">I recalled my password!</a></li>
				</ul>
			</div>
		</div>
	</div>
</script>